import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    provider: Mapped[str] = mapped_column(String, nullable=False)
    reasoning: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    coding: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    long_context: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    tool_use: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    speed: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    cost_efficiency: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    cost_per_1k_input: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    cost_per_1k_output: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    context_window: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String, nullable=False, default="available")
    last_used: Mapped[str | None] = mapped_column(String, nullable=True)
    success_rate_7d: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    avg_latency_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class RoutingDecision(Base):
    __tablename__ = "routing_decisions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id: Mapped[str] = mapped_column(String, nullable=False)
    task_type: Mapped[str] = mapped_column(String, nullable=False)
    selected_model: Mapped[str] = mapped_column(String, nullable=False)
    selected_model_id: Mapped[str] = mapped_column(String, nullable=False)
    reasoning: Mapped[str] = mapped_column(String, nullable=False, default="")
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estimated_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    actual_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estimated_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    actual_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fallback_from: Mapped[str | None] = mapped_column(String, nullable=True)
    fallback_reason: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp: Mapped[str] = mapped_column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    input_sample: Mapped[str | None] = mapped_column(String, nullable=True)


class FallbackEvent(Base):
    __tablename__ = "fallback_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    original_model: Mapped[str] = mapped_column(String, nullable=False)
    fallback_model: Mapped[str] = mapped_column(String, nullable=False)
    reason: Mapped[str] = mapped_column(String, nullable=False)
    task_id: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[str] = mapped_column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    retry_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
