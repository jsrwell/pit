"""Error raised when buying a product that cannot be bought now."""

from app.shared.errors.domain_error import DomainError


class ProductUnavailable(DomainError):
    """The product is inactive or marked as unavailable."""

    code = 'CS-CAT-0007'
    status = 409
    title = 'Product unavailable'
