"""Field types shared by the forms that write account contact data."""

import re
from typing import Annotated

from pydantic import AfterValidator, StringConstraints
from pydantic_core import PydanticCustomError

PHONE_MAX_LENGTH = 20
PHONE_CHARACTERS = re.compile(r'^\+?[\d\s().-]*$')
PHONE_DIGITS = re.compile(r'^[1-9]{2}(9\d{8}|[2-8]\d{7})$')


def phone_digits(value: str) -> str:
    """Return the phone with digits only, after checking its format.

    The phone needs a two-digit area code followed by an eight-digit
    landline or a nine-digit mobile number starting with 9, so it has
    10 or 11 digits; masks such as ``(11) 98765-4321`` are accepted and
    dropped.

    Raises:
        PydanticCustomError: Letters, a missing area code or a wrong
            number of digits, reported as ``phone_format``.
    """
    digits = re.sub(r'\D', '', value)
    if not PHONE_CHARACTERS.match(value) or not PHONE_DIGITS.match(digits):
        raise PydanticCustomError(
            'phone_format',
            'Use a phone with area code and 10 or 11 digits.',
        )
    return digits


Name = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)
]
Phone = Annotated[
    str,
    StringConstraints(strip_whitespace=True, max_length=PHONE_MAX_LENGTH),
    AfterValidator(phone_digits),
]
