from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class ModelRegistryBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    provider: str
    reasoning: float = 0.0
    coding: float = 0.0
    long_context: float = 0.0
    tool_use: float = 0.0
    speed: float = 0.0
    cost_efficiency: float = 0.0
    cost_per_1k_input: float = 0.0
    cost_per_1k_output: float = 0.0
    context_window: int = 0
    status: str = "available"
    last_used: str | None = None
    success_rate_7d: float = 1.0
    avg_latency_ms: int = 0


class ModelRegistryResponse(ModelRegistryBase):
    id: str


class RoutingDecisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    task_id: str
    task_type: str
    selected_model: str
    selected_model_id: str
    reasoning: str
    confidence: float
    estimated_cost: float
    actual_cost: float = 0.0
    estimated_tokens: int = 0
    actual_tokens: int = 0
    latency_ms: int = 0
    fallback_from: str | None = None
    fallback_reason: str | None = None
    timestamp: str
    input_sample: str | None = None


class FallbackEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    original_model: str
    fallback_model: str
    reason: str
    task_id: str
    timestamp: str
    resolved: bool
    retry_count: int


class RouteRequest(BaseModel):
    task_type: str
    input_text: str
    preferred_model: str | None = None
    max_cost: float | None = None
    priority: str | None = None


class RouteResponse(BaseModel):
    selected_model: str
    model_id: str
    reasoning: str
    confidence: float
    estimated_cost: float
    estimated_tokens: int


class CostSummaryResponse(BaseModel):
    daily_spend: float
    monthly_spend: float
    daily_limit: float
    monthly_limit: float
    daily_percentage: float
    monthly_percentage: float


class Meta(BaseModel):
    count: int
    timestamp: str = ""


class ModelListData(BaseModel):
    data: list[ModelRegistryResponse]
    meta: Meta


class DecisionListData(BaseModel):
    data: list[RoutingDecisionResponse]
    meta: Meta


class FallbackListData(BaseModel):
    data: list[FallbackEventResponse]
    meta: Meta


class RouteData(BaseModel):
    data: RouteResponse
    meta: Meta


class CostData(BaseModel):
    data: CostSummaryResponse
    meta: Meta


class StatusData(BaseModel):
    data: dict
    meta: Meta


class MessageData(BaseModel):
    data: dict
    meta: Meta
