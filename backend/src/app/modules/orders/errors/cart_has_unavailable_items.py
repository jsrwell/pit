"""Error raised when ordering while some cart item is unavailable."""

from app.shared.errors.domain_error import DomainError


class CartHasUnavailableItems(DomainError):
    """Unavailable items must leave the cart before ordering."""

    code = 'CS-ORD-0003'
    status = 409
    title = 'Cart has unavailable items'
