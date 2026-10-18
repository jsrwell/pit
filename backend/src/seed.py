"""Entry point that loads the initial data into the database."""

import logging

from app.modules.catalog.services.seed_demo_catalog import seed_demo_catalog
from app.shared.config.settings import get_settings
from app.shared.database.session import get_session_factory

logger = logging.getLogger('seed')


def main() -> None:
    """Load every enabled seed inside a single transaction."""
    logging.basicConfig(level=logging.INFO, format='%(message)s')
    settings = get_settings()
    with get_session_factory().begin() as session:
        if settings.seed.demo_catalog:
            inserted = seed_demo_catalog(session)
            logger.info('Demo catalog: %d products inserted.', inserted)


if __name__ == '__main__':
    main()
