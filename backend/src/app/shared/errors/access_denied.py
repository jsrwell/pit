"""Error answered when the signed-in account lacks the needed role."""

from app.shared.errors.domain_error import DomainError


class AccessDenied(DomainError):
    """The account is authenticated but not allowed to do this."""

    code = 'CS-SYS-0006'
    status = 403
    title = 'Access denied'
