"""Error answered when a protected route lacks a valid session."""

from app.shared.errors.domain_error import DomainError


class AuthenticationRequired(DomainError):
    """The access token is missing, invalid or expired."""

    code = 'CS-SYS-0005'
    status = 401
    title = 'Authentication required'
