"""Code that grants a percentage off the items of an order."""

from datetime import datetime

from sqlalchemy import DateTime, SmallInteger, String, true
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Coupon(TimestampMixin, Base):
    """Discount coupon of a campaign, valid between two instants."""

    __tablename__ = 'coupons'

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True)
    discount_percent: Mapped[int] = mapped_column(SmallInteger)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(server_default=true())
