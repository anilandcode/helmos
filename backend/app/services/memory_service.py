from datetime import datetime, timezone
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.memory import SemanticMemory, EpisodicMemory, ProceduralMemory, ProcedureVersion
from app.schemas.memory import (
    SemanticMemoryCreate, SemanticMemoryUpdate,
    EpisodicMemoryCreate,
    ProceduralMemoryCreate, ProceduralMemoryUpdate,
)
from app.services.embedding_service import EmbeddingService

embeddings = EmbeddingService()


class MemoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ─── Semantic ───

    async def create_semantic(self, data: SemanticMemoryCreate) -> SemanticMemory:
        vec = embeddings.generate(data.content)
        mem = SemanticMemory(
            category=data.category,
            content=data.content,
            source_url=data.source_url,
            confidence=data.confidence,
            last_verified=datetime.now(timezone.utc).isoformat(),
            embedding=vec,
        )
        self.db.add(mem)
        await self.db.commit()
        await self.db.refresh(mem)
        return mem

    async def search_semantic(self, query: str, limit: int = 10) -> list[dict]:
        query_vec = embeddings.generate(query)
        result = await self.db.execute(
            select(SemanticMemory, (1.0 - SemanticMemory.embedding.cosine_distance(query_vec)).label("similarity"))
            .where(SemanticMemory.embedding.is_not(None))
            .order_by(SemanticMemory.embedding.cosine_distance(query_vec))
            .limit(limit)
        )
        rows = result.all()
        return [
            {
                "id": row[0].id,
                "category": row[0].category,
                "content": row[0].content,
                "source_url": row[0].source_url,
                "confidence": row[0].confidence,
                "last_verified": row[0].last_verified,
                "similarity": round(float(row[1]), 4),
            }
            for row in rows
        ]

    async def get_semantic(self, mem_id: str) -> SemanticMemory:
        result = await self.db.execute(select(SemanticMemory).where(SemanticMemory.id == mem_id))
        return result.scalar_one()

    async def list_semantic(self, category: str | None = None) -> list[SemanticMemory]:
        q = select(SemanticMemory)
        if category:
            q = q.where(SemanticMemory.category == category)
        result = await self.db.execute(q.order_by(SemanticMemory.created_at.desc()))
        return result.scalars().all()

    async def update_semantic(self, mem_id: str, data: SemanticMemoryUpdate) -> SemanticMemory:
        mem = await self.get_semantic(mem_id)
        if data.category is not None:
            mem.category = data.category
        if data.content is not None:
            mem.content = data.content
            mem.embedding = embeddings.generate(data.content)
        if data.source_url is not None:
            mem.source_url = data.source_url
        if data.confidence is not None:
            mem.confidence = data.confidence
        mem.last_verified = datetime.now(timezone.utc).isoformat()
        mem.updated_at = datetime.now(timezone.utc).isoformat()
        await self.db.commit()
        await self.db.refresh(mem)
        return mem

    async def delete_semantic(self, mem_id: str) -> None:
        mem = await self.get_semantic(mem_id)
        await self.db.delete(mem)
        await self.db.commit()

    # ─── Episodic ───

    async def create_episodic(self, data: EpisodicMemoryCreate) -> EpisodicMemory:
        ep = EpisodicMemory(
            episode_type=data.episode_type,
            task_id=data.task_id,
            agent_id=data.agent_id,
            agent_name=data.agent_name,
            content=data.content,
            outcome=data.outcome,
            cost=data.cost,
            duration_ms=data.duration_ms,
        )
        self.db.add(ep)
        await self.db.commit()
        await self.db.refresh(ep)
        return ep

    async def list_episodic(self, agent_id: str | None = None, task_id: str | None = None) -> list[EpisodicMemory]:
        q = select(EpisodicMemory)
        if agent_id:
            q = q.where(EpisodicMemory.agent_id == agent_id)
        if task_id:
            q = q.where(EpisodicMemory.task_id == task_id)
        result = await self.db.execute(q.order_by(EpisodicMemory.timestamp.desc()))
        return result.scalars().all()

    async def get_episodic(self, ep_id: str) -> EpisodicMemory:
        result = await self.db.execute(select(EpisodicMemory).where(EpisodicMemory.id == ep_id))
        return result.scalar_one()

    async def search_episodic(self, query: str, limit: int = 10) -> list[EpisodicMemory]:
        q = select(EpisodicMemory).where(
            or_(
                EpisodicMemory.content.ilike(f"%{query}%"),
                EpisodicMemory.agent_name.ilike(f"%{query}%"),
                EpisodicMemory.task_id.ilike(f"%{query}%"),
            )
        ).order_by(EpisodicMemory.timestamp.desc()).limit(limit)
        result = await self.db.execute(q)
        return result.scalars().all()

    # ─── Procedural ───

    async def create_procedure(self, data: ProceduralMemoryCreate) -> ProceduralMemory:
        proc = ProceduralMemory(
            name=data.name,
            description=data.description,
            code=data.code,
            schema=data.schema,
            version=data.version,
            success_rate=data.success_rate,
            usage_count=data.usage_count,
            bumblebee_status=data.bumblebee_status,
        )
        self.db.add(proc)
        await self.db.commit()
        await self.db.refresh(proc)
        return proc

    async def get_procedure(self, proc_id: str) -> ProceduralMemory:
        result = await self.db.execute(select(ProceduralMemory).where(ProceduralMemory.id == proc_id))
        return result.scalar_one()

    async def list_procedures(self) -> list[ProceduralMemory]:
        result = await self.db.execute(select(ProceduralMemory).order_by(ProceduralMemory.name))
        return result.scalars().all()

    async def search_procedures(self, query: str, limit: int = 10) -> list[ProceduralMemory]:
        q = select(ProceduralMemory).where(
            or_(
                ProceduralMemory.name.ilike(f"%{query}%"),
                ProceduralMemory.description.ilike(f"%{query}%"),
            )
        ).limit(limit)
        result = await self.db.execute(q)
        return result.scalars().all()

    async def update_procedure(self, proc_id: str, data: ProceduralMemoryUpdate) -> ProceduralMemory:
        proc = await self.get_procedure(proc_id)

        # save old version
        old = ProcedureVersion(
            procedure_id=proc.id,
            name=proc.name,
            description=proc.description,
            code=proc.code,
            schema=proc.schema,
            version=proc.version,
        )
        self.db.add(old)

        # bump version
        parts = proc.version.split(".")
        parts[-1] = str(int(parts[-1]) + 1)
        proc.version = ".".join(parts)

        if data.name is not None:
            proc.name = data.name
        if data.description is not None:
            proc.description = data.description
        if data.code is not None:
            proc.code = data.code
        if data.schema is not None:
            proc.schema = data.schema
        if data.success_rate is not None:
            proc.success_rate = data.success_rate
        if data.usage_count is not None:
            proc.usage_count = data.usage_count
        if data.bumblebee_status is not None:
            proc.bumblebee_status = data.bumblebee_status

        proc.updated_at = datetime.now(timezone.utc).isoformat()
        proc.parent_version = old.version
        await self.db.commit()
        await self.db.refresh(proc)
        return proc

    async def get_procedure_versions(self, proc_id: str) -> list[ProcedureVersion]:
        result = await self.db.execute(
            select(ProcedureVersion).where(ProcedureVersion.procedure_id == proc_id).order_by(ProcedureVersion.created_at.desc())
        )
        return result.scalars().all()
