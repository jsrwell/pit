"""Entry point that loads the initial data into the database."""

import logging

from app.modules.accounts.services.ensure_admin import ensure_admin
from app.modules.catalog.services.seed_demo_catalog import seed_demo_catalog
from app.modules.promotions.services.seed_demo_coupon import (
    DEMO_COUPON_CODE,
    seed_demo_coupon,
)
from app.shared.config.settings import get_settings
from app.shared.database.session import get_session_factory

logger = logging.getLogger('seed')


def main() -> None:
    """Load every enabled seed inside a single transaction."""
    logging.basicConfig(level=logging.INFO, format='%(message)s')
    settings = get_settings()
    with get_session_factory().begin() as session:
        if ensure_admin(session, settings.admin):
            logger.info('Administrator %s is ready.', settings.admin.email)
        if settings.seed.demo_catalog:
            inserted = seed_demo_catalog(session)
            logger.info('Demo catalog: %d products inserted.', inserted)
            if seed_demo_coupon(session):
                logger.info('Demo coupon %s created.', DEMO_COUPON_CODE)


if __name__ == '__main__':
    main()
