"""Error raised when publishing a product without its minimum data."""

from app.shared.errors.domain_error import DomainError


class ProductIncomplete(DomainError):
    """An active product needs description, composition and image."""

    code = 'CS-CAT-0004'
    status = 422
    title = 'Product incomplete'
