"""Product and quantity sent to the cart."""

from pydantic import BaseModel, Field


class CartItemInput(BaseModel):
    """Units of a product to add to the cart; at least one."""

    product_id: int
    quantity: int = Field(default=1, ge=1)
