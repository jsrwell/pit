"""Types of the factory fixtures declared in ``conftest.py``."""

from collections.abc import Callable
from typing import NamedTuple

from app.modules.accounts.models.user import User
from app.modules.catalog.models.product import Product


class SignedIn(NamedTuple):
    """Account created for a test and the headers that authenticate it."""

    user: User
    headers: dict[str, str]


type ProductFactory = Callable[..., Product]
type UserFactory = Callable[..., User]
type SignInFactory = Callable[..., SignedIn]
