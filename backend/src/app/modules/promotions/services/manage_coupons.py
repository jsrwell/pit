"""Use cases: the store keeps its discount coupons."""

from sqlalchemy.orm import Session

from app.modules.promotions.errors.coupon_not_found import CouponNotFound
from app.modules.promotions.models.coupon import Coupon
from app.modules.promotions.repositories.coupon_repository import (
    CouponRepository,
)
from app.modules.promotions.schemas.coupon_schemas import CouponInput
from app.modules.promotions.services.campaign_period import (
    ensure_valid_period,
)


def list_coupons(session: Session) -> list[Coupon]:
    """Return every coupon, the most recent start first."""
    return CouponRepository(session).list_all()


def save_coupon(
    session: Session, data: CouponInput, coupon_id: int | None = None
) -> Coupon:
    """Create a coupon, or replace one when ``coupon_id`` is given.

    Raises:
        InvalidPeriod: The coupon ends before it starts.
        CouponNotFound: No coupon with ``coupon_id``.
        CouponCodeTaken: Another coupon already uses the code.
    """
    ensure_valid_period(data.starts_at, data.ends_at)
    coupon = Coupon() if coupon_id is None else get_coupon(session, coupon_id)
    for field, value in data.model_dump().items():
        setattr(coupon, field, value)
    return CouponRepository(session).save(coupon)


def set_coupon_active(
    session: Session, coupon_id: int, is_active: bool
) -> Coupon:
    """Enable or disable a coupon without touching its other data."""
    coupon = get_coupon(session, coupon_id)
    coupon.is_active = is_active
    session.flush()
    return coupon


def delete_coupon(session: Session, coupon_id: int) -> None:
    """Remove a coupon; orders that used it keep code and discount."""
    CouponRepository(session).remove(get_coupon(session, coupon_id))


def get_coupon(session: Session, coupon_id: int) -> Coupon:
    """Return a coupon or raise ``CouponNotFound``."""
    coupon = CouponRepository(session).get(coupon_id)
    if coupon is None:
        raise CouponNotFound(f'No coupon with id {coupon_id}.')
    return coupon
