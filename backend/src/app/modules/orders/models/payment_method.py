"""Ways a customer can pay for an order."""

from enum import StrEnum


class PaymentMethod(StrEnum):
    """Instant Pix, credit card or cash on pickup or delivery."""

    PIX = 'pix'
    CREDIT_CARD = 'credit_card'
    CASH = 'cash'
