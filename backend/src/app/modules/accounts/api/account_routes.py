"""Routes that create and read customer accounts."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.modules.accounts.errors.account_has_open_orders import (
    AccountHasOpenOrders,
)
from app.modules.accounts.errors.email_already_registered import (
    EmailAlreadyRegistered,
)
from app.modules.accounts.errors.weak_password import WeakPassword
from app.modules.accounts.errors.wrong_current_password import (
    WrongCurrentPassword,
)
from app.modules.accounts.schemas.account_read import AccountRead
from app.modules.accounts.schemas.account_registration import (
    AccountRegistration,
)
from app.modules.accounts.schemas.account_update import AccountUpdate
from app.modules.accounts.schemas.password_change import PasswordChange
from app.modules.accounts.services.change_password import change_password
from app.modules.accounts.services.delete_account import delete_account
from app.modules.accounts.services.get_account import get_account
from app.modules.accounts.services.register_customer import register_customer
from app.modules.accounts.services.update_account import update_account
from app.modules.orders.services.customer_orders import has_open_orders
from app.shared.database.session import get_session
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.errors.invalid_request import InvalidRequest
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/accounts', tags=['Accounts'])


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(
        EmailAlreadyRegistered, WeakPassword, InvalidRequest
    ),
)
def create_account(
    registration: AccountRegistration,
    session: Annotated[Session, Depends(get_session)],
) -> AccountRead:
    """Sign up a new customer."""
    user = register_customer(session, **registration.model_dump())
    return AccountRead.model_validate(user)


@router.get('/me', responses=problem_responses(AuthenticationRequired))
def read_my_account(
    principal: CurrentPrincipal,
    session: Annotated[Session, Depends(get_session)],
) -> AccountRead:
    """Show the account of the signed-in caller."""
    return AccountRead.model_validate(get_account(session, principal.user_id))


@router.put(
    '/me',
    responses=problem_responses(
        EmailAlreadyRegistered, InvalidRequest, AuthenticationRequired
    ),
)
def edit_my_account(
    data: AccountUpdate,
    principal: CurrentPrincipal,
    session: Annotated[Session, Depends(get_session)],
) -> AccountRead:
    """Replace name, e-mail and phone of the signed-in caller."""
    user = update_account(session, principal.user_id, **data.model_dump())
    return AccountRead.model_validate(user)


@router.put(
    '/me/password',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=problem_responses(
        WrongCurrentPassword,
        WeakPassword,
        InvalidRequest,
        AuthenticationRequired,
    ),
)
def replace_my_password(
    data: PasswordChange,
    principal: CurrentPrincipal,
    session: Annotated[Session, Depends(get_session)],
) -> None:
    """Change the password after confirming the current one."""
    change_password(session, principal.user_id, **data.model_dump())


@router.delete(
    '/me',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=problem_responses(
        AccountHasOpenOrders, AccessDenied, AuthenticationRequired
    ),
)
def delete_my_account(
    principal: CurrentPrincipal,
    session: Annotated[Session, Depends(get_session)],
) -> None:
    """Delete the caller's account, keeping its orders for the store.

    The orders module tells whether some order is still running, which
    keeps ``accounts`` free of a dependency on ``orders`` services.
    """
    delete_account(
        session,
        principal.user_id,
        has_open_orders=has_open_orders(session, principal.user_id),
    )
