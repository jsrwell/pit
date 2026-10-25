"""Use case: the customer corrects name, e-mail and phone."""

from sqlalchemy.orm import Session

from app.modules.accounts.errors.email_already_registered import (
    EmailAlreadyRegistered,
)
from app.modules.accounts.models.user import User
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.accounts.services.get_account import get_account


def update_account(
    session: Session, user_id: int, *, name: str, email: str, phone: str
) -> User:
    """Replace the contact data of the signed-in account.

    Raises:
        AuthenticationRequired: The account no longer exists.
        EmailAlreadyRegistered: Another account already uses the e-mail.
    """
    users = UserRepository(session)
    user = get_account(session, user_id)
    normalized_email = email.lower()
    owner = users.get_by_email(normalized_email)
    if owner is not None and owner.id != user.id:
        raise EmailAlreadyRegistered(
            'An account with this e-mail already exists.'
        )
    user.name = name
    user.email = normalized_email
    user.phone = phone
    return users.save(user)
