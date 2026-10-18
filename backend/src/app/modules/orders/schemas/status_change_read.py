"""Entry of an order's status history."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.modules.orders.models.order_status import OrderStatus


class StatusChangeRead(BaseModel):
    """Status reached and when."""

    model_config = ConfigDict(from_attributes=True)

    status: OrderStatus
    changed_at: datetime
