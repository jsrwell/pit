"""Error raised when a custom order does not exist."""

from app.shared.errors.domain_error import DomainError


class CustomOrderNotFound(DomainError):
    """No custom order matches the requested id."""

    code = 'CS-ORD-0009'
    status = 404
    title = 'Custom order not found'
