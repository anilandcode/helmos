"""Client for the HelmOS Memory Sandbox's personalization-context
endpoint (see helmos-memory-sandbox's app/routes/integrations.py).

The Sandbox models per-*user* personalization memory; HelmOS's task
model has no end-user concept yet (AgentTaskInput has no user_id
field) — agent_id is used as the lookup key as a documented stand-in
until HelmOS has a real "requesting user" concept on a task. Lookups
are best-effort: any failure (network, timeout, unknown id, missing
config) returns an empty list rather than raising, since personalization
context is an enrichment, not a requirement, for a checkpoint to run.
"""

import os

import httpx

SANDBOX_API_URL = os.getenv("SANDBOX_API_URL", "")
SANDBOX_SERVICE_TOKEN = os.getenv("SANDBOX_SERVICE_TOKEN", "")


async def get_context(user_id: str, limit: int = 3) -> list[str]:
    if not SANDBOX_API_URL or not SANDBOX_SERVICE_TOKEN:
        return []
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(
                f"{SANDBOX_API_URL}/integrations/helmos/context",
                params={"user_id": user_id, "limit": limit},
                headers={"Authorization": f"Bearer {SANDBOX_SERVICE_TOKEN}"},
            )
        if resp.status_code != 200:
            return []
        return resp.json().get("memories", [])
    except httpx.HTTPError:
        return []
