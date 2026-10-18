"""Error raised when an address does not belong to the customer."""

from app.shared.errors.domain_error import DomainError


class AddressNotFound(DomainError):
    """No address with this id among the customer's addresses."""

    code = 'CS-ACC-0005'
    status = 404
    title = 'Address not found'
