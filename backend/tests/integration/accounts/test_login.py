"""US05: secure sign-in."""

from datetime import UTC, datetime, timedelta

import jwt
from fastapi.testclient import TestClient
from support.factories import SignInFactory, UserFactory

from app.shared.config.settings import get_settings

PASSWORD = 'doce1234'


def sign_in_request(
    client: TestClient, email: str, password: str = PASSWORD
) -> dict[str, object]:
    """Post the credentials and return status and body."""
    response = client.post(
        '/api/accounts/sessions',
        json={'email': email, 'password': password},
    )
    return {'status': response.status_code, 'body': response.json()}


def test_valid_credentials_return_a_token(
    client: TestClient, make_user: UserFactory
) -> None:
    """CA#1 and CA#3: the token opens the customer's own area."""
    user = make_user()

    result = sign_in_request(client, user.email.upper())

    assert result['status'] == 201
    body = result['body']
    assert body['account']['id'] == user.id
    me = client.get(
        '/api/accounts/me',
        headers={'Authorization': f'Bearer {body["access_token"]}'},
    )
    assert me.json()['email'] == user.email


def test_wrong_password_is_reported(
    client: TestClient, make_user: UserFactory
) -> None:
    """CA#2: wrong credentials answer ``CS-ACC-0003``."""
    user = make_user()

    result = sign_in_request(client, user.email, 'errada123')

    assert result['status'] == 401
    assert result['body']['code'] == 'CS-ACC-0003'


def test_repeated_failures_lock_the_account(
    client: TestClient, make_user: UserFactory
) -> None:
    """RN#1: after the limit, even the right password is refused."""
    user = make_user()
    for _ in range(get_settings().auth.max_failed_attempts):
        sign_in_request(client, user.email, 'errada123')

    result = sign_in_request(client, user.email)

    assert result['status'] == 429
    assert result['body']['code'] == 'CS-ACC-0004'


def test_expired_token_requires_new_sign_in(
    client: TestClient, make_user: UserFactory
) -> None:
    """RN#2: an expired session is refused with ``CS-SYS-0005``."""
    user = make_user()
    expired = jwt.encode(
        {
            'sub': str(user.id),
            'role': user.role,
            'exp': datetime.now(UTC) - timedelta(minutes=1),
        },
        get_settings().auth.secret_key,
        algorithm='HS256',
    )

    response = client.get(
        '/api/accounts/me', headers={'Authorization': f'Bearer {expired}'}
    )

    assert response.status_code == 401
    assert response.json()['code'] == 'CS-SYS-0005'


def test_missing_token_requires_sign_in(client: TestClient) -> None:
    """Protected routes refuse anonymous callers."""
    response = client.get('/api/accounts/me')

    assert response.status_code == 401
    assert response.json()['code'] == 'CS-SYS-0005'


def test_signed_in_fixture_reaches_own_account(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """The test helper produces a token the API accepts."""
    signed = sign_in()

    response = client.get('/api/accounts/me', headers=signed.headers)

    assert response.json()['id'] == signed.user.id
