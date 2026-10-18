"""Error raised when a product does not exist or is not published."""

from app.shared.errors.domain_error import DomainError


class ProductNotFound(DomainError):
    """No published product matches the requested id."""

    code = 'CS-CAT-0003'
    status = 404
    title = 'Product not found'
