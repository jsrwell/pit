"""Use case: list the products shown on the storefront."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)


def list_storefront_products(session: Session) -> list[Product]:
    """Return active products, featured ones first.

    Unavailable products are still listed, flagged by ``is_available``,
    so the customer sees them but cannot buy them.
    """
    return ProductRepository(session).list_active()
