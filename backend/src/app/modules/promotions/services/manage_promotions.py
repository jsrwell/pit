"""Use cases: the store keeps its promotional campaigns."""

from sqlalchemy.orm import Session

from app.modules.promotions.errors.promotion_not_found import (
    PromotionNotFound,
)
from app.modules.promotions.models.promotion import Promotion
from app.modules.promotions.repositories.promotion_repository import (
    PromotionRepository,
)
from app.modules.promotions.schemas.promotion_schemas import PromotionInput
from app.modules.promotions.services.campaign_period import (
    ensure_valid_period,
)


def list_promotions(session: Session) -> list[Promotion]:
    """Return every campaign, the most recent start first."""
    return PromotionRepository(session).list_all()


def save_promotion(
    session: Session, data: PromotionInput, promotion_id: int | None = None
) -> Promotion:
    """Create a campaign, or replace one when ``promotion_id`` is given.

    Raises:
        InvalidPeriod: The campaign ends before it starts.
        PromotionNotFound: No campaign with ``promotion_id``.
        PromotedProductNotFound: The product does not exist.
    """
    ensure_valid_period(data.starts_at, data.ends_at)
    promotions = PromotionRepository(session)
    promotion = (
        Promotion()
        if promotion_id is None
        else get_promotion(session, promotion_id)
    )
    for field, value in data.model_dump().items():
        setattr(promotion, field, value)
    return promotions.save(promotion)


def delete_promotion(session: Session, promotion_id: int) -> None:
    """Remove a campaign; prices go back to normal at once."""
    PromotionRepository(session).remove(get_promotion(session, promotion_id))


def get_promotion(session: Session, promotion_id: int) -> Promotion:
    """Return a campaign or raise ``PromotionNotFound``."""
    promotion = PromotionRepository(session).get(promotion_id)
    if promotion is None:
        raise PromotionNotFound(f'No promotion with id {promotion_id}.')
    return promotion
