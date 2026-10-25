"""Discount coupon sent and read by the administrator."""

from typing import Annotated

from pydantic import (
    AfterValidator,
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
)

COUPON_CODE_MAX_LENGTH = 30


def normalize_code(code: str) -> str:
    """Return the coupon code in upper case, the stored form."""
    return code.upper()


CouponCode = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=3,
        max_length=COUPON_CODE_MAX_LENGTH,
        pattern=r'^[A-Za-z0-9_-]+$',
    ),
    AfterValidator(normalize_code),
]


class CouponInput(BaseModel):
    """Code, percentage off and period of a coupon."""

    code: CouponCode
    discount_percent: int = Field(ge=1, le=100)
    starts_at: AwareDatetime
    ends_at: AwareDatetime
    is_active: bool = True


class CouponStateInput(BaseModel):
    """Whether customers may use the coupon."""

    is_active: bool


class CouponRead(CouponInput):
    """Stored coupon and whether customers can use it right now."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_running: bool = False
