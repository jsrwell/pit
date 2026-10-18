"""Fulfillment choice sent to price or place an order."""

from pydantic import BaseModel

from app.modules.orders.models.fulfillment_method import FulfillmentMethod


class FulfillmentInput(BaseModel):
    """Pickup or delivery; delivery also names one of the addresses."""

    fulfillment_method: FulfillmentMethod
    address_id: int | None = None
