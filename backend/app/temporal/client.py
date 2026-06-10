from temporalio.client import Client

_client: Client | None = None


async def get_temporal_client() -> Client:
    global _client
    if _client is None:
        _client = await Client.connect("localhost:7233")
    return _client
