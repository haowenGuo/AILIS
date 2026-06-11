#!/usr/bin/env bash
set -euo pipefail

export TEST_META="${TEST_META:-/mnt/f/AIGril/evals/engineering/osworld-aigl-deterministic-smoke.json}"
export RESULT_DIR="${RESULT_DIR:-/mnt/f/AIGril/eval-results/engineering/osworld-aigl-deterministic-smoke}"
export OBSERVATION_TYPE="${OBSERVATION_TYPE:-screenshot_a11y_tree}"
export MODEL_NAME="${MODEL_NAME:-aigl-osworld}"
export MAX_STEPS="${MAX_STEPS:-8}"
export PER_TASK_TIMEOUT_SECONDS="${PER_TASK_TIMEOUT_SECONDS:-420}"
export PREFETCH_ASSETS="${PREFETCH_ASSETS:-1}"

bash /mnt/f/AIGril/scripts/run-osworld-aigl-test-small-wsl.sh
