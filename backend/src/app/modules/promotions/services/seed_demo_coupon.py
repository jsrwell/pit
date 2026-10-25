"""Use case: offer a welcome coupon on demo environments."""

from datetime import timedelta

from sqlalchemy.orm import Session

from app.modules.promotions.models.coupon import Coupon
from app.modules.promotions.repositories.coupon_repository import (
    CouponRepository,
)
from app.shared.clock import utc_now

DEMO_COUPON_CODE = 'BEMVINDO10'
DEMO_COUPON_PERCENT = 10
DEMO_COUPON_DAYS = 365


def seed_demo_coupon(session: Session) -> bool:
    """Create the welcome coupon when no coupon uses its code yet.

    Returns:
        Whether the coupon was created.
    """
    coupons = CouponRepository(session)
    if coupons.get_by_code(DEMO_COUPON_CODE) is not None:
        return False
    now = utc_now()
    coupons.save(
        Coupon(
            code=DEMO_COUPON_CODE,
            discount_percent=DEMO_COUPON_PERCENT,
            starts_at=now - timedelta(days=1),
            ends_at=now + timedelta(days=DEMO_COUPON_DAYS),
        )
    )
    return True
