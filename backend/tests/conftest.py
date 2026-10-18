"""Fixtures shared by the whole test suite."""

from collections.abc import Iterator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture
def app() -> FastAPI:
    """Return a fresh application instance."""
    return create_app()


@pytest.fixture
def client(app: FastAPI) -> Iterator[TestClient]:
    """Return an HTTP client that answers unhandled errors as responses."""
    with TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client
