"""Queries and persistence of discount coupons."""

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.promotions.errors.coupon_code_taken import CouponCodeTaken
from app.modules.promotions.models.coupon import Coupon


class CouponRepository:
    """Reads and writes ``Coupon`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_all(self) -> list[Coupon]:
        """Return every coupon, the most recent start first."""
        statement = select(Coupon).order_by(
            Coupon.starts_at.desc(), Coupon.id.desc()
        )
        return list(self.session.scalars(statement))

    def get(self, coupon_id: int) -> Coupon | None:
        """Return the coupon with ``coupon_id``, if any."""
        return self.session.get(Coupon, coupon_id)

    def get_by_code(self, code: str) -> Coupon | None:
        """Return the coupon with ``code``, compared case-insensitively."""
        statement = select(Coupon).where(Coupon.code == code.upper())
        return self.session.scalars(statement).first()

    def save(self, coupon: Coupon) -> Coupon:
        """Persist a coupon, translating a code clash."""
        try:
            with self.session.begin_nested():
                self.session.add(coupon)
                self.session.flush()
        except IntegrityError as error:
            raise CouponCodeTaken(
                f'Another coupon already uses the code {coupon.code}.'
            ) from error
        return coupon

    def remove(self, coupon: Coupon) -> None:
        """Delete a coupon."""
        self.session.delete(coupon)
        self.session.flush()
