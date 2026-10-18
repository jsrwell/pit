"""Error answered when the request fails schema validation."""

from app.shared.errors.domain_error import DomainError


class InvalidRequest(DomainError):
    """One or more request fields are missing or malformed."""

    code = 'CS-SYS-0002'
    status = 422
    title = 'Invalid request'
