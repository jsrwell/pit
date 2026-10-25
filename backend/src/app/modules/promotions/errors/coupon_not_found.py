"""Error raised when a coupon does not exist."""

from app.shared.errors.domain_error import DomainError


class CouponNotFound(DomainError):
    """No coupon matches the requested id."""

    code = 'CS-PRM-0005'
    status = 404
    title = 'Coupon not found'
