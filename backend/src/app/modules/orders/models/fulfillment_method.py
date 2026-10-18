"""Ways a customer can receive an order."""

from enum import StrEnum


class FulfillmentMethod(StrEnum):
    """Pickup at the store or delivery to an address."""

    PICKUP = 'pickup'
    DELIVERY = 'delivery'
