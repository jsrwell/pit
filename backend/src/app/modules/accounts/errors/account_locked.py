"""Error raised while an account is locked after failed sign-ins."""

from app.shared.errors.domain_error import DomainError


class AccountLocked(DomainError):
    """Too many failed attempts; sign-in is paused for a while."""

    code = 'CS-ACC-0004'
    status = 429
    title = 'Account temporarily locked'
    keeps_changes = True
