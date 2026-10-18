"""Administrator bootstrap from settings."""

from uuid import uuid4

from sqlalchemy.orm import Session

from app.modules.accounts.models.role import Role
from app.modules.accounts.repositories.user_repository import UserRepository
from app.modules.accounts.services.ensure_admin import ensure_admin
from app.shared.config.settings import AdminSettings


def test_creates_admin_once(db_session: Session) -> None:
    """The administrator is created on the first run only."""
    settings = AdminSettings(
        email=f'admin.{uuid4().hex[:8]}@example.com', password='admin1234'
    )

    assert ensure_admin(db_session, settings) is True
    assert ensure_admin(db_session, settings) is False
    admin = UserRepository(db_session).get_by_email(str(settings.email))
    assert admin is not None and admin.role == Role.ADMIN


def test_without_credentials_does_nothing(db_session: Session) -> None:
    """Missing e-mail or password skips the bootstrap."""
    assert ensure_admin(db_session, AdminSettings()) is False
