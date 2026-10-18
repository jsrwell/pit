"""Storefront routes of the product catalog."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.modules.catalog.errors.invalid_price_range import InvalidPriceRange
from app.modules.catalog.schemas.product_filters import ProductFilters
from app.modules.catalog.schemas.product_summary import ProductSummary
from app.modules.catalog.services.list_storefront_products import (
    list_storefront_products,
)
from app.shared.database.session import get_session
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/catalog/products', tags=['Catalog'])


@router.get('', responses=problem_responses(InvalidPriceRange))
def list_products(
    filters: Annotated[ProductFilters, Query()],
    session: Annotated[Session, Depends(get_session)],
) -> list[ProductSummary]:
    """List the storefront products matching the filters."""
    products = list_storefront_products(session, filters)
    return [ProductSummary.model_validate(product) for product in products]
