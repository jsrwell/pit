"""US16: campaigns, featured products and combos."""

from datetime import UTC, datetime, timedelta
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role

NOW = datetime.now(UTC)


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


def period(start_days: int, end_days: int) -> dict[str, str]:
    """Return a period relative to now, in days."""
    return {
        'starts_at': (NOW + timedelta(days=start_days)).isoformat(),
        'ends_at': (NOW + timedelta(days=end_days)).isoformat(),
    }


def create_promotion(
    client: TestClient,
    admin: dict[str, str],
    product_id: int,
    price: str,
    window: dict[str, str],
) -> dict[str, object]:
    """Register a campaign and return status and body."""
    response = client.post(
        '/api/promotions/admin/promotions',
        headers=admin,
        json={
            'name': 'Semana do chocolate',
            'product_id': product_id,
            'promotional_price': price,
            **window,
        },
    )
    return {'status': response.status_code, 'body': response.json()}


def storefront_card(client: TestClient, product_id: int) -> dict:
    """Return the storefront entry of ``product_id``."""
    products = client.get('/api/catalog/products').json()
    return next(item for item in products if item['id'] == product_id)


def test_running_campaign_sets_the_displayed_and_charged_price(
    client: TestClient,
    admin: dict[str, str],
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#1 and RN#2: the promotional price prevails while running."""
    product = make_product(price=Decimal('20.00'))
    result = create_promotion(
        client, admin, product.id, '15.00', period(-1, 1)
    )
    customer = sign_in().headers

    client.post(
        '/api/cart/items', headers=customer, json={'product_id': product.id}
    )

    assert result['body']['is_running'] is True
    assert storefront_card(client, product.id)['promotional_price'] == '15.00'
    cart = client.get('/api/cart', headers=customer).json()
    assert cart['subtotal'] == '15.00'


def test_campaign_outside_period_does_not_change_price(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """RN#1: expired or future campaigns never affect the price."""
    product = make_product(price=Decimal('20.00'))
    create_promotion(client, admin, product.id, '10.00', period(-5, -1))
    create_promotion(client, admin, product.id, '12.00', period(1, 5))

    assert storefront_card(client, product.id)['promotional_price'] is None


def test_period_must_end_after_start(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """An inverted period answers ``CS-PRM-0001``."""
    result = create_promotion(
        client, admin, make_product().id, '10.00', period(2, 1)
    )

    assert result['status'] == 422
    assert result['body']['code'] == 'CS-PRM-0001'


def test_unknown_product_is_reported(
    client: TestClient, admin: dict[str, str]
) -> None:
    """A campaign for a missing product answers ``CS-PRM-0004``."""
    result = create_promotion(client, admin, 0, '10.00', period(-1, 1))

    assert result['body']['code'] == 'CS-PRM-0004'


def test_marks_product_as_featured(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """CA#2: the store highlights a product on the storefront."""
    product = make_product()

    client.patch(
        f'/api/catalog/admin/products/{product.id}/featured',
        headers=admin,
        json={'is_featured': True},
    )

    assert storefront_card(client, product.id)['is_featured'] is True


def test_combo_discount_applies_to_complete_sets(
    client: TestClient,
    admin: dict[str, str],
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#3: a complete combo in the cart lowers the total."""
    first = make_product(price=Decimal('10.00'))
    second = make_product(price=Decimal('12.00'))
    combo = client.post(
        '/api/promotions/admin/combos',
        headers=admin,
        json={
            'name': 'Dupla gourmet',
            'price': '18.00',
            **period(-1, 1),
            'items': [
                {'product_id': first.id, 'quantity': 1},
                {'product_id': second.id, 'quantity': 1},
            ],
        },
    ).json()
    customer = sign_in().headers
    for product_id, quantity in ((first.id, 2), (second.id, 1)):
        client.post(
            '/api/cart/items',
            headers=customer,
            json={'product_id': product_id, 'quantity': quantity},
        )

    cart = client.get('/api/cart', headers=customer).json()

    assert combo['id'] in [
        item['id'] for item in client.get('/api/promotions/combos').json()
    ]
    assert cart['subtotal'] == '32.00'
    assert cart['discount'] == '4.00'
    assert cart['total'] == '28.00'
    assert cart['applied_combos'][0]['times'] == 1
    order = client.post(
        '/api/orders',
        headers=customer,
        json={'fulfillment_method': 'pickup', 'payment_method': 'pix'},
    ).json()
    assert order['discount'] == '4.00'
    assert order['total'] == '28.00'
