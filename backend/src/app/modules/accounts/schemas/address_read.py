"""Delivery address as shown to the customer."""

from pydantic import BaseModel, ConfigDict


class AddressRead(BaseModel):
    """Stored address with its id and primary flag."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    label: str
    zip_code: str
    street: str
    number: str
    complement: str
    district: str
    reference: str
    is_primary: bool
