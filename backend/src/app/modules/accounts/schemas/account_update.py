"""Personal data changed by the signed-in customer."""

from pydantic import BaseModel, EmailStr, Field

from app.modules.accounts.schemas.contact_fields import Name, Phone


class AccountUpdate(BaseModel):
    """Name, e-mail and phone, with the same rules as the sign-up."""

    name: Name
    email: EmailStr = Field(max_length=254)
    phone: Phone
