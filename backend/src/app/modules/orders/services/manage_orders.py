"""Use cases: the store lists orders and moves them through the flow."""

from sqlalchemy.orm import Session

from app.modules.orders.errors.invalid_status_transition import (
    InvalidStatusTransition,
)
from app.modules.orders.errors.order_not_found import OrderNotFound
from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.models.order import Order
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.models.payment_status import PaymentStatus
from app.modules.orders.repositories.order_repository import OrderRepository
from app.modules.orders.services.record_status import record_status
from app.modules.orders.services.status_flow import next_statuses


def list_orders(
    session: Session, status: OrderStatus | None = None
) -> list[Order]:
    """Return every order, newest first, optionally of one status."""
    return OrderRepository(session).list_all(status)


def get_order(session: Session, order_id: int) -> Order:
    """Return any order or raise ``OrderNotFound``."""
    order = OrderRepository(session).get(order_id)
    if order is None:
        raise OrderNotFound(f'No order with id {order_id}.')
    return order


def change_status(
    session: Session, order_id: int, status: OrderStatus
) -> Order:
    """Move the order to ``status`` when the flow allows it.

    Completing an order paid in cash marks the payment as received.

    Raises:
        OrderNotFound: No order with ``order_id``.
        InvalidStatusTransition: ``status`` does not follow the current.
    """
    order = get_order(session, order_id)
    allowed = next_statuses(
        FulfillmentMethod(order.fulfillment_method),
        OrderStatus(order.status),
    )
    if status not in allowed:
        raise InvalidStatusTransition(
            f'An order {order.status} cannot become {status}.'
        )
    record_status(order, status)
    if status is OrderStatus.COMPLETED:
        order.payment_status = PaymentStatus.APPROVED
    session.flush()
    return order
