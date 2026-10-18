"""Use case: store an image uploaded by the administrator."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.image_too_large import ImageTooLarge
from app.modules.catalog.errors.unsupported_image import UnsupportedImage
from app.modules.catalog.models.product_image import ProductImage
from app.modules.catalog.repositories.product_image_repository import (
    ProductImageRepository,
)

ACCEPTED_CONTENT_TYPES: frozenset[str] = frozenset(
    {'image/png', 'image/jpeg', 'image/webp'}
)


def upload_product_image(
    session: Session, *, content_type: str, data: bytes, max_bytes: int
) -> ProductImage:
    """Validate and store an image, returning it with its id.

    SVG is refused on purpose: it may carry scripts.

    Raises:
        UnsupportedImage: Not a PNG, JPEG or WebP image.
        ImageTooLarge: Larger than ``max_bytes``.
    """
    if content_type not in ACCEPTED_CONTENT_TYPES:
        raise UnsupportedImage(f'Images of type {content_type} are refused.')
    if len(data) > max_bytes:
        raise ImageTooLarge(f'Images are limited to {max_bytes} bytes.')
    return ProductImageRepository(session).add(content_type, data)
