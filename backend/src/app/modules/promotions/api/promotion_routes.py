"""Routes that run promotional campaigns and combos."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.modules.promotions.errors.combo_not_found import ComboNotFound
from app.modules.promotions.errors.invalid_period import InvalidPeriod
from app.modules.promotions.errors.promoted_product_not_found import (
    PromotedProductNotFound,
)
from app.modules.promotions.errors.promotion_not_found import (
    PromotionNotFound,
)
from app.modules.promotions.models.combo import Combo
from app.modules.promotions.models.promotion import Promotion
from app.modules.promotions.schemas.combo_schemas import ComboInput, ComboRead
from app.modules.promotions.schemas.promotion_schemas import (
    PromotionInput,
    PromotionRead,
)
from app.modules.promotions.services.campaign_period import is_running
from app.modules.promotions.services.manage_combos import (
    delete_combo,
    list_combos,
    list_running_combos,
    save_combo,
)
from app.modules.promotions.services.manage_promotions import (
    delete_promotion,
    list_promotions,
    save_promotion,
)
from app.shared.clock import utc_now
from app.shared.database.session import get_session
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import admin_principal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/promotions', tags=['Promotions'])
admin_router = APIRouter(
    prefix='/promotions/admin',
    tags=['Promotions administration'],
    dependencies=[Depends(admin_principal)],
)

AUTH_ERRORS = (AuthenticationRequired, AccessDenied)
SAVE_ERRORS = (InvalidPeriod, PromotedProductNotFound, *AUTH_ERRORS)
DbSession = Annotated[Session, Depends(get_session)]


def promotion_read(promotion: Promotion) -> PromotionRead:
    """Describe a campaign, telling whether it is running now."""
    return PromotionRead.model_validate(promotion).model_copy(
        update={
            'is_running': is_running(
                promotion.is_active,
                promotion.starts_at,
                promotion.ends_at,
                utc_now(),
            )
        }
    )


def combo_read(combo: Combo) -> ComboRead:
    """Describe a combo, telling whether it is running now."""
    return ComboRead.model_validate(combo).model_copy(
        update={
            'is_running': is_running(
                combo.is_active, combo.starts_at, combo.ends_at, utc_now()
            )
        }
    )


@router.get('/combos', responses=problem_responses())
def read_running_combos(session: DbSession) -> list[ComboRead]:
    """List the combos offered on the storefront right now."""
    return [
        combo_read(combo) for combo in list_running_combos(session, utc_now())
    ]


@admin_router.get('/promotions', responses=problem_responses(*AUTH_ERRORS))
def read_promotions(session: DbSession) -> list[PromotionRead]:
    """List every campaign."""
    return [promotion_read(item) for item in list_promotions(session)]


@admin_router.post(
    '/promotions',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(*SAVE_ERRORS),
)
def create_promotion(
    data: PromotionInput, session: DbSession
) -> PromotionRead:
    """Register a campaign with its period and promotional price."""
    return promotion_read(save_promotion(session, data))


@admin_router.put(
    '/promotions/{promotion_id}',
    responses=problem_responses(PromotionNotFound, *SAVE_ERRORS),
)
def update_promotion(
    promotion_id: int, data: PromotionInput, session: DbSession
) -> PromotionRead:
    """Replace a campaign."""
    return promotion_read(save_promotion(session, data, promotion_id))


@admin_router.delete(
    '/promotions/{promotion_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=problem_responses(PromotionNotFound, *AUTH_ERRORS),
)
def remove_promotion(promotion_id: int, session: DbSession) -> None:
    """Delete a campaign."""
    delete_promotion(session, promotion_id)


@admin_router.get('/combos', responses=problem_responses(*AUTH_ERRORS))
def read_combos(session: DbSession) -> list[ComboRead]:
    """List every combo."""
    return [combo_read(combo) for combo in list_combos(session)]


@admin_router.post(
    '/combos',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(*SAVE_ERRORS),
)
def create_combo(data: ComboInput, session: DbSession) -> ComboRead:
    """Register a combination of products sold for a closed price."""
    return combo_read(save_combo(session, data))


@admin_router.put(
    '/combos/{combo_id}',
    responses=problem_responses(ComboNotFound, *SAVE_ERRORS),
)
def update_combo(
    combo_id: int, data: ComboInput, session: DbSession
) -> ComboRead:
    """Replace a combo."""
    return combo_read(save_combo(session, data, combo_id))


@admin_router.delete(
    '/combos/{combo_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    responses=problem_responses(ComboNotFound, *AUTH_ERRORS),
)
def remove_combo(combo_id: int, session: DbSession) -> None:
    """Delete a combo."""
    delete_combo(session, combo_id)
