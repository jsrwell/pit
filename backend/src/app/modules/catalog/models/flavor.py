"""Main flavor of a product, used as a filter on the storefront."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class Flavor(Base):
    """Predominant flavor of a cupcake."""

    __tablename__ = 'flavors'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60), unique=True)
