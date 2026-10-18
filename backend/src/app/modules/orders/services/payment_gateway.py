"""Payment provider port and the simulated adapter used by the store."""

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Protocol
from uuid import uuid4

from app.modules.orders.errors.invalid_card import InvalidCard
from app.modules.orders.errors.payment_declined import PaymentDeclined
from app.modules.orders.models.payment_method import PaymentMethod
from app.modules.orders.models.payment_status import PaymentStatus

DECLINED_TEST_CARD_SUFFIX = '0002'


@dataclass(frozen=True)
class Card:
    """Card data typed at checkout; it is never stored."""

    number: str
    holder_name: str
    expiry_month: int
    expiry_year: int
    cvv: str


@dataclass(frozen=True)
class PaymentResult:
    """Outcome of a charge and the reference kept with the order."""

    status: PaymentStatus
    reference: str


class PaymentGateway(Protocol):
    """Port to the payment provider."""

    def charge(
        self, amount: Decimal, method: PaymentMethod, card: Card | None
    ) -> PaymentResult:
        """Charge ``amount`` or raise ``PaymentDeclined``."""
        ...


def passes_luhn(number: str) -> bool:
    """Tell whether ``number`` has a valid Luhn check digit."""
    total = 0
    for position, char in enumerate(reversed(number)):
        digit = int(char)
        if position % 2 == 1:
            digit = digit * 2 - 9 if digit > 4 else digit * 2
        total += digit
    return total % 10 == 0


def validate_card(card: Card | None, today: date) -> Card:
    """Return the card when every field is valid.

    Raises:
        InvalidCard: Missing card, bad number, CVV or past expiry.
    """
    if card is None:
        raise InvalidCard('Card data is required for credit card payments.')
    number = card.number.replace(' ', '')
    expired = (card.expiry_year, card.expiry_month) < (today.year, today.month)
    if (
        not number.isdigit()
        or not 13 <= len(number) <= 19
        or not passes_luhn(number)
        or not card.cvv.isdigit()
        or not 3 <= len(card.cvv) <= 4
        or not 1 <= card.expiry_month <= 12
        or expired
    ):
        raise InvalidCard('Check the card number, expiry and security code.')
    return Card(
        number=number,
        holder_name=card.holder_name,
        expiry_month=card.expiry_month,
        expiry_year=card.expiry_year,
        cvv=card.cvv,
    )


class SimulatedPaymentGateway:
    """Provider stand-in for the academic MVP.

    Pix is approved at once, cash stays pending until the order is
    handed over, and cards are approved unless they end in ``0002``,
    the conventional test number for a declined card.
    """

    def charge(
        self, amount: Decimal, method: PaymentMethod, card: Card | None
    ) -> PaymentResult:
        """Simulate the charge of ``amount`` with ``method``."""
        if method is PaymentMethod.CASH:
            return PaymentResult(PaymentStatus.PENDING, 'CASH')
        if method is PaymentMethod.PIX:
            return PaymentResult(
                PaymentStatus.APPROVED, f'PIX-{uuid4().hex[:12].upper()}'
            )
        valid = validate_card(card, date.today())
        if valid.number.endswith(DECLINED_TEST_CARD_SUFFIX):
            raise PaymentDeclined('The card issuer refused the payment.')
        return PaymentResult(
            PaymentStatus.APPROVED, f'CARD-****{valid.number[-4:]}'
        )


def get_payment_gateway() -> PaymentGateway:
    """Return the gateway used by checkout; overridable in tests."""
    return SimulatedPaymentGateway()
