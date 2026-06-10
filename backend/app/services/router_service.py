import json
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from app.models.router import ModelRegistry, RoutingDecision, FallbackEvent
from app.schemas.router import RouteRequest, RouteResponse

TASK_TYPE_WEIGHTS: dict[str, dict[str, float]] = {
    "research": {"reasoning": 0.4, "long_context": 0.3, "tool_use": 0.2, "cost_efficiency": 0.1},
    "coding": {"coding": 0.5, "tool_use": 0.3, "reasoning": 0.2},
    "analysis": {"reasoning": 0.4, "coding": 0.2, "long_context": 0.2, "tool_use": 0.2},
    "creative": {"reasoning": 0.3, "speed": 0.3, "cost_efficiency": 0.4},
    "generation": {"speed": 0.4, "cost_efficiency": 0.3, "reasoning": 0.3},
}

FALLBACK_CHAINS: dict[str, list[str]] = {
    "research": ["claude-4-sonnet", "gpt-5", "gemini-2.5-pro", "deepseek-v4-pro", "local-ollama"],
    "coding": ["claude-4-sonnet", "deepseek-v4-pro", "gpt-5", "gemini-2.5-pro", "local-ollama"],
    "analysis": ["claude-4-sonnet", "gpt-5", "deepseek-v4-pro", "gemini-2.5-pro", "local-ollama"],
    "creative": ["gpt-5", "claude-4-sonnet", "gemini-2.5-pro", "deepseek-v4-pro", "local-ollama"],
    "generation": ["local-ollama", "deepseek-v4-pro", "gpt-5", "claude-4-sonnet", "gemini-2.5-pro"],
}

CAPABILITY_KEYS = ["reasoning", "coding", "long_context", "tool_use", "speed", "cost_efficiency"]


class RouterService:
    def __init__(self, db: AsyncSession, redis: Redis):
        self.db = db
        self.redis = redis

    async def get_models(self) -> list[ModelRegistry]:
        cached = await self.redis.get("router:models")
        if cached:
            raw = json.loads(cached)
            return [ModelRegistry(**m) for m in raw]

        result = await self.db.execute(select(ModelRegistry).where(ModelRegistry.status == "available"))
        models = result.scalars().all()

        await self.redis.set(
            "router:models",
            json.dumps([{c: getattr(m, c) for c in m.__table__.columns.keys()} for m in models]),
            ex=300,
        )
        return models

    async def select_model(self, request: RouteRequest) -> RouteResponse:
        models = await self.get_models()
        weights = TASK_TYPE_WEIGHTS.get(request.task_type, {"reasoning": 0.25, "cost_efficiency": 0.25, "speed": 0.25, "tool_use": 0.25})

        if not models:
            return RouteResponse(
                selected_model="none", model_id="none", reasoning="No models available",
                confidence=0.0, estimated_cost=0.0, estimated_tokens=0,
            )

        if request.preferred_model:
            pref = next((m for m in models if m.name.lower() == request.preferred_model.lower() or m.id == request.preferred_model), None)
            if pref:
                models = [pref]

        scored = []
        for m in models:
            if request.max_cost is not None and m.cost_per_1k_input * 10 > request.max_cost:
                continue

            score = 0.0
            for cap, weight in weights.items():
                score += getattr(m, cap, 0.0) * weight

            if m.avg_latency_ms > 5000:
                score -= 0.1
            if m.success_rate_7d < 0.80:
                score -= 0.2

            scored.append((m, score))

        if not scored:
            return RouteResponse(
                selected_model="none", model_id="none", reasoning="No models within budget",
                confidence=0.0, estimated_cost=0.0, estimated_tokens=0,
            )

        scored.sort(key=lambda x: x[1], reverse=True)
        best_model, best_score = scored[0]

        estimated_tokens = max(len(request.input_text) // 4, 100)
        estimated_cost = (estimated_tokens / 1000) * best_model.cost_per_1k_input

        reasoning_parts = []
        top_caps = sorted(weights.items(), key=lambda x: x[1], reverse=True)[:2]
        for cap, w in top_caps:
            val = getattr(best_model, cap, 0)
            reasoning_parts.append(f"{cap}={val:.0%}")

        reasoning = f"{best_model.name}: {' '.join(reasoning_parts)} → score={best_score:.3f}"

        decision = RoutingDecision(
            task_id=request.task_type,
            task_type=request.task_type,
            selected_model=best_model.name,
            selected_model_id=best_model.id,
            reasoning=reasoning,
            confidence=round(best_score, 4),
            estimated_cost=round(estimated_cost, 6),
            estimated_tokens=estimated_tokens,
            actual_cost=0.0,
            actual_tokens=0,
            latency_ms=0,
            timestamp=datetime.now(timezone.utc).isoformat(),
            input_sample=request.input_text[:200] if request.input_text else None,
        )
        self.db.add(decision)
        await self.db.commit()

        best_model.last_used = datetime.now(timezone.utc).isoformat()
        await self.db.commit()

        return RouteResponse(
            selected_model=best_model.name,
            model_id=best_model.id,
            reasoning=reasoning,
            confidence=round(best_score, 4),
            estimated_cost=round(estimated_cost, 6),
            estimated_tokens=estimated_tokens,
        )

    async def record_fallback(self, task_id: str, original: str, fallback: str, reason: str):
        event = FallbackEvent(
            task_id=task_id,
            original_model=original,
            fallback_model=fallback,
            reason=reason,
            timestamp=datetime.now(timezone.utc).isoformat(),
            resolved=False,
            retry_count=1,
        )
        self.db.add(event)
        await self.db.commit()

    async def get_model_rankings(self, task_type: str) -> list[dict]:
        models = await self.get_models()
        weights = TASK_TYPE_WEIGHTS.get(task_type, {})

        ranked = []
        for m in models:
            score = sum(getattr(m, cap, 0.0) * w for cap, w in weights.items())
            ranked.append({"name": m.name, "id": m.id, "score": round(score, 4)})

        ranked.sort(key=lambda x: x["score"], reverse=True)
        return ranked

    def get_fallback_chain(self, task_type: str) -> list[str]:
        return FALLBACK_CHAINS.get(task_type, [])
