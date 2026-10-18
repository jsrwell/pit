"""Route dependencies that require a signed-in account."""

from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.shared.config.settings import Settings, get_settings
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.security.access_token import Principal, read_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def current_principal(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
    settings: Annotated[Settings, Depends(get_settings)],
) -> Principal:
    """Return the caller identified by the ``Authorization`` header."""
    if credentials is None:
        raise AuthenticationRequired('Sign in to continue.')
    return read_access_token(credentials.credentials, settings.auth)


def admin_principal(
    principal: Annotated[Principal, Depends(current_principal)],
) -> Principal:
    """Return the caller only when it is a store administrator."""
    if not principal.is_admin:
        raise AccessDenied('Only administrators can do this.')
    return principal


CurrentPrincipal = Annotated[Principal, Depends(current_principal)]
AdminPrincipal = Annotated[Principal, Depends(admin_principal)]
