"""Use case: describe orders for the store's operational panel."""

from collections.abc import Sequence
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.modules.accounts.services.customer_contacts import (
    CustomerContact,
    get_customer_contacts,
)
from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.models.order import Order
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.services.status_flow import next_statuses


@dataclass(frozen=True)
class StoreOrderView:
    """Order with the customer's contact and the moves it allows."""

    order: Order
    customer: CustomerContact | None
    next_statuses: tuple[OrderStatus, ...]


def describe_orders(
    session: Session, orders: Sequence[Order]
) -> list[StoreOrderView]:
    """Attach customer contacts and allowed next statuses to orders."""
    contacts = get_customer_contacts(
        session, (order.user_id for order in orders)
    )
    return [
        StoreOrderView(
            order=order,
            customer=contacts.get(order.user_id),
            next_statuses=next_statuses(
                FulfillmentMethod(order.fulfillment_method),
                OrderStatus(order.status),
            ),
        )
        for order in orders
    ]
