from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from app.dependencies import get_db_session, get_redis
from app.models.router import ModelRegistry, RoutingDecision, FallbackEvent
from app.schemas.router import (
    RouteRequest, RouteResponse, RouteData,
    ModelRegistryResponse, ModelListData,
    RoutingDecisionResponse, DecisionListData,
    FallbackEventResponse, FallbackListData,
    CostSummaryResponse, CostData,
    MessageData, Meta,
)
from app.services.router_service import RouterService
from app.services.cost_guard import CostGuard

router = APIRouter(prefix="/router", tags=["router"])


@router.post("/route", response_model=RouteData)
async def route_task(
    request: RouteRequest,
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    svc = RouterService(db, redis)
    result = await svc.select_model(request)
    return RouteData(
        data=result,
        meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.get("/models", response_model=ModelListData)
async def list_models(
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    svc = RouterService(db, redis)
    models = await svc.get_models()
    return ModelListData(
        data=[ModelRegistryResponse.model_validate(m) for m in models],
        meta=Meta(count=len(models), timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.get("/decisions", response_model=DecisionListData)
async def list_decisions(
    task_type: str | None = None,
    db: AsyncSession = Depends(get_db_session),
):
    q = select(RoutingDecision).order_by(RoutingDecision.timestamp.desc())
    if task_type:
        q = q.where(RoutingDecision.task_type == task_type)
    result = await db.execute(q)
    decisions = result.scalars().all()
    return DecisionListData(
        data=[RoutingDecisionResponse.model_validate(d) for d in decisions],
        meta=Meta(count=len(decisions), timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.get("/fallbacks", response_model=FallbackListData)
async def list_fallbacks(
    db: AsyncSession = Depends(get_db_session),
):
    result = await db.execute(select(FallbackEvent).order_by(FallbackEvent.timestamp.desc()))
    events = result.scalars().all()
    return FallbackListData(
        data=[FallbackEventResponse.model_validate(e) for e in events],
        meta=Meta(count=len(events), timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.post("/models/{model_id}/disable", response_model=MessageData)
async def disable_model(
    model_id: str,
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    result = await db.execute(select(ModelRegistry).where(ModelRegistry.id == model_id))
    model = result.scalar_one_or_none()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    model.status = "unavailable"
    await db.commit()
    await redis.delete("router:models")
    return MessageData(
        data={"model_id": model_id, "status": "disabled"},
        meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.post("/models/{model_id}/enable", response_model=MessageData)
async def enable_model(
    model_id: str,
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    result = await db.execute(select(ModelRegistry).where(ModelRegistry.id == model_id))
    model = result.scalar_one_or_none()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    model.status = "available"
    await db.commit()
    await redis.delete("router:models")
    return MessageData(
        data={"model_id": model_id, "status": "enabled"},
        meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()),
    )


@router.get("/cost", response_model=CostData)
async def cost_summary(redis: Redis = Depends(get_redis)):
    guard = CostGuard(redis)
    summary = await guard.get_summary()
    return CostData(
        data=CostSummaryResponse(**summary),
        meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()),
    )
