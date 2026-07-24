#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
export TEST_META="${TEST_META:-${AILIS_ROOT}/evals/engineering/osworld-ailis-deterministic-smoke.json}"
export RESULT_DIR="${RESULT_DIR:-${AILIS_ROOT}/eval-results/engineering/osworld-ailis-deterministic-smoke}"
export OBSERVATION_TYPE="${OBSERVATION_TYPE:-screenshot_a11y_tree}"
export MODEL_NAME="${MODEL_NAME:-ailis-osworld}"
export MAX_STEPS="${MAX_STEPS:-8}"
export PER_TASK_TIMEOUT_SECONDS="${PER_TASK_TIMEOUT_SECONDS:-420}"
export PREFETCH_ASSETS="${PREFETCH_ASSETS:-1}"

bash "${AILIS_ROOT}/scripts/run-osworld-ailis-test-small-wsl.sh"
