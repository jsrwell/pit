"""Routes of the signed-in customer's cart."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.cart.errors.quantity_limit_exceeded import (
    QuantityLimitExceeded,
)
from app.modules.cart.schemas.cart_item_input import CartItemInput
from app.modules.cart.schemas.cart_read import CartRead
from app.modules.cart.services.add_to_cart import add_to_cart
from app.modules.cart.services.cart_summary import summarize_cart
from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.errors.product_unavailable import ProductUnavailable
from app.shared.database.session import get_session
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import CurrentPrincipal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/cart', tags=['Cart'])

DbSession = Annotated[Session, Depends(get_session)]


@router.get('', responses=problem_responses(AuthenticationRequired))
def read_cart(principal: CurrentPrincipal, session: DbSession) -> CartRead:
    """Show the cart with current prices and availability."""
    summary = summarize_cart(session, principal.user_id)
    return CartRead.model_validate(summary)


@router.post(
    '/items',
    responses=problem_responses(
        ProductNotFound,
        ProductUnavailable,
        QuantityLimitExceeded,
        AuthenticationRequired,
    ),
)
def add_item(
    data: CartItemInput, principal: CurrentPrincipal, session: DbSession
) -> CartRead:
    """Add units of a product, merging with its existing line."""
    summary = add_to_cart(
        session,
        user_id=principal.user_id,
        product_id=data.product_id,
        quantity=data.quantity,
    )
    return CartRead.model_validate(summary)
