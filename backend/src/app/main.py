"""ASGI application factory."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api_router import API_PREFIX, api_router
from app.shared.config.settings import Settings, get_settings
from app.shared.http.exception_handlers import register_exception_handlers
from app.shared.http.openapi import build_openapi


def create_app(settings: Settings | None = None) -> FastAPI:
    """Assemble the API: middleware, error handlers, routes and docs."""
    settings = settings or get_settings()
    app = FastAPI(
        title=settings.app.name,
        version=settings.app.version,
        docs_url=f'{API_PREFIX}/docs',
        openapi_url=f'{API_PREFIX}/openapi.json',
        redoc_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors.allow_origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )
    register_exception_handlers(app)
    app.include_router(api_router)
    app.openapi = lambda: build_openapi(app)
    return app


app = create_app()
