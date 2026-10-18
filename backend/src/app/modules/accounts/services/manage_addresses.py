"""Use cases: keep the delivery addresses of a customer."""

from sqlalchemy.orm import Session

from app.modules.accounts.errors.address_not_found import AddressNotFound
from app.modules.accounts.models.address import Address
from app.modules.accounts.repositories.address_repository import (
    AddressRepository,
)
from app.modules.accounts.schemas.address_input import AddressInput


def list_addresses(session: Session, user_id: int) -> list[Address]:
    """Return the customer's addresses, primary first."""
    return AddressRepository(session).list_for(user_id)


def get_address(session: Session, user_id: int, address_id: int) -> Address:
    """Return an address of the customer or raise ``AddressNotFound``."""
    address = AddressRepository(session).find(user_id, address_id)
    if address is None:
        raise AddressNotFound(f'No address with id {address_id}.')
    return address


def add_address(session: Session, user_id: int, data: AddressInput) -> Address:
    """Store a new address; the first one is always the primary."""
    addresses = AddressRepository(session)
    is_first = not addresses.list_for(user_id)
    address = Address(
        user_id=user_id, **data.model_dump(exclude={'is_primary'})
    )
    addresses.add(address)
    if data.is_primary or is_first:
        make_primary(session, user_id, address.id)
    return address


def update_address(
    session: Session, user_id: int, address_id: int, data: AddressInput
) -> Address:
    """Replace the fields of an address of the customer."""
    address = get_address(session, user_id, address_id)
    for field, value in data.model_dump(exclude={'is_primary'}).items():
        setattr(address, field, value)
    if data.is_primary:
        make_primary(session, user_id, address_id)
    session.flush()
    return address


def make_primary(session: Session, user_id: int, address_id: int) -> Address:
    """Mark one address as primary and unmark every other one."""
    chosen = get_address(session, user_id, address_id)
    for address in AddressRepository(session).list_for(user_id):
        address.is_primary = address.id == chosen.id
    session.flush()
    return chosen


def delete_address(session: Session, user_id: int, address_id: int) -> None:
    """Remove an address, promoting another one if it was the primary."""
    addresses = AddressRepository(session)
    address = get_address(session, user_id, address_id)
    was_primary = address.is_primary
    addresses.remove(address)
    remaining = addresses.list_for(user_id)
    if was_primary and remaining:
        remaining[0].is_primary = True
        session.flush()
