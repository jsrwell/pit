"""Decision of the store on a custom order request."""

from decimal import Decimal
from typing import Literal, Self

from pydantic import BaseModel, Field, model_validator

from app.modules.orders.models.custom_order_status import CustomOrderStatus


class CustomOrderReview(BaseModel):
    """Approve with a quoted price, or reject, with a message."""

    decision: Literal[CustomOrderStatus.APPROVED, CustomOrderStatus.REJECTED]
    quoted_price: Decimal | None = Field(
        default=None, gt=0, max_digits=10, decimal_places=2
    )
    response: str = Field(default='', max_length=1000)

    @model_validator(mode='after')
    def require_price_on_approval(self) -> Self:
        """An approval must tell the customer the price."""
        if (
            self.decision is CustomOrderStatus.APPROVED
            and self.quoted_price is None
        ):
            raise ValueError('An approval needs a quoted price.')
        return self
