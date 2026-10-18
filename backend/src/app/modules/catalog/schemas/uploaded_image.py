"""Answer to an image upload."""

from pydantic import BaseModel, ConfigDict


class UploadedImage(BaseModel):
    """Id to reference the stored image from a product."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    content_type: str
