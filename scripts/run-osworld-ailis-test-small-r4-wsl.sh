#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
export RESULT_DIR="${AILIS_ROOT}/eval-results/engineering/osworld-ailis-test-small-r4"
export PER_TASK_TIMEOUT_SECONDS=420

bash "${AILIS_ROOT}/scripts/run-osworld-ailis-test-small-wsl.sh"
