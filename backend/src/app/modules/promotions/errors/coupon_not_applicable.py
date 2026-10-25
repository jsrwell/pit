"""Error raised when a customer types a coupon that cannot be used."""

from app.shared.errors.domain_error import DomainError


class CouponNotApplicable(DomainError):
    """The coupon does not exist, is disabled or is outside its period."""

    code = 'CS-PRM-0007'
    status = 422
    title = 'Coupon not applicable'
