"""Review stages of a custom order request."""

from enum import StrEnum


class CustomOrderStatus(StrEnum):
    """Awaiting the store, approved with a price, or rejected."""

    PENDING_REVIEW = 'pending_review'
    APPROVED = 'approved'
    REJECTED = 'rejected'
