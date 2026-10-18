"""US02: storefront filters and text search."""

from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient

from app.modules.catalog.models.product import Product

type ProductFactory = Callable[..., Product]


def search_ids(client: TestClient, **params: object) -> set[int]:
    """Return the ids listed by the storefront for ``params``."""
    response = client.get('/api/catalog/products', params=params)
    assert response.status_code == 200
    return {product['id'] for product in response.json()}


def test_filters_by_category_and_flavor(
    client: TestClient, make_product: ProductFactory
) -> None:
    """CA#1 and CA#2: category and flavor narrow the result."""
    target = make_product()
    other = make_product()

    by_category = search_ids(client, category_id=target.category_id)
    by_flavor = search_ids(client, flavor_id=target.flavor_id)

    assert target.id in by_category and other.id not in by_category
    assert target.id in by_flavor and other.id not in by_flavor


def test_filters_by_price_range(
    client: TestClient, make_product: ProductFactory
) -> None:
    """CA#2: only prices inside the range are listed."""
    cheap = make_product(price=Decimal('5.00'))
    pricey = make_product(price=Decimal('99.00'))

    ids = search_ids(client, min_price='4', max_price='6')

    assert cheap.id in ids and pricey.id not in ids


def test_searches_by_name_ignoring_case(
    client: TestClient, make_product: ProductFactory
) -> None:
    """CA#3 and RN#1: text search matches active products only."""
    match = make_product(name='Pistache Celestial XYZ')
    inactive = make_product(name='Pistache Celestial XYZ', is_active=False)

    ids = search_ids(client, search='celestial xyz')

    assert ids == {match.id}
    assert inactive.id not in ids


def test_inverted_price_range_is_rejected(client: TestClient) -> None:
    """A minimum above the maximum answers ``CS-CAT-0002``."""
    response = client.get(
        '/api/catalog/products', params={'min_price': 20, 'max_price': 10}
    )

    assert response.status_code == 422
    assert response.json()['code'] == 'CS-CAT-0002'


def test_lists_filter_options(client: TestClient) -> None:
    """Categories and flavors are exposed for the filter bar."""
    for path in ('/api/catalog/categories', '/api/catalog/flavors'):
        response = client.get(path)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
