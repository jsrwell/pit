"""Error raised when an uploaded image exceeds the size limit."""

from app.shared.errors.domain_error import DomainError


class ImageTooLarge(DomainError):
    """The image is larger than ``CATALOG__MAX_IMAGE_BYTES``."""

    code = 'CS-CAT-0006'
    status = 413
    title = 'Image too large'
