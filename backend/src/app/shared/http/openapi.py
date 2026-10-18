"""OpenAPI document with the Problem Details schemas registered."""

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.shared.http.problem_details import ProblemDetails

SCHEMA_REF_TEMPLATE = '#/components/schemas/{model}'


def problem_schemas() -> dict[str, object]:
    """Return ``ProblemDetails`` and its nested models as components."""
    schema = ProblemDetails.model_json_schema(ref_template=SCHEMA_REF_TEMPLATE)
    nested = schema.pop('$defs', {})
    return {**nested, ProblemDetails.__name__: schema}


def build_openapi(app: FastAPI) -> dict[str, object]:
    """Generate the OpenAPI document once and cache it on the app.

    Routes reference ``ProblemDetails`` through ``problem_responses``,
    which only declares a ``$ref``; the schema itself is added here.
    """
    if app.openapi_schema is None:
        document = get_openapi(
            title=app.title,
            version=app.version,
            routes=app.routes,
        )
        components = document.setdefault('components', {})
        components.setdefault('schemas', {}).update(problem_schemas())
        app.openapi_schema = document
    return app.openapi_schema
