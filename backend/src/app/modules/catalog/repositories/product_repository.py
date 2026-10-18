"""Queries and persistence of products."""

from decimal import Decimal

from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.modules.catalog.models.product import Product


class ProductRepository:
    """Reads and writes ``Product`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_active(
        self,
        *,
        category_id: int | None = None,
        flavor_id: int | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        search: str | None = None,
    ) -> list[Product]:
        """Return active products matching every given criterion.

        Featured products come first, then the rest ordered by name.
        """
        statement = select(Product).where(Product.is_active)
        if category_id is not None:
            statement = statement.where(Product.category_id == category_id)
        if flavor_id is not None:
            statement = statement.where(Product.flavor_id == flavor_id)
        if min_price is not None:
            statement = statement.where(Product.price >= min_price)
        if max_price is not None:
            statement = statement.where(Product.price <= max_price)
        if search and search.strip():
            statement = statement.where(
                Product.name.ilike(f'%{search.strip()}%')
            )
        statement = statement.order_by(
            Product.is_featured.desc(), Product.name
        )
        return list(self.session.scalars(statement))

    def list_all(self) -> list[Product]:
        """Return every product, active or not, ordered by name."""
        statement = select(Product).order_by(Product.name)
        return list(self.session.scalars(statement))

    def get(self, product_id: int) -> Product | None:
        """Return the product with ``product_id``, if any."""
        return self.session.get(Product, product_id)

    def has_any(self) -> bool:
        """Tell whether the catalog holds at least one product."""
        return bool(self.session.scalar(select(exists().select_from(Product))))

    def add(self, product: Product) -> Product:
        """Persist a new product and return it with its id."""
        self.session.add(product)
        self.session.flush()
        return product
