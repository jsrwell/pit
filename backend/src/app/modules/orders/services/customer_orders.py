"""Use cases: the customer reads their own orders."""

from sqlalchemy.orm import Session

from app.modules.orders.errors.order_not_found import OrderNotFound
from app.modules.orders.models.order import Order
from app.modules.orders.repositories.order_repository import OrderRepository


def list_my_orders(session: Session, user_id: int) -> list[Order]:
    """Return the customer's orders, newest first."""
    return OrderRepository(session).list_for(user_id)


def get_my_order(session: Session, user_id: int, order_id: int) -> Order:
    """Return an order only to the customer who placed it.

    Raises:
        OrderNotFound: Missing, or placed by someone else.
    """
    order = OrderRepository(session).get(order_id)
    if order is None or order.user_id != user_id:
        raise OrderNotFound(f'No order with id {order_id}.')
    return order
