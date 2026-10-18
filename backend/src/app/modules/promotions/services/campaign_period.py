"""Rules about the period in which a campaign is in force."""

from datetime import datetime

from app.modules.promotions.errors.invalid_period import InvalidPeriod


def ensure_valid_period(starts_at: datetime, ends_at: datetime) -> None:
    """Raise ``InvalidPeriod`` unless the period ends after it starts."""
    if ends_at <= starts_at:
        raise InvalidPeriod('The campaign must end after it starts.')


def is_running(
    is_active: bool, starts_at: datetime, ends_at: datetime, now: datetime
) -> bool:
    """Tell whether an enabled campaign is inside its period at ``now``."""
    return is_active and starts_at <= now < ends_at
