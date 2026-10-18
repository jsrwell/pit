"""Error raised when the payment provider refuses the charge."""

from app.shared.errors.domain_error import DomainError


class PaymentDeclined(DomainError):
    """The charge was refused; nothing is ordered."""

    code = 'CS-ORD-0005'
    status = 402
    title = 'Payment declined'
