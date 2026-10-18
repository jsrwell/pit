"""Status chosen by the store for an order."""

from pydantic import BaseModel

from app.modules.orders.models.order_status import OrderStatus


class StatusInput(BaseModel):
    """Next status of the order."""

    status: OrderStatus
