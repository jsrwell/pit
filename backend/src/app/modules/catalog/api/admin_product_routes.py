"""Administration routes that maintain the product catalog."""

from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, status
from sqlalchemy.orm import Session

from app.modules.catalog.errors.image_not_found import ImageNotFound
from app.modules.catalog.errors.image_too_large import ImageTooLarge
from app.modules.catalog.errors.product_incomplete import ProductIncomplete
from app.modules.catalog.errors.product_not_found import ProductNotFound
from app.modules.catalog.errors.unsupported_image import UnsupportedImage
from app.modules.catalog.schemas.admin_product import AdminProduct
from app.modules.catalog.schemas.availability_input import AvailabilityInput
from app.modules.catalog.schemas.product_input import ProductInput
from app.modules.catalog.schemas.uploaded_image import UploadedImage
from app.modules.catalog.services.list_all_products import list_all_products
from app.modules.catalog.services.save_product import (
    create_product,
    get_any_product,
    update_product,
)
from app.modules.catalog.services.set_availability import set_availability
from app.modules.catalog.services.upload_product_image import (
    upload_product_image,
)
from app.shared.config.settings import Settings, get_settings
from app.shared.database.session import get_session
from app.shared.errors.access_denied import AccessDenied
from app.shared.errors.authentication_required import AuthenticationRequired
from app.shared.http.authentication import admin_principal
from app.shared.http.problem_responses import problem_responses

router = APIRouter(
    prefix='/catalog/admin',
    tags=['Catalog administration'],
    dependencies=[Depends(admin_principal)],
)

AUTH_ERRORS = (AuthenticationRequired, AccessDenied)
DbSession = Annotated[Session, Depends(get_session)]


@router.get('/products', responses=problem_responses(*AUTH_ERRORS))
def read_all_products(session: DbSession) -> list[AdminProduct]:
    """List every product, including inactive ones."""
    return [
        AdminProduct.model_validate(product)
        for product in list_all_products(session)
    ]


@router.get(
    '/products/{product_id}',
    responses=problem_responses(ProductNotFound, *AUTH_ERRORS),
)
def read_any_product(product_id: int, session: DbSession) -> AdminProduct:
    """Show one product in any state."""
    return AdminProduct.model_validate(get_any_product(session, product_id))


@router.post(
    '/products',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(
        ProductIncomplete, ImageNotFound, *AUTH_ERRORS
    ),
)
def add_product(data: ProductInput, session: DbSession) -> AdminProduct:
    """Register a new product."""
    return AdminProduct.model_validate(create_product(session, data))


@router.put(
    '/products/{product_id}',
    responses=problem_responses(
        ProductNotFound, ProductIncomplete, ImageNotFound, *AUTH_ERRORS
    ),
)
def edit_product(
    product_id: int, data: ProductInput, session: DbSession
) -> AdminProduct:
    """Replace the data of a product; inactivating never deletes it."""
    return AdminProduct.model_validate(
        update_product(session, product_id, data)
    )


@router.patch(
    '/products/{product_id}/availability',
    responses=problem_responses(ProductNotFound, *AUTH_ERRORS),
)
def change_availability(
    product_id: int, data: AvailabilityInput, session: DbSession
) -> AdminProduct:
    """Mark a product as available or unavailable for purchase."""
    product = set_availability(session, product_id, **data.model_dump())
    return AdminProduct.model_validate(product)


@router.post(
    '/images',
    status_code=status.HTTP_201_CREATED,
    responses=problem_responses(UnsupportedImage, ImageTooLarge, *AUTH_ERRORS),
)
def add_image(
    file: UploadFile,
    session: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> UploadedImage:
    """Store a PNG, JPEG or WebP image to be used by a product."""
    image = upload_product_image(
        session,
        content_type=file.content_type or '',
        data=file.file.read(settings.catalog.max_image_bytes + 1),
        max_bytes=settings.catalog.max_image_bytes,
    )
    return UploadedImage.model_validate(image)
