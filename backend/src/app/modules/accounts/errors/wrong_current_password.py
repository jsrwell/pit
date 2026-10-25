"""Error raised when the current password typed to change it is wrong."""

from app.shared.errors.domain_error import DomainError


class WrongCurrentPassword(DomainError):
    """The password confirming the change does not match the account."""

    code = 'CS-ACC-0006'
    status = 422
    title = 'Wrong current password'
