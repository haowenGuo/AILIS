#!/usr/bin/env bash
set -euo pipefail

OSWORLD_DIR="${OSWORLD_DIR:-/mnt/f/AIGril/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/aigl-osworld-venv}"
AIGL_ROOT="${AIGL_ROOT:-/mnt/f/AIGril}"

if [[ ! -d "${OSWORLD_DIR}" ]]; then
  echo "OSWorld directory not found: ${OSWORLD_DIR}" >&2
  exit 1
fi

if [[ ! -f "${OSWORLD_VENV}/bin/activate" ]]; then
  echo "OSWorld venv not found: ${OSWORLD_VENV}" >&2
  echo "Run /mnt/f/AIGril/scripts/setup-osworld-wsl.sh full first." >&2
  exit 1
fi

source "${OSWORLD_VENV}/bin/activate"
export PYTHONPATH="${AIGL_ROOT}/scripts/osworld:${OSWORLD_DIR}:${PYTHONPATH:-}"

cd "${OSWORLD_DIR}"
python "${AIGL_ROOT}/scripts/osworld/run_aigl_osworld.py" "$@"
