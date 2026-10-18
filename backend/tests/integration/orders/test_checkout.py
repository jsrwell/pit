"""US10: secure checkout and payment."""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

VALID_CARD = '4111 1111 1111 1111'
DECLINED_CARD = '4000 0000 0000 0002'


@pytest.fixture
def headers(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> dict[str, str]:
    """Return a customer whose cart holds 3 units at R$ 10,00."""
    headers = sign_in().headers
    product = make_product(price=Decimal('10.00'))
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 3},
    )
    return headers


def card(number: str = VALID_CARD) -> dict[str, object]:
    """Return card data expiring in the future."""
    return {
        'number': number,
        'holder_name': 'ANA SOUZA',
        'expiry_month': 12,
        'expiry_year': 2099,
        'cvv': '123',
    }


def checkout(
    client: TestClient, headers: dict[str, str], **payload: object
) -> dict[str, object]:
    """Post the checkout and return status and body."""
    body = {'fulfillment_method': 'pickup', 'payment_method': 'pix', **payload}
    response = client.post('/api/orders', headers=headers, json=body)
    return {'status': response.status_code, 'body': response.json()}


def test_pix_order_is_confirmed_and_cart_emptied(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#1, CA#3 and RN#2: items, total and payment are recorded."""
    result = checkout(client, headers, notes='Sem velas, por favor.')

    order = result['body']
    assert result['status'] == 201
    assert order['status'] == 'received'
    assert order['payment_status'] == 'approved'
    assert order['total'] == '30.00'
    assert order['items'][0]['quantity'] == 3
    assert order['notes'] == 'Sem velas, por favor.'
    assert client.get('/api/cart', headers=headers).json()['lines'] == []


def test_card_payment_keeps_only_last_digits(
    client: TestClient, headers: dict[str, str]
) -> None:
    """The card number is never stored, only its last four digits."""
    result = checkout(
        client, headers, payment_method='credit_card', card=card()
    )

    assert result['status'] == 201
    assert result['body']['payment_reference'] == 'CARD-****1111'


def test_delivery_total_includes_fee(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#2: the total carries the delivery fee."""
    address = client.post(
        '/api/accounts/me/addresses',
        headers=headers,
        json={
            'zip_code': '01310-100',
            'street': 'Avenida Paulista',
            'number': '1000',
            'district': 'Bela Vista',
        },
    ).json()

    result = checkout(
        client,
        headers,
        fulfillment_method='delivery',
        address_id=address['id'],
        payment_method='cash',
    )

    order = result['body']
    assert Decimal(order['total']) == Decimal('30.00') + Decimal(
        order['delivery_fee']
    )
    assert order['payment_status'] == 'pending'
    assert 'Avenida Paulista' in order['delivery_address']


def test_declined_payment_creates_nothing(
    client: TestClient, headers: dict[str, str]
) -> None:
    """A refused card answers ``CS-ORD-0005`` and keeps the cart."""
    result = checkout(
        client, headers, payment_method='credit_card', card=card(DECLINED_CARD)
    )

    assert result['status'] == 402
    assert result['body']['code'] == 'CS-ORD-0005'
    assert len(client.get('/api/cart', headers=headers).json()['lines']) == 1


def test_invalid_card_is_rejected(
    client: TestClient, headers: dict[str, str]
) -> None:
    """A number failing the check digit answers ``CS-ORD-0004``."""
    result = checkout(
        client,
        headers,
        payment_method='credit_card',
        card=card('4111 1111 1111 1112'),
    )

    assert result['body']['code'] == 'CS-ORD-0004'


def test_requires_valid_cart(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """RN#1: no order without a valid cart."""
    result = checkout(client, sign_in().headers)

    assert result['body']['code'] == 'CS-ORD-0002'
