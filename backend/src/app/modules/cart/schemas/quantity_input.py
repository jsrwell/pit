"""New quantity of a cart line."""

from pydantic import BaseModel, Field

from app.modules.cart.services.cart_summary import MAX_QUANTITY


class QuantityInput(BaseModel):
    """Units to keep in the cart, between one and the per-product limit."""

    quantity: int = Field(ge=1, le=MAX_QUANTITY)
