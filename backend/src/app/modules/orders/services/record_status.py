"""Use case: move an order to a status, keeping the change on record."""

from app.modules.orders.models.order import Order
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.models.order_status_change import OrderStatusChange


def record_status(order: Order, status: OrderStatus) -> None:
    """Set ``status`` on the order and append it to the history."""
    order.status = status
    order.history.append(OrderStatusChange(status=status))
