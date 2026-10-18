"""Use case offered to orders: empty the cart once it became an order."""

from sqlalchemy.orm import Session

from app.modules.cart.repositories.cart_item_repository import (
    CartItemRepository,
)


def clear_cart(session: Session, user_id: int) -> None:
    """Remove every line of ``user_id``'s cart."""
    CartItemRepository(session).clear(user_id)
