"""Use case: highlight a product on the storefront or stop doing so."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.catalog.services.save_product import get_any_product


def set_featured(
    session: Session, product_id: int, is_featured: bool
) -> Product:
    """Mark or unmark a product as featured.

    Raises:
        ProductNotFound: No product with ``product_id``.
    """
    product = get_any_product(session, product_id)
    product.is_featured = is_featured
    session.flush()
    return product
