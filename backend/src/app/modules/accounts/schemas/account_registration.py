"""Data sent to create a customer account."""

from pydantic import BaseModel, EmailStr, Field

from app.modules.accounts.schemas.contact_fields import Name, Phone


class AccountRegistration(BaseModel):
    """Name, e-mail, phone and password of a new customer."""

    name: Name
    email: EmailStr = Field(max_length=254)
    phone: Phone
    password: str = Field(min_length=1, max_length=72)
