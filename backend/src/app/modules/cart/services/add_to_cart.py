"""Use case: put a product in the customer's cart."""

from sqlalchemy.orm import Session

from app.modules.cart.errors.quantity_limit_exceeded import (
    QuantityLimitExceeded,
)
from app.modules.cart.models.cart_item import CartItem
from app.modules.cart.repositories.cart_item_repository import (
    CartItemRepository,
)
from app.modules.cart.services.cart_summary import (
    MAX_QUANTITY,
    CartSummary,
    summarize_cart,
)
from app.modules.catalog.services.purchasable_products import (
    get_purchasable_product,
)


def add_to_cart(
    session: Session, *, user_id: int, product_id: int, quantity: int
) -> CartSummary:
    """Add ``quantity`` units, merging with an existing line.

    Raises:
        ProductNotFound: The product does not exist.
        ProductUnavailable: The product cannot be bought now.
        QuantityLimitExceeded: The line would pass ``MAX_QUANTITY``.
    """
    get_purchasable_product(session, product_id)
    items = CartItemRepository(session)
    item = items.find(user_id, product_id)
    total = quantity + (item.quantity if item else 0)
    if total > MAX_QUANTITY:
        raise QuantityLimitExceeded(
            f'At most {MAX_QUANTITY} units of a product per order.'
        )
    if item is None:
        items.add(
            CartItem(user_id=user_id, product_id=product_id, quantity=total)
        )
    else:
        item.quantity = total
    return summarize_cart(session, user_id)
