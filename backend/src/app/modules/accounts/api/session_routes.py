"""Route that signs a customer or administrator in."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.modules.accounts.errors.account_locked import AccountLocked
from app.modules.accounts.errors.invalid_credentials import InvalidCredentials
from app.modules.accounts.schemas.account_read import AccountRead
from app.modules.accounts.schemas.credentials import Credentials
from app.modules.accounts.schemas.session_token import SessionToken
from app.modules.accounts.services.authenticate import authenticate
from app.shared.config.settings import Settings, get_settings
from app.shared.database.session import get_session
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/accounts/sessions', tags=['Accounts'])


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(InvalidCredentials, AccountLocked),
)
def create_session(
    credentials: Credentials,
    session: Annotated[Session, Depends(get_session)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> SessionToken:
    """Exchange e-mail and password for an expiring access token."""
    signed_in = authenticate(
        session,
        email=credentials.email,
        password=credentials.password,
        auth=settings.auth,
    )
    return SessionToken(
        access_token=signed_in.token.value,
        expires_at=signed_in.token.expires_at,
        account=AccountRead.model_validate(signed_in.user),
    )
