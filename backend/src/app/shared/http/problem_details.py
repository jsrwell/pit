"""RFC 9457 Problem Details body and its JSON response."""

from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.shared.errors.domain_error import DomainError

PROBLEM_MEDIA_TYPE = 'application/problem+json'
PROBLEM_TYPE_PREFIX = 'urn:cupcakes-store:problem:'


class InvalidField(BaseModel):
    """One field rejected by request validation."""

    pointer: str
    code: str
    detail: str


class ProblemDetails(BaseModel):
    """Error body shared by every non-2xx response of the API."""

    type: str
    title: str
    status: int
    code: str
    detail: str | None = None
    instance: str | None = None
    errors: list[InvalidField] | None = None


def problem_from_error(
    error: DomainError | type[DomainError],
    instance: str | None = None,
    errors: list[InvalidField] | None = None,
) -> ProblemDetails:
    """Build the body of a domain error, or of its class for examples."""
    detail = error.detail if isinstance(error, DomainError) else None
    return ProblemDetails(
        type=PROBLEM_TYPE_PREFIX + error.code,
        title=error.title,
        status=error.status,
        code=error.code,
        detail=detail,
        instance=instance,
        errors=errors,
    )


class ProblemResponse(JSONResponse):
    """JSON response served as ``application/problem+json``."""

    media_type = PROBLEM_MEDIA_TYPE

    def __init__(self, problem: ProblemDetails) -> None:
        super().__init__(
            content=problem.model_dump(mode='json', exclude_none=True),
            status_code=problem.status,
        )
