"""Single translation point from exceptions to Problem Details."""

import logging
from collections.abc import Sequence

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from app.shared.errors.domain_error import DomainError
from app.shared.errors.invalid_request import InvalidRequest
from app.shared.errors.method_not_allowed import MethodNotAllowed
from app.shared.errors.route_not_found import RouteNotFound
from app.shared.errors.unexpected_error import UnexpectedError
from app.shared.http.problem_details import (
    InvalidField,
    ProblemResponse,
    problem_from_error,
)

logger = logging.getLogger(__name__)

PROTOCOL_ERRORS: dict[int, type[DomainError]] = {
    RouteNotFound.status: RouteNotFound,
    MethodNotAllowed.status: MethodNotAllowed,
}


def json_pointer(location: Sequence[str | int]) -> str:
    """Convert a validation location into an RFC 6901 JSON Pointer."""
    tokens = (
        str(token).replace('~', '~0').replace('/', '~1') for token in location
    )
    return ''.join(f'/{token}' for token in tokens)


def handle_domain_error(
    request: Request, error: DomainError
) -> ProblemResponse:
    """Answer a domain error raised by a service."""
    return ProblemResponse(problem_from_error(error, request.url.path))


def handle_validation_error(
    request: Request, error: RequestValidationError
) -> ProblemResponse:
    """Answer a request rejected by schema validation with ``422``."""
    fields = [
        InvalidField(
            pointer=json_pointer(entry['loc']),
            code=entry['type'],
            detail=entry['msg'],
        )
        for entry in error.errors()
    ]
    problem = problem_from_error(InvalidRequest(), request.url.path, fields)
    return ProblemResponse(problem)


def handle_http_error(
    request: Request, error: HTTPException
) -> ProblemResponse:
    """Answer routing failures raised by Starlette itself."""
    error_class = PROTOCOL_ERRORS.get(error.status_code, UnexpectedError)
    return ProblemResponse(problem_from_error(error_class(), request.url.path))


def handle_unexpected_error(
    request: Request, error: Exception
) -> ProblemResponse:
    """Log an unhandled exception and answer without exposing it."""
    logger.exception(
        'Unhandled error while serving %s', request.url.path, exc_info=error
    )
    return ProblemResponse(
        problem_from_error(UnexpectedError(), request.url.path)
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Install every exception handler on the application."""
    app.add_exception_handler(DomainError, handle_domain_error)
    app.add_exception_handler(RequestValidationError, handle_validation_error)
    app.add_exception_handler(HTTPException, handle_http_error)
    app.add_exception_handler(Exception, handle_unexpected_error)
