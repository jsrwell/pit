"""Record of each status an order went through."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class OrderStatusChange(Base):
    """Status reached by an order and when it happened."""

    __tablename__ = 'order_status_changes'

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey('orders.id', ondelete='CASCADE'), index=True
    )
    status: Mapped[str] = mapped_column(String(30))
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
