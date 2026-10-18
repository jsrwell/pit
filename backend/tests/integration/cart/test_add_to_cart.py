"""US06: add products to the cart."""

from decimal import Decimal

from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory


def add(
    client: TestClient,
    headers: dict[str, str],
    product_id: int,
    quantity: int = 1,
) -> dict[str, object]:
    """Post a product to the cart and return status and body."""
    response = client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product_id, 'quantity': quantity},
    )
    return {'status': response.status_code, 'body': response.json()}


def test_adding_updates_lines_and_subtotal(
    client: TestClient,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#1, CA#2 and CA#3: quantity is chosen and subtotal follows."""
    headers = sign_in().headers
    cupcake = make_product(price=Decimal('12.50'))

    add(client, headers, cupcake.id, 2)
    result = add(client, headers, cupcake.id, 1)

    body = result['body']
    assert result['status'] == 200
    assert body['lines'][0]['quantity'] == 3
    assert body['subtotal'] == '37.50'
    assert body['item_count'] == 3


def test_quantity_must_be_at_least_one(
    client: TestClient,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """RN#1: zero units are rejected by validation."""
    result = add(client, sign_in().headers, make_product().id, 0)

    assert result['status'] == 422


def test_unavailable_product_cannot_be_added(
    client: TestClient,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """RN#2: an unavailable product answers ``CS-CAT-0007``."""
    product = make_product(is_available=False)

    result = add(client, sign_in().headers, product.id)

    assert result['status'] == 409
    assert result['body']['code'] == 'CS-CAT-0007'


def test_quantity_limit_per_product(
    client: TestClient,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """A line never exceeds the per-product limit."""
    result = add(client, sign_in().headers, make_product().id, 51)

    assert result['status'] == 422
    assert result['body']['code'] == 'CS-CRT-0001'


def test_cart_requires_sign_in(client: TestClient) -> None:
    """Anonymous visitors have no cart."""
    response = client.get('/api/cart')

    assert response.status_code == 401
