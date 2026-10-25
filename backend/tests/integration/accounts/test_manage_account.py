"""IMP08: the customer edits, protects and deletes the own account."""

from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from support.factories import ProductFactory, SignInFactory, UserFactory

from app.modules.accounts.models.role import Role
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.repositories.order_repository import OrderRepository

PASSWORD = 'doce1234'


def new_email() -> str:
    """Return an e-mail no account uses."""
    return f'novo.{uuid4().hex[:8]}@example.com'


def contact(**overrides: str) -> dict[str, str]:
    """Return a valid contact payload with a fresh e-mail."""
    return {
        'name': 'Ana Lima',
        'email': new_email(),
        'phone': '(21) 3456-7890',
        **overrides,
    }


def sign_in_request(client: TestClient, email: str, password: str) -> int:
    """Try to sign in and return the status code."""
    return client.post(
        '/api/accounts/sessions',
        json={'email': email, 'password': password},
    ).status_code


def place_pickup_order(
    client: TestClient, headers: dict[str, str], product_id: int
) -> int:
    """Buy one unit for pickup and return the order id."""
    client.post(
        '/api/cart/items', headers=headers, json={'product_id': product_id}
    )
    response = client.post(
        '/api/orders',
        headers=headers,
        json={'fulfillment_method': 'pickup', 'payment_method': 'pix'},
    )
    return response.json()['id']


def test_edits_name_email_and_phone(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """CA#1: contact data change with the sign-up rules."""
    signed = sign_in()
    payload = contact(email=new_email().upper())

    response = client.put(
        '/api/accounts/me', headers=signed.headers, json=payload
    )

    assert response.status_code == 200
    body = response.json()
    assert body['name'] == 'Ana Lima'
    assert body['email'] == payload['email'].lower()
    assert body['phone'] == '2134567890'


@pytest.mark.parametrize(
    ('field', 'value'),
    [('email', 'ana.example.com'), ('phone', '3456-7890'), ('name', 'A')],
)
def test_edit_reuses_sign_up_validation(
    client: TestClient, sign_in: SignInFactory, field: str, value: str
) -> None:
    """CA#1: invalid data is pointed out by field."""
    response = client.put(
        '/api/accounts/me',
        headers=sign_in().headers,
        json=contact(**{field: value}),
    )

    assert response.status_code == 422
    pointers = [error['pointer'] for error in response.json()['errors']]
    assert f'/body/{field}' in pointers


def test_new_email_must_stay_unique(
    client: TestClient, sign_in: SignInFactory, make_user: UserFactory
) -> None:
    """RN#1: another account's e-mail is refused; keeping one's own works."""
    other = make_user()
    signed = sign_in()

    taken = client.put(
        '/api/accounts/me',
        headers=signed.headers,
        json=contact(email=other.email.upper()),
    )
    same = client.put(
        '/api/accounts/me',
        headers=signed.headers,
        json=contact(email=signed.user.email),
    )

    assert taken.status_code == 409
    assert taken.json()['code'] == 'CS-ACC-0001'
    assert same.status_code == 200


def test_changes_password_with_the_current_one(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """CA#2 and RNF#1: the new password works and the old one stops."""
    signed = sign_in()

    response = client.put(
        '/api/accounts/me/password',
        headers=signed.headers,
        json={'current_password': PASSWORD, 'new_password': 'trufa5678'},
    )

    assert response.status_code == 204
    assert response.content == b''
    assert sign_in_request(client, signed.user.email, 'trufa5678') == 201
    assert sign_in_request(client, signed.user.email, PASSWORD) == 401


def test_wrong_current_password_is_refused(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """CA#2: without the current password nothing changes."""
    response = client.put(
        '/api/accounts/me/password',
        headers=sign_in().headers,
        json={'current_password': 'errada123', 'new_password': 'trufa5678'},
    )

    assert response.status_code == 422
    assert response.json()['code'] == 'CS-ACC-0006'


def test_new_password_follows_the_policy(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """RN#2: the minimum security policy also applies to changes."""
    response = client.put(
        '/api/accounts/me/password',
        headers=sign_in().headers,
        json={'current_password': PASSWORD, 'new_password': 'curta'},
    )

    assert response.json()['code'] == 'CS-ACC-0002'


def test_deleted_account_is_anonymized_and_cannot_sign_in(
    client: TestClient,
    db_session: Session,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#3, CA#4 and RN#3: data erased, orders kept, sign-in refused."""
    signed = sign_in()
    email = signed.user.email
    order_id = place_pickup_order(
        client, signed.headers, make_product(price=Decimal('10.00')).id
    )
    order = OrderRepository(db_session).get(order_id)
    assert order is not None
    order.status = OrderStatus.COMPLETED
    client.post(
        '/api/accounts/me/addresses',
        headers=signed.headers,
        json={
            'zip_code': '01310-100',
            'street': 'Avenida Paulista',
            'number': '1000',
            'district': 'Bela Vista',
        },
    )

    response = client.delete('/api/accounts/me', headers=signed.headers)

    assert response.status_code == 204
    stored = UserRepository(db_session).get(signed.user.id)
    assert stored is not None and stored.deleted_at is not None
    assert stored.name == 'Conta excluída'
    assert stored.email != email and stored.phone == ''
    assert OrderRepository(db_session).get(order_id) is not None
    assert sign_in_request(client, email, PASSWORD) == 401
    me = client.get('/api/accounts/me', headers=signed.headers)
    assert me.json()['code'] == 'CS-SYS-0005'
    addresses = client.get(
        '/api/accounts/me/addresses', headers=signed.headers
    )
    assert addresses.json() == []


def test_open_orders_block_the_deletion(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> None:
    """RN#4: an order still running keeps the account."""
    signed = sign_in()
    place_pickup_order(client, signed.headers, make_product().id)

    response = client.delete('/api/accounts/me', headers=signed.headers)

    assert response.status_code == 409
    assert response.json()['code'] == 'CS-ACC-0007'
    assert sign_in_request(client, signed.user.email, PASSWORD) == 201


def test_administrators_cannot_delete_themselves(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """The store account is kept out of self-service deletion."""
    response = client.delete(
        '/api/accounts/me', headers=sign_in(Role.ADMIN).headers
    )

    assert response.status_code == 403
    assert response.json()['code'] == 'CS-SYS-0006'


def test_account_changes_require_a_session(client: TestClient) -> None:
    """RNF#1: anonymous callers are refused."""
    for method, path in (
        ('put', '/api/accounts/me'),
        ('put', '/api/accounts/me/password'),
        ('delete', '/api/accounts/me'),
    ):
        response = client.request(method, path, json=contact())
        assert response.json()['code'] == 'CS-SYS-0005'
