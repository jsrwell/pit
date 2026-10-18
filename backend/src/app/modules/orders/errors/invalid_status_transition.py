"""Error raised when an order skips or reverses its flow."""

from app.shared.errors.domain_error import DomainError


class InvalidStatusTransition(DomainError):
    """The requested status does not follow from the current one."""

    code = 'CS-ORD-0007'
    status = 409
    title = 'Invalid status transition'
