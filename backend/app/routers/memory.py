from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db_session
from app.services.memory_service import MemoryService
from app.schemas.memory import (
    SemanticMemoryCreate, SemanticMemoryUpdate, SemanticMemoryResponse, SemanticListData, SemanticData,
    EpisodicMemoryCreate, EpisodicMemoryResponse, EpisodicListData, EpisodicData,
    ProceduralMemoryCreate, ProceduralMemoryUpdate, ProceduralMemoryResponse, ProceduralListData, ProceduralData,
    SemanticSearchRequest, SearchData, MemorySearchResponse,
    ProcedureVersionResponse, VersionListData,
    MessageData, Meta,
)

router = APIRouter(prefix="/memory", tags=["memory"])


# ─── Semantic ───

@router.post("/semantic", response_model=SemanticData)
async def create_semantic(data: SemanticMemoryCreate, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    mem = await svc.create_semantic(data)
    return SemanticData(data=SemanticMemoryResponse.model_validate(mem), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/semantic", response_model=SemanticListData)
async def list_semantic(category: str | None = None, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    mems = await svc.list_semantic(category=category)
    return SemanticListData(data=[SemanticMemoryResponse.model_validate(m) for m in mems], meta=Meta(count=len(mems), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/semantic/{mem_id}", response_model=SemanticData)
async def get_semantic(mem_id: str, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        mem = await svc.get_semantic(mem_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Semantic memory not found")
    return SemanticData(data=SemanticMemoryResponse.model_validate(mem), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.put("/semantic/{mem_id}", response_model=SemanticData)
async def update_semantic(mem_id: str, data: SemanticMemoryUpdate, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        mem = await svc.update_semantic(mem_id, data)
    except Exception:
        raise HTTPException(status_code=404, detail="Semantic memory not found")
    return SemanticData(data=SemanticMemoryResponse.model_validate(mem), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.delete("/semantic/{mem_id}", response_model=MessageData)
async def delete_semantic(mem_id: str, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        await svc.delete_semantic(mem_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Semantic memory not found")
    return MessageData(data={"id": mem_id, "deleted": True}, meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.post("/semantic/search", response_model=SearchData)
async def search_semantic(req: SemanticSearchRequest, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    results = await svc.search_semantic(req.query, req.limit)
    return SearchData(data=MemorySearchResponse(results=results, meta={"limit": req.limit}), meta=Meta(count=len(results), timestamp=datetime.now(timezone.utc).isoformat()))


# ─── Episodic ───

@router.post("/episodic", response_model=EpisodicData)
async def create_episodic(data: EpisodicMemoryCreate, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    mem = await svc.create_episodic(data)
    return EpisodicData(data=EpisodicMemoryResponse.model_validate(mem), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/episodic", response_model=EpisodicListData)
async def list_episodic(agent_id: str | None = None, task_id: str | None = None, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    mems = await svc.list_episodic(agent_id=agent_id, task_id=task_id)
    return EpisodicListData(data=[EpisodicMemoryResponse.model_validate(m) for m in mems], meta=Meta(count=len(mems), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/episodic/{mem_id}", response_model=EpisodicData)
async def get_episodic(mem_id: str, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        mem = await svc.get_episodic(mem_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Episodic memory not found")
    return EpisodicData(data=EpisodicMemoryResponse.model_validate(mem), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.post("/episodic/search", response_model=EpisodicListData)
async def search_episodic(req: SemanticSearchRequest, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    results = await svc.search_episodic(req.query, req.limit)
    return EpisodicListData(data=[EpisodicMemoryResponse.model_validate(r) for r in results], meta=Meta(count=len(results), timestamp=datetime.now(timezone.utc).isoformat()))


# ─── Procedural ───

@router.post("/procedural", response_model=ProceduralData)
async def create_procedure(data: ProceduralMemoryCreate, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    proc = await svc.create_procedure(data)
    return ProceduralData(data=ProceduralMemoryResponse.model_validate(proc), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/procedural", response_model=ProceduralListData)
async def list_procedures(db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    procs = await svc.list_procedures()
    return ProceduralListData(data=[ProceduralMemoryResponse.model_validate(p) for p in procs], meta=Meta(count=len(procs), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/procedural/{proc_id}", response_model=ProceduralData)
async def get_procedure(proc_id: str, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        proc = await svc.get_procedure(proc_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Procedure not found")
    return ProceduralData(data=ProceduralMemoryResponse.model_validate(proc), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.put("/procedural/{proc_id}", response_model=ProceduralData)
async def update_procedure(proc_id: str, data: ProceduralMemoryUpdate, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    try:
        proc = await svc.update_procedure(proc_id, data)
    except Exception:
        raise HTTPException(status_code=404, detail="Procedure not found")
    return ProceduralData(data=ProceduralMemoryResponse.model_validate(proc), meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/procedural/{proc_id}/versions", response_model=VersionListData)
async def get_procedure_versions(proc_id: str, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    versions = await svc.get_procedure_versions(proc_id)
    return VersionListData(data=[ProcedureVersionResponse.model_validate(v) for v in versions], meta=Meta(count=len(versions), timestamp=datetime.now(timezone.utc).isoformat()))


@router.post("/procedural/search", response_model=ProceduralListData)
async def search_procedures(req: SemanticSearchRequest, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    results = await svc.search_procedures(req.query, req.limit)
    return ProceduralListData(data=[ProceduralMemoryResponse.model_validate(r) for r in results], meta=Meta(count=len(results), timestamp=datetime.now(timezone.utc).isoformat()))


# ─── Hybrid search ───

@router.post("/search", response_model=SearchData)
async def hybrid_search(req: SemanticSearchRequest, db: AsyncSession = Depends(get_db_session)):
    svc = MemoryService(db)
    semantic = await svc.search_semantic(req.query, req.limit)
    episodic = await svc.search_episodic(req.query, req.limit)
    procedures = await svc.search_procedures(req.query, req.limit)
    results = [
        *[{"type": "semantic", **s} for s in semantic],
        *[{"type": "episodic", "id": e.id, "content": e.content, "agent_name": e.agent_name, "outcome": e.outcome} for e in episodic],
        *[{"type": "procedural", "id": p.id, "name": p.name, "description": p.description, "version": p.version} for p in procedures],
    ]
    return SearchData(data=MemorySearchResponse(results=results[:req.limit], meta={"limit": req.limit}), meta=Meta(count=len(results[:req.limit]), timestamp=datetime.now(timezone.utc).isoformat()))


@router.get("/stats", response_model=MessageData)
async def memory_stats(db: AsyncSession = Depends(get_db_session)):
    from sqlalchemy import func, select
    from app.models.memory import SemanticMemory, EpisodicMemory, ProceduralMemory

    sem = (await db.execute(select(func.count(SemanticMemory.id)))).scalar() or 0
    epi = (await db.execute(select(func.count(EpisodicMemory.id)))).scalar() or 0
    proc = (await db.execute(select(func.count(ProceduralMemory.id)))).scalar() or 0

    return MessageData(data={"semantic": sem, "episodic": epi, "procedural": proc, "total": sem + epi + proc}, meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()))
