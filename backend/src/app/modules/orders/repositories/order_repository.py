"""Queries and persistence of orders."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.orders.models.order import Order


class OrderRepository:
    """Reads and writes ``Order`` rows with their items."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, order: Order) -> Order:
        """Persist a new order and its items."""
        self.session.add(order)
        self.session.flush()
        return order

    def get(self, order_id: int) -> Order | None:
        """Return the order with ``order_id``, if any."""
        return self.session.get(Order, order_id)

    def list_for(self, user_id: int) -> list[Order]:
        """Return the orders of ``user_id``, newest first."""
        statement = (
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc(), Order.id.desc())
        )
        return list(self.session.scalars(statement))
