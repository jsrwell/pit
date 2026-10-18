"""Queries and persistence of cart lines."""

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.modules.cart.models.cart_item import CartItem


class CartItemRepository:
    """Reads and writes the ``CartItem`` rows of customers."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_for(self, user_id: int) -> list[CartItem]:
        """Return the lines of ``user_id``'s cart in insertion order."""
        statement = (
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .order_by(CartItem.id)
        )
        return list(self.session.scalars(statement))

    def find(self, user_id: int, product_id: int) -> CartItem | None:
        """Return the line of ``product_id`` in the cart, if any."""
        statement = select(CartItem).where(
            CartItem.user_id == user_id, CartItem.product_id == product_id
        )
        return self.session.scalars(statement).first()

    def add(self, item: CartItem) -> CartItem:
        """Persist a new cart line."""
        self.session.add(item)
        self.session.flush()
        return item

    def remove(self, item: CartItem) -> None:
        """Delete a cart line."""
        self.session.delete(item)
        self.session.flush()

    def clear(self, user_id: int) -> None:
        """Empty the cart of ``user_id``."""
        self.session.execute(
            delete(CartItem).where(CartItem.user_id == user_id)
        )
