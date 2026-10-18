"""Use case: read the content of a product image."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.image_not_found import ImageNotFound
from app.modules.catalog.models.product_image import ProductImage
from app.modules.catalog.repositories.product_image_repository import (
    ProductImageRepository,
)


def get_product_image(session: Session, image_id: int) -> ProductImage:
    """Return the image or raise ``ImageNotFound``."""
    image = ProductImageRepository(session).get(image_id)
    if image is None:
        raise ImageNotFound(f'No image with id {image_id}.')
    return image
