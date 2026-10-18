"""Cupcake offered by the store."""

from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor
from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Product(TimestampMixin, Base):
    """Catalog entry with its price, flags and classification."""

    __tablename__ = 'products'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    composition: Mapped[str] = mapped_column(Text, server_default='')
    highlights: Mapped[str] = mapped_column(Text, server_default='')
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'))
    flavor_id: Mapped[int] = mapped_column(ForeignKey('flavors.id'))
    image_id: Mapped[int | None] = mapped_column(
        ForeignKey('product_images.id')
    )
    is_active: Mapped[bool] = mapped_column(server_default=true())
    is_available: Mapped[bool] = mapped_column(server_default=true())
    show_when_unavailable: Mapped[bool] = mapped_column(server_default=true())
    is_featured: Mapped[bool] = mapped_column(server_default='false')

    category: Mapped[Category] = relationship(lazy='joined')
    flavor: Mapped[Flavor] = relationship(lazy='joined')
