import uuid
from sqlalchemy import String, Float, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from datetime import datetime


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    short_description: Mapped[str] = mapped_column(String, nullable=False, default="")
    category: Mapped[str] = mapped_column(String, nullable=False)
    author: Mapped[dict] = mapped_column(JSON, nullable=False)
    version: Mapped[str] = mapped_column(String, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    install_count: Mapped[int] = mapped_column(Integer, default=0)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    capabilities: Mapped[list] = mapped_column(JSON, default=list)
    bumblebee_status: Mapped[str] = mapped_column(String, default="pending")
    last_updated: Mapped[str] = mapped_column(String, default=lambda: datetime.utcnow().isoformat())
    icon: Mapped[str] = mapped_column(String, default="")
    color: Mapped[str] = mapped_column(String, default="#3B82F6")
