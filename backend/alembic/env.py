"""Alembic environment bound to the application settings and models."""

from datetime import UTC, datetime
from logging.config import fileConfig

from alembic import context
from alembic.operations.ops import MigrationScript
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine, pool

from app.shared.config.settings import get_settings
from app.shared.database.base import Base
from app.shared.discovery import import_submodules

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

import_submodules('app.modules', 'models')
target_metadata = Base.metadata


def existing_revision_ids(script_directory: ScriptDirectory) -> set[str]:
    """List every revision id already present in ``versions/``."""
    return {script.revision for script in script_directory.walk_revisions()}


def process_revision_directives(
    migration_context: MigrationContext,
    revision: str | tuple[str, ...] | None,
    directives: list[MigrationScript],
) -> None:
    """Stamp the revision id as ``AAAAMMDD_HHMM``, adding seconds on clash.

    Two revisions generated inside the same minute would otherwise
    receive the same identifier, since the timestamp alone is not
    guaranteed to be unique. The seconds are appended only when the
    minute-precision id already exists.
    """
    script_directory = ScriptDirectory.from_config(config)
    taken = existing_revision_ids(script_directory)

    now = datetime.now(UTC)
    stamped = now.strftime('%Y%m%d_%H%M')
    if stamped in taken:
        stamped = now.strftime('%Y%m%d_%H%M%S')

    directives[0].rev_id = stamped


def database_url() -> str:
    """Resolve the DSN from ``Settings``, never from ``alembic.ini``."""
    return get_settings().database.dsn


def run_migrations_offline() -> None:
    """Emit the migration SQL without connecting to the database."""
    context.configure(
        url=database_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
        process_revision_directives=process_revision_directives,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Apply the migrations through a live connection."""
    engine = create_engine(database_url(), poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            process_revision_directives=process_revision_directives,
        )
        with context.begin_transaction():
            context.run_migrations()
    engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
