"""Error raised when signing up with an e-mail already in use."""

from app.shared.errors.domain_error import DomainError


class EmailAlreadyRegistered(DomainError):
    """Another account already uses this e-mail."""

    code = 'CS-ACC-0001'
    status = 409
    title = 'E-mail already registered'
