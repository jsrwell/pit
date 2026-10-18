"""Engine and per-request session bound to the configured database."""

from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.shared.config.settings import get_settings


@lru_cache
def get_engine() -> Engine:
    """Return the process-wide engine, created on first use."""
    database = get_settings().database
    return create_engine(database.dsn, echo=database.echo, pool_pre_ping=True)


@lru_cache
def get_session_factory() -> sessionmaker[Session]:
    """Return the session factory bound to the engine."""
    return sessionmaker(bind=get_engine(), expire_on_commit=False)


def get_session() -> Iterator[Session]:
    """Yield one transactional session per request.

    The transaction commits when the request handler returns and rolls
    back when it raises, so services never call ``commit`` themselves.
    """
    with get_session_factory().begin() as session:
        yield session
