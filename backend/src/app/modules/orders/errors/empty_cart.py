"""Error raised when ordering with nothing purchasable in the cart."""

from app.shared.errors.domain_error import DomainError


class EmptyCart(DomainError):
    """The cart has no item to order."""

    code = 'CS-ORD-0002'
    status = 422
    title = 'Empty cart'
