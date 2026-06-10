from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db_session
from app.services.bumblebee_service import BumblebeeService
from app.services.guardrail_service import GuardrailService
from app.services.audit_service import AuditService
from app.models.security import SecurityScan, AuditLog, GuardrailConfig
from app.models.memory import ProceduralMemory
from app.schemas.security import (
    SecurityScanResponse, AuditLogResponse, AuditLogCreate, GuardrailConfigResponse, GuardrailUpdate,
    SecurityStatsResponse, ScanRequest,
    ScanListData, ScanData, AuditListData, AuditData, GuardrailListData, GuardrailData,
    StatsData, MessageData, Meta,
)
from sqlalchemy import select, func as sqlfunc

router = APIRouter(prefix="/security", tags=["security"])


@router.post("/scan", response_model=ScanData)
async def trigger_scan(req: ScanRequest, db: AsyncSession = Depends(get_db_session)):
    svc = BumblebeeService(db)
    if req.scan_type == "skill_code":
        proc = (await db.execute(select(ProceduralMemory).where(ProceduralMemory.name == req.target))).scalar_one_or_none()
        code = proc.code if proc else "async def placeholder(): pass"
        scan = await svc.scan_skill_code(req.target, code)
    elif req.scan_type == "dependency":
        scan = await svc.scan_dependencies(req.target)
    else:
        scan = await svc.scan_skill_code(req.target, "async def placeholder(): pass")
    return ScanData(data=SecurityScanResponse.model_validate(scan), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/scans", response_model=ScanListData)
async def list_scans(scan_type: str | None = None, db: AsyncSession = Depends(get_db_session)):
    q = select(SecurityScan).order_by(SecurityScan.scanned_at.desc())
    if scan_type:
        q = q.where(SecurityScan.scan_type == scan_type)
    result = await db.execute(q)
    scans = result.scalars().all()
    return ScanListData(data=[SecurityScanResponse.model_validate(s) for s in scans], meta=Meta(count=len(scans), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/scans/{scan_id}", response_model=ScanData)
async def get_scan(scan_id: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(SecurityScan).where(SecurityScan.id == scan_id))
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return ScanData(data=SecurityScanResponse.model_validate(scan), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/stats", response_model=StatsData)
async def security_stats(db: AsyncSession = Depends(get_db_session)):
    guard_svc = GuardrailService(db)
    audit_svc = AuditService(db)
    total_scans = (await db.execute(select(sqlfunc.count(SecurityScan.id)))).scalar() or 0
    passed_scans = (await db.execute(select(sqlfunc.count(SecurityScan.id)).where(SecurityScan.status == "passed"))).scalar() or 0
    pass_rate = round(passed_scans / total_scans * 100, 1) if total_scans > 0 else 0.0
    active_guardrails = await guard_svc.count_active()
    total_guardrails = await guard_svc.count_total()
    audit_stats = await audit_svc.get_stats()
    total_audit = (await db.execute(select(sqlfunc.count(AuditLog.id)))).scalar() or 0
    blocked_audit = (await db.execute(select(sqlfunc.count(AuditLog.id)).where(AuditLog.outcome.in_(["blocked", "denied"])))).scalar() or 0
    return StatsData(data=SecurityStatsResponse(
        total_scans=total_scans, pass_rate=pass_rate,
        active_guardrails=active_guardrails, total_guardrails=total_guardrails,
        audit_count_24h=total_audit, blocked_events_24h=blocked_audit,
    ), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/guardrails", response_model=GuardrailListData)
async def list_guardrails(db: AsyncSession = Depends(get_db_session)):
    svc = GuardrailService(db)
    guardrails = await svc.get_all()
    return GuardrailListData(data=[GuardrailConfigResponse.model_validate(g) for g in guardrails], meta=Meta(count=len(guardrails), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/guardrails/active", response_model=GuardrailListData)
async def list_active_guardrails(db: AsyncSession = Depends(get_db_session)):
    svc = GuardrailService(db)
    guardrails = await svc.get_active()
    return GuardrailListData(data=[GuardrailConfigResponse.model_validate(g) for g in guardrails], meta=Meta(count=len(guardrails), timestamp=datetime.now(timezone.utc).isoformat()))


@router.put("/guardrails/{gr_id}", response_model=GuardrailData)
async def update_guardrail(gr_id: str, data: GuardrailUpdate, db: AsyncSession = Depends(get_db_session)):
    svc = GuardrailService(db)
    try:
        gr = await svc.toggle(gr_id, enabled=data.enabled, action=data.action, config=data.config)
    except ValueError:
        raise HTTPException(status_code=404, detail="Guardrail not found")
    return GuardrailData(data=GuardrailConfigResponse.model_validate(gr), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/audit", response_model=AuditListData)
async def list_audit_logs(event_type: str | None = None, severity: str | None = None, agent_id: str | None = None, db: AsyncSession = Depends(get_db_session)):
    svc = AuditService(db)
    logs = await svc.get_recent(event_type=event_type, severity=severity, agent_id=agent_id)
    return AuditListData(data=[AuditLogResponse.model_validate(l) for l in logs], meta=Meta(count=len(logs), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/audit/stats", response_model=MessageData)
async def audit_stats(db: AsyncSession = Depends(get_db_session)):
    svc = AuditService(db)
    stats = await svc.get_stats()
    return MessageData(data=stats, meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.post("/audit/log", response_model=AuditData)
async def create_audit_log(data: AuditLogCreate, db: AsyncSession = Depends(get_db_session)):
    svc = AuditService(db)
    log = await svc.log_event(
        event_type=data.event_type, action=data.action, agent_id=data.agent_id,
        task_id=data.task_id, target=data.target, details=data.details,
        severity=data.severity, outcome=data.outcome,
    )
    return AuditData(data=AuditLogResponse.model_validate(log), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))
