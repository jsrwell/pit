"""Route that serves product images."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.modules.catalog.errors.image_not_found import ImageNotFound
from app.modules.catalog.services.get_product_image import get_product_image
from app.shared.database.session import get_session
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/catalog/images', tags=['Catalog'])

IMMUTABLE_CACHE = 'public, max-age=31536000, immutable'


@router.get(
    '/{image_id}',
    response_class=Response,
    responses=problem_responses(ImageNotFound),
)
def read_image(
    image_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> Response:
    """Serve the image bytes; ids are never reused, so they are cached."""
    image = get_product_image(session, image_id)
    return Response(
        content=image.data,
        media_type=image.content_type,
        headers={'Cache-Control': IMMUTABLE_CACHE},
    )
