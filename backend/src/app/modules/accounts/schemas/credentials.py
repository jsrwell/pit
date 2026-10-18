"""Sign-in request."""

from pydantic import BaseModel, EmailStr, Field


class Credentials(BaseModel):
    """E-mail and password typed by the customer."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)
