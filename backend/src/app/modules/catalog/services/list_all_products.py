"""Use case: list every product for the administration panel."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)


def list_all_products(session: Session) -> list[Product]:
    """Return active and inactive products ordered by name."""
    return ProductRepository(session).list_all()
