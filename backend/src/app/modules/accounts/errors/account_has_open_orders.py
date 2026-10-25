"""Error raised when deleting an account that still has orders running."""

from app.shared.errors.domain_error import DomainError


class AccountHasOpenOrders(DomainError):
    """Orders not yet completed or cancelled keep the account alive."""

    code = 'CS-ACC-0007'
    status = 409
    title = 'Account has open orders'
