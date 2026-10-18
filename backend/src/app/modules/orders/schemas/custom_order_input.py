"""Custom order request typed by the customer."""

from datetime import date

from pydantic import BaseModel, Field


class CustomOrderInput(BaseModel):
    """What, how many and for when, plus free notes."""

    description: str = Field(min_length=10, max_length=1000)
    quantity: int = Field(ge=6, le=500)
    desired_date: date
    notes: str = Field(default='', max_length=500)
