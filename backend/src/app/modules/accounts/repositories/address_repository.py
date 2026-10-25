"""Queries and persistence of delivery addresses."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.accounts.models.address import Address


class AddressRepository:
    """Reads and writes the ``Address`` rows of customers."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_for(self, user_id: int) -> list[Address]:
        """Return the addresses of ``user_id``, primary first."""
        statement = (
            select(Address)
            .where(Address.user_id == user_id)
            .order_by(Address.is_primary.desc(), Address.id)
        )
        return list(self.session.scalars(statement))

    def find(self, user_id: int, address_id: int) -> Address | None:
        """Return the address only when it belongs to ``user_id``."""
        statement = select(Address).where(
            Address.id == address_id, Address.user_id == user_id
        )
        return self.session.scalars(statement).first()

    def add(self, address: Address) -> Address:
        """Persist a new address."""
        self.session.add(address)
        self.session.flush()
        return address

    def remove_all_for(self, user_id: int) -> None:
        """Delete every address of ``user_id``."""
        for address in self.list_for(user_id):
            self.session.delete(address)
        self.session.flush()

    def remove(self, address: Address) -> None:
        """Delete an address."""
        self.session.delete(address)
        self.session.flush()
