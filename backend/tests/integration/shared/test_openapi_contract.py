"""Error contract published in the OpenAPI document."""

from fastapi.testclient import TestClient

from app.shared.http.problem_details import PROBLEM_MEDIA_TYPE


def test_problem_schema_is_registered(client: TestClient) -> None:
    """``ProblemDetails`` and its nested models are components."""
    schemas = client.get('/api/openapi.json').json()['components']['schemas']

    assert {'ProblemDetails', 'InvalidField'} <= schemas.keys()


def test_routes_declare_unexpected_error(client: TestClient) -> None:
    """Every route documents the 500 problem response."""
    document = client.get('/api/openapi.json').json()
    responses = document['paths']['/api/health']['get']['responses']

    content = responses['500']['content'][PROBLEM_MEDIA_TYPE]
    assert content['schema'] == {'$ref': '#/components/schemas/ProblemDetails'}
    assert 'UnexpectedError' in content['examples']
