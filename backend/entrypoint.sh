#!/bin/sh
# ensure our package is importable
export PYTHONPATH=/app

# ensure tables exist before running migrations (helpful on fresh db)
python - <<'PY'
from app.core.database import Base, engine
Base.metadata.create_all(bind=engine)
PY

# run database migrations (silent if none)
alembic upgrade head

# finally start the server
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
