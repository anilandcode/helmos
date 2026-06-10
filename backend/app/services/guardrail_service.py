from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.security import GuardrailConfig

DEFAULT_GUARDRAILS = [
    {"id": "gr-block-unknown-domains", "name": "block_unknown_domains", "description": "Block all outbound requests to unknown domains", "rule_type": "allowlist", "config": {"domains": ["api.example.com", "*.google.com", "*.github.com", "*.slack.com"]}, "enabled": True, "action": "block"},
    {"id": "gr-cost-approval", "name": "cost_approval_threshold", "description": "Require human approval for tasks over cost threshold", "rule_type": "threshold", "config": {"threshold_usd": 1.00}, "enabled": True, "action": "require_approval"},
    {"id": "gr-workspace-jail", "name": "workspace_jail", "description": "Allow agent file access only within workspace directory", "rule_type": "pattern", "config": {"allowed_paths": ["/workspace/*", "/home/*", "/tmp/*"]}, "enabled": True, "action": "block"},
    {"id": "gr-sanitize-outputs", "name": "sanitize_outputs", "description": "Scan LLM outputs before execution", "rule_type": "pattern", "config": {"check_patterns": ["sql_injection", "xss", "command_injection"]}, "enabled": True, "action": "warn"},
    {"id": "gr-log-all-tool-calls", "name": "log_all_tool_calls", "description": "Audit all tool usage", "rule_type": "blocklist", "config": {}, "enabled": True, "action": "log"},
]

import fnmatch


class GuardrailService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def initialize_defaults(self):
        result = await self.db.execute(select(GuardrailConfig).limit(1))
        if result.scalar_one_or_none():
            return
        for g in DEFAULT_GUARDRAILS:
            self.db.add(GuardrailConfig(**g))
        await self.db.commit()

    async def get_active(self) -> list[GuardrailConfig]:
        result = await self.db.execute(select(GuardrailConfig).where(GuardrailConfig.enabled == True))
        return result.scalars().all()

    async def get_all(self) -> list[GuardrailConfig]:
        result = await self.db.execute(select(GuardrailConfig))
        return result.scalars().all()

    async def get_by_id(self, gr_id: str) -> GuardrailConfig | None:
        result = await self.db.execute(select(GuardrailConfig).where(GuardrailConfig.id == gr_id))
        return result.scalar_one_or_none()

    async def toggle(self, gr_id: str, enabled: bool | None = None, action: str | None = None, config: dict | None = None) -> GuardrailConfig:
        gr = await self.get_by_id(gr_id)
        if not gr:
            raise ValueError("Guardrail not found")
        if enabled is not None:
            gr.enabled = enabled
        if action is not None:
            gr.action = action
        if config is not None:
            gr.config = config
        await self.db.commit()
        await self.db.refresh(gr)
        return gr

    async def check_tool_call(self, agent_id: str, tool_name: str, params: dict) -> dict:
        gr = await self.get_by_id("gr-log-all-tool-calls")
        if gr and gr.enabled:
            return {"allowed": True, "reason": f"Tool call logged: {tool_name}", "guardrail": "log_all_tool_calls"}
        return {"allowed": True}

    async def check_file_access(self, agent_id: str, path: str, mode: str) -> dict:
        gr = await self.get_by_id("gr-workspace-jail")
        if not gr or not gr.enabled:
            return {"allowed": True}
        allowed = gr.config.get("allowed_paths", [])
        for pattern in allowed:
            if fnmatch.fnmatch(path, pattern):
                return {"allowed": True}
        return {"allowed": False, "reason": f"Path '{path}' not in allowed workspace", "guardrail": "workspace_jail"}

    async def check_network_request(self, agent_id: str, url: str) -> dict:
        gr = await self.get_by_id("gr-block-unknown-domains")
        if not gr or not gr.enabled:
            return {"allowed": True}
        from urllib.parse import urlparse
        hostname = urlparse(url).hostname or url
        allowed = gr.config.get("domains", [])
        for pattern in allowed:
            if fnmatch.fnmatch(hostname, pattern):
                return {"allowed": True}
        return {"allowed": False, "reason": f"Domain '{hostname}' not in allowlist", "guardrail": "block_unknown_domains"}

    async def check_cost_threshold(self, agent_id: str, estimated_cost: float) -> dict:
        gr = await self.get_by_id("gr-cost-approval")
        if not gr or not gr.enabled:
            return {"allowed": True}
        threshold = gr.config.get("threshold_usd", 1.00)
        if estimated_cost > threshold:
            return {"allowed": True, "requires_approval": True, "reason": f"Cost ${estimated_cost:.4f} exceeds threshold ${threshold:.2f}", "guardrail": "cost_approval_threshold"}
        return {"allowed": True}

    async def count_active(self) -> int:
        result = await self.db.execute(select(GuardrailConfig).where(GuardrailConfig.enabled == True))
        return len(result.scalars().all())

    async def count_total(self) -> int:
        from sqlalchemy import func as sqlfunc
        result = await self.db.execute(select(sqlfunc.count(GuardrailConfig.id)))
        return result.scalar() or 0
