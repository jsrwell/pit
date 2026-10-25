"""Query filters accepted by the storefront listing."""

from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel, Field


class ProductSort(StrEnum):
    """Order of the storefront listing."""

    FEATURED = 'featured'
    PRICE_ASC = 'price_asc'
    PRICE_DESC = 'price_desc'


class ProductFilters(BaseModel):
    """Optional criteria that narrow and order the storefront listing."""

    category_id: int | None = None
    flavor_id: int | None = None
    min_price: Decimal | None = Field(default=None, ge=0)
    max_price: Decimal | None = Field(default=None, ge=0)
    search: str | None = Field(default=None, max_length=80)
    sort: ProductSort = ProductSort.FEATURED
