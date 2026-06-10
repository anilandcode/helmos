import os
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.dependencies import get_redis
from app.schemas.memory import MessageData, Meta

router = APIRouter(prefix="/obsidian", tags=["obsidian"])


@router.post("/sync", response_model=MessageData)
async def trigger_sync(redis: Redis = Depends(get_redis)):
    vault_path = os.path.expanduser("~/Obsidian/HelmOS")
    files_processed = 0
    errors = []

    if os.path.isdir(vault_path):
        for fname in os.listdir(vault_path):
            if fname.endswith(".md"):
                try:
                    fpath = os.path.join(vault_path, fname)
                    with open(fpath, "r") as f:
                        f.read()
                    files_processed += 1
                except Exception as e:
                    errors.append(str(e))
    else:
        errors.append(f"Vault path not found: {vault_path}")

    now = datetime.now(timezone.utc).isoformat()
    await redis.set("obsidian:last_sync", now)
    await redis.set("obsidian:status", "synced" if not errors else "error")
    await redis.set("obsidian:file_count", str(files_processed))

    return MessageData(
        data={"files_processed": files_processed, "errors": errors, "vault_path": vault_path},
        meta=Meta(count=1, timestamp=now),
    )


@router.get("/status", response_model=MessageData)
async def sync_status(redis: Redis = Depends(get_redis)):
    last_sync = (await redis.get("obsidian:last_sync")) or "never"
    status = (await redis.get("obsidian:status")) or "idle"
    file_count = int((await redis.get("obsidian:file_count")) or 0)
    return MessageData(
        data={"last_sync": last_sync, "status": status, "file_count": file_count},
        meta=Meta(count=1, timestamp=datetime.now(timezone.utc).isoformat()),
    )
