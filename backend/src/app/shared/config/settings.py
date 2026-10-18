"""Application settings resolved from environment variables."""

from functools import lru_cache

from pydantic import BaseModel, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PSYCOPG_SCHEME = 'postgresql+psycopg://'
PLAIN_SCHEMES: tuple[str, ...] = ('postgres://', 'postgresql://')


class AppSettings(BaseModel):
    """Identity of the running application."""

    name: str = 'Cupcakes Store API'
    version: str = '0.0.0-dev'


class ServerSettings(BaseModel):
    """Bind address of the ASGI server."""

    host: str = '0.0.0.0'
    port: int = 8000
    reload: bool = False


class DatabaseSettings(BaseModel):
    """Connection to the PostgreSQL database."""

    dsn: str = PSYCOPG_SCHEME + 'cupcakes:cupcakes@localhost:5432/cupcakes'
    echo: bool = False

    @field_validator('dsn')
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        """Force the psycopg driver on a plain ``postgresql://`` DSN.

        Hosted providers such as Neon hand out the plain scheme, which
        SQLAlchemy would otherwise resolve to the ``psycopg2`` driver.
        """
        for scheme in PLAIN_SCHEMES:
            if value.startswith(scheme):
                return PSYCOPG_SCHEME + value.removeprefix(scheme)
        return value


class CorsSettings(BaseModel):
    """Origins allowed to call the API from a browser."""

    allow_origins: list[str] = ['http://localhost:5173']


class SeedSettings(BaseModel):
    """Data loaded by ``src/seed.py`` on an empty database."""

    demo_catalog: bool = True


class Settings(BaseSettings):
    """Root settings, read from the environment and from ``.env``.

    Nested fields use ``__`` as delimiter, e.g. ``DATABASE__DSN``.
    """

    model_config = SettingsConfigDict(
        env_file='.env',
        env_nested_delimiter='__',
        extra='ignore',
    )

    app: AppSettings = Field(default_factory=AppSettings)
    server: ServerSettings = Field(default_factory=ServerSettings)
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    cors: CorsSettings = Field(default_factory=CorsSettings)
    seed: SeedSettings = Field(default_factory=SeedSettings)


@lru_cache
def get_settings() -> Settings:
    """Return the settings, read once per process."""
    return Settings()
