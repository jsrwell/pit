"""Sync every version reference with the release semantic-release resolved.

Called by semantic-release via ``prepareCmd`` with the resolved version
and channel. Backend and frontend are released in lockstep, so the same
version is written to:

- the version badge of the root ``README.md``, with the full version
  (prerelease identifier included, e.g. ``1.8.0-beta.1``);
- ``backend/pyproject.toml`` and the ``package.json`` and
  ``package-lock.json`` pairs at the root and under ``frontend/``,
  always stripped down to ``MAJOR.MINOR.PATCH``.

The running applications never read these files: each image receives
the full version as the ``APP_VERSION`` build argument.

Usage:
    python .github/scripts/semantic-release/update_release_versions.py \
        <version> [channel]
"""

import json
import re
import sys
from pathlib import Path
from typing import cast

PROJECT_ROOT = Path(__file__).resolve().parents[3]
NPM_PROJECTS: tuple[Path, ...] = (PROJECT_ROOT, PROJECT_ROOT / 'frontend')

BADGE_PATTERN = re.compile(
    r'!\[Vers[aã]o\]\(https://img\.shields\.io/badge/versao-[^)]+\)'
)
PYPROJECT_VERSION_PATTERN = re.compile(r'^version = "[^"]+"$', re.MULTILINE)

JsonObject = dict[str, object]


def build_badge(version: str, channel: str) -> str:
    """Build the README badge markdown for a released version."""
    encoded = version.replace('-', '--')
    color = 'orange' if channel == 'beta' else 'blue'
    return f'![Versão](https://img.shields.io/badge/versao-{encoded}-{color})'


def strip_prerelease(version: str) -> str:
    """Drop a semantic-release prerelease identifier, e.g. ``-beta.1``."""
    return version.split('-', 1)[0]


def replace_once(path: Path, pattern: re.Pattern[str], new: str) -> None:
    """Replace the first match of ``pattern`` in ``path``, or fail."""
    content = path.read_text(encoding='utf-8')
    updated, replacements = pattern.subn(new, content, count=1)
    if replacements == 0:
        raise RuntimeError(f'{pattern.pattern!r} not found in {path}')
    path.write_text(updated, encoding='utf-8')


def read_json(path: Path) -> JsonObject:
    """Read a JSON object from ``path``."""
    return cast(JsonObject, json.loads(path.read_text(encoding='utf-8')))


def write_json(path: Path, data: JsonObject) -> None:
    """Write ``data`` with the two-space indent ``npm`` uses."""
    path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')


def update_npm_project(directory: Path, version: str) -> None:
    """Set the root package version in ``package.json`` and its lockfile.

    ``npm`` keeps the lockfile root version in two places: the top-level
    ``version`` and ``packages[""].version``. Every other ``version`` in
    the lockfile belongs to a dependency and is left untouched, which is
    why the JSON is parsed instead of matched with a regex.
    """
    package_json = directory / 'package.json'
    package = read_json(package_json)
    package['version'] = version
    write_json(package_json, package)

    package_lock = directory / 'package-lock.json'
    lock = read_json(package_lock)
    lock['version'] = version
    packages = cast(dict[str, JsonObject], lock['packages'])
    packages['']['version'] = version
    write_json(package_lock, lock)


def main(argv: list[str]) -> None:
    """Update every version reference for the resolved release."""
    if len(argv) not in {2, 3}:
        raise SystemExit(
            'Usage: update_release_versions.py <version> [channel]'
        )

    version = argv[1]
    channel = argv[2] if len(argv) == 3 else ''
    stable_version = strip_prerelease(version)

    replace_once(
        PROJECT_ROOT / 'README.md',
        BADGE_PATTERN,
        build_badge(version, channel),
    )
    replace_once(
        PROJECT_ROOT / 'backend' / 'pyproject.toml',
        PYPROJECT_VERSION_PATTERN,
        f'version = "{stable_version}"',
    )
    for directory in NPM_PROJECTS:
        update_npm_project(directory, stable_version)

    print(f'[update_release_versions] README badge -> {version}')
    print(f'[update_release_versions] manifests -> {stable_version}')


if __name__ == '__main__':
    main(sys.argv)
