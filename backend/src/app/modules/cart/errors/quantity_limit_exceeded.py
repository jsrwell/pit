"""Error raised when a cart line would exceed the quantity limit."""

from app.shared.errors.domain_error import DomainError


class QuantityLimitExceeded(DomainError):
    """A single product is limited to ``MAX_QUANTITY`` units per cart."""

    code = 'CS-CRT-0001'
    status = 422
    title = 'Quantity limit exceeded'
