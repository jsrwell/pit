"""Use case: price the cart of a customer with current catalog data."""

from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.cart.repositories.cart_item_repository import (
    CartItemRepository,
)
from app.modules.catalog.services.purchasable_products import (
    get_products_by_id,
    is_purchasable,
)

MAX_QUANTITY = 50
ZERO = Decimal('0.00')


@dataclass(frozen=True)
class CartLine:
    """A cart line priced with the product as it is right now."""

    product_id: int
    name: str
    image_id: int | None
    unit_price: Decimal
    quantity: int
    is_available: bool

    @property
    def line_total(self) -> Decimal:
        """Price of the whole line."""
        return self.unit_price * self.quantity


@dataclass(frozen=True)
class CartSummary:
    """Every line of the cart and the totals of the purchasable ones."""

    lines: list[CartLine]

    @property
    def purchasable_lines(self) -> list[CartLine]:
        """Lines whose product can be bought now."""
        return [line for line in self.lines if line.is_available]

    @property
    def subtotal(self) -> Decimal:
        """Sum of the purchasable lines; unavailable ones never count."""
        return sum((line.line_total for line in self.purchasable_lines), ZERO)

    @property
    def item_count(self) -> int:
        """Units across all lines, shown on the cart badge."""
        return sum(line.quantity for line in self.lines)

    @property
    def has_unavailable(self) -> bool:
        """Tell whether some line can no longer be bought."""
        return len(self.purchasable_lines) != len(self.lines)


def summarize_cart(session: Session, user_id: int) -> CartSummary:
    """Price the cart of ``user_id`` with current prices and availability.

    The availability of the product right now always wins over the
    moment it was added to the cart.
    """
    items = CartItemRepository(session).list_for(user_id)
    products = get_products_by_id(session, (item.product_id for item in items))
    lines = [
        CartLine(
            product_id=item.product_id,
            name=products[item.product_id].name,
            image_id=products[item.product_id].image_id,
            unit_price=products[item.product_id].price,
            quantity=item.quantity,
            is_available=is_purchasable(products[item.product_id]),
        )
        for item in items
    ]
    return CartSummary(lines)
