"""Use case: list the products shown on the storefront."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.invalid_price_range import InvalidPriceRange
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)
from app.modules.catalog.schemas.product_filters import (
    ProductFilters,
    ProductSort,
)
from app.modules.catalog.services.pricing import effective_prices


def list_storefront_products(
    session: Session, filters: ProductFilters | None = None
) -> list[Product]:
    """Return active products matching ``filters`` in the chosen order.

    The default order puts featured products first; the price orders use
    the price charged now, promotional when a campaign runs, and break
    ties by name. Unavailable products are still listed, flagged by
    ``is_available``, so the customer sees them but cannot buy them.
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
    products = ProductRepository(session).list_active(
        **filters.model_dump(exclude={'sort'})
    )
    if filters.sort is ProductSort.FEATURED:
        return products
    prices = effective_prices(session, products)
    descending = filters.sort is ProductSort.PRICE_DESC
    return sorted(
        products,
        key=lambda product: (
            -prices[product.id] if descending else prices[product.id],
            product.name.casefold(),
        ),
    )
