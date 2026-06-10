from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class CheckpointSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    index: int
    name: str
    status: str = "pending"
    start_time: str | None = None
    end_time: str | None = None
    cost: float | None = None
    reasoning: str | None = None
    tool_used: str | None = None
    confidence: float | None = None
    input: str | None = None
    output: str | None = None


class TaskBase(BaseModel):
    model_config = ConfigDict(protected_namespaces=())


class TaskBase(BaseModel):
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    assigned_agent: str | None = None
    agent_id: str | None = None
    agent_name: str | None = None
    model_used: str | None = None
    cost: float | None = None
    estimated_cost: float = 0.0
    tags: list[str] = []
    current_checkpoint_index: int | None = None
    reasoning: str | None = None
    uncertainty: str | None = None
    input_refs: list[str] | None = None
    output: str | None = None
    error: str | None = None


class TaskResponse(TaskBase):
    id: str
    created_at: str
    updated_at: str | None = None
    completed_at: str | None = None
    checkpoints: list[CheckpointSchema] = []

    model_config = ConfigDict(from_attributes=True)


class Meta(BaseModel):
    count: int
    timestamp: str = ""


class TaskData(BaseModel):
    data: TaskResponse
    meta: Meta


class TaskListData(BaseModel):
    data: list[TaskResponse]
    meta: Meta
