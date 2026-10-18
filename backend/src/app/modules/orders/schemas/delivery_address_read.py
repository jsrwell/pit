"""Delivery address attached to a quote or an order."""

from pydantic import BaseModel, ConfigDict


class DeliveryAddressRead(BaseModel):
    """Address the order goes to, as a snapshot."""

    model_config = ConfigDict(from_attributes=True)

    label: str
    zip_code: str
    street: str
    number: str
    complement: str
    district: str
    reference: str
