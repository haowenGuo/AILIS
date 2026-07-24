#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
OSWORLD_DIR="${OSWORLD_DIR:-${AILIS_ROOT}/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/ailis-osworld-venv}"

if [[ ! -d "${OSWORLD_DIR}" ]]; then
  echo "OSWorld directory not found: ${OSWORLD_DIR}" >&2
  exit 1
fi

if [[ ! -f "${OSWORLD_VENV}/bin/activate" ]]; then
  echo "OSWorld venv not found: ${OSWORLD_VENV}" >&2
  echo "Run ${AILIS_ROOT}/scripts/setup-osworld-wsl.sh full first." >&2
  exit 1
fi

source "${OSWORLD_VENV}/bin/activate"
export PYTHONPATH="${AILIS_ROOT}/scripts/osworld:${OSWORLD_DIR}:${PYTHONPATH:-}"

cd "${OSWORLD_DIR}"
python "${AILIS_ROOT}/scripts/osworld/run_ailis_osworld.py" "$@"
