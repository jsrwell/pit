"""IMP06: discount coupons applied at checkout."""

from datetime import UTC, datetime, timedelta
from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from support.factories import ProductFactory, SignInFactory

from app.modules.accounts.models.role import Role

NOW = datetime.now(UTC)
COUPONS = '/api/promotions/admin/coupons'


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


@pytest.fixture
def customer(
    client: TestClient, sign_in: SignInFactory, make_product: ProductFactory
) -> dict[str, str]:
    """Return headers of a customer with two R$ 20,00 cupcakes in cart."""
    headers = sign_in().headers
    product = make_product(price=Decimal('20.00'))
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 2},
    )
    return headers


def coupon_code() -> str:
    """Return a code that never clashes with existing coupons."""
    return f'DOCE{uuid4().hex[:6].upper()}'


def create_coupon(
    client: TestClient,
    admin: dict[str, str],
    code: str,
    percent: int = 10,
    start_days: int = -1,
    end_days: int = 1,
    **overrides: object,
) -> dict[str, object]:
    """Register a coupon and return status and body."""
    response = client.post(
        COUPONS,
        headers=admin,
        json={
            'code': code,
            'discount_percent': percent,
            'starts_at': (NOW + timedelta(days=start_days)).isoformat(),
            'ends_at': (NOW + timedelta(days=end_days)).isoformat(),
            **overrides,
        },
    )
    return {'status': response.status_code, 'body': response.json()}


def quote(
    client: TestClient, headers: dict[str, str], **payload: object
) -> dict[str, object]:
    """Price the cart for pickup and return status and body."""
    response = client.post(
        '/api/orders/quote',
        headers=headers,
        json={'fulfillment_method': 'pickup', **payload},
    )
    return {'status': response.status_code, 'body': response.json()}


def test_admin_registers_and_switches_a_coupon(
    client: TestClient, admin: dict[str, str]
) -> None:
    """CA#1 and RN#1: code stored in upper case, enabled and disabled."""
    code = coupon_code()
    created = create_coupon(client, admin, code.lower(), percent=15)

    assert created['status'] == 201
    body = created['body']
    assert body['code'] == code and body['is_running'] is True
    switched = client.patch(
        f'{COUPONS}/{body["id"]}/active',
        headers=admin,
        json={'is_active': False},
    )
    assert switched.json()['is_running'] is False
    listed = client.get(COUPONS, headers=admin).json()
    assert body['id'] in [coupon['id'] for coupon in listed]


def test_code_is_unique_regardless_of_case(
    client: TestClient, admin: dict[str, str]
) -> None:
    """RN#1: a second coupon with the same code is refused."""
    code = coupon_code()
    create_coupon(client, admin, code)

    duplicate = create_coupon(client, admin, code.lower())

    assert duplicate['status'] == 409
    assert duplicate['body']['code'] == 'CS-PRM-0006'


@pytest.mark.parametrize('percent', [0, 101])
def test_percent_must_be_between_one_and_a_hundred(
    client: TestClient, admin: dict[str, str], percent: int
) -> None:
    """RN#2: the percentage goes from 1% to 100%."""
    result = create_coupon(client, admin, coupon_code(), percent=percent)

    assert result['status'] == 422
    pointers = [error['pointer'] for error in result['body']['errors']]
    assert '/body/discount_percent' in pointers


def test_period_must_end_after_start(
    client: TestClient, admin: dict[str, str]
) -> None:
    """The coupon reuses the campaign period rule."""
    result = create_coupon(
        client, admin, coupon_code(), start_days=2, end_days=1
    )

    assert result['body']['code'] == 'CS-PRM-0001'


def test_customers_cannot_manage_coupons(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """Only the store keeps coupons."""
    response = client.get(COUPONS, headers=sign_in().headers)

    assert response.status_code == 403


def test_missing_coupon_is_reported(
    client: TestClient, admin: dict[str, str]
) -> None:
    """Editing an unknown coupon answers ``CS-PRM-0005``."""
    response = client.delete(f'{COUPONS}/999999', headers=admin)

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-PRM-0005'


def test_quote_shows_the_coupon_discount_on_items_only(
    client: TestClient,
    admin: dict[str, str],
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """CA#2 and RN#2: the percentage leaves the delivery fee untouched."""
    code = coupon_code()
    create_coupon(client, admin, code, percent=10)
    headers = sign_in().headers
    product = make_product(price=Decimal('20.00'))
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 2},
    )
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

    result = quote(
        client,
        headers,
        fulfillment_method='delivery',
        address_id=address['id'],
        coupon_code=code.lower(),
    )

    body = result['body']
    assert body['coupon_code'] == code
    assert Decimal(body['coupon_discount']) == Decimal('4.00')
    assert Decimal(body['total']) == (
        Decimal('36.00') + Decimal(body['delivery_fee'])
    )


@pytest.mark.parametrize(
    'coupon',
    [
        {'start_days': 1, 'end_days': 2},
        {'start_days': -2, 'end_days': -1},
        {'is_active': False},
    ],
)
def test_unusable_coupon_is_refused(
    client: TestClient,
    admin: dict[str, str],
    customer: dict[str, str],
    coupon: dict[str, object],
) -> None:
    """CA#3: inactive or out-of-period coupons answer ``CS-PRM-0007``."""
    code = coupon_code()
    create_coupon(client, admin, code, **coupon)

    result = quote(client, customer, coupon_code=code)

    assert result['status'] == 422
    assert result['body']['code'] == 'CS-PRM-0007'


def test_unknown_coupon_does_not_block_ordering_without_it(
    client: TestClient, customer: dict[str, str]
) -> None:
    """CA#3: an unknown code is refused, and an empty one is ignored."""
    refused = quote(client, customer, coupon_code='NAOEXISTE')
    without = quote(client, customer, coupon_code='  ')

    assert refused['body']['code'] == 'CS-PRM-0007'
    assert without['status'] == 200
    assert without['body']['coupon_code'] is None
    assert Decimal(without['body']['total']) == Decimal('40.00')


def test_confirmed_order_records_coupon_and_discount(
    client: TestClient, admin: dict[str, str], customer: dict[str, str]
) -> None:
    """CA#4 and RN#4: the API recalculates and stores the discount."""
    code = coupon_code()
    create_coupon(client, admin, code, percent=25)

    response = client.post(
        '/api/orders',
        headers=customer,
        json={
            'fulfillment_method': 'pickup',
            'payment_method': 'pix',
            'coupon_code': code,
            'coupon_discount': '40.00',
            'total': '0.00',
        },
    )

    assert response.status_code == 201
    order = response.json()
    assert order['coupon_code'] == code
    assert Decimal(order['coupon_discount']) == Decimal('10.00')
    assert Decimal(order['total']) == Decimal('30.00')


def test_full_discount_never_goes_below_zero(
    client: TestClient, admin: dict[str, str], customer: dict[str, str]
) -> None:
    """RN#2 and RN#3: 100% off covers the items, not the fee."""
    code = coupon_code()
    create_coupon(client, admin, code, percent=100)

    body = quote(client, customer, coupon_code=code)['body']
    order = client.post(
        '/api/orders',
        headers=customer,
        json={
            'fulfillment_method': 'pickup',
            'payment_method': 'pix',
            'coupon_code': code,
        },
    )

    assert Decimal(body['coupon_discount']) == Decimal('40.00')
    assert Decimal(body['total']) == Decimal('0.00')
    assert order.status_code == 201
    assert Decimal(order.json()['total']) == Decimal('0.00')


def test_coupon_adds_to_running_promotional_prices(
    client: TestClient,
    admin: dict[str, str],
    sign_in: SignInFactory,
    make_product: ProductFactory,
) -> None:
    """RN#3: the percentage applies over the promotional price."""
    product = make_product(price=Decimal('20.00'))
    client.post(
        '/api/promotions/admin/promotions',
        headers=admin,
        json={
            'name': 'Semana do pistache',
            'product_id': product.id,
            'promotional_price': '15.00',
            'starts_at': (NOW - timedelta(days=1)).isoformat(),
            'ends_at': (NOW + timedelta(days=1)).isoformat(),
        },
    )
    code = coupon_code()
    create_coupon(client, admin, code, percent=10)
    headers = sign_in().headers
    client.post(
        '/api/cart/items',
        headers=headers,
        json={'product_id': product.id, 'quantity': 2},
    )

    body = quote(client, headers, coupon_code=code)['body']

    assert Decimal(body['subtotal']) == Decimal('30.00')
    assert Decimal(body['coupon_discount']) == Decimal('3.00')
    assert Decimal(body['total']) == Decimal('27.00')
