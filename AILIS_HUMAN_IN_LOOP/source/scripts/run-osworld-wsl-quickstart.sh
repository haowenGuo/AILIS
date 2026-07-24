#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AILIS_ROOT="${AILIS_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
OSWORLD_REPO="${OSWORLD_REPO:-${AILIS_ROOT}/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/ailis-osworld-venv}"
HF_ENDPOINT="${HF_ENDPOINT:-https://hf-mirror.com}"

export HF_ENDPOINT

cd "$OSWORLD_REPO"
# shellcheck disable=SC1091
source "$OSWORLD_VENV/bin/activate"

python quickstart.py --provider_name docker --os_type Ubuntu --headless True

