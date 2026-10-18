FROM python:3.13-slim AS builder

ENV POETRY_VERSION=2.1.4 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    PIP_NO_CACHE_DIR=1

RUN pip install "poetry==${POETRY_VERSION}"

WORKDIR /app
COPY backend/pyproject.toml backend/poetry.lock ./
RUN poetry install --only main --no-root --no-cache

FROM python:3.13-slim AS runtime

ARG APP_VERSION=0.0.0-dev

ENV PATH="/app/.venv/bin:${PATH}" \
    PYTHONPATH=/app/src \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP__VERSION=${APP_VERSION} \
    SERVER__HOST=0.0.0.0 \
    SERVER__PORT=8000 \
    DATABASE__DSN=postgresql+psycopg://cupcakes:cupcakes@database:5432/cupcakes \
    CORS__ALLOW_ORIGINS='["http://localhost:8080"]' \
    RUN_MIGRATIONS=true \
    RUN_SEED=true \
    SEED__DEMO_CATALOG=true

RUN useradd --create-home --uid 1000 app
WORKDIR /app

COPY --from=builder /app/.venv ./.venv
COPY backend/alembic.ini ./
COPY backend/alembic ./alembic
COPY backend/src ./src
COPY docker/release/backend/entrypoint.sh /usr/local/bin/entrypoint.sh

USER app
EXPOSE 8000

ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
CMD ["python", "src/run.py"]
