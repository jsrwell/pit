"""Error answered when the path exists but not for the HTTP method."""

from app.shared.errors.domain_error import DomainError


class MethodNotAllowed(DomainError):
    """The requested path does not accept the HTTP method used."""

    code = 'CS-SYS-0004'
    status = 405
    title = 'Method not allowed'
