"""US14: product availability control."""

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


def set_availability(
    client: TestClient,
    admin: dict[str, str],
    product_id: int,
    *,
    available: bool,
    visible: bool = True,
) -> dict[str, object]:
    """Patch the availability and return the updated product."""
    response = client.patch(
        f'/api/catalog/admin/products/{product_id}/availability',
        headers=admin,
        json={'is_available': available, 'show_when_unavailable': visible},
    )
    assert response.status_code == 200
    return response.json()


def storefront_card(client: TestClient, product_id: int) -> dict | None:
    """Return the storefront entry of ``product_id``, if listed."""
    products = client.get('/api/catalog/products').json()
    return next((item for item in products if item['id'] == product_id), None)


def test_unavailable_product_stays_visible_but_flagged(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """CA#1, CA#2 and RN#2: visible on the storefront, not purchasable."""
    product = make_product()

    set_availability(client, admin, product.id, available=False)

    card = storefront_card(client, product.id)
    assert card is not None and card['is_available'] is False


def test_store_can_hide_unavailable_product(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """RN#2: when the store opts, an unavailable product disappears."""
    product = make_product()

    set_availability(client, admin, product.id, available=False, visible=False)

    assert storefront_card(client, product.id) is None
    detail = client.get(f'/api/catalog/products/{product.id}')
    assert detail.status_code == 404


def test_change_reaches_existing_carts(
    client: TestClient,
    admin: dict[str, str],
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#3 and RN#1: carts follow the current availability."""
    customer = sign_in().headers
    product = make_product()
    client.post(
        '/api/cart/items', headers=customer, json={'product_id': product.id}
    )

    set_availability(client, admin, product.id, available=False)

    cart = client.get('/api/cart', headers=customer).json()
    assert cart['has_unavailable'] is True
    retry = client.post(
        '/api/cart/items', headers=customer, json={'product_id': product.id}
    )
    assert retry.json()['code'] == 'CS-CAT-0007'
