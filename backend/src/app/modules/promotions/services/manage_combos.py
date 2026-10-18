"""Use cases: the store keeps its promotional combos."""

from datetime import datetime

from sqlalchemy.orm import Session

from app.modules.promotions.errors.combo_not_found import ComboNotFound
from app.modules.promotions.models.combo import Combo
from app.modules.promotions.models.combo_item import ComboItem
from app.modules.promotions.repositories.combo_repository import (
    ComboRepository,
)
from app.modules.promotions.schemas.combo_schemas import ComboInput
from app.modules.promotions.services.campaign_period import (
    ensure_valid_period,
)


def list_combos(session: Session) -> list[Combo]:
    """Return every combo, the most recent start first."""
    return ComboRepository(session).list_all()


def list_running_combos(session: Session, now: datetime) -> list[Combo]:
    """Return the combos offered at ``now``."""
    return ComboRepository(session).list_running(now)


def save_combo(
    session: Session, data: ComboInput, combo_id: int | None = None
) -> Combo:
    """Create a combo, or replace one when ``combo_id`` is given.

    Raises:
        InvalidPeriod: The combo ends before it starts.
        ComboNotFound: No combo with ``combo_id``.
        PromotedProductNotFound: An item names an unknown product.
    """
    ensure_valid_period(data.starts_at, data.ends_at)
    combo = Combo() if combo_id is None else get_combo(session, combo_id)
    for field, value in data.model_dump(exclude={'items'}).items():
        setattr(combo, field, value)
    combo.items = [
        ComboItem(product_id=item.product_id, quantity=item.quantity)
        for item in data.items
    ]
    return ComboRepository(session).save(combo)


def delete_combo(session: Session, combo_id: int) -> None:
    """Remove a combo; carts stop getting its discount at once."""
    ComboRepository(session).remove(get_combo(session, combo_id))


def get_combo(session: Session, combo_id: int) -> Combo:
    """Return a combo or raise ``ComboNotFound``."""
    combo = ComboRepository(session).get(combo_id)
    if combo is None:
        raise ComboNotFound(f'No combo with id {combo_id}.')
    return combo
