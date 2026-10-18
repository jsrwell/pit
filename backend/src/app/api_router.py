"""Composition of every module router under the ``/api`` prefix."""

from fastapi import APIRouter

from app.modules.accounts.api.account_routes import router as account_router
from app.modules.accounts.api.address_routes import router as address_router
from app.modules.accounts.api.session_routes import router as session_router
from app.modules.cart.api.cart_routes import router as cart_router
from app.modules.catalog.api.admin_product_routes import (
    router as admin_product_router,
)
from app.modules.catalog.api.classification_routes import (
    router as classification_router,
)
from app.modules.catalog.api.image_routes import router as image_router
from app.modules.catalog.api.product_routes import router as product_router
from app.modules.orders.api.custom_order_routes import (
    router as custom_order_router,
)
from app.modules.orders.api.order_routes import router as order_router
from app.modules.orders.api.quote_routes import router as quote_router
from app.modules.orders.api.store_custom_order_routes import (
    router as store_custom_order_router,
)
from app.modules.orders.api.store_order_routes import (
    router as store_order_router,
)
from app.modules.promotions.api.promotion_routes import (
    admin_router as promotion_admin_router,
)
from app.modules.promotions.api.promotion_routes import (
    router as promotion_router,
)
from app.modules.system.api.health_routes import router as health_router

API_PREFIX = '/api'

api_router = APIRouter(prefix=API_PREFIX)
api_router.include_router(health_router)
api_router.include_router(product_router)
api_router.include_router(image_router)
api_router.include_router(classification_router)
api_router.include_router(admin_product_router)
api_router.include_router(account_router)
api_router.include_router(session_router)
api_router.include_router(address_router)
api_router.include_router(cart_router)
api_router.include_router(quote_router)
api_router.include_router(store_custom_order_router)
api_router.include_router(store_order_router)
api_router.include_router(custom_order_router)
api_router.include_router(order_router)
api_router.include_router(promotion_router)
api_router.include_router(promotion_admin_router)
