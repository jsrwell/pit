"""Password hashing with bcrypt, so plain passwords are never stored."""

import bcrypt


def hash_password(password: str) -> str:
    """Return the salted bcrypt hash of ``password``."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    """Tell whether ``password`` matches ``password_hash``."""
    return bcrypt.checkpw(password.encode(), password_hash.encode())
