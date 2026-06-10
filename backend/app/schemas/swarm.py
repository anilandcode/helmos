from pydantic import BaseModel, ConfigDict


class SwarmConfigResponse(BaseModel):
    id: str
    name: str
    description: str = ""
    goal: str
    agents: list
    consensus_mode: str = "majority"
    max_rounds: int = 5
    timeout_minutes: int = 60
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class SwarmExecutionResponse(BaseModel):
    id: str
    config_id: str
    status: str
    current_round: int
    max_rounds: int
    start_time: str
    end_time: str | None = None
    messages: list = []
    decisions: list = []
    final_output: str | None = None
    cost: float = 0.0

    model_config = ConfigDict(from_attributes=True)
