"""Queries and persistence of categories and flavors."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.catalog.models.category import Category
from app.modules.catalog.models.flavor import Flavor


class ClassificationRepository[Model: (Category, Flavor)]:
    """Reads and writes one classification table, by display name."""

    def __init__(self, session: Session, model: type[Model]) -> None:
        self.session = session
        self.model = model

    def list_all(self) -> list[Model]:
        """Return every entry ordered by name."""
        statement = select(self.model).order_by(self.model.name)
        return list(self.session.scalars(statement))

    def get(self, entry_id: int) -> Model | None:
        """Return the entry with ``entry_id``, if any."""
        return self.session.get(self.model, entry_id)

    def get_or_create(self, name: str) -> Model:
        """Return the entry named ``name``, creating it when missing."""
        statement = select(self.model).where(self.model.name == name)
        entry = self.session.scalars(statement).first()
        if entry is None:
            entry = self.model(name=name)
            self.session.add(entry)
            self.session.flush()
        return entry
