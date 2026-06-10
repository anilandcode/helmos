from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, AsyncSessionLocal
from app.services.seed import seed
from app.middleware.audit_middleware import AuditMiddleware
from app.routers import health, agents, tasks, workflows, router, memory, obsidian, security


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed(session)
    yield


app = FastAPI(
    title="HelmOS API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(AuditMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "HelmOS API", "version": "0.1.0"}


app.include_router(health.router)
app.include_router(agents.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(workflows.router, prefix="/api")
app.include_router(router.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(obsidian.router, prefix="/api")
app.include_router(security.router, prefix="/api")
