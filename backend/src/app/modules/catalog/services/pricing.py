"""Use cases: the price a product costs right now."""

from collections.abc import Sequence
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product
from app.modules.promotions.services.promotional_pricing import (
    promotional_prices,
)


def running_promotional_prices(
    session: Session, products: Sequence[Product]
) -> dict[int, Decimal]:
    """Return the promotional price of each product under a campaign."""
    return promotional_prices(session, [product.id for product in products])


def effective_prices(
    session: Session, products: Sequence[Product]
) -> dict[int, Decimal]:
    """Return the price charged now: the campaign price or the base one."""
    promotional = running_promotional_prices(session, products)
    return {
        product.id: promotional.get(product.id, product.price)
        for product in products
    }
