"""Single entry point that serves the Cupcakes Store API."""

import uvicorn

from app.shared.config.settings import get_settings


def main() -> None:
    """Start the ASGI server with the configured bind address."""
    settings = get_settings()
    uvicorn.run(
        'app.main:app',
        host=settings.server.host,
        port=settings.server.port,
        reload=settings.server.reload,
    )


if __name__ == '__main__':
    main()
