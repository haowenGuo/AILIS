#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
OSWORLD_DIR="${OSWORLD_DIR:-${AILIS_ROOT}/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/ailis-osworld-venv}"
RESULT_DIR="${RESULT_DIR:-${AILIS_ROOT}/eval-results/engineering/osworld-ailis-test-small}"
LIMIT="${LIMIT:-1}"
START_INDEX="${START_INDEX:-0}"
MAX_ACTIONS="${MAX_ACTIONS:-50}"
TASK_TIMEOUT_SECONDS="${TASK_TIMEOUT_SECONDS:-900}"

if [[ ! -f "${OSWORLD_VENV}/bin/activate" ]]; then
  echo "OSWorld venv not found: ${OSWORLD_VENV}" >&2
  exit 1
fi

source "${OSWORLD_VENV}/bin/activate"
export PYTHONPATH="${AILIS_ROOT}/scripts/osworld:${OSWORLD_DIR}:${PYTHONPATH:-}"

mkdir -p "${RESULT_DIR}"
echo "AILIS clean OSWorld small-suite run"
echo "result_dir=${RESULT_DIR}"
echo "limit=${LIMIT} start_index=${START_INDEX} max_actions=${MAX_ACTIONS}"

cd "${OSWORLD_DIR}"
python "${AILIS_ROOT}/scripts/osworld/run_clean_ailis_osworld.py" \
  --suite small \
  --provider-name docker \
  --headless \
  --result-dir "${RESULT_DIR}" \
  --start-index "${START_INDEX}" \
  --limit "${LIMIT}" \
  --max-actions "${MAX_ACTIONS}" \
  --task-timeout-seconds "${TASK_TIMEOUT_SECONDS}" \
  "$@"
