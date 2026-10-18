"""Error raised when e-mail and password do not match an account."""

from app.shared.errors.domain_error import DomainError


class InvalidCredentials(DomainError):
    """The e-mail or the password is wrong.

    The failed attempt counter is persisted even though the request
    fails, hence ``keeps_changes``.
    """

    code = 'CS-ACC-0003'
    status = 401
    title = 'Invalid credentials'
    keeps_changes = True
