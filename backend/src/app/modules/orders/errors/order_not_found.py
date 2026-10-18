"""Error raised when an order does not exist for the caller."""

from app.shared.errors.domain_error import DomainError


class OrderNotFound(DomainError):
    """No order with this id is visible to the caller."""

    code = 'CS-ORD-0006'
    status = 404
    title = 'Order not found'
