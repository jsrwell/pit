"""Delivery address kept by a customer."""

from sqlalchemy import ForeignKey, String, false
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Address(TimestampMixin, Base):
    """Place where orders can be delivered; one of them is the primary."""

    __tablename__ = 'addresses'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), index=True
    )
    label: Mapped[str] = mapped_column(String(40))
    zip_code: Mapped[str] = mapped_column(String(9))
    street: Mapped[str] = mapped_column(String(120))
    number: Mapped[str] = mapped_column(String(10))
    complement: Mapped[str] = mapped_column(String(60), server_default='')
    district: Mapped[str] = mapped_column(String(60))
    reference: Mapped[str] = mapped_column(String(120), server_default='')
    is_primary: Mapped[bool] = mapped_column(server_default=false())
