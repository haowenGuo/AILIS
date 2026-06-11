#!/usr/bin/env bash
set -euo pipefail

OSWORLD_REPO="${OSWORLD_REPO:-/mnt/f/AIGril/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/aigl-osworld-venv}"
PIP_INDEX_URL="${PIP_INDEX_URL:-https://pypi.tuna.tsinghua.edu.cn/simple}"
PIP_DEFAULT_TIMEOUT="${PIP_DEFAULT_TIMEOUT:-180}"
PIP_RETRIES="${PIP_RETRIES:-10}"
MODE="${1:-full}"

export PIP_INDEX_URL
export PIP_DEFAULT_TIMEOUT
export PIP_RETRIES

cd "$OSWORLD_REPO"

python3 -m venv "$OSWORLD_VENV"
# shellcheck disable=SC1091
source "$OSWORLD_VENV/bin/activate"

python -m pip install --upgrade pip setuptools wheel

if [[ "$MODE" == "minimal" ]]; then
  python -m pip install \
    "gymnasium~=0.28.1" \
    requests \
    filelock \
    tqdm \
    psutil \
    pillow \
    pyautogui
else
  python -m pip install -r requirements.txt
fi

python -c 'from desktop_env.desktop_env import DesktopEnv; print("OSWORLD_IMPORT_OK")'
