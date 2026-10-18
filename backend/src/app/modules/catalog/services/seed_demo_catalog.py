"""Use case: fill an empty catalog with the demo products."""

from sqlalchemy.orm import Session

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
from app.modules.catalog.services.cupcake_illustration import (
    SVG_CONTENT_TYPE,
    render_cupcake,
)
from app.modules.catalog.services.demo_catalog import DEMO_PRODUCTS


def seed_demo_catalog(session: Session) -> int:
    """Insert the demo products when the catalog is empty.

    Running it again is harmless: a catalog with any product, demo or
    not, is left untouched.

    Returns:
        The number of products inserted.
    """
    products = ProductRepository(session)
    if products.has_any():
        return 0

    categories = ClassificationRepository(session, Category)
    flavors = ClassificationRepository(session, Flavor)
    images = ProductImageRepository(session)
    for demo in DEMO_PRODUCTS:
        image = images.add(SVG_CONTENT_TYPE, render_cupcake(demo.palette))
        products.add(
            Product(
                name=demo.name,
                description=demo.description,
                price=demo.price,
                category=categories.get_or_create(demo.category),
                flavor=flavors.get_or_create(demo.flavor),
                image_id=image.id,
                is_available=demo.available,
                is_featured=demo.featured,
            )
        )
    return len(DEMO_PRODUCTS)
