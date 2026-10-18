"""Routes that list the categories and flavors used as filters."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.catalog.schemas.named_item import NamedItem
from app.modules.catalog.services.list_classifications import (
    list_categories,
    list_flavors,
)
from app.shared.database.session import get_session
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/catalog', tags=['Catalog'])


@router.get('/categories', responses=problem_responses())
def read_categories(
    session: Annotated[Session, Depends(get_session)],
) -> list[NamedItem]:
    """List every product category."""
    return [
        NamedItem.model_validate(item) for item in list_categories(session)
    ]


@router.get('/flavors', responses=problem_responses())
def read_flavors(
    session: Annotated[Session, Depends(get_session)],
) -> list[NamedItem]:
    """List every product flavor."""
    return [NamedItem.model_validate(item) for item in list_flavors(session)]
