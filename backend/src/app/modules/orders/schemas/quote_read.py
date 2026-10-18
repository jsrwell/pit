"""Price of the cart for a fulfillment method."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.schemas.delivery_address_read import (
    DeliveryAddressRead,
)


class QuoteLine(BaseModel):
    """One product of the order with its price."""

    model_config = ConfigDict(from_attributes=True)

    product_id: int
    name: str
    image_id: int | None
    unit_price: Decimal
    quantity: int
    line_total: Decimal


class QuoteRead(BaseModel):
    """Items, fee and total for the chosen fulfillment."""

    model_config = ConfigDict(from_attributes=True)

    lines: list[QuoteLine]
    fulfillment_method: FulfillmentMethod
    address: DeliveryAddressRead | None
    subtotal: Decimal
    delivery_fee: Decimal
    total: Decimal
    pickup_address: str
