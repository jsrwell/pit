"""Engine and per-request session bound to the configured database."""

from collections.abc import Iterator
from contextlib import contextmanager
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, SessionTransaction, sessionmaker

from app.shared.config.settings import get_settings
from app.shared.errors.domain_error import DomainError


@lru_cache
def get_engine() -> Engine:
    """Return the process-wide engine, created on first use."""
    database = get_settings().database
    return create_engine(database.dsn, echo=database.echo, pool_pre_ping=True)


@lru_cache
def get_session_factory() -> sessionmaker[Session]:
    """Return the session factory bound to the engine."""
    return sessionmaker(bind=get_engine(), expire_on_commit=False)


@contextmanager
def unit_of_work(transaction: SessionTransaction) -> Iterator[None]:
    """Commit ``transaction`` on success and roll it back on failure.

    A domain error flagged with ``keeps_changes`` still commits, so a
    request can persist a side effect, such as a failed login attempt,
    while answering with an error.
    """
    try:
        yield
    except DomainError as error:
        if error.keeps_changes:
            transaction.commit()
        else:
            transaction.rollback()
        raise
    except BaseException:
        transaction.rollback()
        raise
    transaction.commit()


def get_session() -> Iterator[Session]:
    """Yield one transactional session per request.

    Services and repositories never call ``commit`` themselves; the
    transaction ends here, as decided by ``unit_of_work``.
    """
    with get_session_factory()() as session, unit_of_work(session.begin()):
        yield session
