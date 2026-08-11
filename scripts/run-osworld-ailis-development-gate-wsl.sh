#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
OSWORLD_DIR="${OSWORLD_DIR:-${AILIS_ROOT}/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/ailis-osworld-venv}"
PASS_NAME="${PASS_NAME:-pass-1}"
RESULT_DIR="${RESULT_DIR:-${AILIS_ROOT}/eval-results/engineering/osworld-development-gate/${PASS_NAME}}"
TEST_META="${AILIS_ROOT}/evals/engineering/osworld-development-gate.json"
LIMIT="${LIMIT:-0}"
START_INDEX="${START_INDEX:-0}"
MAX_ACTIONS="${MAX_ACTIONS:-50}"
TASK_TIMEOUT_SECONDS="${TASK_TIMEOUT_SECONDS:-900}"
PREFETCH_ASSETS="${PREFETCH_ASSETS:-true}"

if [[ ! -f "${OSWORLD_VENV}/bin/activate" ]]; then
  echo "OSWorld venv not found: ${OSWORLD_VENV}" >&2
  exit 1
fi

if [[ ! -f "${TEST_META}" ]]; then
  echo "OSWorld development gate manifest not found: ${TEST_META}" >&2
  exit 1
fi

source "${OSWORLD_VENV}/bin/activate"
export PYTHONPATH="${AILIS_ROOT}/scripts/osworld:${OSWORLD_DIR}:${PYTHONPATH:-}"

if [[ "${PREFETCH_ASSETS}" == "true" ]]; then
  WINDOWS_POWERSHELL="/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"
  if [[ ! -x "${WINDOWS_POWERSHELL}" ]]; then
    echo "Windows PowerShell not found: ${WINDOWS_POWERSHELL}" >&2
    exit 1
  fi
  "${WINDOWS_POWERSHELL}" \
    -NoProfile \
    -ExecutionPolicy Bypass \
    -File "$(wslpath -w "${AILIS_ROOT}/scripts/osworld/prefetch-osworld-assets.ps1")" \
    -SuiteManifest "$(wslpath -w "${TEST_META}")" \
    -OSWorldRoot "$(wslpath -w "${OSWORLD_DIR}")"
fi

mkdir -p "${RESULT_DIR}"
echo "AILIS clean OSWorld ten-domain development gate"
echo "pass=${PASS_NAME} result_dir=${RESULT_DIR}"
echo "limit=${LIMIT} start_index=${START_INDEX} max_actions=${MAX_ACTIONS}"

cd "${OSWORLD_DIR}"
python "${AILIS_ROOT}/scripts/osworld/run_clean_ailis_osworld.py" \
  --suite small \
  --test-meta "${TEST_META}" \
  --provider-name docker \
  --headless \
  --result-dir "${RESULT_DIR}" \
  --start-index "${START_INDEX}" \
  --limit "${LIMIT}" \
  --max-actions "${MAX_ACTIONS}" \
  --task-timeout-seconds "${TASK_TIMEOUT_SECONDS}" \
  "$@"
