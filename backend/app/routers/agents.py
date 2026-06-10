from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db_session
from app.models.agent import Agent
from app.schemas.agent import AgentResponse, AgentListData


router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=AgentListData)
async def list_agents(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Agent).order_by(Agent.name))
    agents = result.scalars().all()
    return AgentListData(
        data=[AgentResponse.model_validate(a) for a in agents],
        meta={"count": len(agents), "timestamp": datetime.now(timezone.utc).isoformat()},
    )


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one()
    return AgentResponse.model_validate(agent)
