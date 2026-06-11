#!/usr/bin/env bash
set -euo pipefail

OSWORLD_REPO="${OSWORLD_REPO:-/mnt/f/AIGril/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/aigl-osworld-venv}"
HF_ENDPOINT="${HF_ENDPOINT:-https://hf-mirror.com}"

export HF_ENDPOINT

cd "$OSWORLD_REPO"
# shellcheck disable=SC1091
source "$OSWORLD_VENV/bin/activate"

python quickstart.py --provider_name docker --os_type Ubuntu --headless True

