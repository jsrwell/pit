"""Error raised when reviewing a custom order twice."""

from app.shared.errors.domain_error import DomainError


class CustomOrderAlreadyReviewed(DomainError):
    """The request was already approved or rejected."""

    code = 'CS-ORD-0010'
    status = 409
    title = 'Custom order already reviewed'
