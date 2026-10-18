"""Settings resolution."""

import pytest

from app.shared.config.settings import DatabaseSettings


@pytest.mark.parametrize(
    'dsn',
    [
        'postgres://user:secret@host/db?sslmode=require',
        'postgresql://user:secret@host/db?sslmode=require',
        'postgresql+psycopg://user:secret@host/db?sslmode=require',
    ],
)
def test_dsn_uses_psycopg_driver(dsn: str) -> None:
    """Plain PostgreSQL schemes are rewritten to the psycopg driver."""
    settings = DatabaseSettings(dsn=dsn)

    assert settings.dsn == (
        'postgresql+psycopg://user:secret@host/db?sslmode=require'
    )
