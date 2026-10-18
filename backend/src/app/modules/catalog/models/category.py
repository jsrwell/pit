"""Product category, such as classic or vegan cupcakes."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class Category(Base):
    """Groups products for browsing and filtering."""

    __tablename__ = 'categories'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60), unique=True)
