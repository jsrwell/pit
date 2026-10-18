"""US07: change and remove cart lines."""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from support.factories import ProductFactory, SignInFactory

from app.modules.catalog.models.product import Product


@pytest.fixture
def cart_with_product(
    client: TestClient,
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> tuple[dict[str, str], Product]:
    """Return headers of a customer whose cart has 2 units of a product."""
    headers = sign_in().headers
    product = make_product(price=Decimal('10.00'))
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 2},
    )
    return headers, product


def test_changing_quantity_recalculates_subtotal(
    client: TestClient, cart_with_product: tuple[dict[str, str], Product]
) -> None:
    """CA#1 and CA#3: quantity goes up or down and the total follows."""
    headers, product = cart_with_product

    response = client.patch(
        f'/api/cart/items/{product.id}', headers=headers, json={'quantity': 5}
    )

    assert response.status_code == 200
    assert response.json()['subtotal'] == '50.00'


def test_removing_item_empties_cart(
    client: TestClient, cart_with_product: tuple[dict[str, str], Product]
) -> None:
    """CA#2: the line is removed and the subtotal drops to zero."""
    headers, product = cart_with_product

    response = client.delete(f'/api/cart/items/{product.id}', headers=headers)

    assert response.json()['lines'] == []
    assert response.json()['subtotal'] == '0.00'


def test_zero_quantity_needs_explicit_removal(
    client: TestClient, cart_with_product: tuple[dict[str, str], Product]
) -> None:
    """RN#1: quantity zero is rejected; removal is a separate action."""
    headers, product = cart_with_product

    response = client.patch(
        f'/api/cart/items/{product.id}', headers=headers, json={'quantity': 0}
    )

    assert response.status_code == 422


def test_unavailable_product_can_only_decrease(
    client: TestClient,
    db_session: Session,
    cart_with_product: tuple[dict[str, str], Product],
) -> None:
    """RN#2: availability now prevails over what the cart held."""
    headers, product = cart_with_product
    product.is_available = False
    db_session.flush()

    increase = client.patch(
        f'/api/cart/items/{product.id}', headers=headers, json={'quantity': 3}
    )
    decrease = client.patch(
        f'/api/cart/items/{product.id}', headers=headers, json={'quantity': 1}
    )

    assert increase.json()['code'] == 'CS-CAT-0007'
    assert decrease.status_code == 200
    assert decrease.json()['has_unavailable'] is True
    assert decrease.json()['subtotal'] == '0.00'


def test_missing_item_is_reported(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """Changing a product outside the cart answers ``CS-CRT-0002``."""
    response = client.delete('/api/cart/items/0', headers=sign_in().headers)

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-CRT-0002'
