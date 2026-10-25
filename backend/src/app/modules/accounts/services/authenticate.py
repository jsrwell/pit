"""Use case: sign in with e-mail and password."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.modules.accounts.errors.account_locked import AccountLocked
from app.modules.accounts.errors.invalid_credentials import InvalidCredentials
from app.modules.accounts.models.user import User
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.accounts.services.password_hashing import verify_password
from app.shared.config.settings import AuthSettings
from app.shared.security.access_token import (
    IssuedToken,
    Principal,
    issue_access_token,
)


@dataclass(frozen=True)
class AuthenticatedSession:
    """Account that signed in and the token it must present."""

    user: User
    token: IssuedToken


def authenticate(
    session: Session, *, email: str, password: str, auth: AuthSettings
) -> AuthenticatedSession:
    """Check the credentials and issue an access token.

    After ``auth.max_failed_attempts`` wrong passwords in a row the
    account is locked for ``auth.lockout_minutes``, even for the right
    password.

    Raises:
        InvalidCredentials: Unknown e-mail, deleted account or wrong
            password.
        AccountLocked: The account is inside its lockout window.
    """
    user = UserRepository(session).get_by_email(email)
    if user is None or user.is_deleted:
        raise InvalidCredentials('E-mail or password is incorrect.')

    now = datetime.now(UTC)
    if user.locked_until is not None and user.locked_until > now:
        raise AccountLocked('Too many failed attempts; try again later.')

    if not verify_password(password, user.password_hash):
        register_failure(user, now, auth)
        raise InvalidCredentials('E-mail or password is incorrect.')

    user.failed_login_attempts = 0
    user.locked_until = None
    principal = Principal(user_id=user.id, role=user.role)
    return AuthenticatedSession(user, issue_access_token(principal, auth))


def register_failure(user: User, now: datetime, auth: AuthSettings) -> None:
    """Count a wrong password and lock the account at the threshold."""
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= auth.max_failed_attempts:
        user.failed_login_attempts = 0
        user.locked_until = now + timedelta(minutes=auth.lockout_minutes)
