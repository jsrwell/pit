"""Use cases: list categories and flavors offered as filters."""

from sqlalchemy.orm import Session

from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor
from app.modules.catalog.repositories.classification_repository import (
    ClassificationRepository,
)


def list_categories(session: Session) -> list[Category]:
    """Return every category ordered by name."""
    return ClassificationRepository(session, Category).list_all()


def list_flavors(session: Session) -> list[Flavor]:
    """Return every flavor ordered by name."""
    return ClassificationRepository(session, Flavor).list_all()
