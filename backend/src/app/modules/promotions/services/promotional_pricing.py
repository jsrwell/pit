"""Use cases offered to catalog and cart: prices and combo discounts."""

from collections.abc import Collection, Mapping
from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.promotions.models.combo import Combo
from app.modules.promotions.repositories.combo_repository import (
    ComboRepository,
)
from app.modules.promotions.repositories.promotion_repository import (
    PromotionRepository,
)
from app.shared.clock import utc_now

ZERO = Decimal('0.00')


@dataclass(frozen=True)
class PricedUnits:
    """Units of a product in a cart and the price each one costs."""

    unit_price: Decimal
    quantity: int


@dataclass(frozen=True)
class AppliedCombo:
    """Combo found in a cart, how many times and how much it saves."""

    name: str
    times: int
    discount: Decimal


def promotional_prices(
    session: Session, product_ids: Collection[int]
) -> dict[int, Decimal]:
    """Return the lowest running promotional price of each product.

    Campaigns outside their period, or disabled, never count.
    """
    prices: dict[int, Decimal] = {}
    running = PromotionRepository(session).list_running(product_ids, utc_now())
    for promotion in running:
        current = prices.get(promotion.product_id)
        if current is None or promotion.promotional_price < current:
            prices[promotion.product_id] = promotion.promotional_price
    return prices


def combo_discounts(
    session: Session, units: Mapping[int, PricedUnits]
) -> list[AppliedCombo]:
    """Find running combos completed by ``units`` and their savings.

    Units used by one combo are not reused by another; combos that save
    more per set are applied first.
    """
    remaining = {
        product_id: line.quantity for product_id, line in units.items()
    }
    combos = ComboRepository(session).list_running(utc_now())
    candidates = [
        (combo, savings)
        for combo in combos
        if (savings := set_savings(combo, units)) > ZERO
    ]
    applied: list[AppliedCombo] = []
    for combo, savings in sorted(candidates, key=lambda pair: -pair[1]):
        times = min(
            remaining.get(item.product_id, 0) // item.quantity
            for item in combo.items
        )
        if times == 0:
            continue
        for item in combo.items:
            remaining[item.product_id] -= item.quantity * times
        applied.append(AppliedCombo(combo.name, times, savings * times))
    return applied


def set_savings(combo: Combo, units: Mapping[int, PricedUnits]) -> Decimal:
    """Return how much one full set of the combo saves, or zero."""
    if any(item.product_id not in units for item in combo.items):
        return ZERO
    regular = sum(
        (units[item.product_id].unit_price * item.quantity)
        for item in combo.items
    )
    return max(regular - combo.price, ZERO)
