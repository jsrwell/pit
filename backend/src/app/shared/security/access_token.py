"""Signed, expiring access tokens that identify the caller."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import jwt

from app.shared.config.settings import AuthSettings
from app.shared.errors.authentication_required import AuthenticationRequired

ALGORITHM = 'HS256'
ADMIN_ROLE = 'admin'


@dataclass(frozen=True)
class Principal:
    """Account behind a request, as asserted by its access token."""

    user_id: int
    role: str

    @property
    def is_admin(self) -> bool:
        """Tell whether the account runs the store."""
        return self.role == ADMIN_ROLE


@dataclass(frozen=True)
class IssuedToken:
    """Access token and the moment it stops being accepted."""

    value: str
    expires_at: datetime


def issue_access_token(
    principal: Principal, auth: AuthSettings
) -> IssuedToken:
    """Sign a token for ``principal`` valid for the configured minutes."""
    expires_at = datetime.now(UTC) + timedelta(
        minutes=auth.access_token_minutes
    )
    claims = {
        'sub': str(principal.user_id),
        'role': principal.role,
        'exp': expires_at,
    }
    value = jwt.encode(claims, auth.secret_key, algorithm=ALGORITHM)
    return IssuedToken(value=value, expires_at=expires_at)


def read_access_token(token: str, auth: AuthSettings) -> Principal:
    """Validate ``token`` and return its principal.

    Raises:
        AuthenticationRequired: The token is malformed, forged or expired.
    """
    try:
        claims = jwt.decode(token, auth.secret_key, algorithms=[ALGORITHM])
        return Principal(user_id=int(claims['sub']), role=str(claims['role']))
    except jwt.ExpiredSignatureError as error:
        raise AuthenticationRequired(
            'The session expired; sign in again.'
        ) from error
    except (jwt.InvalidTokenError, KeyError, ValueError) as error:
        raise AuthenticationRequired('The access token is invalid.') from error
