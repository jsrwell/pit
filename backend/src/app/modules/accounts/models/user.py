"""Person who signs in to buy or to run the store."""

from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base
from app.shared.database.timestamps import TimestampMixin


class User(TimestampMixin, Base):
    """Customer or administrator account."""

    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(254), unique=True)
    phone: Mapped[str] = mapped_column(String(20))
    password_hash: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(20), server_default='customer')
    failed_login_attempts: Mapped[int] = mapped_column(server_default='0')
    locked_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    @property
    def is_deleted(self) -> bool:
        """Tell whether the customer deleted the account."""
        return self.deleted_at is not None
