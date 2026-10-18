"""OpenAPI ``responses`` declaration built from domain error classes."""

from collections import defaultdict

from app.shared.errors.domain_error import DomainError
from app.shared.errors.unexpected_error import UnexpectedError
from app.shared.http.problem_details import (
    PROBLEM_MEDIA_TYPE,
    problem_from_error,
)

PROBLEM_SCHEMA_REF: dict[str, str] = {
    '$ref': '#/components/schemas/ProblemDetails'
}


def problem_responses(
    *errors: type[DomainError],
) -> dict[int | str, dict[str, object]]:
    """Declare the problem responses a route can propagate.

    ``UnexpectedError`` is always included, because any route can fail
    unexpectedly. Errors sharing a status are grouped under it, each one
    as a named example.

    Args:
        *errors: Domain error classes the route can raise.

    Returns:
        The mapping expected by the ``responses`` argument of a route.

    Example:
        >>> @router.get(
        ...     '/products/{product_id}',
        ...     responses=problem_responses(ProductNotFound),
        ... )
    """
    by_status: defaultdict[int, list[type[DomainError]]] = defaultdict(list)
    for error in dict.fromkeys((*errors, UnexpectedError)):
        by_status[error.status].append(error)

    return {
        status: {
            'description': ' | '.join(error.title for error in grouped),
            'content': {
                PROBLEM_MEDIA_TYPE: {
                    'schema': PROBLEM_SCHEMA_REF,
                    'examples': {
                        error.__name__: {
                            'summary': error.title,
                            'value': problem_from_error(error).model_dump(
                                mode='json', exclude_none=True
                            ),
                        }
                        for error in grouped
                    },
                }
            },
        }
        for status, grouped in sorted(by_status.items())
    }
