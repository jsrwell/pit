"""Product as shown on a storefront card."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.modules.catalog.schemas.named_item import NamedItem


class ProductSummary(BaseModel):
    """Name, image, price and availability of one product."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: Decimal
    promotional_price: Decimal | None = None
    image_id: int | None
    category: NamedItem
    flavor: NamedItem
    is_available: bool
    is_featured: bool
