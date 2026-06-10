from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class SemanticMemoryCreate(BaseModel):
    category: str
    content: str
    source_url: str | None = None
    confidence: float = 0.0


class SemanticMemoryUpdate(BaseModel):
    category: str | None = None
    content: str | None = None
    source_url: str | None = None
    confidence: float | None = None


class SemanticMemoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    category: str
    content: str
    source_url: str | None = None
    confidence: float
    last_verified: str
    created_at: str | None = None
    updated_at: str | None = None


class EpisodicMemoryCreate(BaseModel):
    episode_type: str
    task_id: str | None = None
    agent_id: str
    agent_name: str
    content: str
    outcome: str
    cost: float | None = None
    duration_ms: int | None = None


class EpisodicMemoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    episode_type: str
    task_id: str | None = None
    agent_id: str
    agent_name: str
    content: str
    outcome: str
    timestamp: str
    cost: float | None = None
    duration_ms: int | None = None


class ProceduralMemoryCreate(BaseModel):
    name: str
    description: str = ""
    code: str = ""
    schema: dict = {}
    version: str = "1.0.0"
    success_rate: float = 0.0
    usage_count: int = 0
    bumblebee_status: str = "pending"


class ProceduralMemoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    code: str | None = None
    schema: dict | None = None
    success_rate: float | None = None
    usage_count: int | None = None
    bumblebee_status: str | None = None


class ProceduralMemoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str
    code: str
    schema: dict
    version: str
    parent_version: str | None = None
    success_rate: float
    usage_count: int
    bumblebee_status: str
    created_at: str | None = None
    updated_at: str | None = None


class ProcedureVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    procedure_id: str
    name: str
    description: str
    code: str
    schema: dict
    version: str
    created_at: str | None = None


class SemanticSearchRequest(BaseModel):
    query: str
    limit: int = 10


class MemorySearchResponse(BaseModel):
    results: list[dict]
    meta: dict


class Meta(BaseModel):
    count: int
    timestamp: str = ""


class SemanticListData(BaseModel):
    data: list[SemanticMemoryResponse]
    meta: Meta


class EpisodicListData(BaseModel):
    data: list[EpisodicMemoryResponse]
    meta: Meta


class ProceduralListData(BaseModel):
    data: list[ProceduralMemoryResponse]
    meta: Meta


class VersionListData(BaseModel):
    data: list[ProcedureVersionResponse]
    meta: Meta


class SemanticData(BaseModel):
    data: SemanticMemoryResponse
    meta: Meta


class EpisodicData(BaseModel):
    data: EpisodicMemoryResponse
    meta: Meta


class ProceduralData(BaseModel):
    data: ProceduralMemoryResponse
    meta: Meta


class SearchData(BaseModel):
    data: MemorySearchResponse
    meta: Meta


class MessageData(BaseModel):
    data: dict
    meta: Meta
