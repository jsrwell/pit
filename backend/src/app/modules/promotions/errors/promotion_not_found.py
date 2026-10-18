"""Error raised when a promotion does not exist."""

from app.shared.errors.domain_error import DomainError


class PromotionNotFound(DomainError):
    """No promotion matches the requested id."""

    code = 'CS-PRM-0002'
    status = 404
    title = 'Promotion not found'
