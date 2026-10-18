"""Data sent to confirm an order."""

from pydantic import BaseModel, Field

from app.modules.orders.models.payment_method import PaymentMethod
from app.modules.orders.schemas.quote_input import FulfillmentInput


class CardInput(BaseModel):
    """Credit card typed by the customer; only the last digits are kept."""

    number: str = Field(min_length=12, max_length=23)
    holder_name: str = Field(min_length=2, max_length=80)
    expiry_month: int = Field(ge=1, le=12)
    expiry_year: int = Field(ge=2000, le=2100)
    cvv: str = Field(min_length=3, max_length=4)


class CheckoutInput(FulfillmentInput):
    """Fulfillment, payment method, optional card and notes."""

    payment_method: PaymentMethod
    card: CardInput | None = None
    notes: str = Field(default='', max_length=500)
