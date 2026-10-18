"""Queries and persistence of product images."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.product_image import ProductImage


class ProductImageRepository:
    """Reads and writes ``ProductImage`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, image_id: int) -> ProductImage | None:
        """Return the image with ``image_id``, if any."""
        return self.session.get(ProductImage, image_id)

    def add(self, content_type: str, data: bytes) -> ProductImage:
        """Store a new image and return it with its id."""
        image = ProductImage(content_type=content_type, data=data)
        self.session.add(image)
        self.session.flush()
        return image
