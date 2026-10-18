"""Error raised when card data is missing or malformed."""

from app.shared.errors.domain_error import DomainError


class InvalidCard(DomainError):
    """Card number, expiry or security code is not valid."""

    code = 'CS-ORD-0004'
    status = 422
    title = 'Invalid card data'
