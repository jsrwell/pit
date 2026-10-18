"""Base class of every business error in the application."""

from typing import ClassVar


class DomainError(Exception):
    """Business error that carries its own catalog entry.

    Subclasses declare ``code``, ``status`` and ``title`` as class
    attributes. ``detail`` explains one occurrence to a human and never
    exposes SQL, table names, credentials, paths or internal state.

    Example:
        >>> class ProductNotFound(DomainError):
        ...     code = 'CS-CAT-0001'
        ...     status = 404
        ...     title = 'Product not found'
        >>> raise ProductNotFound('No product with id 42.')
    """

    code: ClassVar[str]
    status: ClassVar[int]
    title: ClassVar[str]
    internal: ClassVar[bool] = False
    deprecated: ClassVar[bool] = False
    keeps_changes: ClassVar[bool] = False

    def __init__(self, detail: str | None = None) -> None:
        super().__init__(detail or self.title)
        self.detail: str | None = detail
