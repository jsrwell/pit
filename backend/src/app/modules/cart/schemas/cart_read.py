"""Cart as shown to the customer."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CartLineRead(BaseModel):
    """One product of the cart with its current price."""

    model_config = ConfigDict(from_attributes=True)

    product_id: int
    name: str
    image_id: int | None
    unit_price: Decimal
    quantity: int
    line_total: Decimal
    is_available: bool


class CartRead(BaseModel):
    """Lines, unit count and subtotal of the cart."""

    model_config = ConfigDict(from_attributes=True)

    lines: list[CartLineRead]
    item_count: int
    subtotal: Decimal
    has_unavailable: bool
