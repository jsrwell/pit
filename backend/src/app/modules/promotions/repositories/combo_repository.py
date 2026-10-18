"""Queries and persistence of promotional combos."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.promotions.errors.promoted_product_not_found import (
    PromotedProductNotFound,
)
from app.modules.promotions.models.combo import Combo


class ComboRepository:
    """Reads and writes ``Combo`` rows with their items."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_all(self) -> list[Combo]:
        """Return every combo, the most recent start first."""
        statement = select(Combo).order_by(
            Combo.starts_at.desc(), Combo.id.desc()
        )
        return list(self.session.scalars(statement))

    def get(self, combo_id: int) -> Combo | None:
        """Return the combo with ``combo_id``, if any."""
        return self.session.get(Combo, combo_id)

    def list_running(self, now: datetime) -> list[Combo]:
        """Return enabled combos in force at ``now``."""
        statement = (
            select(Combo)
            .where(
                Combo.is_active, Combo.starts_at <= now, Combo.ends_at > now
            )
            .order_by(Combo.name)
        )
        return list(self.session.scalars(statement))

    def save(self, combo: Combo) -> Combo:
        """Persist a combo, translating an unknown product."""
        try:
            with self.session.begin_nested():
                self.session.add(combo)
                self.session.flush()
        except IntegrityError as error:
            raise PromotedProductNotFound(
                'A combo item references an unknown product.'
            ) from error
        return combo

    def remove(self, combo: Combo) -> None:
        """Delete a combo and its items."""
        self.session.delete(combo)
        self.session.flush()
