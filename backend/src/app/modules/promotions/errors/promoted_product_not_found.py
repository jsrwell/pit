"""Error raised when a promotion names a product that does not exist."""

from app.shared.errors.domain_error import DomainError


class PromotedProductNotFound(DomainError):
    """A promotion or combo references an unknown product."""

    code = 'CS-PRM-0004'
    status = 404
    title = 'Promoted product not found'
