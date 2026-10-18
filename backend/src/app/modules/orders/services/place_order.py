"""Use case: confirm the order and pay for it."""

from sqlalchemy.orm import Session

from app.modules.cart.services.clear_cart import clear_cart
from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.modules.orders.models.order import Order
from app.modules.orders.models.order_item import OrderItem
from app.modules.orders.models.order_status import OrderStatus
from app.modules.orders.models.payment_method import PaymentMethod
from app.modules.orders.repositories.order_repository import OrderRepository
from app.modules.orders.services.payment_gateway import Card, PaymentGateway
from app.modules.orders.services.price_order import price_order
from app.shared.config.settings import StoreSettings


def place_order(
    session: Session,
    *,
    user_id: int,
    fulfillment_method: FulfillmentMethod,
    address_id: int | None,
    payment_method: PaymentMethod,
    card: Card | None,
    notes: str,
    store: StoreSettings,
    gateway: PaymentGateway,
) -> Order:
    """Price the cart, charge it and turn it into an order.

    The total is computed again here from current prices, never taken
    from the client. A declined payment raises before anything is
    stored, and the cart is emptied only when the order exists.

    Raises:
        EmptyCart, CartHasUnavailableItems, AddressRequired,
        AddressNotFound: The order cannot be priced.
        InvalidCard, PaymentDeclined: The payment failed.
    """
    priced = price_order(
        session,
        user_id=user_id,
        fulfillment_method=fulfillment_method,
        address_id=address_id,
        store=store,
    )
    payment = gateway.charge(priced.total, payment_method, card)
    order = Order(
        user_id=user_id,
        status=OrderStatus.RECEIVED,
        fulfillment_method=fulfillment_method,
        delivery_address=(
            priced.address.formatted() if priced.address else None
        ),
        delivery_reference=(
            priced.address.reference if priced.address else None
        ),
        payment_method=payment_method,
        payment_status=payment.status,
        payment_reference=payment.reference,
        subtotal=priced.subtotal,
        delivery_fee=priced.delivery_fee,
        total=priced.total,
        notes=notes.strip(),
        items=[
            OrderItem(
                product_id=line.product_id,
                product_name=line.name,
                unit_price=line.unit_price,
                quantity=line.quantity,
                line_total=line.line_total,
            )
            for line in priced.lines
        ],
    )
    OrderRepository(session).add(order)
    clear_cart(session, user_id)
    return order
