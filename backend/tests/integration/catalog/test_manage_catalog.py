"""US13: catalog administration."""

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role

PNG_BYTES = b'\x89PNG\r\n\x1a\n' + b'0' * 32


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


def upload_png(client: TestClient, admin: dict[str, str]) -> int:
    """Upload a small PNG and return its id."""
    response = client.post(
        '/api/catalog/admin/images',
        headers=admin,
        files={'file': ('cupcake.png', PNG_BYTES, 'image/png')},
    )
    assert response.status_code == 201
    return response.json()['id']


def product_payload(**overrides: object) -> dict[str, object]:
    """Return a complete product ready to be published."""
    return {
        'name': 'Cupcake de Avelã',
        'description': 'Massa de avelã com creme.',
        'composition': 'Farinha, avelã, manteiga.',
        'highlights': ['Avelã piemontesa'],
        'price': '19.90',
        'category_name': 'Gourmet',
        'flavor_name': 'Avelã',
        **overrides,
    }


def test_creates_product_with_image(
    client: TestClient, admin: dict[str, str]
) -> None:
    """CA#1: name, category, description, price, image, availability."""
    image_id = upload_png(client, admin)

    response = client.post(
        '/api/catalog/admin/products',
        headers=admin,
        json=product_payload(image_id=image_id, is_available=False),
    )

    body = response.json()
    assert response.status_code == 201
    assert body['image_id'] == image_id
    assert body['category']['name'] == 'Gourmet'
    assert body['is_available'] is False
    image = client.get(f'/api/catalog/images/{image_id}')
    assert image.headers['content-type'] == 'image/png'


def test_edits_and_inactivates_without_deleting(
    client: TestClient, admin: dict[str, str], make_product: ProductFactory
) -> None:
    """CA#2, CA#3 and RN#2: an inactive product leaves the storefront."""
    product = make_product()
    payload = product_payload(name='Novo nome', is_active=False)

    response = client.put(
        f'/api/catalog/admin/products/{product.id}',
        headers=admin,
        json=payload,
    )

    assert response.status_code == 200
    assert response.json()['name'] == 'Novo nome'
    storefront = client.get(f'/api/catalog/products/{product.id}')
    assert storefront.status_code == 404
    admin_view = client.get(
        f'/api/catalog/admin/products/{product.id}', headers=admin
    )
    assert admin_view.json()['is_active'] is False


def test_publishing_requires_minimum_data(
    client: TestClient, admin: dict[str, str]
) -> None:
    """RN#1: an active product without image is refused."""
    response = client.post(
        '/api/catalog/admin/products', headers=admin, json=product_payload()
    )

    assert response.status_code == 422
    assert response.json()['code'] == 'CS-CAT-0004'


def test_refuses_unsupported_image(
    client: TestClient, admin: dict[str, str]
) -> None:
    """SVG uploads are refused with ``CS-CAT-0005``."""
    response = client.post(
        '/api/catalog/admin/images',
        headers=admin,
        files={'file': ('x.svg', b'<svg/>', 'image/svg+xml')},
    )

    assert response.status_code == 415
    assert response.json()['code'] == 'CS-CAT-0005'


def test_customers_cannot_manage_catalog(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """Only administrators reach the panel routes."""
    customer = sign_in()

    response = client.get(
        '/api/catalog/admin/products', headers=customer.headers
    )

    assert response.status_code == 403
    assert response.json()['code'] == 'CS-SYS-0006'
