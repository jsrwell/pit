"""US04: customer sign-up."""

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.accounts.repositories.user_repository import UserRepository


def registration(**overrides: str) -> dict[str, str]:
    """Return a valid sign-up payload with a unique e-mail."""
    return {
        'name': 'Ana Souza',
        'email': f'ana.{uuid4().hex[:8]}@example.com',
        'phone': '(11) 98765-4321',
        'password': 'doce1234',
        **overrides,
    }


def test_creates_account_with_hashed_password(
    client: TestClient, db_session: Session
) -> None:
    """CA#1 and RNF#1: the account is created and the password hashed."""
    payload = registration()

    response = client.post('/api/accounts', json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body['email'] == payload['email']
    assert body['role'] == 'customer'
    assert 'password' not in body and 'password_hash' not in body
    stored = UserRepository(db_session).get(body['id'])
    assert stored is not None
    assert stored.password_hash != payload['password']


@pytest.mark.parametrize('field', ['name', 'email', 'phone', 'password'])
def test_required_fields_are_validated(client: TestClient, field: str) -> None:
    """CA#2: a missing field is pointed out by its JSON Pointer."""
    payload = registration()
    del payload[field]

    response = client.post('/api/accounts', json=payload)

    assert response.status_code == 422
    pointers = [error['pointer'] for error in response.json()['errors']]
    assert f'/body/{field}' in pointers


def test_duplicate_email_is_rejected(client: TestClient) -> None:
    """CA#3 and RN#1: the e-mail is unique, regardless of case."""
    payload = registration()
    client.post('/api/accounts', json=payload)

    duplicate = registration(email=payload['email'].upper())
    response = client.post('/api/accounts', json=duplicate)

    assert response.status_code == 409
    assert response.json()['code'] == 'CS-ACC-0001'


@pytest.mark.parametrize('password', ['curta1', 'somenteletras', '12345678'])
def test_weak_password_is_rejected(client: TestClient, password: str) -> None:
    """RN#2: passwords need 8 characters with letters and digits."""
    response = client.post(
        '/api/accounts', json=registration(password=password)
    )

    assert response.status_code == 422
    assert response.json()['code'] == 'CS-ACC-0002'


def test_phone_is_stored_with_digits_only(client: TestClient) -> None:
    """IMP04 RN#1: the mask is dropped and only digits are kept."""
    response = client.post(
        '/api/accounts', json=registration(phone='(11) 98765-4321')
    )

    assert response.status_code == 201
    assert response.json()['phone'] == '11987654321'


@pytest.mark.parametrize(
    'phone',
    [
        '98765-4321',
        '(11) 98765-43210',
        '(11) 9876a-4321',
        '(01) 98765-4321',
        '+55 11 98765-4321',
        '1234567890123',
    ],
)
def test_invalid_phone_is_rejected(client: TestClient, phone: str) -> None:
    """IMP04 CA#4: phones need an area code and 10 or 11 digits."""
    response = client.post('/api/accounts', json=registration(phone=phone))

    assert response.status_code == 422
    errors = response.json()['errors']
    assert {'pointer': '/body/phone', 'code': 'phone_format'} in [
        {'pointer': error['pointer'], 'code': error['code']}
        for error in errors
    ]


def test_landline_phone_is_accepted(client: TestClient) -> None:
    """IMP04 CA#4: a ten-digit landline with area code is valid."""
    response = client.post(
        '/api/accounts', json=registration(phone='(11) 3456-7890')
    )

    assert response.json()['phone'] == '1134567890'


@pytest.mark.parametrize(
    ('field', 'value'),
    [
        ('email', 'ana.example.com'),
        ('email', f'{"a" * 250}@example.com'),
        ('name', 'A' * 101),
        ('password', 'doce1234' * 10),
    ],
)
def test_malformed_or_oversized_fields_are_rejected(
    client: TestClient, field: str, value: str
) -> None:
    """IMP04 CA#1 and CA#3: format and length limits of the API."""
    response = client.post(
        '/api/accounts', json=registration(**{field: value})
    )

    assert response.status_code == 422
    pointers = [error['pointer'] for error in response.json()['errors']]
    assert f'/body/{field}' in pointers
