"""Integrity of the domain error catalog."""

import re

import pytest

from app.shared.discovery import import_submodules
from app.shared.errors.domain_error import DomainError

CODE_PATTERN = re.compile(r'^CS-[A-Z]{3}-\d{4}$')


def all_subclasses(base: type[DomainError]) -> list[type[DomainError]]:
    """Return every subclass of ``base``, at any depth."""
    direct = base.__subclasses__()
    return direct + [
        nested for cls in direct for nested in all_subclasses(cls)
    ]


def catalog() -> list[type[DomainError]]:
    """Return every domain error declared by the application."""
    import_submodules('app.shared', 'errors')
    import_submodules('app.modules', 'errors')
    return [
        error
        for error in all_subclasses(DomainError)
        if error.__module__.startswith('app.')
    ]


@pytest.mark.parametrize('error', catalog(), ids=lambda error: error.__name__)
def test_error_declares_catalog_entry(error: type[DomainError]) -> None:
    """Each error declares a well-formed code, a status and a title."""
    assert CODE_PATTERN.match(error.code)
    assert 400 <= error.status <= 599
    assert error.title


def test_codes_are_unique() -> None:
    """No two errors share a code."""
    codes = [error.code for error in catalog()]

    assert len(codes) == len(set(codes))
