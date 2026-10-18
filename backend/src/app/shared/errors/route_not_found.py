"""Error answered when no route matches the requested path."""

from app.shared.errors.domain_error import DomainError


class RouteNotFound(DomainError):
    """The requested path does not exist in the API."""

    code = 'CS-SYS-0003'
    status = 404
    title = 'Route not found'
