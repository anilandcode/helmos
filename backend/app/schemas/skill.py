from pydantic import BaseModel, ConfigDict


class SkillResponse(BaseModel):
    id: str
    name: str
    description: str
    short_description: str = ""
    category: str
    author: dict
    version: str
    rating: float = 0.0
    review_count: int = 0
    install_count: int = 0
    price: float = 0.0
    tags: list = []
    capabilities: list = []
    bumblebee_status: str = "pending"
    last_updated: str
    icon: str = ""
    color: str = "#3B82F6"

    model_config = ConfigDict(from_attributes=True)
