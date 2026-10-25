"""Use case offered to orders: the discount granted by a coupon."""

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal

from sqlalchemy.orm import Session

from app.modules.promotions.errors.coupon_not_applicable import (
    CouponNotApplicable,
)
from app.modules.promotions.repositories.coupon_repository import (
    CouponRepository,
)
from app.modules.promotions.services.campaign_period import is_running
from app.shared.clock import utc_now

CENT = Decimal('0.01')


@dataclass(frozen=True)
class AppliedCoupon:
    """Code of the coupon used and the amount it takes off."""

    code: str
    discount: Decimal


def apply_coupon(
    session: Session, code: str, items_total: Decimal
) -> AppliedCoupon:
    """Return the discount of the coupon ``code`` over ``items_total``.

    The code is compared ignoring letter case and the percentage is
    rounded to the cent. Only enabled coupons inside their period count.

    Raises:
        CouponNotApplicable: Unknown, disabled or out-of-period coupon.
    """
    typed = code.strip().upper()
    coupon = CouponRepository(session).get_by_code(typed)
    if coupon is None or not is_running(
        coupon.is_active, coupon.starts_at, coupon.ends_at, utc_now()
    ):
        raise CouponNotApplicable(f'The coupon {typed} cannot be used now.')
    discount = (items_total * coupon.discount_percent / 100).quantize(
        CENT, rounding=ROUND_HALF_UP
    )
    return AppliedCoupon(coupon.code, discount)
