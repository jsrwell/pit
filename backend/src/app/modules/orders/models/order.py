"""Order placed by a customer."""

from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.orders.models.order_item import OrderItem
from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Order(TimestampMixin, Base):
    """Purchase with its prices, fulfillment and payment frozen in time."""

    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    status: Mapped[str] = mapped_column(String(30), index=True)
    fulfillment_method: Mapped[str] = mapped_column(String(20))
    delivery_address: Mapped[str | None] = mapped_column(Text)
    delivery_reference: Mapped[str | None] = mapped_column(String(120))
    payment_method: Mapped[str] = mapped_column(String(20))
    payment_status: Mapped[str] = mapped_column(String(20))
    payment_reference: Mapped[str] = mapped_column(String(40))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    delivery_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    notes: Mapped[str] = mapped_column(Text, server_default='')

    items: Mapped[list[OrderItem]] = relationship(
        cascade='all, delete-orphan', lazy='selectin', order_by=OrderItem.id
    )
