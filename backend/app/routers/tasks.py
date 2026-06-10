from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db_session
from app.models.task import Task
from app.schemas.task import TaskResponse, TaskListData, TaskData


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TaskListData)
async def list_tasks(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(
        select(Task).options(selectinload(Task.checkpoints)).order_by(Task.created_at.desc())
    )
    tasks = result.scalars().all()
    return TaskListData(
        data=[TaskResponse.model_validate(t) for t in tasks],
        meta={"count": len(tasks), "timestamp": datetime.now(timezone.utc).isoformat()},
    )


@router.get("/{task_id}", response_model=TaskData)
async def get_task(task_id: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(
        select(Task).options(selectinload(Task.checkpoints)).where(Task.id == task_id)
    )
    task = result.scalar_one()
    return TaskData(
        data=TaskResponse.model_validate(task),
        meta={"count": 1, "timestamp": datetime.now(timezone.utc).isoformat()},
    )
