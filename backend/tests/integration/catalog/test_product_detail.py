"""US03: product detail."""

from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.catalog.models.product import Product

type ProductFactory = Callable[..., Product]


def test_detail_shows_full_information(
    client: TestClient, make_product: ProductFactory
) -> None:
    """CA#1 and CA#2: description, price, image, availability, extras."""
    product = make_product(
        composition='Farinha, cacau.',
        highlights='Artesanal\n\nSem conservantes\n',
        is_available=False,
    )

    response = client.get(f'/api/catalog/products/{product.id}')

    body = response.json()
    assert response.status_code == 200
    assert body['description'] == product.description
    assert body['composition'] == 'Farinha, cacau.'
    assert body['highlights'] == ['Artesanal', 'Sem conservantes']
    assert body['is_available'] is False
    assert body['price'] == '10.00'


def test_inactive_product_is_not_found(
    client: TestClient, make_product: ProductFactory
) -> None:
    """An inactive product answers ``CS-CAT-0003``, like a missing one."""
    product = make_product(is_active=False)

    response = client.get(f'/api/catalog/products/{product.id}')

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-CAT-0003'
