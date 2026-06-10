# HelmOS Backend API

FastAPI backend for the HelmOS Agentic OS dashboard.

## Setup (Local)

### Prerequisites
- Python 3.11+
- PostgreSQL 16
- Redis 7

### Quick Start

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables (`.env`)

```
DATABASE_URL=postgresql+asyncpg://helmos:changeme@localhost:5432/helmos
REDIS_URL=redis://localhost:6379
ENVIRONMENT=development
SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Database Setup

```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
createuser -s helmos
createdb helmos -O helmos
psql -c "ALTER USER helmos WITH PASSWORD 'changeme';" postgres
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Root — API info |
| GET | `/health` | Health check — `{"status": "ok"}` |
| GET | `/ready` | Readiness — checks DB + Redis |
| GET | `/api/agents` | List all agents (5 seeded) |
| GET | `/api/agents/{id}` | Get agent by ID |
| GET | `/api/tasks` | List all tasks with checkpoints (8 seeded) |
| GET | `/api/tasks/{id}` | Get task by ID with checkpoints |

All list endpoints return `{ "data": [...], "meta": { "count": N, "timestamp": "..." } }`.

## Tech Stack

- **FastAPI** — async REST framework
- **SQLAlchemy 2.0 + asyncpg** — async PostgreSQL ORM
- **Redis 7** — caching / pubsub
- **Pydantic v2** — request/response validation
- **Uvicorn** — ASGI server

## Running Tests

```bash
cd backend
source venv/bin/activate
pytest tests/
```
