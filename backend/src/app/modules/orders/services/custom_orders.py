"""Use cases: request custom orders and review them at the store."""

from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.accounts.services.customer_contacts import (
    CustomerContact,
    get_customer_contacts,
)
from app.modules.orders.errors.custom_order_already_reviewed import (
    CustomOrderAlreadyReviewed,
)
from app.modules.orders.errors.custom_order_not_found import (
    CustomOrderNotFound,
)
from app.modules.orders.errors.lead_time_too_short import LeadTimeTooShort
from app.modules.orders.models.custom_order import CustomOrder
from app.modules.orders.models.custom_order_status import CustomOrderStatus
from app.modules.orders.repositories.custom_order_repository import (
    CustomOrderRepository,
)


def request_custom_order(
    session: Session,
    *,
    user_id: int,
    description: str,
    quantity: int,
    desired_date: date,
    notes: str,
    lead_days: int,
    today: date,
) -> CustomOrder:
    """Register a request that waits for the store's review.

    Raises:
        LeadTimeTooShort: ``desired_date`` is sooner than ``lead_days``.
    """
    earliest = today + timedelta(days=lead_days)
    if desired_date < earliest:
        raise LeadTimeTooShort(
            f'Custom orders need {lead_days} days of notice; '
            f'the earliest date is {earliest.isoformat()}.'
        )
    return CustomOrderRepository(session).add(
        CustomOrder(
            user_id=user_id,
            description=description.strip(),
            quantity=quantity,
            desired_date=desired_date,
            notes=notes.strip(),
            status=CustomOrderStatus.PENDING_REVIEW,
        )
    )


def list_my_custom_orders(session: Session, user_id: int) -> list[CustomOrder]:
    """Return the customer's requests, newest first."""
    return CustomOrderRepository(session).list_for(user_id)


def list_custom_orders(
    session: Session, status: CustomOrderStatus | None = None
) -> list[CustomOrder]:
    """Return every request ordered by desired date."""
    return CustomOrderRepository(session).list_all(status)


def review_custom_order(
    session: Session,
    custom_order_id: int,
    *,
    decision: CustomOrderStatus,
    quoted_price: Decimal | None,
    response: str,
) -> CustomOrder:
    """Approve with a price, or reject, a pending request.

    Raises:
        CustomOrderNotFound: No request with ``custom_order_id``.
        CustomOrderAlreadyReviewed: The request was reviewed before.
    """
    custom_order = CustomOrderRepository(session).get(custom_order_id)
    if custom_order is None:
        raise CustomOrderNotFound(
            f'No custom order with id {custom_order_id}.'
        )
    if custom_order.status != CustomOrderStatus.PENDING_REVIEW:
        raise CustomOrderAlreadyReviewed(
            f'Custom order {custom_order_id} is already {custom_order.status}.'
        )
    custom_order.status = decision
    custom_order.quoted_price = (
        quoted_price if decision is CustomOrderStatus.APPROVED else None
    )
    custom_order.store_response = response.strip()
    custom_order.reviewed_at = datetime.now(UTC)
    session.flush()
    return custom_order


def describe_custom_orders(
    session: Session, custom_orders: list[CustomOrder]
) -> list[tuple[CustomOrder, CustomerContact | None]]:
    """Pair each request with the contact of the customer who made it."""
    contacts = get_customer_contacts(
        session, (item.user_id for item in custom_orders)
    )
    return [(item, contacts.get(item.user_id)) for item in custom_orders]
