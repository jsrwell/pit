"""Use case: sign up a new customer."""

from sqlalchemy.orm import Session

from app.modules.accounts.errors.email_already_registered import (
    EmailAlreadyRegistered,
)
from app.modules.accounts.models.role import Role
from app.modules.accounts.models.user import User
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.accounts.services.password_hashing import hash_password
from app.modules.accounts.services.password_policy import (
    enforce_password_policy,
)


def register_customer(
    session: Session, *, name: str, email: str, phone: str, password: str
) -> User:
    """Create a customer account with a hashed password.

    Raises:
        WeakPassword: The password fails the minimum policy.
        EmailAlreadyRegistered: The e-mail belongs to another account.
    """
    enforce_password_policy(password)
    users = UserRepository(session)
    normalized_email = email.lower()
    if users.get_by_email(normalized_email) is not None:
        raise EmailAlreadyRegistered(
            'An account with this e-mail already exists.'
        )
    return users.add(
        User(
            name=name,
            email=normalized_email,
            phone=phone,
            password_hash=hash_password(password),
            role=Role.CUSTOMER,
        )
    )
