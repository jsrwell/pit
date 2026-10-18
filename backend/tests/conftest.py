"""Fixtures shared by the whole test suite."""

from collections.abc import Callable, Iterator
from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import create_app
from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor
from app.modules.catalog.models.product import Product
from app.shared.database.session import get_engine, get_session

type ProductFactory = Callable[..., Product]


@pytest.fixture
def db_session() -> Iterator[Session]:
    """Yield a session whose changes are rolled back after the test."""
    connection = get_engine().connect()
    transaction = connection.begin()
    session = Session(
        bind=connection,
        join_transaction_mode='create_savepoint',
        expire_on_commit=False,
    )
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def app(db_session: Session) -> FastAPI:
    """Return a fresh application bound to the test transaction."""
    application = create_app()

    def test_session() -> Iterator[Session]:
        with db_session.begin_nested():
            yield db_session

    application.dependency_overrides[get_session] = test_session
    return application


@pytest.fixture
def client(app: FastAPI) -> Iterator[TestClient]:
    """Return an HTTP client that answers unhandled errors as responses."""
    with TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client


def unique(prefix: str) -> str:
    """Return a name that never clashes with existing rows."""
    return f'{prefix} {uuid4().hex[:8]}'


@pytest.fixture
def make_product(db_session: Session) -> ProductFactory:
    """Return a factory that persists a product with sensible defaults."""

    def factory(**overrides: object) -> Product:
        fields: dict[str, object] = {
            'name': unique('Cupcake'),
            'description': 'Test cupcake.',
            'price': Decimal('10.00'),
            'category': Category(name=unique('Category')),
            'flavor': Flavor(name=unique('Flavor')),
            'is_active': True,
            'is_available': True,
            'is_featured': False,
            **overrides,
        }
        product = Product(**fields)
        db_session.add(product)
        db_session.flush()
        return product

    return factory
