"""Error raised when a delivery order has no address."""

from app.shared.errors.domain_error import DomainError


class AddressRequired(DomainError):
    """Delivery needs one of the customer's registered addresses."""

    code = 'CS-ORD-0001'
    status = 422
    title = 'Delivery address required'
