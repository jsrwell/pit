"""Data sent to create a customer account."""

from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, StringConstraints

Name = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)
]
Phone = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True, pattern=r'^\+?[\d\s().-]{10,20}$'
    ),
]


class AccountRegistration(BaseModel):
    """Name, e-mail, phone and password of a new customer."""

    name: Name
    email: EmailStr
    phone: Phone
    password: str = Field(min_length=1, max_length=72)
