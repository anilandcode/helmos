import asyncio
from temporalio.worker import Worker
from app.temporal.client import get_temporal_client
from app.temporal.workflows import AgentTaskWorkflow
from app.temporal.activities import execute_checkpoint, update_task_status, calculate_total_cost


async def main():
    client = await get_temporal_client()
    worker = Worker(
        client,
        task_queue="agent-tasks",
        workflows=[AgentTaskWorkflow],
        activities=[execute_checkpoint, update_task_status, calculate_total_cost],
    )
    print("Temporal Worker started on task_queue='agent-tasks'")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())
