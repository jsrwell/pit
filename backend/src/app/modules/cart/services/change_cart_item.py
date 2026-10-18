"""Use cases: change the quantity of a cart line or remove it."""

from sqlalchemy.orm import Session

from app.modules.cart.errors.cart_item_not_found import CartItemNotFound
from app.modules.cart.models.cart_item import CartItem
from app.modules.cart.repositories.cart_item_repository import (
    CartItemRepository,
)
from app.modules.cart.services.cart_summary import CartSummary, summarize_cart
from app.modules.catalog.services.purchasable_products import (
    get_purchasable_product,
)


def change_quantity(
    session: Session, *, user_id: int, product_id: int, quantity: int
) -> CartSummary:
    """Set the units of a line; increasing needs the product available.

    Lowering is always allowed, so a customer can trim an unavailable
    line before removing it. Zero is not a quantity: removal is explicit.

    Raises:
        CartItemNotFound: The product is not in the cart.
        ProductUnavailable: Increasing a product that cannot be bought.
    """
    item = find_item(session, user_id, product_id)
    if quantity > item.quantity:
        get_purchasable_product(session, product_id)
    item.quantity = quantity
    return summarize_cart(session, user_id)


def remove_from_cart(
    session: Session, *, user_id: int, product_id: int
) -> CartSummary:
    """Delete the line of ``product_id`` from the cart.

    Raises:
        CartItemNotFound: The product is not in the cart.
    """
    CartItemRepository(session).remove(find_item(session, user_id, product_id))
    return summarize_cart(session, user_id)


def find_item(session: Session, user_id: int, product_id: int) -> CartItem:
    """Return the cart line or raise ``CartItemNotFound``."""
    item = CartItemRepository(session).find(user_id, product_id)
    if item is None:
        raise CartItemNotFound(f'Product {product_id} is not in the cart.')
    return item
