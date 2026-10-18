"""Error raised when changing a product that is not in the cart."""

from app.shared.errors.domain_error import DomainError


class CartItemNotFound(DomainError):
    """The cart has no line for the given product."""

    code = 'CS-CRT-0002'
    status = 404
    title = 'Cart item not found'
