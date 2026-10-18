"""Use case: guarantee the configured administrator account exists."""

from sqlalchemy.orm import Session

from app.modules.accounts.models.role import Role
from app.modules.accounts.models.user import User
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.accounts.services.password_hashing import hash_password
from app.modules.accounts.services.password_policy import (
    enforce_password_policy,
)
from app.shared.config.settings import AdminSettings

ADMIN_PHONE_PLACEHOLDER = '0000000000'


def ensure_admin(session: Session, admin: AdminSettings) -> bool:
    """Create the administrator from settings when it does not exist.

    An existing account with the same e-mail is promoted to
    administrator, keeping its password.

    Returns:
        Whether an account was created or promoted.
    """
    if not admin.email or not admin.password:
        return False
    users = UserRepository(session)
    existing = users.get_by_email(admin.email)
    if existing is not None:
        if existing.role == Role.ADMIN:
            return False
        existing.role = Role.ADMIN
        return True
    enforce_password_policy(admin.password)
    users.add(
        User(
            name=admin.name,
            email=admin.email.lower(),
            phone=ADMIN_PHONE_PLACEHOLDER,
            password_hash=hash_password(admin.password),
            role=Role.ADMIN,
        )
    )
    return True
