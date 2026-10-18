"""Error raised when a custom order is due too soon."""

from app.shared.errors.domain_error import DomainError


class LeadTimeTooShort(DomainError):
    """The desired date is earlier than the store's minimum lead time."""

    code = 'CS-ORD-0008'
    status = 422
    title = 'Lead time too short'
