"""Use cases: create and edit a product from the administration panel."""

from sqlalchemy.orm import Session

from app.modules.catalog.errors.image_not_found import ImageNotFound
from app.modules.catalog.errors.product_incomplete import ProductIncomplete
from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor
from app.modules.catalog.models.product import Product
from app.modules.catalog.repositories.classification_repository import (
    ClassificationRepository,
)
from app.modules.catalog.repositories.product_image_repository import (
    ProductImageRepository,
)
from app.modules.catalog.repositories.product_repository import (
    ProductRepository,
)
from app.modules.catalog.schemas.product_input import ProductInput


def create_product(session: Session, data: ProductInput) -> Product:
    """Register a new product.

    Raises:
        ProductIncomplete: Published without its minimum data.
        ImageNotFound: ``image_id`` does not reference a stored image.
    """
    product = Product()
    apply_input(session, product, data)
    return ProductRepository(session).add(product)


def update_product(
    session: Session, product_id: int, data: ProductInput
) -> Product:
    """Replace every editable field of an existing product.

    Deactivating keeps the row, so orders and history still point to it.

    Raises:
        ProductNotFound: No product with ``product_id``.
        ProductIncomplete: Published without its minimum data.
        ImageNotFound: ``image_id`` does not reference a stored image.
    """
    product = get_any_product(session, product_id)
    apply_input(session, product, data)
    session.flush()
    return product


def get_any_product(session: Session, product_id: int) -> Product:
    """Return a product in any state or raise ``ProductNotFound``."""
    product = ProductRepository(session).get(product_id)
    if product is None:
        raise ProductNotFound(f'No product with id {product_id}.')
    return product


def apply_input(
    session: Session, product: Product, data: ProductInput
) -> None:
    """Validate ``data`` and copy it onto ``product``."""
    highlights = [line.strip() for line in data.highlights if line.strip()]
    if data.is_active:
        ensure_publishable(data)
    if (
        data.image_id is not None
        and ProductImageRepository(session).get(data.image_id) is None
    ):
        raise ImageNotFound(f'No image with id {data.image_id}.')

    product.name = data.name
    product.description = data.description.strip()
    product.composition = data.composition.strip()
    product.highlights = '\n'.join(highlights)
    product.price = data.price
    product.category = ClassificationRepository(
        session, Category
    ).get_or_create(data.category_name)
    product.flavor = ClassificationRepository(session, Flavor).get_or_create(
        data.flavor_name
    )
    product.image_id = data.image_id
    product.is_active = data.is_active
    product.is_available = data.is_available
    product.is_featured = data.is_featured


def ensure_publishable(data: ProductInput) -> None:
    """Require the minimum data a product shows on the storefront."""
    missing = [
        field
        for field, present in (
            ('description', bool(data.description.strip())),
            ('composition', bool(data.composition.strip())),
            ('image', data.image_id is not None),
        )
        if not present
    ]
    if missing:
        raise ProductIncomplete(
            'An active product needs: ' + ', '.join(missing) + '.'
        )
