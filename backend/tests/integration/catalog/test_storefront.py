"""US01: storefront listing."""

from collections.abc import Callable

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.catalog.services.cupcake_illustration import SVG_CONTENT_TYPE
from app.modules.catalog.services.seed_demo_catalog import seed_demo_catalog

type ProductFactory = Callable[..., Product]


def listed_ids(client: TestClient) -> list[int]:
    """Return the ids of the products on the storefront, in order."""
    response = client.get('/api/catalog/products')
    assert response.status_code == 200
    return [product['id'] for product in response.json()]


def test_card_shows_name_image_price_and_availability(
    client: TestClient, make_product: ProductFactory
) -> None:
    """CA#2: each item carries what its storefront card needs."""
    product = make_product(is_available=False)

    response = client.get('/api/catalog/products')

    card = next(item for item in response.json() if item['id'] == product.id)
    assert card['name'] == product.name
    assert card['price'] == '10.00'
    assert card['is_available'] is False
    assert {'image_id', 'category', 'flavor'} <= card.keys()


def test_inactive_products_are_hidden(
    client: TestClient, make_product: ProductFactory
) -> None:
    """RN#1: an inactive product never reaches the storefront."""
    inactive = make_product(is_active=False)

    assert inactive.id not in listed_ids(client)


def test_featured_products_come_first(
    client: TestClient, make_product: ProductFactory
) -> None:
    """RN#2: featured products lead the listing."""
    regular = make_product(name='AAA regular')
    featured = make_product(name='ZZZ featured', is_featured=True)

    ids = listed_ids(client)

    assert ids.index(featured.id) < ids.index(regular.id)


def test_image_is_served_with_its_content_type(
    client: TestClient, db_session: Session
) -> None:
    """Images are served by id, with an immutable cache policy."""
    seed_demo_catalog(db_session)
    image_id = client.get('/api/catalog/products').json()[0]['image_id']

    response = client.get(f'/api/catalog/images/{image_id}')

    assert response.status_code == 200
    assert response.headers['content-type'] == SVG_CONTENT_TYPE
    assert 'immutable' in response.headers['cache-control']


def test_missing_image_is_a_problem(client: TestClient) -> None:
    """An unknown image id answers ``CS-CAT-0001``."""
    response = client.get('/api/catalog/images/0')

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-CAT-0001'
