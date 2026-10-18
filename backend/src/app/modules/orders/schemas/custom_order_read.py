"""Custom order request as shown to customer and store."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.modules.orders.models.custom_order_status import CustomOrderStatus
from app.modules.orders.schemas.store_order_read import CustomerRead


class CustomOrderRead(BaseModel):
    """Request, its review status and the answer of the store."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    description: str
    quantity: int
    desired_date: date
    notes: str
    status: CustomOrderStatus
    quoted_price: Decimal | None
    store_response: str
    created_at: datetime
    reviewed_at: datetime | None


class StoreCustomOrderRead(CustomOrderRead):
    """Request plus the contact of the customer who made it."""

    customer: CustomerRead | None
