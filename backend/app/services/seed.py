from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

SEED_AGENTS = [
    {"id": "agent-1", "name": "Athena", "role": "coordinator", "status": "working", "current_task": "Q2 pricing analysis", "model": "Claude-4-Sonnet", "last_heartbeat": datetime.utcnow().isoformat(), "success_rate": 0.94, "cost_today": 3.42},
    {"id": "agent-2", "name": "Hermes", "role": "researcher", "status": "online", "current_task": None, "model": "GPT-4o", "last_heartbeat": datetime.utcnow().isoformat(), "success_rate": 0.91, "cost_today": 1.87},
    {"id": "agent-3", "name": "Babbage", "role": "executor", "status": "idle", "current_task": None, "model": "Claude-4-Haiku", "last_heartbeat": (datetime.utcnow().isoformat()), "success_rate": 0.88, "cost_today": 0.95},
    {"id": "agent-4", "name": "Critias", "role": "critic", "status": "online", "current_task": None, "model": "Claude-4-Sonnet", "last_heartbeat": datetime.utcnow().isoformat(), "success_rate": 0.92, "cost_today": 2.10},
    {"id": "agent-5", "name": "Synthia", "role": "synthesizer", "status": "error", "current_task": "Weekly report compilation", "model": "GPT-4o", "last_heartbeat": datetime.utcnow().isoformat(), "success_rate": 0.85, "cost_today": 4.55},
]

SEED_TASKS = [
    {"id": "task-1", "title": "Analyze Q2 pricing data", "description": "Pull Q2 sales data and identify pricing optimization opportunities across product tiers", "status": "in_progress", "priority": "high", "assigned_agent": "agent-1", "agent_id": "agent-1", "agent_name": "Athena", "model_used": "Claude-4-Sonnet", "cost": 0.0423, "estimated_cost": 2.50, "tags": ["analytics", "pricing"], "created_at": (datetime.utcnow().isoformat())},
    {"id": "task-2", "title": "Research competitor landscape", "description": "Gather intelligence on top 5 competitors", "status": "todo", "priority": "medium", "estimated_cost": 3.00, "tags": ["research", "competitive"], "created_at": (datetime.utcnow().isoformat())},
    {"id": "task-3", "title": "Generate weekly email campaign", "description": "Create personalized email sequences for the top 500 leads", "status": "todo", "priority": "high", "estimated_cost": 1.80, "tags": ["email", "marketing"], "created_at": (datetime.utcnow().isoformat())},
    {"id": "task-4", "title": "Debug API rate limiting", "description": "Investigate 429 errors in production", "status": "review", "priority": "critical", "assigned_agent": "agent-3", "agent_id": "agent-3", "agent_name": "Babbage", "estimated_cost": 1.20, "tags": ["engineering", "bugfix"], "created_at": (datetime.utcnow().isoformat())},
    {"id": "task-5", "title": "Review Q1 financial model", "description": "Audit the Q1 financial projection model", "status": "in_progress", "priority": "high", "assigned_agent": "agent-4", "agent_id": "agent-4", "agent_name": "Critias", "estimated_cost": 2.80, "tags": ["finance", "audit"], "created_at": (datetime.utcnow().isoformat())},
    {"id": "task-6", "title": "Draft social media calendar", "description": "Create a 30-day content calendar", "status": "done", "priority": "low", "assigned_agent": "agent-5", "agent_id": "agent-5", "agent_name": "Synthia", "estimated_cost": 1.50, "tags": ["marketing", "social"], "created_at": (datetime.utcnow().isoformat()), "completed_at": (datetime.utcnow().isoformat())},
    {"id": "task-7", "title": "Onboard new team members", "description": "Send welcome docs for 3 new hires", "status": "done", "priority": "medium", "assigned_agent": "agent-2", "agent_id": "agent-2", "agent_name": "Hermes", "estimated_cost": 0.80, "tags": ["hr", "onboarding"], "created_at": (datetime.utcnow().isoformat()), "completed_at": (datetime.utcnow().isoformat())},
    {"id": "task-8", "title": "Security audit for SOC 2", "description": "Run Bumblebee scan on all installed skills", "status": "todo", "priority": "critical", "estimated_cost": 5.00, "tags": ["security", "compliance"], "created_at": (datetime.utcnow().isoformat())},
]

CHECKPOINTS_FOR_TASK_1 = [
    {"task_id": "task-1", "index": 0, "name": "Plan research", "status": "completed", "reasoning": "Breaking down research into 5 key competitors", "tool_used": "decompose-task", "confidence": 0.92, "output": "Identified 5 competitors"},
    {"task_id": "task-1", "index": 1, "name": "Search web", "status": "completed", "reasoning": "Using comprehensive web search", "tool_used": "web-search", "confidence": 0.87},
    {"task_id": "task-1", "index": 2, "name": "Extract data", "status": "active", "reasoning": "Extracting structured pricing data", "tool_used": "data-extractor", "confidence": 0.78},
    {"task_id": "task-1", "index": 3, "name": "Analyze trends", "status": "pending"},
    {"task_id": "task-1", "index": 4, "name": "Generate report", "status": "pending"},
]

SEED_MODELS = [
    {"id": "claude-4-sonnet", "name": "Claude 4 Sonnet", "provider": "Anthropic", "reasoning": 0.95, "coding": 0.90, "long_context": 0.95, "tool_use": 0.90, "speed": 0.80, "cost_efficiency": 0.70, "cost_per_1k_input": 0.003, "cost_per_1k_output": 0.015, "context_window": 200000, "status": "available", "success_rate_7d": 0.94, "avg_latency_ms": 1850},
    {"id": "gpt-5", "name": "GPT-5", "provider": "OpenAI", "reasoning": 0.90, "coding": 0.85, "long_context": 0.90, "tool_use": 0.85, "speed": 0.85, "cost_efficiency": 0.60, "cost_per_1k_input": 0.005, "cost_per_1k_output": 0.015, "context_window": 128000, "status": "available", "success_rate_7d": 0.91, "avg_latency_ms": 1620},
    {"id": "deepseek-v4-pro", "name": "DeepSeek V4 Pro", "provider": "DeepSeek", "reasoning": 0.85, "coding": 0.80, "long_context": 0.80, "tool_use": 0.75, "speed": 0.70, "cost_efficiency": 0.95, "cost_per_1k_input": 0.0005, "cost_per_1k_output": 0.002, "context_window": 64000, "status": "available", "success_rate_7d": 0.88, "avg_latency_ms": 1240},
    {"id": "gemini-2.5-pro", "name": "Gemini 2.5 Pro", "provider": "Google", "reasoning": 0.88, "coding": 0.82, "long_context": 0.98, "tool_use": 0.80, "speed": 0.75, "cost_efficiency": 0.75, "cost_per_1k_input": 0.001, "cost_per_1k_output": 0.004, "context_window": 1000000, "status": "available", "success_rate_7d": 0.82, "avg_latency_ms": 2100},
    {"id": "local-ollama", "name": "Local Ollama", "provider": "Local", "reasoning": 0.60, "coding": 0.55, "long_context": 0.50, "tool_use": 0.40, "speed": 0.90, "cost_efficiency": 1.00, "cost_per_1k_input": 0.0, "cost_per_1k_output": 0.0, "context_window": 32000, "status": "available", "success_rate_7d": 0.76, "avg_latency_ms": 680},
]

SEED_MEMORIES_SEMANTIC = [
    {"id": "mem-sem-1", "category": "pricing", "content": "Competitor X charges $49/mo for pro tier", "confidence": 0.95},
    {"id": "mem-sem-2", "category": "competitors", "content": "Odysseus is a self-hosted AI workspace with deep research", "confidence": 0.90},
    {"id": "mem-sem-3", "category": "tech_stack", "content": "FastAPI + SQLAlchemy + asyncpg is the recommended Python async stack", "confidence": 0.98},
    {"id": "mem-sem-4", "category": "pricing", "content": "OpenAI GPT-5 costs $0.005 per 1K input tokens", "confidence": 0.99},
    {"id": "mem-sem-5", "category": "competitors", "content": "AionUi wraps multiple CLI agents in a desktop GUI", "confidence": 0.85},
    {"id": "mem-sem-6", "category": "tech_stack", "content": "Temporal workflows survive process crashes and retries", "confidence": 0.95},
    {"id": "mem-sem-7", "category": "pricing", "content": "DeepSeek V4 Pro costs $0.0005 per 1K input tokens", "confidence": 0.99},
    {"id": "mem-sem-8", "category": "competitors", "content": "OpenUI is a framework for generative UI with token-efficient syntax", "confidence": 0.88},
    {"id": "mem-sem-9", "category": "tech_stack", "content": "pgvector enables vector similarity search in PostgreSQL", "confidence": 0.97},
    {"id": "mem-sem-10", "category": "pricing", "content": "Claude 4 Sonnet costs $0.003 per 1K input tokens", "confidence": 0.99},
]

SEED_MEMORIES_EPISODIC = [
    {"id": "mem-ep-1", "episode_type": "task_execution", "agent_id": "agent-5", "agent_name": "Synthia", "content": "Completed social media calendar draft", "outcome": "success", "cost": 0.015, "duration_ms": 120000},
    {"id": "mem-ep-2", "episode_type": "tool_call", "agent_id": "agent-2", "agent_name": "Hermes", "content": "Called web_search for Q3 competitor data", "outcome": "success", "cost": 0.003},
    {"id": "mem-ep-3", "episode_type": "error", "agent_id": "agent-5", "agent_name": "Synthia", "content": "API rate limit exceeded during email generation", "outcome": "failure", "cost": 0.001},
    {"id": "mem-ep-4", "episode_type": "decision", "agent_id": "agent-1", "agent_name": "Athena", "content": "Selected Claude 4 for long-context research task", "outcome": "success"},
    {"id": "mem-ep-5", "episode_type": "task_execution", "agent_id": "agent-3", "agent_name": "Babbage", "content": "Onboarded 5 new team members to CRM", "outcome": "success", "cost": 0.008, "duration_ms": 90000},
    {"id": "mem-ep-6", "episode_type": "tool_call", "agent_id": "agent-4", "agent_name": "Critias", "content": "Executed code_interpreter for financial model", "outcome": "success", "cost": 0.005},
    {"id": "mem-ep-7", "episode_type": "error", "agent_id": "agent-3", "agent_name": "Babbage", "content": "Permission denied accessing sensitive file", "outcome": "failure"},
    {"id": "mem-ep-8", "episode_type": "decision", "agent_id": "router", "agent_name": "Router", "content": "Fell back from Claude 4 to GPT-5 due to rate limiting", "outcome": "partial"},
]

SEED_MEMORIES_PROCEDURAL = [
    {"id": "mem-proc-1", "name": "web_search", "description": "Search the web using SearXNG", "code": "async def search(query: str) -> list[dict]:\n    return await searxng.search(query)", "schema": {"type": "object", "properties": {"query": {"type": "string"}}}, "version": "1.0.0", "success_rate": 0.95, "usage_count": 1240, "bumblebee_status": "passed"},
    {"id": "mem-proc-2", "name": "code_execution", "description": "Execute Python code safely", "code": "async def execute(code: str) -> dict:\n    return await sandbox.run(code)", "schema": {"type": "object", "properties": {"code": {"type": "string"}}}, "version": "1.0.0", "success_rate": 0.92, "usage_count": 856, "bumblebee_status": "passed"},
    {"id": "mem-proc-3", "name": "file_manager", "description": "Read and write files in workspace", "code": "async def read(path: str) -> str:\n    return await fs.read(path)", "schema": {"type": "object", "properties": {"path": {"type": "string"}}}, "version": "1.0.0", "success_rate": 0.88, "usage_count": 2103, "bumblebee_status": "pending"},
]


async def seed(db: AsyncSession):
    from sqlalchemy import select
    from app.models.agent import Agent
    from app.models.task import Task, Checkpoint
    from app.models.router import ModelRegistry
    from app.models.memory import SemanticMemory, EpisodicMemory, ProceduralMemory
    from app.services.embedding_service import EmbeddingService

    emb = EmbeddingService()

    result = await db.execute(select(Agent).limit(1))
    if result.scalar_one_or_none():
        pass
    else:
        for a in SEED_AGENTS:
            db.add(Agent(**a))
        for t in SEED_TASKS:
            db.add(Task(**t))
        for cp in CHECKPOINTS_FOR_TASK_1:
            db.add(Checkpoint(**cp))
        await db.commit()

    model_check = await db.execute(select(ModelRegistry).limit(1))
    if model_check.scalar_one_or_none():
        pass
    else:
        for m in SEED_MODELS:
            db.add(ModelRegistry(**m))
        await db.commit()

    sem_check = await db.execute(select(SemanticMemory).limit(1))
    if sem_check.scalar_one_or_none():
        pass
    else:
        for m in SEED_MEMORIES_SEMANTIC:
            db.add(SemanticMemory(**m, embedding=emb.generate(m["content"]), last_verified=datetime.utcnow().isoformat()))
        for e in SEED_MEMORIES_EPISODIC:
            db.add(EpisodicMemory(**e, timestamp=datetime.utcnow().isoformat()))
        for p in SEED_MEMORIES_PROCEDURAL:
            db.add(ProceduralMemory(**p))
        await db.commit()

    # security seeds
    from app.models.security import SecurityScan, AuditLog, GuardrailConfig
    from app.services.guardrail_service import GuardrailService

    sec_check = await db.execute(select(SecurityScan).limit(1))
    if sec_check.scalar_one_or_none():
        pass
    else:
        SEED_SCANS = [
            {"id": "scan-1", "scan_type": "skill_code", "target": "web_search", "status": "passed", "findings": [], "severity_counts": {}, "duration_ms": 45, "scanner_version": "1.0.0"},
            {"id": "scan-2", "scan_type": "skill_code", "target": "code_execution", "status": "passed", "findings": [], "severity_counts": {}, "duration_ms": 38, "scanner_version": "1.0.0"},
            {"id": "scan-3", "scan_type": "skill_code", "target": "file_manager", "status": "pending", "findings": [], "severity_counts": {}, "duration_ms": 0, "scanner_version": "1.0.0"},
        ]
        for s in SEED_SCANS:
            db.add(SecurityScan(**s))

        SEED_AUDIT = [
            {"id": "audit-1", "event_type": "tool_call", "agent_id": "agent-1", "task_id": "task-1", "action": "executed_web_search", "target": "Q3 competitor data", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-2", "event_type": "file_access", "agent_id": "agent-2", "task_id": "task-2", "action": "read_file", "target": "/workspace/data.csv", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-3", "event_type": "network_request", "agent_id": "agent-1", "task_id": "task-1", "action": "http_get", "target": "https://api.example.com", "details": {}, "severity": "warning", "outcome": "blocked"},
            {"id": "audit-4", "event_type": "agent_action", "agent_id": "agent-5", "task_id": "task-5", "action": "agent_blocked", "target": "Rate limit exceeded", "details": {}, "severity": "error", "outcome": "blocked"},
            {"id": "audit-5", "event_type": "config_change", "user_id": "admin", "action": "updated_api_key", "target": "anthropic", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-6", "event_type": "tool_call", "agent_id": "agent-3", "task_id": "task-3", "action": "executed_code_interpreter", "target": "financial_model.py", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-7", "event_type": "auth_attempt", "user_id": "admin", "action": "login", "target": "admin", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-8", "event_type": "file_access", "agent_id": "agent-2", "task_id": "task-2", "action": "write_file", "target": "/workspace/output.json", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-9", "event_type": "network_request", "agent_id": "agent-4", "task_id": "task-4", "action": "http_post", "target": "https://slack.com/api", "details": {}, "severity": "info", "outcome": "success"},
            {"id": "audit-10", "event_type": "agent_action", "agent_id": "agent-5", "task_id": "task-6", "action": "task_completed", "target": "Social media calendar", "details": {}, "severity": "info", "outcome": "success"},
        ]
        for a in SEED_AUDIT:
            db.add(AuditLog(**a))

        gsvc = GuardrailService(db)
        await gsvc.initialize_defaults()
        await db.commit()
