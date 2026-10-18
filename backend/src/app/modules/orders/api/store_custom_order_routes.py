"""Administration routes where the store reviews custom orders."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.orders.errors.custom_order_already_reviewed import (
    CustomOrderAlreadyReviewed,
)
from app.modules.orders.errors.custom_order_not_found import (
    CustomOrderNotFound,
)
from app.modules.orders.models.custom_order import CustomOrder
from app.modules.orders.models.custom_order_status import CustomOrderStatus
from app.modules.orders.schemas.custom_order_read import (
    CustomOrderRead,
    StoreCustomOrderRead,
)
from app.modules.orders.schemas.custom_order_review import CustomOrderReview
from app.modules.orders.schemas.store_order_read import CustomerRead
from app.modules.orders.services.custom_orders import (
    describe_custom_orders,
    list_custom_orders,
    review_custom_order,
)
from app.shared.database.session import get_session
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import admin_principal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(
    prefix='/orders/admin/custom',
    tags=['Custom orders administration'],
    dependencies=[Depends(admin_principal)],
)

AUTH_ERRORS = (AuthenticationRequired, AccessDenied)
DbSession = Annotated[Session, Depends(get_session)]


def to_schemas(
    session: Session, custom_orders: list[CustomOrder]
) -> list[StoreCustomOrderRead]:
    """Build the panel view of each request with its customer."""
    return [
        StoreCustomOrderRead(
            **CustomOrderRead.model_validate(item).model_dump(),
            customer=CustomerRead.model_validate(contact) if contact else None,
        )
        for item, contact in describe_custom_orders(session, custom_orders)
    ]


@router.get('', responses=problem_responses(*AUTH_ERRORS))
def read_custom_orders(
    session: DbSession, status: CustomOrderStatus | None = None
) -> list[StoreCustomOrderRead]:
    """List requests by desired date, optionally of one status."""
    return to_schemas(session, list_custom_orders(session, status))


@router.patch(
    '/{custom_order_id}/review',
    responses=problem_responses(
        CustomOrderNotFound, CustomOrderAlreadyReviewed, *AUTH_ERRORS
    ),
)
def review(
    custom_order_id: int, data: CustomOrderReview, session: DbSession
) -> StoreCustomOrderRead:
    """Approve with a price, or reject, a pending request."""
    custom_order = review_custom_order(
        session, custom_order_id, **data.model_dump()
    )
    [result] = to_schemas(session, [custom_order])
    return result
