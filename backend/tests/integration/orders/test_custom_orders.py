"""US12: custom order requests."""

from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient
from support.factories import SignInFactory

from app.modules.accounts.models.role import Role
from app.shared.config.settings import get_settings


@pytest.fixture
def admin(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in administrator."""
    return sign_in(Role.ADMIN).headers


def request_payload(days_ahead: int) -> dict[str, object]:
    """Return a request for ``days_ahead`` days from today."""
    return {
        'description': 'Cupcakes temáticos de casamento, brancos e dourados.',
        'quantity': 60,
        'desired_date': (
            date.today() + timedelta(days=days_ahead)
        ).isoformat(),
        'notes': 'Sem glúten se possível.',
    }


def lead_days() -> int:
    """Return the configured minimum notice."""
    return get_settings().store.custom_order_lead_days


def test_request_is_registered_apart_and_pending(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """CA#1 and CA#2: kept apart from regular orders, awaiting review."""
    headers = sign_in().headers

    response = client.post(
        '/api/orders/custom',
        headers=headers,
        json=request_payload(lead_days()),
    )

    body = response.json()
    assert response.status_code == 201
    assert body['status'] == 'pending_review'
    assert body['quantity'] == 60
    assert client.get('/api/orders', headers=headers).json() == []
    mine = client.get('/api/orders/custom', headers=headers).json()
    assert [item['id'] for item in mine] == [body['id']]


def test_minimum_lead_time_is_enforced(
    client: TestClient, sign_in: SignInFactory
) -> None:
    """RN#1: a date sooner than the notice answers ``CS-ORD-0008``."""
    response = client.post(
        '/api/orders/custom',
        headers=sign_in().headers,
        json=request_payload(lead_days() - 1),
    )

    assert response.status_code == 422
    assert response.json()['code'] == 'CS-ORD-0008'


def test_store_approves_with_price_once(
    client: TestClient, sign_in: SignInFactory, admin: dict[str, str]
) -> None:
    """CA#3 and RN#2: manual review sets status, price and answer."""
    created = client.post(
        '/api/orders/custom',
        headers=sign_in().headers,
        json=request_payload(lead_days() + 5),
    ).json()
    url = f'/api/orders/admin/custom/{created["id"]}/review'
    decision = {
        'decision': 'approved',
        'quoted_price': '480.00',
        'response': 'Aprovado! Entraremos em contato.',
    }

    response = client.patch(url, headers=admin, json=decision)
    again = client.patch(url, headers=admin, json=decision)

    body = response.json()
    assert body['status'] == 'approved'
    assert body['quoted_price'] == '480.00'
    assert body['customer']['name'] == 'Cliente Teste'
    assert again.json()['code'] == 'CS-ORD-0010'


def test_approval_requires_a_price(
    client: TestClient, admin: dict[str, str]
) -> None:
    """An approval without price is rejected by validation."""
    response = client.patch(
        '/api/orders/admin/custom/0/review',
        headers=admin,
        json={'decision': 'approved'},
    )

    assert response.status_code == 422
