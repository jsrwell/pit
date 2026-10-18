"""Liveness route, used by the hosting platform and by the frontend."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.modules.system.schemas.health_status import HealthStatus
from app.shared.config.settings import Settings, get_settings
from app.shared.http.problem_responses import problem_responses

router = APIRouter(prefix='/health', tags=['System'])


@router.get('', responses=problem_responses())
def read_health(
    settings: Annotated[Settings, Depends(get_settings)],
) -> HealthStatus:
    """Report that the API is up, without touching the database."""
    return HealthStatus(status='ok', version=settings.app.version)
