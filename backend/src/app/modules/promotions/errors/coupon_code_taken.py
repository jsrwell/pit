"""Error raised when a coupon code is already used by another coupon."""

from app.shared.errors.domain_error import DomainError


class CouponCodeTaken(DomainError):
    """Coupon codes are unique regardless of letter case."""

    code = 'CS-PRM-0006'
    status = 409
    title = 'Coupon code already in use'
