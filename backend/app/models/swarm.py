import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class SwarmConfig(Base):
    __tablename__ = "swarm_configs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    goal: Mapped[str] = mapped_column(String, nullable=False)
    agents: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    consensus_mode: Mapped[str] = mapped_column(String, nullable=False, default="majority")
    max_rounds: Mapped[int] = mapped_column(Integer, default=5)
    timeout_minutes: Mapped[int] = mapped_column(Integer, default=60)
    created_at: Mapped[str] = mapped_column(String, default=lambda: datetime.utcnow().isoformat())


class SwarmExecution(Base):
    __tablename__ = "swarm_executions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    config_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="running")
    current_round: Mapped[int] = mapped_column(Integer, default=1)
    max_rounds: Mapped[int] = mapped_column(Integer, default=5)
    start_time: Mapped[str] = mapped_column(String, default=lambda: datetime.utcnow().isoformat())
    end_time: Mapped[str | None] = mapped_column(String, nullable=True)
    messages: Mapped[list] = mapped_column(JSON, default=list)
    decisions: Mapped[list] = mapped_column(JSON, default=list)
    final_output: Mapped[str | None] = mapped_column(String, nullable=True)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
