"""Current instant, in one place so time rules read the same clock."""

from datetime import UTC, datetime


def utc_now() -> datetime:
    """Return the current time, time zone aware, in UTC."""
    return datetime.now(UTC)
