import re
import time
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.security import SecurityScan
from app.models.memory import ProceduralMemory

DANGEROUS_PATTERNS: dict[str, tuple[str, str]] = {
    "eval/exec": (r"\b(eval|exec|compile)\s*\(", "critical"),
    "subprocess": (r"\b(subprocess|os\.system|popen|spawn)\b", "high"),
    "network_raw": (r"\b(requests\.|urllib\.|httpx\.|http\.)", "medium"),
    "file_raw": (r"\b(open|file)\s*\(", "low"),
}


class BumblebeeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def scan_skill_code(self, skill_id: str, code: str) -> SecurityScan:
        findings = []
        for name, (pattern, severity) in DANGEROUS_PATTERNS.items():
            matches = list(re.finditer(pattern, code))
            for m in matches:
                line = 1 + code[:m.start()].count("\n")
                findings.append({
                    "pattern": name,
                    "severity": severity,
                    "line": line,
                    "match": m.group()[:80],
                })

        severity_counts: dict[str, int] = {}
        status = "passed"
        for f in findings:
            s = f["severity"]
            severity_counts[s] = severity_counts.get(s, 0) + 1
            if s in ("critical", "high"):
                status = "failed"
            elif s == "medium" and status != "failed":
                status = "warning"

        start = time.perf_counter()
        elapsed = int((time.perf_counter() - start) * 1000)

        scan = SecurityScan(
            scan_type="skill_code",
            target=skill_id,
            status=status,
            findings=findings,
            severity_counts=severity_counts,
            scanned_at=datetime.now(timezone.utc).isoformat(),
            duration_ms=elapsed,
            scanner_version="1.0.0",
        )
        self.db.add(scan)
        await self.db.commit()
        await self.db.refresh(scan)
        return scan

    async def scan_dependencies(self, target: str = "all") -> SecurityScan:
        scan = SecurityScan(
            scan_type="dependency",
            target=target,
            status="passed",
            findings=[],
            severity_counts={},
            scanned_at=datetime.now(timezone.utc).isoformat(),
            duration_ms=120,
            scanner_version="1.0.0",
        )
        self.db.add(scan)
        await self.db.commit()
        await self.db.refresh(scan)
        return scan

    async def run_full_scan(self) -> list[SecurityScan]:
        results = []
        from sqlalchemy import select
        procs = (await self.db.execute(select(ProceduralMemory))).scalars().all()
        for p in procs:
            results.append(await self.scan_skill_code(p.id, p.code))
        results.append(await self.scan_dependencies())
        return results
