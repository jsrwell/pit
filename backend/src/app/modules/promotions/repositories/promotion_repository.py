"""Queries and persistence of promotional campaigns."""

from collections.abc import Collection
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.promotions.errors.promoted_product_not_found import (
    PromotedProductNotFound,
)
from app.modules.promotions.models.promotion import Promotion


class PromotionRepository:
    """Reads and writes ``Promotion`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_all(self) -> list[Promotion]:
        """Return every campaign, the most recent start first."""
        statement = select(Promotion).order_by(
            Promotion.starts_at.desc(), Promotion.id.desc()
        )
        return list(self.session.scalars(statement))

    def get(self, promotion_id: int) -> Promotion | None:
        """Return the campaign with ``promotion_id``, if any."""
        return self.session.get(Promotion, promotion_id)

    def list_running(
        self, product_ids: Collection[int], now: datetime
    ) -> list[Promotion]:
        """Return enabled campaigns of the products in force at ``now``."""
        if not product_ids:
            return []
        statement = select(Promotion).where(
            Promotion.product_id.in_(product_ids),
            Promotion.is_active,
            Promotion.starts_at <= now,
            Promotion.ends_at > now,
        )
        return list(self.session.scalars(statement))

    def save(self, promotion: Promotion) -> Promotion:
        """Persist a campaign, translating an unknown product."""
        try:
            with self.session.begin_nested():
                self.session.add(promotion)
                self.session.flush()
        except IntegrityError as error:
            raise PromotedProductNotFound(
                f'No product with id {promotion.product_id}.'
            ) from error
        return promotion

    def remove(self, promotion: Promotion) -> None:
        """Delete a campaign."""
        self.session.delete(promotion)
        self.session.flush()
