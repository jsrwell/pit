"""Promotional combo sent by the administrator and read by everyone."""

from decimal import Decimal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class ComboItemSchema(BaseModel):
    """Units of a product inside the combo."""

    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int = Field(ge=1, le=50)


class ComboInput(BaseModel):
    """Name, closed price, period and at least two products."""

    name: str = Field(min_length=2, max_length=80)
    description: str = Field(default='', max_length=500)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    starts_at: AwareDatetime
    ends_at: AwareDatetime
    is_active: bool = True
    items: list[ComboItemSchema] = Field(min_length=2, max_length=10)


class ComboRead(ComboInput):
    """Stored combo and whether it is offered right now."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_running: bool = False
