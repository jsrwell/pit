"""Use case: the customer deletes the own account."""

import secrets

from sqlalchemy.orm import Session

from app.modules.accounts.errors.account_has_open_orders import (
    AccountHasOpenOrders,
)
from app.modules.accounts.models.role import Role
from app.modules.accounts.repositories.address_repository import (
    AddressRepository,
)
from app.modules.accounts.services.get_account import get_account
from app.modules.accounts.services.password_hashing import hash_password
from app.shared.clock import utc_now
from app.shared.errors.access_denied import AccessDenied

DELETED_NAME = 'Conta excluída'
DELETED_EMAIL_DOMAIN = 'deleted.invalid'


def delete_account(
    session: Session, user_id: int, *, has_open_orders: bool
) -> None:
    """Deactivate the account and erase its personal data.

    The row stays so orders and custom orders keep their customer:
    ``deleted_at`` is set, name, e-mail and phone are anonymized, the
    password is replaced by an unknown one and the addresses are removed.

    Args:
        session: Database session of the request.
        user_id: Account of the signed-in customer.
        has_open_orders: Whether some order is neither completed nor
            cancelled, as told by the orders module.

    Raises:
        AuthenticationRequired: The account no longer exists.
        AccessDenied: Administrator accounts cannot delete themselves.
        AccountHasOpenOrders: Some order is still running.
    """
    user = get_account(session, user_id)
    if user.role == Role.ADMIN:
        raise AccessDenied('Administrator accounts cannot be deleted here.')
    if has_open_orders:
        raise AccountHasOpenOrders(
            'Wait until every order is completed or cancelled.'
        )
    AddressRepository(session).remove_all_for(user.id)
    user.deleted_at = utc_now()
    user.name = DELETED_NAME
    user.email = f'deleted-{user.id}@{DELETED_EMAIL_DOMAIN}'
    user.phone = ''
    user.password_hash = hash_password(secrets.token_urlsafe(32))
    session.flush()
