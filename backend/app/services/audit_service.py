from sqlalchemy import select, func as sqlfunc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.security import AuditLog


class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log_event(self, event_type: str, action: str, agent_id: str | None = None, task_id: str | None = None, user_id: str | None = None, target: str | None = None, details: dict | None = None, severity: str = "info", outcome: str = "success", ip_address: str | None = None) -> AuditLog:
        log = AuditLog(
            event_type=event_type,
            agent_id=agent_id,
            task_id=task_id,
            user_id=user_id,
            action=action,
            target=target,
            details=details or {},
            severity=severity,
            outcome=outcome,
            ip_address=ip_address,
        )
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log

    async def get_recent(self, limit: int = 100, event_type: str | None = None, severity: str | None = None, agent_id: str | None = None) -> list[AuditLog]:
        q = select(AuditLog).order_by(AuditLog.timestamp.desc())
        if event_type:
            q = q.where(AuditLog.event_type == event_type)
        if severity:
            q = q.where(AuditLog.severity == severity)
        if agent_id:
            q = q.where(AuditLog.agent_id == agent_id)
        if limit:
            q = q.limit(limit)
        result = await self.db.execute(q)
        return result.scalars().all()

    async def get_stats(self, hours: int = 24) -> dict:
        cutoff = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
        total = await self.db.execute(select(sqlfunc.count(AuditLog.id)))
        total_count = total.scalar() or 0

        blocked = await self.db.execute(select(sqlfunc.count(AuditLog.id)).where(AuditLog.outcome.in_(["blocked", "denied"])))
        blocked_count = blocked.scalar() or 0

        return {
            "total_events": total_count,
            "blocked_events": blocked_count,
            "hours": hours,
        }
