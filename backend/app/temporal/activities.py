import asyncio
import random
from datetime import datetime, timezone
from temporalio import activity
from sqlalchemy import select, update
from app.temporal.schemas import AgentTaskInput, CheckpointResult
from app.database import AsyncSessionLocal
from app.models.task import Task, Checkpoint
from app.services.guardrail_service import GuardrailService
from app.services.audit_service import AuditService


@activity.defn
async def execute_checkpoint(input: AgentTaskInput, checkpoint_index: int) -> CheckpointResult:
    name = input.checkpoint_names[checkpoint_index]
    delay = random.uniform(1, 3)
    await asyncio.sleep(delay)
    cost = round(random.uniform(0.01, 0.05), 4)

    success = random.random() < 0.90
    status = "completed" if success else "failed"

    reasoning = None
    tool_used = None
    output = None
    confidence = None

    if success:
        reasoning = f"Checkpoint {checkpoint_index}: {name} executed successfully by {input.agent_name}"
        tool_used = random.choice(["web-search", "code-analysis", "data-extract", "llm-reason"])
        output = f"Result from {name}: processed in {delay:.1f}s"
        confidence = round(random.uniform(0.75, 0.98), 2)
    else:
        reasoning = f"Checkpoint {checkpoint_index}: {name} failed"
        output = None
        confidence = None

    async with AsyncSessionLocal() as session:
        guard_svc = GuardrailService(session)
        audit_svc = AuditService(session)

        cost_check = await guard_svc.check_cost_threshold(input.agent_id, cost)
        if not cost_check.get("allowed", True):
            await audit_svc.log_event(
                event_type="guardrail_blocked", action="cost_threshold", agent_id=input.agent_id,
                task_id=input.task_id, severity="warning", outcome="blocked",
                details={"estimated_cost": cost, "guardrail": "cost_approval_threshold"},
            )

        if tool_used:
            tool_check = await guard_svc.check_tool_call(input.agent_id, tool_used, {"task_id": input.task_id})
            await audit_svc.log_event(
                event_type="tool_call", action=tool_used, agent_id=input.agent_id,
                task_id=input.task_id, severity="info", outcome="success" if status == "completed" else "error",
                details={"cost": cost, "confidence": confidence},
            )

        result = await session.execute(
            select(Checkpoint).where(Checkpoint.task_id == input.task_id, Checkpoint.index == checkpoint_index)
        )
        existing = result.scalar_one_or_none()

        if existing:
            existing.status = status
            existing.reasoning = reasoning
            existing.tool_used = tool_used
            existing.confidence = confidence
            existing.output = output
            existing.cost = cost
            existing.end_time = datetime.now(timezone.utc).isoformat()
        else:
            cp = Checkpoint(
                task_id=input.task_id,
                index=checkpoint_index,
                name=name,
                status=status,
                reasoning=reasoning,
                tool_used=tool_used,
                confidence=confidence,
                output=output,
                cost=cost,
                end_time=datetime.now(timezone.utc).isoformat(),
            )
            session.add(cp)

        await session.commit()

    return CheckpointResult(
        index=checkpoint_index,
        name=name,
        status=status,
        reasoning=reasoning,
        tool_used=tool_used,
        confidence=confidence,
        cost=cost,
        output=output,
    )


@activity.defn
async def update_task_status(task_id: str, status: str) -> None:
    async with AsyncSessionLocal() as session:
        await session.execute(update(Task).where(Task.id == task_id).values(status=status))
        await session.commit()
        audit_svc = AuditService(session)
        await audit_svc.log_event(
            event_type="agent_action", action=f"task_{status}", task_id=task_id,
            severity="info", outcome="success",
        )


@activity.defn
async def calculate_total_cost(task_id: str) -> float:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Checkpoint.cost).where(Checkpoint.task_id == task_id)
        )
        costs = result.scalars().all()
        total = sum(c for c in costs if c is not None)
        await session.execute(update(Task).where(Task.id == task_id).values(cost=total))
        await session.commit()
        return total
