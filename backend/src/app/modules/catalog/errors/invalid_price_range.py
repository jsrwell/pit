"""Error raised when a price filter has its bounds inverted."""

from app.shared.errors.domain_error import DomainError


class InvalidPriceRange(DomainError):
    """The minimum price is greater than the maximum price."""

    code = 'CS-CAT-0002'
    status = 422
    title = 'Invalid price range'
