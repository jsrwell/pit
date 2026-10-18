"""Error raised when a password does not meet the minimum policy."""

from app.shared.errors.domain_error import DomainError


class WeakPassword(DomainError):
    """The password is too short or lacks letters or digits."""

    code = 'CS-ACC-0002'
    status = 422
    title = 'Weak password'
