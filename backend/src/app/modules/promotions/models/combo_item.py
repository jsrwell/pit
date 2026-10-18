"""Product and quantity that make up a combo."""

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class ComboItem(Base):
    """Units of a product required by a combo."""

    __tablename__ = 'combo_items'

    id: Mapped[int] = mapped_column(primary_key=True)
    combo_id: Mapped[int] = mapped_column(
        ForeignKey('combos.id', ondelete='CASCADE'), index=True
    )
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'))
    quantity: Mapped[int]
