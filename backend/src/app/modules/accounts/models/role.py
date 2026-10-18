"""Roles an account can hold."""

from enum import StrEnum


class Role(StrEnum):
    """Permission level of an account."""

    CUSTOMER = 'customer'
    ADMIN = 'admin'
