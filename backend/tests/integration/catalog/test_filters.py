"""US02: storefront filters and text search."""

from datetime import UTC, datetime, timedelta
from decimal import Decimal

from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role


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


def listed_ids(client: TestClient, **params: object) -> list[int]:
    """Return the storefront ids for ``params``, keeping their order."""
    response = client.get('/api/catalog/products', params=params)
    assert response.status_code == 200
    return [product['id'] for product in response.json()]


def test_sorts_by_price_both_ways(
    client: TestClient, make_product: ProductFactory
) -> None:
    """IMP10 CA#1 and CA#3: price orders combine with the filters."""
    cheap = make_product(price=Decimal('8.00'))
    middle = make_product(price=Decimal('12.00'), category=cheap.category)
    pricey = make_product(price=Decimal('30.00'), category=cheap.category)
    other = make_product(price=Decimal('1.00'))

    ascending = listed_ids(
        client, category_id=cheap.category_id, sort='price_asc'
    )
    descending = listed_ids(
        client, category_id=cheap.category_id, sort='price_desc'
    )

    assert ascending == [cheap.id, middle.id, pricey.id]
    assert descending == [pricey.id, middle.id, cheap.id]
    assert other.id not in ascending


def test_price_order_uses_running_promotions(
    client: TestClient,
    make_product: ProductFactory,
    sign_in: SignInFactory,
) -> None:
    """IMP10 RN#2: a promotional price moves the product in the order."""
    base = make_product(price=Decimal('15.00'))
    promoted = make_product(price=Decimal('20.00'), category=base.category)
    now = datetime.now(UTC)
    client.post(
        '/api/promotions/admin/promotions',
        headers=sign_in(Role.ADMIN).headers,
        json={
            'name': 'Queima de estoque',
            'product_id': promoted.id,
            'promotional_price': '10.00',
            'starts_at': (now - timedelta(days=1)).isoformat(),
            'ends_at': (now + timedelta(days=1)).isoformat(),
        },
    )

    ids = listed_ids(client, category_id=base.category_id, sort='price_asc')

    assert ids == [promoted.id, base.id]


def test_same_price_keeps_name_order(
    client: TestClient, make_product: ProductFactory
) -> None:
    """IMP10 RN#3: ties are ordered by name."""
    zeta = make_product(name='Zeta Cupcake', price=Decimal('9.00'))
    alpha = make_product(
        name='alfa Cupcake', price=Decimal('9.00'), category=zeta.category
    )

    for sort in ('price_asc', 'price_desc'):
        ids = listed_ids(client, category_id=zeta.category_id, sort=sort)
        assert ids == [alpha.id, zeta.id]


def test_default_order_keeps_featured_first(
    client: TestClient, make_product: ProductFactory
) -> None:
    """IMP10 RN#1: without a sort the highlights still lead."""
    plain = make_product(name='Aaa Simples', price=Decimal('5.00'))
    featured = make_product(
        name='Zzz Destaque', is_featured=True, category=plain.category
    )

    ids = listed_ids(client, category_id=plain.category_id)

    assert ids == [featured.id, plain.id]


def test_unknown_sort_is_rejected(client: TestClient) -> None:
    """Only the documented orders are accepted."""
    response = client.get('/api/catalog/products', params={'sort': 'nome'})

    assert response.status_code == 422
    pointers = [error['pointer'] for error in response.json()['errors']]
    assert '/query/sort' in pointers
