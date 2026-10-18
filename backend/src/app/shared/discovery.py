"""Import submodules by convention, so no central registry is kept."""

import importlib
import pkgutil


def import_submodules(package: str, segment: str) -> list[str]:
    """Import every module under ``package`` whose path has ``segment``.

    Used to load all ORM models (``models``) before Alembic compares the
    metadata, and all domain errors (``errors``) before the catalog is
    inspected.

    Args:
        package: Dotted name of the package to walk, e.g. ``app.modules``.
        segment: Path segment a module must contain, e.g. ``models``.

    Returns:
        The dotted names of the imported modules.

    Example:
        >>> import_submodules('app.modules', 'models')
        ['app.modules.catalog.models.product', ...]
    """
    root = importlib.import_module(package)
    imported: list[str] = []
    for module in pkgutil.walk_packages(root.__path__, prefix=f'{package}.'):
        if segment in module.name.split('.'):
            importlib.import_module(module.name)
            imported.append(module.name)
    return imported
