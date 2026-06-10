from dataclasses import dataclass, field


@dataclass
class AgentTaskInput:
    task_id: str
    agent_id: str
    agent_name: str
    agent_role: str
    task_title: str
    task_description: str
    model: str
    max_cost: float
    checkpoint_names: list[str]


@dataclass
class CheckpointResult:
    index: int
    name: str
    status: str = "completed"
    reasoning: str | None = None
    tool_used: str | None = None
    confidence: float | None = None
    cost: float = 0.0
    output: str | None = None


@dataclass
class AgentTaskResult:
    task_id: str
    agent_id: str
    status: str
    checkpoints: list[CheckpointResult] = field(default_factory=list)
    total_cost: float = 0.0
    final_output: str | None = None
    error: str | None = None
