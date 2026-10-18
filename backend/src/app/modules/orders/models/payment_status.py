"""Whether an order is already paid."""

from enum import StrEnum


class PaymentStatus(StrEnum):
    """Approved at checkout, or pending until pickup or delivery."""

    APPROVED = 'approved'
    PENDING = 'pending'
