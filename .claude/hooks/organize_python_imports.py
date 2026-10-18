"""Organize the imports of a backend Python file Claude just wrote.

Runs as a ``PostToolUse`` hook: reads the tool payload from stdin and,
for a ``.py`` file under ``backend/``, lets Ruff sort the imports and
drop the unused ones. Ruff is taken from the backend virtualenv, so the
hook is a silent no-op until ``poetry install`` has run.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND = PROJECT_ROOT / 'backend'
VIRTUALENV = BACKEND / '.venv'


def edited_file(payload: object) -> Path | None:
    """Return the file the tool wrote, if the payload names one."""
    if not isinstance(payload, dict):
        return None
    tool_input = payload.get('tool_input')
    if not isinstance(tool_input, dict):
        return None
    file_path = tool_input.get('file_path')
    return Path(file_path).resolve() if isinstance(file_path, str) else None


def find_ruff() -> str | None:
    """Locate Ruff inside the backend virtualenv only."""
    search_path = os.pathsep.join(
        str(VIRTUALENV / folder) for folder in ('Scripts', 'bin')
    )
    return shutil.which('ruff', path=search_path)


def main() -> None:
    """Organize imports of the edited file when it is backend Python."""
    file = edited_file(json.load(sys.stdin))
    if file is None or file.suffix != '.py':
        return
    if not file.is_relative_to(BACKEND):
        return
    ruff = find_ruff()
    if ruff is None:
        return
    subprocess.run(
        [ruff, 'check', '--fix', '--select', 'I,F401', '--quiet', str(file)],
        cwd=BACKEND,
        check=False,
        capture_output=True,
    )


if __name__ == '__main__':
    main()
