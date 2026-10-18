"""Order as shown on the store's operational panel."""

from pydantic import BaseModel, ConfigDict

from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.schemas.order_read import OrderRead


class CustomerRead(BaseModel):
    """Contact of the customer who placed the order."""

    model_config = ConfigDict(from_attributes=True)

    name: str
    email: str
    phone: str


class StoreOrderRead(OrderRead):
    """Customer order plus contact and the statuses it can move to."""

    customer: CustomerRead | None
    next_statuses: list[OrderStatus]
