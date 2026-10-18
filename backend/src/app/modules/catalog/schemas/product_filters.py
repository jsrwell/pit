"""Query filters accepted by the storefront listing."""

from decimal import Decimal

from pydantic import BaseModel, Field


class ProductFilters(BaseModel):
    """Optional criteria that narrow the storefront listing."""

    category_id: int | None = None
    flavor_id: int | None = None
    min_price: Decimal | None = Field(default=None, ge=0)
    max_price: Decimal | None = Field(default=None, ge=0)
    search: str | None = Field(default=None, max_length=80)
