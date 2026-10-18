"""Every error leaves the API as RFC 9457 Problem Details."""

from typing import Annotated

import pytest
from fastapi import APIRouter, FastAPI, Query
from fastapi.testclient import TestClient

from app.shared.errors.domain_error import DomainError
from app.shared.http.problem_details import PROBLEM_MEDIA_TYPE


class SampleConflict(DomainError):
    """Domain error raised by the probe route."""

    code = 'CS-TST-0001'
    status = 409
    title = 'Sample conflict'


@pytest.fixture
def probe_client(app: FastAPI) -> TestClient:
    """Return a client for the app extended with failing probe routes."""
    router = APIRouter(prefix='/probe')

    @router.get('/domain')
    def raise_domain_error() -> None:
        raise SampleConflict('The sample is already taken.')

    @router.get('/crash')
    def raise_unexpected_error() -> None:
        raise RuntimeError('database password is hunter2')

    @router.get('/validate')
    def validate(quantity: Annotated[int, Query(ge=1)]) -> None:
        return None

    app.include_router(router)
    return TestClient(app, raise_server_exceptions=False)


def test_domain_error_becomes_problem(probe_client: TestClient) -> None:
    """Status, code, title and detail come from the raised error."""
    response = probe_client.get('/probe/domain')

    assert response.status_code == 409
    assert response.headers['content-type'] == PROBLEM_MEDIA_TYPE
    assert response.json() == {
        'type': 'urn:cupcakes-store:problem:CS-TST-0001',
        'title': 'Sample conflict',
        'status': 409,
        'code': 'CS-TST-0001',
        'detail': 'The sample is already taken.',
        'instance': '/probe/domain',
    }


def test_validation_error_points_to_field(probe_client: TestClient) -> None:
    """A rejected field is located by a JSON Pointer with its own code."""
    response = probe_client.get('/probe/validate', params={'quantity': 0})

    body = response.json()
    assert response.status_code == 422
    assert body['status'] == 422
    assert body['code'] == 'CS-SYS-0002'
    assert body['errors'] == [
        {
            'pointer': '/query/quantity',
            'code': 'greater_than_equal',
            'detail': 'Input should be greater than or equal to 1',
        }
    ]


def test_unexpected_error_hides_internals(probe_client: TestClient) -> None:
    """An unhandled exception answers 500 without leaking its message."""
    response = probe_client.get('/probe/crash')

    assert response.status_code == 500
    assert response.json()['code'] == 'CS-SYS-0001'
    assert 'hunter2' not in response.text


@pytest.mark.parametrize(
    ('method', 'path', 'status', 'code'),
    [
        ('GET', '/api/missing', 404, 'CS-SYS-0003'),
        ('DELETE', '/api/health', 405, 'CS-SYS-0004'),
    ],
)
def test_routing_errors_become_problems(
    client: TestClient, method: str, path: str, status: int, code: str
) -> None:
    """Starlette routing failures follow the same contract."""
    response = client.request(method, path)

    assert response.status_code == status
    assert response.headers['content-type'] == PROBLEM_MEDIA_TYPE
    assert response.json()['code'] == code
