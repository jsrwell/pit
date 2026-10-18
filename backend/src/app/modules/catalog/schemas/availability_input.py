"""Availability switch sent by the administrator."""

from pydantic import BaseModel


class AvailabilityInput(BaseModel):
    """Whether the product can be bought and if it stays visible meanwhile."""

    is_available: bool
    show_when_unavailable: bool = True
