import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class RouterDecision(Base):
    __tablename__ = "router_decisions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id: Mapped[str] = mapped_column(String, nullable=False)
    task_type: Mapped[str] = mapped_column(String, nullable=False)
    selected_model: Mapped[str] = mapped_column(String, nullable=False)
    selected_model_id: Mapped[str] = mapped_column(String, nullable=False)
    reasoning: Mapped[str] = mapped_column(String, nullable=False, default="")
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estimated_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    actual_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estimated_tokens: Mapped[int] = mapped_column(Integer, default=0)
    actual_tokens: Mapped[int] = mapped_column(Integer, default=0)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    fallback_from: Mapped[str | None] = mapped_column(String, nullable=True)
    fallback_reason: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp: Mapped[str] = mapped_column(String, default=lambda: datetime.utcnow().isoformat())


class FallbackEvent(Base):
    __tablename__ = "fallback_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    original_model: Mapped[str] = mapped_column(String, nullable=False)
    fallback_model: Mapped[str] = mapped_column(String, nullable=False)
    reason: Mapped[str] = mapped_column(String, nullable=False)
    task_id: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[str] = mapped_column(String, default=lambda: datetime.utcnow().isoformat())
    resolved: Mapped[bool] = mapped_column(default=False)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
