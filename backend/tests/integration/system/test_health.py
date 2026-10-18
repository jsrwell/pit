"""Liveness route."""

from fastapi.testclient import TestClient

from app.shared.config.settings import get_settings


def test_health_reports_ok_and_version(client: TestClient) -> None:
    """The route answers 200 with the configured version."""
    response = client.get('/api/health')

    assert response.status_code == 200
    assert response.json() == {
        'status': 'ok',
        'version': get_settings().app.version,
    }
