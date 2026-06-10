from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from temporalio.client import WorkflowHandle

from app.dependencies import get_db_session, get_redis
from app.models.task import Task, Checkpoint
from app.temporal.client import get_temporal_client
from app.temporal.schemas import AgentTaskInput
from app.temporal.workflows import AgentTaskWorkflow
from app.services.router_service import RouterService
from app.services.cost_guard import CostGuard
from app.schemas.router import RouteRequest

router = APIRouter(prefix="/tasks", tags=["workflows"])


@router.post("/{task_id}/start", response_model=None)
async def start_workflow(
    task_id: str,
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one()

    cp_result = await db.execute(
        select(Checkpoint.name).where(Checkpoint.task_id == task_id).order_by(Checkpoint.index)
    )
    checkpoint_names = cp_result.scalars().all()

    if not checkpoint_names:
        checkpoint_names = [task.title]

    router_svc = RouterService(db, redis)
    cost_guard = CostGuard(redis)

    task_type = task.tags[0] if task.tags else "analysis"

    route_req = RouteRequest(
        task_type=task_type,
        input_text=task.description,
        max_cost=task.estimated_cost,
    )

    route_result = await router_svc.select_model(route_req)

    if route_result.selected_model == "none":
        raise HTTPException(status_code=503, detail="No models available for routing")

    budget = await cost_guard.check_budget(route_result.estimated_cost)
    if not budget["allowed"]:
        raise HTTPException(
            status_code=402,
            detail={
                "message": "Budget exceeded",
                "daily_spend": budget["daily_spend"],
                "daily_limit": budget["daily_limit"],
                "estimated_cost": route_result.estimated_cost,
            },
        )

    t_input = AgentTaskInput(
        task_id=task.id,
        agent_id=task.agent_id or "agent-1",
        agent_name=task.agent_name or "Atlas",
        agent_role="executor",
        task_title=task.title,
        task_description=task.description,
        model=route_result.selected_model,
        max_cost=task.estimated_cost,
        checkpoint_names=checkpoint_names,
    )

    client = await get_temporal_client()
    handle = await client.start_workflow(
        AgentTaskWorkflow.run,
        t_input,
        id=f"task-{task_id}",
        task_queue="agent-tasks",
    )

    return {
        "data": {
            "workflow_id": handle.id,
            "task_id": task_id,
            "status": "started",
            "routed_model": route_result.selected_model,
            "estimated_cost": route_result.estimated_cost,
        },
        "meta": {"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    }


@router.post("/{task_id}/pause", response_model=None)
async def pause_workflow(task_id: str):
    client = await get_temporal_client()
    handle: WorkflowHandle = client.get_workflow_handle(f"task-{task_id}")
    await handle.signal(AgentTaskWorkflow.pause)
    return {
        "data": {"task_id": task_id, "status": "paused"},
        "meta": {"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    }


@router.post("/{task_id}/resume", response_model=None)
async def resume_workflow(task_id: str):
    client = await get_temporal_client()
    handle: WorkflowHandle = client.get_workflow_handle(f"task-{task_id}")
    await handle.signal(AgentTaskWorkflow.resume)
    return {
        "data": {"task_id": task_id, "status": "resumed"},
        "meta": {"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    }


@router.post("/{task_id}/kill", response_model=None)
async def kill_workflow(task_id: str):
    client = await get_temporal_client()
    handle: WorkflowHandle = client.get_workflow_handle(f"task-{task_id}")
    await handle.signal(AgentTaskWorkflow.kill)
    return {
        "data": {"task_id": task_id, "status": "killed"},
        "meta": {"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    }


@router.get("/{task_id}/status", response_model=None)
async def get_workflow_status(task_id: str):
    client = await get_temporal_client()
    handle: WorkflowHandle = client.get_workflow_handle(f"task-{task_id}")
    status = await handle.query(AgentTaskWorkflow.get_status)
    return {
        "data": status,
        "meta": {"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    }
