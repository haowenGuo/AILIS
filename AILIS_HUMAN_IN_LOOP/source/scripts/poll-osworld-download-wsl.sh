#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-/root/osworld-docker-vm-data}"
MAX_POLLS="${2:-120}"
SLEEP_SECONDS="${3:-30}"

for i in $(seq 1 "$MAX_POLLS"); do
  size="$(du -sh "$TARGET_DIR" 2>/dev/null | awk '{print $1}' || true)"
  final_bytes="$(find "$TARGET_DIR" -maxdepth 2 -name 'Ubuntu.qcow2.zip' -type f -printf '%s' 2>/dev/null | head -1 || true)"
  running="$(ps aux | grep -E 'hf download xlangai/ubuntu_osworld' | grep -v grep | wc -l)"
  echo "poll:$i size:${size:-0} running:$running final_bytes:${final_bytes:-0}"
  if [[ -n "${final_bytes:-}" && "$final_bytes" -gt 10000000000 ]]; then
    exit 0
  fi
  if [[ "$running" == "0" ]]; then
    exit 0
  fi
  sleep "$SLEEP_SECONDS"
done

exit 124

