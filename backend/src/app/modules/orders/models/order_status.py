"""Stages an order goes through."""

from enum import StrEnum


class OrderStatus(StrEnum):
    """Operational status of an order, from receipt to completion."""

    RECEIVED = 'received'
    CONFIRMED = 'confirmed'
    PREPARING = 'preparing'
    READY = 'ready'
    OUT_FOR_DELIVERY = 'out_for_delivery'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
