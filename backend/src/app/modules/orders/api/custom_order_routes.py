"""Routes where customers request custom orders."""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.modules.orders.errors.lead_time_too_short import LeadTimeTooShort
from app.modules.orders.schemas.custom_order_input import CustomOrderInput
from app.modules.orders.schemas.custom_order_read import CustomOrderRead
from app.modules.orders.services.custom_orders import (
    list_my_custom_orders,
    request_custom_order,
)
from app.shared.config.settings import Settings, get_settings
from app.shared.database.session import get_session
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/orders/custom', tags=['Custom orders'])

DbSession = Annotated[Session, Depends(get_session)]


@router.get('', responses=problem_responses(AuthenticationRequired))
def read_my_custom_orders(
    principal: CurrentPrincipal, session: DbSession
) -> list[CustomOrderRead]:
    """List the custom order requests of the customer."""
    return [
        CustomOrderRead.model_validate(item)
        for item in list_my_custom_orders(session, principal.user_id)
    ]


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(LeadTimeTooShort, AuthenticationRequired),
)
def create_custom_order(
    data: CustomOrderInput,
    principal: CurrentPrincipal,
    session: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> CustomOrderRead:
    """Request a custom order, pending the review of the store."""
    custom_order = request_custom_order(
        session,
        user_id=principal.user_id,
        **data.model_dump(),
        lead_days=settings.store.custom_order_lead_days,
        today=date.today(),
    )
    return CustomOrderRead.model_validate(custom_order)
