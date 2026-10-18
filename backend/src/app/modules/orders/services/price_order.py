"""Use case: price the cart for a fulfillment method before ordering."""

from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.accounts.services.delivery_address import (
    DeliveryAddress,
    get_delivery_address,
)
from app.modules.cart.services.cart_summary import CartLine, summarize_cart
from app.modules.orders.errors.address_required import AddressRequired
from app.modules.orders.errors.cart_has_unavailable_items import (
    CartHasUnavailableItems,
)
from app.modules.orders.errors.empty_cart import EmptyCart
from app.modules.orders.models.fulfillment_method import FulfillmentMethod
from app.shared.config.settings import StoreSettings

NO_FEE = Decimal('0.00')


@dataclass(frozen=True)
class PricedOrder:
    """Cart lines and totals for the chosen way of receiving the order."""

    lines: list[CartLine]
    fulfillment_method: FulfillmentMethod
    address: DeliveryAddress | None
    subtotal: Decimal
    delivery_fee: Decimal

    @property
    def total(self) -> Decimal:
        """Amount the customer pays."""
        return self.subtotal + self.delivery_fee


def price_order(
    session: Session,
    *,
    user_id: int,
    fulfillment_method: FulfillmentMethod,
    address_id: int | None,
    store: StoreSettings,
) -> PricedOrder:
    """Validate the cart and the fulfillment method and price the order.

    Pickup needs no address and has no fee; delivery requires one of the
    customer's addresses and charges ``store.delivery_fee``.

    Raises:
        EmptyCart: Nothing in the cart.
        CartHasUnavailableItems: Some line cannot be bought now.
        AddressRequired: Delivery without an address.
        AddressNotFound: The address is not one of the customer's.
    """
    cart = summarize_cart(session, user_id)
    if not cart.lines:
        raise EmptyCart('Add products to the cart before ordering.')
    if cart.has_unavailable:
        raise CartHasUnavailableItems(
            'Remove the unavailable products before ordering.'
        )

    address = None
    delivery_fee = NO_FEE
    if fulfillment_method is FulfillmentMethod.DELIVERY:
        if address_id is None:
            raise AddressRequired('Choose where the order will be delivered.')
        address = get_delivery_address(session, user_id, address_id)
        delivery_fee = store.delivery_fee

    return PricedOrder(
        lines=cart.lines,
        fulfillment_method=fulfillment_method,
        address=address,
        subtotal=cart.subtotal,
        delivery_fee=delivery_fee,
    )
