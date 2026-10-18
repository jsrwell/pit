"""Fixtures shared by the whole test suite."""

from collections.abc import Iterator
from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from support.factories import (
    ProductFactory,
    SignedIn,
    SignInFactory,
    UserFactory,
)

from app.main import create_app
from app.modules.accounts.models.role import Role
from app.modules.accounts.models.user import User
from app.modules.accounts.services.password_hashing import hash_password
from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor
from app.modules.catalog.models.product import Product
from app.shared.config.settings import get_settings
from app.shared.database.session import (
    get_engine,
    get_session,
    unit_of_work,
)
from app.shared.security.access_token import Principal, issue_access_token

TEST_PASSWORD = 'doce1234'
TEST_PASSWORD_HASH = hash_password(TEST_PASSWORD)


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
        with unit_of_work(db_session.begin_nested()):
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
def make_user(db_session: Session) -> UserFactory:
    """Return a factory that persists an account with password ``doce1234``."""

    def factory(role: Role = Role.CUSTOMER, **overrides: object) -> User:
        fields: dict[str, object] = {
            'name': 'Cliente Teste',
            'email': f'{uuid4().hex[:12]}@example.com',
            'phone': '11987654321',
            'password_hash': TEST_PASSWORD_HASH,
            'role': role,
            **overrides,
        }
        user = User(**fields)
        db_session.add(user)
        db_session.flush()
        return user

    return factory


@pytest.fixture
def sign_in(make_user: UserFactory) -> SignInFactory:
    """Return a factory that creates an account already signed in."""

    def factory(role: Role = Role.CUSTOMER) -> SignedIn:
        user = make_user(role)
        token = issue_access_token(
            Principal(user_id=user.id, role=user.role), get_settings().auth
        )
        return SignedIn(user, {'Authorization': f'Bearer {token.value}'})

    return factory


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
