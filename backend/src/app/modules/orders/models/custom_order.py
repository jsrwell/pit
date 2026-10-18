"""Special order request reviewed by the store before confirmation."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class CustomOrder(TimestampMixin, Base):
    """Customized cupcakes for a date, kept apart from regular orders."""

    __tablename__ = 'custom_orders'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    description: Mapped[str] = mapped_column(Text)
    quantity: Mapped[int]
    desired_date: Mapped[date] = mapped_column(Date)
    notes: Mapped[str] = mapped_column(Text, server_default='')
    status: Mapped[str] = mapped_column(String(20), index=True)
    quoted_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    store_response: Mapped[str] = mapped_column(Text, server_default='')
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
