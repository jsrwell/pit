"""Error raised when a product image does not exist."""

from app.shared.errors.domain_error import DomainError


class ImageNotFound(DomainError):
    """No image matches the requested id."""

    code = 'CS-CAT-0001'
    status = 404
    title = 'Image not found'
