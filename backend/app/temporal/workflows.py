from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy
from app.temporal.schemas import AgentTaskInput, AgentTaskResult, CheckpointResult


@workflow.defn
class AgentTaskWorkflow:
    def __init__(self):
        self._status = "running"
        self._current_checkpoint = 0
        self._checkpoints: list[CheckpointResult] = []
        self._total_cost = 0.0

    @workflow.run
    async def run(self, input: AgentTaskInput) -> AgentTaskResult:
        await workflow.execute_activity(
            "update_task_status",
            args=[input.task_id, "in_progress"],
            retry_policy=RetryPolicy(maximum_attempts=3),
            start_to_close_timeout=timedelta(seconds=10),
        )

        for i, name in enumerate(input.checkpoint_names):
            if self._status == "killed":
                break
            if self._status == "paused":
                await workflow.wait_condition(lambda: self._status != "paused")

            self._current_checkpoint = i

            try:
                result: CheckpointResult = await workflow.execute_activity(
                    "execute_checkpoint",
                    args=[input, i],
                    retry_policy=RetryPolicy(
                        maximum_attempts=3,
                        initial_interval=timedelta(seconds=1),
                    ),
                    start_to_close_timeout=timedelta(seconds=30),
                )
                self._checkpoints.append(result)
                self._total_cost += result.cost

                if result.status == "failed":
                    self._status = "failed"
                    break
            except Exception:
                self._status = "failed"
                break

        if self._status == "killed":
            final_status = "killed"
        elif self._status == "failed":
            final_status = "failed"
        elif self._current_checkpoint < len(input.checkpoint_names) - 1:
            final_status = "partial"
        else:
            final_status = "completed"

        await workflow.execute_activity(
            "calculate_total_cost",
            args=[input.task_id],
            retry_policy=RetryPolicy(maximum_attempts=3),
            start_to_close_timeout=timedelta(seconds=10),
        )

        await workflow.execute_activity(
            "update_task_status",
            args=[input.task_id, final_status],
            retry_policy=RetryPolicy(maximum_attempts=3),
            start_to_close_timeout=timedelta(seconds=10),
        )

        return AgentTaskResult(
            task_id=input.task_id,
            agent_id=input.agent_id,
            status=final_status,
            checkpoints=self._checkpoints,
            total_cost=self._total_cost,
        )

    @workflow.signal
    async def pause(self) -> None:
        self._status = "paused"

    @workflow.signal
    async def resume(self) -> None:
        self._status = "running"

    @workflow.signal
    async def kill(self) -> None:
        self._status = "killed"

    @workflow.query
    def get_status(self) -> dict:
        return {
            "task_id": workflow.info().workflow_id.replace("task-", ""),
            "current_checkpoint": self._current_checkpoint,
            "total_checkpoints": len(self._checkpoints),
            "status": self._status,
            "total_cost": self._total_cost,
        }
