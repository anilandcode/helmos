from pgvector.sqlalchemy import Vector
from sqlalchemy import String, Float, Integer, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import uuid


class SemanticMemory(Base):
    __tablename__ = "semantic_memories"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    category: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    source_url: Mapped[str | None] = mapped_column(String, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    last_verified: Mapped[str] = mapped_column(String, nullable=False, default=lambda: "2026-01-01T00:00:00")
    embedding = mapped_column(Vector(1536), nullable=True)
    created_at: Mapped[str] = mapped_column(String, server_default=func.now())
    updated_at: Mapped[str] = mapped_column(String, server_default=func.now())


class EpisodicMemory(Base):
    __tablename__ = "episodic_memories"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_type: Mapped[str] = mapped_column(String, nullable=False)
    task_id: Mapped[str | None] = mapped_column(String, nullable=True)
    agent_id: Mapped[str] = mapped_column(String, nullable=False)
    agent_name: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    outcome: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[str] = mapped_column(String, nullable=False, default=lambda: "2026-01-01T00:00:00")
    cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)


class ProceduralMemory(Base):
    __tablename__ = "procedural_memories"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    code: Mapped[str] = mapped_column(String, nullable=False, default="")
    schema: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    version: Mapped[str] = mapped_column(String, nullable=False, default="1.0.0")
    parent_version: Mapped[str | None] = mapped_column(String, nullable=True)
    success_rate: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    usage_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bumblebee_status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    created_at: Mapped[str] = mapped_column(String, server_default=func.now())
    updated_at: Mapped[str] = mapped_column(String, server_default=func.now())


class ProcedureVersion(Base):
    __tablename__ = "procedure_versions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    procedure_id: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    code: Mapped[str] = mapped_column(String, nullable=False, default="")
    schema: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    version: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[str] = mapped_column(String, server_default=func.now())
