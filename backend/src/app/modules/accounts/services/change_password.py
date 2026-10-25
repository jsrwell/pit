"""Use case: the customer replaces the password."""

from sqlalchemy.orm import Session

from app.modules.accounts.errors.wrong_current_password import (
    WrongCurrentPassword,
)
from app.modules.accounts.services.get_account import get_account
from app.modules.accounts.services.password_hashing import (
    hash_password,
    verify_password,
)
from app.modules.accounts.services.password_policy import (
    enforce_password_policy,
)


def change_password(
    session: Session,
    user_id: int,
    *,
    current_password: str,
    new_password: str,
) -> None:
    """Store a new password after checking the current one.

    Raises:
        AuthenticationRequired: The account no longer exists.
        WrongCurrentPassword: The current password does not match.
        WeakPassword: The new password fails the minimum policy.
    """
    user = get_account(session, user_id)
    if not verify_password(current_password, user.password_hash):
        raise WrongCurrentPassword('The current password is incorrect.')
    enforce_password_policy(new_password)
    user.password_hash = hash_password(new_password)
    session.flush()
