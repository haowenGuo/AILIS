#!/usr/bin/env bash
set -euo pipefail

export RESULT_DIR=/mnt/f/AIGril/eval-results/engineering/osworld-aigl-test-small-r4
export PER_TASK_TIMEOUT_SECONDS=420

bash /mnt/f/AIGril/scripts/run-osworld-aigl-test-small-wsl.sh
