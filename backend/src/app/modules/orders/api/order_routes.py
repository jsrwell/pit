"""Routes of the signed-in customer's orders."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.modules.accounts.errors.address_not_found import AddressNotFound
from app.modules.orders.errors.address_required import AddressRequired
from app.modules.orders.errors.cart_has_unavailable_items import (
    CartHasUnavailableItems,
)
from app.modules.orders.errors.empty_cart import EmptyCart
from app.modules.orders.errors.invalid_card import InvalidCard
from app.modules.orders.errors.order_not_found import OrderNotFound
from app.modules.orders.errors.payment_declined import PaymentDeclined
from app.modules.orders.schemas.checkout_input import CheckoutInput
from app.modules.orders.schemas.order_read import OrderRead
from app.modules.orders.services.customer_orders import (
    get_my_order,
    list_my_orders,
)
from app.modules.orders.services.payment_gateway import (
    Card,
    PaymentGateway,
    get_payment_gateway,
)
from app.modules.orders.services.place_order import place_order
from app.shared.config.settings import Settings, get_settings
from app.shared.database.session import get_session
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/orders', tags=['Orders'])

DbSession = Annotated[Session, Depends(get_session)]


@router.get('', responses=problem_responses(AuthenticationRequired))
def read_my_orders(
    principal: CurrentPrincipal, session: DbSession
) -> list[OrderRead]:
    """List the customer's orders, newest first."""
    return [
        OrderRead.model_validate(order)
        for order in list_my_orders(session, principal.user_id)
    ]


@router.get(
    '/{order_id}',
    responses=problem_responses(OrderNotFound, AuthenticationRequired),
)
def read_my_order(
    order_id: int, principal: CurrentPrincipal, session: DbSession
) -> OrderRead:
    """Track one of the customer's orders with its status history."""
    return OrderRead.model_validate(
        get_my_order(session, principal.user_id, order_id)
    )


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(
        EmptyCart,
        CartHasUnavailableItems,
        AddressRequired,
        AddressNotFound,
        InvalidCard,
        PaymentDeclined,
        AuthenticationRequired,
    ),
)
def create_order(
    data: CheckoutInput,
    principal: CurrentPrincipal,
    session: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
    gateway: Annotated[PaymentGateway, Depends(get_payment_gateway)],
) -> OrderRead:
    """Confirm the cart as an order, charging the chosen payment method."""
    order = place_order(
        session,
        user_id=principal.user_id,
        fulfillment_method=data.fulfillment_method,
        address_id=data.address_id,
        payment_method=data.payment_method,
        card=Card(**data.card.model_dump()) if data.card else None,
        notes=data.notes,
        store=settings.store,
        gateway=gateway,
    )
    return OrderRead.model_validate(order)
