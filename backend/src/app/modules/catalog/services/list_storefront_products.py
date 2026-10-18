"""Use case: list the products shown on the storefront."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.invalid_price_range import InvalidPriceRange
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)
from app.modules.catalog.schemas.product_filters import ProductFilters


def list_storefront_products(
    session: Session, filters: ProductFilters | None = None
) -> list[Product]:
    """Return active products matching ``filters``, featured ones first.

    Unavailable products are still listed, flagged by ``is_available``,
    so the customer sees them but cannot buy them.
    """
    filters = filters or ProductFilters()
    if (
        filters.min_price is not None
        and filters.max_price is not None
        and filters.min_price > filters.max_price
    ):
        raise InvalidPriceRange(
            'The minimum price cannot exceed the maximum price.'
        )
    return ProductRepository(session).list_active(**filters.model_dump())
