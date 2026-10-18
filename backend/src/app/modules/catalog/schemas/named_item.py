"""Reference to a category or flavor by id and name."""

from pydantic import BaseModel, ConfigDict


class NamedItem(BaseModel):
    """Identifier and display name of a classification."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
