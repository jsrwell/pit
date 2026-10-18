"""Error raised when a combo does not exist."""

from app.shared.errors.domain_error import DomainError


class ComboNotFound(DomainError):
    """No combo matches the requested id."""

    code = 'CS-PRM-0003'
    status = 404
    title = 'Combo not found'
