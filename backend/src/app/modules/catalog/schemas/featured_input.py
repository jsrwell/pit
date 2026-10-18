"""Featured switch sent by the administrator."""

from pydantic import BaseModel


class FeaturedInput(BaseModel):
    """Whether the product is highlighted on the storefront."""

    is_featured: bool
