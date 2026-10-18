"""Administration routes of the store's operational order panel."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.orders.errors.invalid_status_transition import (
    InvalidStatusTransition,
)
from app.modules.orders.errors.order_not_found import OrderNotFound
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.schemas.order_read import OrderRead
from app.modules.orders.schemas.status_input import StatusInput
from app.modules.orders.schemas.store_order_read import (
    CustomerRead,
    StoreOrderRead,
)
from app.modules.orders.services.manage_orders import (
    change_status,
    get_order,
    list_orders,
)
from app.modules.orders.services.store_order_view import (
    StoreOrderView,
    describe_orders,
)
from app.shared.database.session import get_session
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import admin_principal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(
    prefix='/orders/admin',
    tags=['Orders administration'],
    dependencies=[Depends(admin_principal)],
)

AUTH_ERRORS = (AuthenticationRequired, AccessDenied)
DbSession = Annotated[Session, Depends(get_session)]


def to_schema(view: StoreOrderView) -> StoreOrderRead:
    """Merge an order and its panel data into the response schema."""
    customer = (
        CustomerRead.model_validate(view.customer) if view.customer else None
    )
    return StoreOrderRead(
        **OrderRead.model_validate(view.order).model_dump(),
        customer=customer,
        next_statuses=list(view.next_statuses),
    )


@router.get('', responses=problem_responses(*AUTH_ERRORS))
def read_orders(
    session: DbSession, status: OrderStatus | None = None
) -> list[StoreOrderRead]:
    """List received orders with customer data, newest first."""
    return [
        to_schema(view)
        for view in describe_orders(session, list_orders(session, status))
    ]


@router.get(
    '/{order_id}', responses=problem_responses(OrderNotFound, *AUTH_ERRORS)
)
def read_order(order_id: int, session: DbSession) -> StoreOrderRead:
    """Show an order with fulfillment, notes and customer contact."""
    [view] = describe_orders(session, [get_order(session, order_id)])
    return to_schema(view)


@router.patch(
    '/{order_id}/status',
    responses=problem_responses(
        OrderNotFound, InvalidStatusTransition, *AUTH_ERRORS
    ),
)
def update_status(
    order_id: int, data: StatusInput, session: DbSession
) -> StoreOrderRead:
    """Move the order to the next status of its flow."""
    order = change_status(session, order_id, data.status)
    [view] = describe_orders(session, [order])
    return to_schema(view)
