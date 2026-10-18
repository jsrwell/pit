"""Minimum security policy for account passwords."""

from app.modules.accounts.errors.weak_password import WeakPassword

MIN_PASSWORD_LENGTH = 8


def enforce_password_policy(password: str) -> None:
    """Raise ``WeakPassword`` unless the password is long and mixed.

    The password needs at least eight characters, one letter and one
    digit.
    """
    long_enough = len(password) >= MIN_PASSWORD_LENGTH
    has_letter = any(char.isalpha() for char in password)
    has_digit = any(char.isdigit() for char in password)
    if not (long_enough and has_letter and has_digit):
        raise WeakPassword(
            'Use at least 8 characters mixing letters and digits.'
        )
