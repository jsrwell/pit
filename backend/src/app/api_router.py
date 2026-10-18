"""Composition of every module router under the ``/api`` prefix."""

from fastapi import APIRouter

from app.modules.accounts.api.account_routes import router as account_router
from app.modules.accounts.api.session_routes import router as session_router
from app.modules.catalog.api.classification_routes import (
    router as classification_router,
)
from app.modules.catalog.api.image_routes import router as image_router
from app.modules.catalog.api.product_routes import router as product_router
from app.modules.system.api.health_routes import router as health_router

API_PREFIX = '/api'

api_router = APIRouter(prefix=API_PREFIX)
api_router.include_router(health_router)
api_router.include_router(product_router)
api_router.include_router(image_router)
api_router.include_router(classification_router)
api_router.include_router(account_router)
api_router.include_router(session_router)
