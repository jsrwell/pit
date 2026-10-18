#!/bin/sh
# Applies pending migrations and the idempotent seed before serving, unless
# RUN_MIGRATIONS=false or RUN_SEED=false, so a single-instance host without
# a pre-deploy hook stays in sync.
set -eu

if [ "${RUN_MIGRATIONS}" = "true" ]; then
    alembic upgrade head
fi

if [ "${RUN_SEED}" = "true" ]; then
    python src/seed.py
fi

exec "$@"
