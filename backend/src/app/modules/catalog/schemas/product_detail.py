"""Product as shown on its detail page."""

from pydantic import field_validator

from app.modules.catalog.schemas.product_summary import ProductSummary


class ProductDetail(ProductSummary):
    """Storefront card data plus description, composition and highlights."""

    description: str
    composition: str
    highlights: list[str]

    @field_validator('highlights', mode='before')
    @classmethod
    def split_lines(cls, value: object) -> object:
        """Turn the stored one-per-line text into a list of highlights."""
        if isinstance(value, str):
            return [
                line.strip() for line in value.splitlines() if line.strip()
            ]
        return value
