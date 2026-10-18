"""Error raised when a campaign ends before it starts."""

from app.shared.errors.domain_error import DomainError


class InvalidPeriod(DomainError):
    """The end of the period must come after its start."""

    code = 'CS-PRM-0001'
    status = 422
    title = 'Invalid period'
