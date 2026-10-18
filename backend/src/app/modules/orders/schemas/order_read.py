"""Order as shown to the customer."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.models.payment_method import PaymentMethod
from app.modules.orders.models.payment_status import PaymentStatus
from app.modules.orders.schemas.status_change_read import StatusChangeRead


class OrderItemRead(BaseModel):
    """Product line as it was sold."""

    model_config = ConfigDict(from_attributes=True)

    product_id: int
    product_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal


class OrderRead(BaseModel):
    """Status, fulfillment, payment, totals and items of an order."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    fulfillment_method: FulfillmentMethod
    delivery_address: str | None
    delivery_reference: str | None
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    payment_reference: str
    subtotal: Decimal
    delivery_fee: Decimal
    total: Decimal
    notes: str
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemRead]
    history: list[StatusChangeRead]
