"""Error raised when an uploaded file is not an accepted image."""

from app.shared.errors.domain_error import DomainError


class UnsupportedImage(DomainError):
    """Only PNG, JPEG and WebP images are accepted."""

    code = 'CS-CAT-0005'
    status = 415
    title = 'Unsupported image type'
