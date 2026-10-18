"""Product and quantity a customer intends to buy."""

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class CartItem(TimestampMixin, Base):
    """One line of a customer's cart; a product appears once per cart."""

    __tablename__ = 'cart_items'
    __table_args__ = (UniqueConstraint('user_id', 'product_id'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), index=True
    )
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'))
    quantity: Mapped[int]
