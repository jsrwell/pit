#!/bin/sh
# Applies pending migrations before serving, unless RUN_MIGRATIONS=false,
# so a single-instance host without a pre-deploy hook stays in sync.
set -eu

if [ "${RUN_MIGRATIONS}" = "true" ]; then
    alembic upgrade head
fi

exec "$@"
