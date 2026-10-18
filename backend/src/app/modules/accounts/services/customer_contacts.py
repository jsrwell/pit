"""Use case offered to orders: contact data of the customers."""

from collections.abc import Iterable
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.modules.accounts.repositories.user_repository import UserRepository


@dataclass(frozen=True)
class CustomerContact:
    """Name, e-mail and phone the store uses to reach a customer."""

    name: str
    email: str
    phone: str


def get_customer_contacts(
    session: Session, user_ids: Iterable[int]
) -> dict[int, CustomerContact]:
    """Return the contact of each customer, keyed by user id."""
    users = UserRepository(session).list_by_ids(set(user_ids))
    return {
        user.id: CustomerContact(user.name, user.email, user.phone)
        for user in users
    }
