"""Sign-in response."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

from app.modules.accounts.schemas.account_read import AccountRead


class SessionToken(BaseModel):
    """Bearer token, its expiry and the account it belongs to."""

    access_token: str
    token_type: Literal['bearer'] = 'bearer'
    expires_at: datetime
    account: AccountRead
