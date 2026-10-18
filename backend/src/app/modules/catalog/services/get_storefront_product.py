"""Use case: read one product published on the storefront."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)


def get_storefront_product(session: Session, product_id: int) -> Product:
    """Return the product shown on the storefront or raise.

    Inactive products, and unavailable ones the store chose to hide, are
    treated exactly as if they did not exist.

    Raises:
        ProductNotFound: The product is missing or not shown.
    """
    product = ProductRepository(session).get(product_id)
    if product is None or not is_visible(product):
        raise ProductNotFound(f'No product with id {product_id}.')
    return product


def is_visible(product: Product) -> bool:
    """Tell whether ``product`` appears on the storefront."""
    return product.is_active and (
        product.is_available or product.show_when_unavailable
    )
