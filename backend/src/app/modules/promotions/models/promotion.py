"""Campaign that sells a product for a lower price during a period."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, true
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class Promotion(TimestampMixin, Base):
    """Promotional price of one product between two instants."""

    __tablename__ = 'promotions'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    product_id: Mapped[int] = mapped_column(
        ForeignKey('products.id'), index=True
    )
    promotional_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(server_default=true())
