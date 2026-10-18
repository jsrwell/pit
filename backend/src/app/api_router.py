"""Composition of every module router under the ``/api`` prefix."""

from fastapi import APIRouter

from app.modules.system.api.health_routes import router as health_router

API_PREFIX = '/api'

api_router = APIRouter(prefix=API_PREFIX)
api_router.include_router(health_router)
