"""Product data sent by the administrator to create or edit it."""

from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints

ShortText = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=80)
]
Classification = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=60)
]


class ProductInput(BaseModel):
    """Every editable field of a product.

    Category and flavor are given by name and created when new, so the
    administrator never has to register them beforehand.
    """

    name: ShortText
    description: str = Field(default='', max_length=2000)
    composition: str = Field(default='', max_length=2000)
    highlights: list[str] = Field(default_factory=list, max_length=10)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    category_name: Classification
    flavor_name: Classification
    image_id: int | None = None
    is_active: bool = True
    is_available: bool = True
    show_when_unavailable: bool = True
    is_featured: bool = False
