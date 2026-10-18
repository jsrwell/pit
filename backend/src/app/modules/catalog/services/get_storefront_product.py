"""Use case: read one product published on the storefront."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)


def get_storefront_product(session: Session, product_id: int) -> Product:
    """Return the active product or raise ``ProductNotFound``.

    Inactive products are hidden exactly as if they did not exist.
    """
    product = ProductRepository(session).get(product_id)
    if product is None or not product.is_active:
        raise ProductNotFound(f'No product with id {product_id}.')
    return product
