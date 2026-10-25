"""Request to replace the password of the signed-in account."""

from pydantic import BaseModel, Field


class PasswordChange(BaseModel):
    """Current password, as proof, and the new one."""

    current_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=1, max_length=72)
