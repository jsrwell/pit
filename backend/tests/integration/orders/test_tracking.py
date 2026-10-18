"""US11: track an order."""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory


@pytest.fixture
def placed(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> tuple[dict[str, str], dict[str, object]]:
    """Return a customer's headers and the order they just placed."""
    headers = sign_in().headers
    product = make_product(price=Decimal('15.00'))
    client.post(
        '/api/cart/items', headers=headers, json={'product_id': product.id}
    )
    order = client.post(
        '/api/orders',
        headers=headers,
        json={'fulfillment_method': 'pickup', 'payment_method': 'pix'},
    ).json()
    return headers, order


def test_shows_status_creation_time_and_history(
    client: TestClient, placed: tuple[dict[str, str], dict[str, object]]
) -> None:
    """CA#1, CA#2 and RN#2: status, creation time and recorded history."""
    headers, order = placed

    response = client.get(f'/api/orders/{order["id"]}', headers=headers)

    body = response.json()
    assert response.status_code == 200
    assert body['status'] == 'received'
    assert body['created_at']
    assert [entry['status'] for entry in body['history']] == ['received']


def test_lists_own_orders(
    client: TestClient, placed: tuple[dict[str, str], dict[str, object]]
) -> None:
    """The customer sees the orders they placed."""
    headers, order = placed

    listed = client.get('/api/orders', headers=headers).json()

    assert [item['id'] for item in listed] == [order['id']]


def test_other_customers_cannot_track(
    client: TestClient,
    sign_in: SignInFactory,
    placed: tuple[dict[str, str], dict[str, object]],
) -> None:
    """RN#1: only the owner sees the order; others get ``CS-ORD-0006``."""
    _, order = placed

    response = client.get(
        f'/api/orders/{order["id"]}', headers=sign_in().headers
    )

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-ORD-0006'
