"""Fulfillment choice sent to price or place an order."""

from typing import Annotated

from pydantic import BaseModel, BeforeValidator, StringConstraints

from app.modules.orders.models.fulfillment_method import FulfillmentMethod


def blank_as_none(value: object) -> object:
    """Treat an empty or blank coupon field as no coupon at all."""
    if isinstance(value, str) and not value.strip():
        return None
    return value


CouponText = Annotated[
    str, StringConstraints(strip_whitespace=True, max_length=30)
]
TypedCoupon = Annotated[CouponText | None, BeforeValidator(blank_as_none)]


class FulfillmentInput(BaseModel):
    """Pickup or delivery, the address of a delivery and a coupon."""

    fulfillment_method: FulfillmentMethod
    address_id: int | None = None
    coupon_code: TypedCoupon = None
