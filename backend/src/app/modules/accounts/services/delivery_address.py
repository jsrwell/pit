"""Use case offered to orders: read a customer's address for delivery."""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.modules.accounts.services.manage_addresses import get_address


@dataclass(frozen=True)
class DeliveryAddress:
    """Snapshot of an address, copied into the order when it is placed."""

    label: str
    zip_code: str
    street: str
    number: str
    complement: str
    district: str
    reference: str

    def formatted(self) -> str:
        """Return the address in a single human-readable line."""
        complement = f', {self.complement}' if self.complement else ''
        return (
            f'{self.street}, {self.number}{complement} - {self.district}, '
            f'CEP {self.zip_code}'
        )


def get_delivery_address(
    session: Session, user_id: int, address_id: int
) -> DeliveryAddress:
    """Return a snapshot of the customer's address.

    Raises:
        AddressNotFound: The address is not one of the customer's.
    """
    address = get_address(session, user_id, address_id)
    return DeliveryAddress(
        label=address.label,
        zip_code=address.zip_code,
        street=address.street,
        number=address.number,
        complement=address.complement,
        district=address.district,
        reference=address.reference,
    )
