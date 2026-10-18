"""Liveness payload reported by the API."""

from typing import Literal

from pydantic import BaseModel


class HealthStatus(BaseModel):
    """Confirms the process is serving and reports its version."""

    status: Literal['ok']
    version: str
