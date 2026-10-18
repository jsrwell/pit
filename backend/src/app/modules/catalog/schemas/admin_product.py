"""Product as seen by the administrator, including inactive ones."""

from datetime import datetime

from app.modules.catalog.schemas.product_detail import ProductDetail


class AdminProduct(ProductDetail):
    """Full product data plus publication state and audit dates."""

    is_active: bool
    created_at: datetime
    updated_at: datetime
