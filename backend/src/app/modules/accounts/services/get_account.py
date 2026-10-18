"""Use case: read the account of the signed-in caller."""

from sqlalchemy.orm import Session

from app.modules.accounts.models.user import User
from app.modules.accounts.repositories.user_repository import UserRepository
from app.shared.errors.authentication_required import AuthenticationRequired


def get_account(session: Session, user_id: int) -> User:
    """Return the account or ask to sign in again if it vanished."""
    user = UserRepository(session).get(user_id)
    if user is None:
        raise AuthenticationRequired('The account no longer exists.')
    return user
