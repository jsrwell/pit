"""Queries and persistence of products."""

from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product


class ProductRepository:
    """Reads and writes ``Product`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_active(self) -> list[Product]:
        """Return active products, featured first, then by name."""
        statement = (
            select(Product)
            .where(Product.is_active)
            .order_by(Product.is_featured.desc(), Product.name)
        )
        return list(self.session.scalars(statement))

    def has_any(self) -> bool:
        """Tell whether the catalog holds at least one product."""
        return bool(self.session.scalar(select(exists().select_from(Product))))

    def add(self, product: Product) -> Product:
        """Persist a new product and return it with its id."""
        self.session.add(product)
        self.session.flush()
        return product
