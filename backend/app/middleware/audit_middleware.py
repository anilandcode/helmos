import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.services.audit_service import AuditService
from app.database import AsyncSessionLocal


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in ("/health", "/ready", "/"):
            return await call_next(request)

        start = time.perf_counter()
        try:
            response = await call_next(request)
            duration_ms = int((time.perf_counter() - start) * 1000)
        except Exception as exc:
            duration_ms = int((time.perf_counter() - start) * 1000)
            async with AsyncSessionLocal() as session:
                svc = AuditService(session)
                await svc.log_event(
                    event_type="api_request", action=f"{request.method} {request.url.path}",
                    severity="error", outcome="error",
                    details={"status_code": 500, "duration_ms": duration_ms, "error": str(exc)},
                )
            raise

        async with AsyncSessionLocal() as session:
            svc = AuditService(session)
            await svc.log_event(
                event_type="api_request", action=f"{request.method} {request.url.path}",
                severity="info", outcome="success",
                details={"status_code": response.status_code, "duration_ms": duration_ms},
            )

        return response
