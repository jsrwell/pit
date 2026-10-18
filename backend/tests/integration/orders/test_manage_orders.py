"""US15: operational order panel."""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


@pytest.fixture
def order_id(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> int:
    """Place a pickup order paid in cash and return its id."""
    headers = sign_in().headers
    product = make_product(price=Decimal('10.00'))
    client.post(
        '/api/cart/items', headers=headers, json={'product_id': product.id}
    )
    order = client.post(
        '/api/orders',
        headers=headers,
        json={
            'fulfillment_method': 'pickup',
            'payment_method': 'cash',
            'notes': 'Retiro às 18h.',
        },
    )
    return order.json()['id']


def move(
    client: TestClient, admin: dict[str, str], order_id: int, status: str
) -> dict[str, object]:
    """Patch the status and return status code and body."""
    response = client.patch(
        f'/api/orders/admin/{order_id}/status',
        headers=admin,
        json={'status': status},
    )
    return {'status': response.status_code, 'body': response.json()}


def test_lists_orders_with_customer_and_notes(
    client: TestClient, admin: dict[str, str], order_id: int
) -> None:
    """CA#1 and CA#3: customer data, fulfillment and notes are shown."""
    listed = client.get(
        '/api/orders/admin', headers=admin, params={'status': 'received'}
    ).json()

    order = next(item for item in listed if item['id'] == order_id)
    assert order['customer']['name'] == 'Cliente Teste'
    assert order['fulfillment_method'] == 'pickup'
    assert order['notes'] == 'Retiro às 18h.'
    assert order['next_statuses'] == ['confirmed', 'cancelled']


def test_pickup_flow_reaches_completion(
    client: TestClient, admin: dict[str, str], order_id: int
) -> None:
    """CA#2 and RN#1: each step is recorded; cash is paid at the end."""
    for status in ('confirmed', 'preparing', 'ready', 'completed'):
        result = move(client, admin, order_id, status)
        assert result['status'] == 200

    body = result['body']
    assert body['payment_status'] == 'approved'
    assert [entry['status'] for entry in body['history']] == [
        'received',
        'confirmed',
        'preparing',
        'ready',
        'completed',
    ]


def test_final_status_requires_previous_steps(
    client: TestClient, admin: dict[str, str], order_id: int
) -> None:
    """RN#2: completing a received order answers ``CS-ORD-0007``."""
    result = move(client, admin, order_id, 'completed')

    assert result['status'] == 409
    assert result['body']['code'] == 'CS-ORD-0007'


def test_pickup_never_goes_out_for_delivery(
    client: TestClient, admin: dict[str, str], order_id: int
) -> None:
    """The flow depends on the fulfillment method."""
    for status in ('confirmed', 'preparing', 'ready'):
        move(client, admin, order_id, status)

    result = move(client, admin, order_id, 'out_for_delivery')

    assert result['body']['code'] == 'CS-ORD-0007'


def test_customers_cannot_open_the_panel(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """Only administrators reach the panel."""
    response = client.get('/api/orders/admin', headers=sign_in().headers)

    assert response.status_code == 403
