"""Queries and persistence of custom order requests."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.orders.models.custom_order import CustomOrder


class CustomOrderRepository:
    """Reads and writes ``CustomOrder`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, custom_order: CustomOrder) -> CustomOrder:
        """Persist a new request."""
        self.session.add(custom_order)
        self.session.flush()
        return custom_order

    def get(self, custom_order_id: int) -> CustomOrder | None:
        """Return the request with ``custom_order_id``, if any."""
        return self.session.get(CustomOrder, custom_order_id)

    def list_all(self, status: str | None = None) -> list[CustomOrder]:
        """Return requests by desired date, optionally of one status."""
        statement = select(CustomOrder).order_by(
            CustomOrder.desired_date, CustomOrder.id
        )
        if status is not None:
            statement = statement.where(CustomOrder.status == status)
        return list(self.session.scalars(statement))

    def list_for(self, user_id: int) -> list[CustomOrder]:
        """Return the requests of ``user_id``, newest first."""
        statement = (
            select(CustomOrder)
            .where(CustomOrder.user_id == user_id)
            .order_by(CustomOrder.id.desc())
        )
        return list(self.session.scalars(statement))
