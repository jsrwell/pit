"""Binary image of a product, stored in the database.

Keeping the bytes in PostgreSQL avoids depending on a persistent disk,
which free container hosts do not offer.
"""

from datetime import datetime

from sqlalchemy import DateTime, LargeBinary, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class ProductImage(Base):
    """Immutable image content, served by its id."""

    __tablename__ = 'product_images'

    id: Mapped[int] = mapped_column(primary_key=True)
    content_type: Mapped[str] = mapped_column(String(50))
    data: Mapped[bytes] = mapped_column(LargeBinary)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
