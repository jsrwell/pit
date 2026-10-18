"""Error answered when an unhandled exception escapes a request."""

from app.shared.errors.domain_error import DomainError


class UnexpectedError(DomainError):
    """The server failed in a way no business rule anticipated."""

    code = 'CS-SYS-0001'
    status = 500
    title = 'Unexpected error'
