"""Route that prices the cart for a fulfillment method."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.accounts.errors.address_not_found import AddressNotFound
from app.modules.orders.errors.address_required import AddressRequired
from app.modules.orders.errors.cart_has_unavailable_items import (
    CartHasUnavailableItems,
)
from app.modules.orders.errors.empty_cart import EmptyCart
from app.modules.orders.schemas.quote_input import FulfillmentInput
from app.modules.orders.schemas.quote_read import QuoteRead
from app.modules.orders.services.price_order import price_order
from app.shared.config.settings import Settings, get_settings
from app.shared.database.session import get_session
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/orders', tags=['Orders'])


@router.post(
    '/quote',
    responses=problem_responses(
        EmptyCart,
        CartHasUnavailableItems,
        AddressRequired,
        AddressNotFound,
        AuthenticationRequired,
    ),
)
def quote_order(
    data: FulfillmentInput,
    principal: CurrentPrincipal,
    session: Annotated[Session, Depends(get_session)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> QuoteRead:
    """Show items, delivery fee and total for pickup or delivery."""
    priced = price_order(
        session,
        user_id=principal.user_id,
        fulfillment_method=data.fulfillment_method,
        address_id=data.address_id,
        store=settings.store,
    )
    return QuoteRead.model_validate(
        {
            'lines': priced.lines,
            'fulfillment_method': priced.fulfillment_method,
            'address': priced.address,
            'subtotal': priced.subtotal,
            'discount': priced.discount,
            'delivery_fee': priced.delivery_fee,
            'total': priced.total,
            'pickup_address': settings.store.pickup_address,
        }
    )
