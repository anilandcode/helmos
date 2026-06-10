from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class SecurityScanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    scan_type: str
    target: str
    status: str
    findings: list = []
    severity_counts: dict = {}
    scanned_at: str
    duration_ms: int = 0
    scanner_version: str = "1.0.0"


class ScanRequest(BaseModel):
    scan_type: str
    target: str


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    event_type: str
    agent_id: str | None = None
    task_id: str | None = None
    user_id: str | None = None
    action: str
    target: str | None = None
    details: dict = {}
    severity: str
    timestamp: str
    ip_address: str | None = None
    outcome: str


class AuditLogCreate(BaseModel):
    event_type: str
    action: str
    agent_id: str | None = None
    task_id: str | None = None
    target: str | None = None
    details: dict | None = None
    severity: str = "info"
    outcome: str = "success"


class GuardrailConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: str
    rule_type: str
    config: dict = {}
    enabled: bool
    action: str


class GuardrailUpdate(BaseModel):
    enabled: bool | None = None
    action: str | None = None
    config: dict | None = None


class SecurityStatsResponse(BaseModel):
    total_scans: int
    pass_rate: float
    active_guardrails: int
    total_guardrails: int
    audit_count_24h: int
    blocked_events_24h: int


class Meta(BaseModel):
    count: int
    timestamp: str = ""


class ScanListData(BaseModel):
    data: list[SecurityScanResponse]
    meta: Meta


class ScanData(BaseModel):
    data: SecurityScanResponse
    meta: Meta


class AuditListData(BaseModel):
    data: list[AuditLogResponse]
    meta: Meta


class AuditData(BaseModel):
    data: AuditLogResponse
    meta: Meta


class GuardrailListData(BaseModel):
    data: list[GuardrailConfigResponse]
    meta: Meta


class GuardrailData(BaseModel):
    data: GuardrailConfigResponse
    meta: Meta


class StatsData(BaseModel):
    data: SecurityStatsResponse
    meta: Meta


class MessageData(BaseModel):
    data: dict
    meta: Meta
