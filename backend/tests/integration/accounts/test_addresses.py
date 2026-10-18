"""US09: delivery addresses."""

import pytest
from fastapi.testclient import TestClient
from support.factories import SignInFactory

ADDRESSES = '/api/accounts/me/addresses'


def address(**overrides: object) -> dict[str, object]:
    """Return a complete address payload."""
    return {
        'label': 'Casa',
        'zip_code': '01310100',
        'street': 'Avenida Paulista',
        'number': '1000',
        'complement': 'Apto 12',
        'district': 'Bela Vista',
        'reference': 'Próximo ao metrô',
        **overrides,
    }


@pytest.fixture
def headers(sign_in: SignInFactory) -> dict[str, str]:
    """Return headers of a signed-in customer."""
    return sign_in().headers


def test_registers_every_field(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#1: CEP, street, number, complement, district and reference."""
    response = client.post(ADDRESSES, headers=headers, json=address())

    body = response.json()
    assert response.status_code == 201
    assert body['zip_code'] == '01310-100'
    assert body['reference'] == 'Próximo ao metrô'
    assert body['is_primary'] is True


@pytest.mark.parametrize('field', ['zip_code', 'street', 'number', 'district'])
def test_required_fields_are_validated(
    client: TestClient, headers: dict[str, str], field: str
) -> None:
    """CA#2 and RN#1: incomplete addresses are refused."""
    response = client.post(
        ADDRESSES, headers=headers, json=address(**{field: ''})
    )

    assert response.status_code == 422
    pointers = [error['pointer'] for error in response.json()['errors']]
    assert f'/body/{field}' in pointers


def test_keeps_several_addresses_with_one_primary(
    client: TestClient, headers: dict[str, str]
) -> None:
    """CA#3 and RN#2: many addresses, exactly one primary."""
    first = client.post(ADDRESSES, headers=headers, json=address()).json()
    second = client.post(
        ADDRESSES, headers=headers, json=address(label='Trabalho')
    ).json()

    client.post(f'{ADDRESSES}/{second["id"]}/primary', headers=headers)

    listed = client.get(ADDRESSES, headers=headers).json()
    primaries = [item['id'] for item in listed if item['is_primary']]
    assert len(listed) == 2
    assert primaries == [second['id']]
    assert listed[1]['id'] == first['id']


def test_deleting_primary_promotes_another(
    client: TestClient, headers: dict[str, str]
) -> None:
    """The customer always keeps a primary while addresses remain."""
    first = client.post(ADDRESSES, headers=headers, json=address()).json()
    second = client.post(ADDRESSES, headers=headers, json=address()).json()

    client.delete(f'{ADDRESSES}/{first["id"]}', headers=headers)

    listed = client.get(ADDRESSES, headers=headers).json()
    assert [item['id'] for item in listed] == [second['id']]
    assert listed[0]['is_primary'] is True


def test_other_customers_addresses_are_hidden(
    client: TestClient, headers: dict[str, str], sign_in: SignInFactory
) -> None:
    """An address of someone else answers ``CS-ACC-0005``."""
    created = client.post(ADDRESSES, headers=headers, json=address()).json()

    response = client.delete(
        f'{ADDRESSES}/{created["id"]}', headers=sign_in().headers
    )

    assert response.status_code == 404
    assert response.json()['code'] == 'CS-ACC-0005'
