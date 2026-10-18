"""Use case: switch a product between available and unavailable."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.catalog.services.save_product import get_any_product


def set_availability(
    session: Session,
    product_id: int,
    *,
    is_available: bool,
    show_when_unavailable: bool,
) -> Product:
    """Change availability; storefront and carts read it on the next request.

    Nothing is cached, so the change reaches the storefront and every
    cart at once: carts price each line with the product as it is now.

    Raises:
        ProductNotFound: No product with ``product_id``.
    """
    product = get_any_product(session, product_id)
    product.is_available = is_available
    product.show_when_unavailable = show_when_unavailable
    session.flush()
    return product
