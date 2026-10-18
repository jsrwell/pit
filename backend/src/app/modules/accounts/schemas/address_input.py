"""Address data typed by the customer."""

from typing import Annotated

from pydantic import BaseModel, StringConstraints, field_validator


def text(min_length: int, max_length: int) -> type[str]:
    """Return a stripped string type bounded by the given lengths."""
    return Annotated[
        str,
        StringConstraints(
            strip_whitespace=True, min_length=min_length, max_length=max_length
        ),
    ]


ZipCode = Annotated[
    str, StringConstraints(strip_whitespace=True, pattern=r'^\d{5}-?\d{3}$')
]


class AddressInput(BaseModel):
    """CEP, street, number, complement, district and reference."""

    label: text(0, 40) = 'Casa'
    zip_code: ZipCode
    street: text(1, 120)
    number: text(1, 10)
    complement: text(0, 60) = ''
    district: text(1, 60)
    reference: text(0, 120) = ''
    is_primary: bool = False

    @field_validator('zip_code')
    @classmethod
    def format_zip_code(cls, value: str) -> str:
        """Store the CEP always as ``00000-000``."""
        digits = value.replace('-', '')
        return f'{digits[:5]}-{digits[5:]}'
