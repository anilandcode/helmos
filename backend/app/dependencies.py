from typing import Annotated
from fastapi import Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.database import get_db


async def get_redis() -> Redis:
    client = Redis.from_url(settings.redis_url, decode_responses=True)
    try:
        yield client
    finally:
        await client.close()


async def get_db_session() -> AsyncSession:
    async for session in get_db():
        yield session


DbDep = Annotated[AsyncSession, Depends(get_db_session)]
RedisDep = Annotated[Redis, Depends(get_redis)]
