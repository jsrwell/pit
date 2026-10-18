"""State machine of an order, by fulfillment method."""

from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.models.order_status import OrderStatus

S = OrderStatus

COMMON_FLOW: dict[OrderStatus, tuple[OrderStatus, ...]] = {
    S.RECEIVED: (S.CONFIRMED, S.CANCELLED),
    S.CONFIRMED: (S.PREPARING, S.CANCELLED),
    S.PREPARING: (S.READY, S.CANCELLED),
    S.COMPLETED: (),
    S.CANCELLED: (),
}

FLOWS: dict[FulfillmentMethod, dict[OrderStatus, tuple[OrderStatus, ...]]] = {
    FulfillmentMethod.PICKUP: {**COMMON_FLOW, S.READY: (S.COMPLETED,)},
    FulfillmentMethod.DELIVERY: {
        **COMMON_FLOW,
        S.READY: (S.OUT_FOR_DELIVERY,),
        S.OUT_FOR_DELIVERY: (S.COMPLETED,),
    },
}


def next_statuses(
    fulfillment: FulfillmentMethod, current: OrderStatus
) -> tuple[OrderStatus, ...]:
    """Return the statuses an order may move to from ``current``.

    Completion only follows ``ready`` (pickup) or ``out_for_delivery``
    (delivery), and an order can be cancelled only before it is ready.
    """
    return FLOWS[fulfillment].get(current, ())
