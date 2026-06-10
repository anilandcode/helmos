from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class AgentBase(BaseModel):
    name: str
    role: str
    status: str = "idle"
    current_task: str | None = None
    model: str
    last_heartbeat: str = ""
    success_rate: float = 0.0
    cost_today: float = 0.0


class AgentResponse(AgentBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class Meta(BaseModel):
    count: int
    timestamp: str = ""


class AgentListData(BaseModel):
    data: list[AgentResponse]
    meta: Meta
