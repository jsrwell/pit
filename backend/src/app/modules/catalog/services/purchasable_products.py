"""Use cases offered to other modules that sell catalog products."""

from collections.abc import Iterable

from sqlalchemy.orm import Session

from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.errors.product_unavailable import ProductUnavailable
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)


def is_purchasable(product: Product) -> bool:
    """Tell whether ``product`` can be bought right now."""
    return product.is_active and product.is_available


def get_purchasable_product(session: Session, product_id: int) -> Product:
    """Return the product only when it can be bought now.

    Raises:
        ProductNotFound: The product does not exist.
        ProductUnavailable: The product is inactive or unavailable.
    """
    product = ProductRepository(session).get(product_id)
    if product is None:
        raise ProductNotFound(f'No product with id {product_id}.')
    if not is_purchasable(product):
        raise ProductUnavailable(
            f'Product {product_id} cannot be bought right now.'
        )
    return product


def get_products_by_id(
    session: Session, product_ids: Iterable[int]
) -> dict[int, Product]:
    """Return the products with the given ids, in any state, by id."""
    products = ProductRepository(session).list_by_ids(set(product_ids))
    return {product.id: product for product in products}
