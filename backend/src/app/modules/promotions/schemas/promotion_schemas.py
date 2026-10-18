"""Promotional campaign sent and read by the administrator."""

from decimal import Decimal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class PromotionInput(BaseModel):
    """Product, promotional price and period of a campaign."""

    name: str = Field(min_length=2, max_length=80)
    product_id: int
    promotional_price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    starts_at: AwareDatetime
    ends_at: AwareDatetime
    is_active: bool = True


class PromotionRead(PromotionInput):
    """Stored campaign and whether it affects prices right now."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_running: bool = False
