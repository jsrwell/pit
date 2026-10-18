"""Routes that create and read customer accounts."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.modules.accounts.errors.email_already_registered import (
    EmailAlreadyRegistered,
)
from app.modules.accounts.errors.weak_password import WeakPassword
from app.modules.accounts.schemas.account_read import AccountRead
from app.modules.accounts.schemas.account_registration import (
    AccountRegistration,
)
from app.modules.accounts.services.register_customer import register_customer
from app.shared.database.session import get_session
from app.shared.errors.invalid_request import InvalidRequest
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
