"""Routes that keep the delivery addresses of the signed-in customer."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.modules.accounts.errors.address_not_found import AddressNotFound
from app.modules.accounts.schemas.address_input import AddressInput
from app.modules.accounts.schemas.address_read import AddressRead
from app.modules.accounts.services.manage_addresses import (
    add_address,
    delete_address,
    list_addresses,
    make_primary,
    update_address,
)
from app.shared.database.session import get_session
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/accounts/me/addresses', tags=['Accounts'])

DbSession = Annotated[Session, Depends(get_session)]


@router.get('', responses=problem_responses(AuthenticationRequired))
def read_addresses(
    principal: CurrentPrincipal, session: DbSession
) -> list[AddressRead]:
    """List the customer's addresses, primary first."""
    return [
        AddressRead.model_validate(address)
        for address in list_addresses(session, principal.user_id)
    ]


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(AuthenticationRequired),
)
def create_address(
    data: AddressInput, principal: CurrentPrincipal, session: DbSession
) -> AddressRead:
    """Register a new address; the first one becomes the primary."""
    return AddressRead.model_validate(
        add_address(session, principal.user_id, data)
    )


@router.put(
    '/{address_id}',
    responses=problem_responses(AddressNotFound, AuthenticationRequired),
)
def edit_address(
    address_id: int,
    data: AddressInput,
    principal: CurrentPrincipal,
    session: DbSession,
) -> AddressRead:
    """Replace the data of an address."""
    return AddressRead.model_validate(
        update_address(session, principal.user_id, address_id, data)
    )


@router.post(
    '/{address_id}/primary',
    responses=problem_responses(AddressNotFound, AuthenticationRequired),
)
def choose_primary(
    address_id: int, principal: CurrentPrincipal, session: DbSession
) -> AddressRead:
    """Make an address the primary one."""
    return AddressRead.model_validate(
        make_primary(session, principal.user_id, address_id)
    )


@router.delete(
    '/{address_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=problem_responses(AddressNotFound, AuthenticationRequired),
)
def remove_address(
    address_id: int, principal: CurrentPrincipal, session: DbSession
) -> None:
    """Delete an address."""
    delete_address(session, principal.user_id, address_id)
