"""Queries and persistence of user accounts."""

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.accounts.errors.email_already_registered import (
    EmailAlreadyRegistered,
)
from app.modules.accounts.models.user import User


class UserRepository:
    """Reads and writes ``User`` rows."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, user_id: int) -> User | None:
        """Return the user with ``user_id``, if any."""
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        """Return the user owning ``email``, compared case-insensitively."""
        statement = select(User).where(User.email == email.lower())
        return self.session.scalars(statement).first()

    def add(self, user: User) -> User:
        """Persist a new user, translating an e-mail clash."""
        try:
            with self.session.begin_nested():
                self.session.add(user)
                self.session.flush()
        except IntegrityError as error:
            raise EmailAlreadyRegistered(
                'An account with this e-mail already exists.'
            ) from error
        return user
