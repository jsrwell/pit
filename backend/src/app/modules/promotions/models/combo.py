"""Promotional combination of products sold for a closed price."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String, Text, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.promotions.models.combo_item import ComboItem
from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Combo(TimestampMixin, Base):
    """Set of products that costs ``price`` when bought together."""

    __tablename__ = 'combos'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text, server_default='')
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(server_default=true())

    items: Mapped[list[ComboItem]] = relationship(
        cascade='all, delete-orphan', lazy='selectin', order_by=ComboItem.id
    )
