"""US08: choose pickup or delivery."""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.shared.config.settings import get_settings


@pytest.fixture
def headers(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> dict[str, str]:
    """Return a customer whose cart holds R$ 20,00 of cupcakes."""
    headers = sign_in().headers
    product = make_product(price=Decimal('10.00'))
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 2},
    )
    return headers


def quote(
    client: TestClient, headers: dict[str, str], **payload: object
) -> dict[str, object]:
    """Request a quote and return status and body."""
    response = client.post('/api/orders/quote', headers=headers, json=payload)
    return {'status': response.status_code, 'body': response.json()}


def create_address(client: TestClient, headers: dict[str, str]) -> int:
    """Register an address for the customer and return its id."""
    response = client.post(
        '/api/accounts/me/addresses',
        headers=headers,
        json={
            'zip_code': '01310-100',
            'street': 'Avenida Paulista',
            'number': '1000',
            'district': 'Bela Vista',
        },
    )
    return response.json()['id']


def test_pickup_has_no_fee_and_no_address(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#1, CA#3 and RN#1: pickup is free and needs no address."""
    result = quote(client, headers, fulfillment_method='pickup')

    body = result['body']
    assert result['status'] == 200
    assert body['delivery_fee'] == '0.00'
    assert body['total'] == '20.00'
    assert body['address'] is None


def test_delivery_adds_fee_and_address(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#2 and CA#3: delivery charges the configured fee."""
    address_id = create_address(client, headers)
    fee = get_settings().store.delivery_fee

    result = quote(
        client, headers, fulfillment_method='delivery', address_id=address_id
    )

    body = result['body']
    assert Decimal(body['delivery_fee']) == fee
    assert Decimal(body['total']) == Decimal('20.00') + fee
    assert body['address']['street'] == 'Avenida Paulista'


def test_delivery_requires_an_address(
    client: TestClient, headers: dict[str, str]
) -> None:
    """RN#2: delivery without address answers ``CS-ORD-0001``."""
    result = quote(client, headers, fulfillment_method='delivery')

    assert result['status'] == 422
    assert result['body']['code'] == 'CS-ORD-0001'


def test_empty_cart_cannot_be_quoted(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """Nothing to order answers ``CS-ORD-0002``."""
    result = quote(client, sign_in().headers, fulfillment_method='pickup')

    assert result['body']['code'] == 'CS-ORD-0002'
