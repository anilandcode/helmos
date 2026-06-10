from datetime import date
from redis.asyncio import Redis

DAILY_LIMIT = 50.0
MONTHLY_LIMIT = 1000.0


class CostGuard:
    def __init__(self, redis: Redis):
        self.redis = redis

    def _daily_key(self, agent_id: str = "global") -> str:
        return f"cost:daily:{date.today().isoformat()}:{agent_id}"

    def _monthly_key(self, agent_id: str = "global") -> str:
        return f"cost:monthly:{date.today().strftime('%Y-%m')}:{agent_id}"

    async def get_daily_spend(self, agent_id: str = "global") -> float:
        val = await self.redis.get(self._daily_key(agent_id))
        return float(val) if val else 0.0

    async def get_monthly_spend(self, agent_id: str = "global") -> float:
        val = await self.redis.get(self._monthly_key(agent_id))
        return float(val) if val else 0.0

    async def add_cost(self, amount: float, agent_id: str = "global"):
        pipe = self.redis.pipeline()
        pipe.incrbyfloat(self._daily_key(agent_id), amount)
        pipe.incrbyfloat(self._monthly_key(agent_id), amount)
        pipe.expire(self._daily_key(agent_id), 86400 * 2)
        pipe.expire(self._monthly_key(agent_id), 86400 * 40)
        await pipe.execute()

    async def check_budget(self, estimated_cost: float, agent_id: str = "global") -> dict:
        daily = await self.get_daily_spend(agent_id)
        monthly = await self.get_monthly_spend(agent_id)

        remaining_daily = DAILY_LIMIT - daily
        remaining_monthly = MONTHLY_LIMIT - monthly

        allowed = estimated_cost <= remaining_daily and estimated_cost <= remaining_monthly
        warning = daily / DAILY_LIMIT > 0.80 if DAILY_LIMIT > 0 else False

        return {
            "allowed": allowed,
            "daily_spend": daily,
            "monthly_spend": monthly,
            "daily_limit": DAILY_LIMIT,
            "monthly_limit": MONTHLY_LIMIT,
            "remaining_daily": remaining_daily,
            "remaining_monthly": remaining_monthly,
            "estimated_cost": estimated_cost,
            "warning": warning,
        }

    async def get_summary(self) -> dict:
        daily = await self.get_daily_spend()
        monthly = await self.get_monthly_spend()
        return {
            "daily_spend": daily,
            "monthly_spend": monthly,
            "daily_limit": DAILY_LIMIT,
            "monthly_limit": MONTHLY_LIMIT,
            "daily_percentage": round(daily / DAILY_LIMIT * 100, 1) if DAILY_LIMIT > 0 else 0,
            "monthly_percentage": round(monthly / MONTHLY_LIMIT * 100, 1) if MONTHLY_LIMIT > 0 else 0,
        }
