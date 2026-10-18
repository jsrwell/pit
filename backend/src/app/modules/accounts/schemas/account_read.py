"""Public view of an account."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AccountRead(BaseModel):
    """Account data safe to send back, without the password hash."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str
    role: str
    created_at: datetime
