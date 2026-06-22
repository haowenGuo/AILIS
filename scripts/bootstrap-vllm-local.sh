#!/usr/bin/env bash
set -euo pipefail

SOURCE="hf"
MODEL="Qwen/Qwen2.5-7B-Instruct"
SERVED_MODEL_NAME=""
HOST_NAME="127.0.0.1"
PORT="8000"
VENV_DIR=".ailis-runtime/vllm-venv"
DOWNLOAD_DIR=""
DTYPE="auto"
TENSOR_PARALLEL_SIZE="1"
GPU_MEMORY_UTILIZATION="0.9"
MAX_MODEL_LEN=""
QUANTIZATION=""
TRUST_REMOTE_CODE="false"
START_AFTER_INSTALL="false"
DETACHED="false"
WAIT_READY="false"
READY_TIMEOUT_SEC="900"
DRY_RUN="false"
EXTRA_ARGS=()

usage() {
  cat <<'EOF'
Usage:
  bash scripts/bootstrap-vllm-local.sh [options]

Options:
  --source hf|modelscope          Model source. Default: hf
  --model MODEL_ID                HF/ModelScope model id.
  --served-model-name NAME        Stable model id exposed by /v1/models.
  --host HOST                     vLLM listen host. Default: 127.0.0.1
  --port PORT                     vLLM port. Default: 8000
  --venv-dir PATH                 Python venv path. Default: .ailis-runtime/vllm-venv
  --download-dir PATH             vLLM model cache/download directory.
  --dtype auto|float16|bfloat16   vLLM dtype. Default: auto
  --tensor-parallel-size N        Multi-GPU tensor parallel size.
  --gpu-memory-utilization FLOAT  vLLM GPU memory fraction. Default: 0.9
  --max-model-len N               Reduce context length when GPU memory is tight.
  --quantization MODE             vLLM quantization mode.
  --trust-remote-code             Pass --trust-remote-code to vLLM.
  --start                         Start vLLM after install/update.
  --detached                      Start in background and write logs under .ailis-runtime/vllm.
  --wait-ready                    Wait until /v1/models responds.
  --ready-timeout-sec N           Readiness timeout. Default: 900
  --dry-run                       Print actions without installing or starting.
  --                              Remaining args are forwarded to vLLM.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) SOURCE="${2:-}"; shift 2 ;;
    --model) MODEL="${2:-}"; shift 2 ;;
    --served-model-name) SERVED_MODEL_NAME="${2:-}"; shift 2 ;;
    --host) HOST_NAME="${2:-}"; shift 2 ;;
    --port) PORT="${2:-}"; shift 2 ;;
    --venv-dir) VENV_DIR="${2:-}"; shift 2 ;;
    --download-dir) DOWNLOAD_DIR="${2:-}"; shift 2 ;;
    --dtype) DTYPE="${2:-}"; shift 2 ;;
    --tensor-parallel-size) TENSOR_PARALLEL_SIZE="${2:-}"; shift 2 ;;
    --gpu-memory-utilization) GPU_MEMORY_UTILIZATION="${2:-}"; shift 2 ;;
    --max-model-len) MAX_MODEL_LEN="${2:-}"; shift 2 ;;
    --quantization) QUANTIZATION="${2:-}"; shift 2 ;;
    --trust-remote-code) TRUST_REMOTE_CODE="true"; shift ;;
    --start) START_AFTER_INSTALL="true"; shift ;;
    --detached) DETACHED="true"; shift ;;
    --wait-ready) WAIT_READY="true"; shift ;;
    --ready-timeout-sec) READY_TIMEOUT_SEC="${2:-}"; shift 2 ;;
    --dry-run) DRY_RUN="true"; shift ;;
    --help|-h) usage; exit 0 ;;
    --) shift; EXTRA_ARGS+=("$@"); break ;;
    *) echo "[AILIS vLLM] Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

case "${SOURCE,,}" in
  hf|huggingface) SOURCE="hf" ;;
  ms|modelscope) SOURCE="modelscope" ;;
  *) echo "[AILIS vLLM] --source must be hf or modelscope." >&2; exit 2 ;;
esac

if [[ -z "${MODEL}" ]]; then
  echo "[AILIS vLLM] --model cannot be empty." >&2
  exit 2
fi

PYTHON_BIN="${PYTHON_BIN:-python3}"

try_install_python() {
  if command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
    return 0
  fi
  echo "[AILIS vLLM] python3 was not found. Trying to install Python runtime automatically..."
  if command -v apt-get >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1; then
      sudo apt-get update
      sudo apt-get install -y python3 python3-venv python3-pip
    else
      apt-get update
      apt-get install -y python3 python3-venv python3-pip
    fi
    return 0
  fi
  if command -v dnf >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1; then
      sudo dnf install -y python3 python3-pip
    else
      dnf install -y python3 python3-pip
    fi
    return 0
  fi
  if command -v yum >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1; then
      sudo yum install -y python3 python3-pip
    else
      yum install -y python3 python3-pip
    fi
    return 0
  fi
  echo "[AILIS vLLM] python3 was not found and no supported package manager was available." >&2
  return 1
}

try_install_python || exit 3

if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
  echo "[AILIS vLLM] python3 is still unavailable after automatic installation attempt." >&2
  exit 3
fi

PYTHON_VERSION="$("${PYTHON_BIN}" - <<'PY'
import sys
print(f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
PY
)"

if ! "${PYTHON_BIN}" - <<'PY'
import sys
raise SystemExit(0 if sys.version_info >= (3, 10) else 1)
PY
then
  echo "[AILIS vLLM] Python ${PYTHON_VERSION} is too old. Trying package-manager upgrade/install..."
  try_install_python || true
  if ! "${PYTHON_BIN}" - <<'PY'
import sys
raise SystemExit(0 if sys.version_info >= (3, 10) else 1)
PY
  then
    echo "[AILIS vLLM] Python ${PYTHON_VERSION} is too old. Use Python 3.10+." >&2
    exit 3
  fi
  PYTHON_VERSION="$("${PYTHON_BIN}" - <<'PY'
import sys
print(f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
PY
)"
fi

if ! "${PYTHON_BIN}" -m venv --help >/dev/null 2>&1; then
  echo "[AILIS vLLM] python3-venv is missing. Trying to install it automatically..."
  if command -v apt-get >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1; then
      sudo apt-get update
      sudo apt-get install -y python3-venv python3-pip
    else
      apt-get update
      apt-get install -y python3-venv python3-pip
    fi
  fi
fi

if ! "${PYTHON_BIN}" -m venv --help >/dev/null 2>&1; then
  echo "[AILIS vLLM] python3-venv is still unavailable after automatic installation attempt." >&2
  exit 3
fi

CLIENT_HOST="${HOST_NAME}"
if [[ "${HOST_NAME}" == "0.0.0.0" || "${HOST_NAME}" == "::" ]]; then
  CLIENT_HOST="127.0.0.1"
fi

BASE_URL="http://${CLIENT_HOST}:${PORT}/v1"
READY_URL="${BASE_URL}/models"
MODEL_ID="${SERVED_MODEL_NAME:-$MODEL}"
VENV_PYTHON="${VENV_DIR}/bin/python"
VENV_VLLM="${VENV_DIR}/bin/vllm"

echo "[AILIS vLLM] One-click environment bootstrap"
echo "[AILIS vLLM] Source: ${SOURCE}"
echo "[AILIS vLLM] Python: ${PYTHON_VERSION}"
echo "[AILIS vLLM] venv: ${VENV_DIR}"
echo "[AILIS vLLM] Model: ${MODEL}"
echo "[AILIS vLLM] AILIS API Base: ${BASE_URL}"
echo "[AILIS vLLM] AILIS Model ID: ${MODEL_ID}"
if [[ "${HOST_NAME}" == "0.0.0.0" || "${HOST_NAME}" == "::" ]]; then
  echo "[AILIS vLLM] LAN clients should replace 127.0.0.1 with this machine IP."
fi

if command -v nvidia-smi >/dev/null 2>&1; then
  echo "[AILIS vLLM] NVIDIA GPU detected:"
  nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader || true
else
  echo "[AILIS vLLM] WARNING: nvidia-smi was not found. vLLM normally needs a CUDA-capable GPU."
fi

if [[ "${SOURCE}" == "modelscope" ]]; then
  export VLLM_USE_MODELSCOPE=True
  echo "[AILIS vLLM] VLLM_USE_MODELSCOPE=True"
else
  unset VLLM_USE_MODELSCOPE || true
fi

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "[AILIS vLLM] Dry run. Would create venv, install vLLM, and optionally start server."
  exit 0
fi

mkdir -p "$(dirname "${VENV_DIR}")"
if [[ ! -x "${VENV_PYTHON}" ]]; then
  echo "[AILIS vLLM] Creating Python virtual environment..."
  "${PYTHON_BIN}" -m venv "${VENV_DIR}"
fi

echo "[AILIS vLLM] Upgrading pip tooling..."
"${VENV_PYTHON}" -m pip install --upgrade pip setuptools wheel

echo "[AILIS vLLM] Installing vLLM and model download helpers..."
if [[ "${SOURCE}" == "modelscope" ]]; then
  "${VENV_PYTHON}" -m pip install --upgrade vllm modelscope
else
  "${VENV_PYTHON}" -m pip install --upgrade vllm huggingface_hub
fi

VLLM_ARGS=(serve "${MODEL}" --host "${HOST_NAME}" --port "${PORT}" --dtype "${DTYPE}" --gpu-memory-utilization "${GPU_MEMORY_UTILIZATION}")
if [[ -n "${SERVED_MODEL_NAME}" ]]; then
  VLLM_ARGS+=(--served-model-name "${SERVED_MODEL_NAME}")
fi
if [[ -n "${DOWNLOAD_DIR}" ]]; then
  VLLM_ARGS+=(--download-dir "${DOWNLOAD_DIR}")
fi
if [[ "${TENSOR_PARALLEL_SIZE}" != "1" ]]; then
  VLLM_ARGS+=(--tensor-parallel-size "${TENSOR_PARALLEL_SIZE}")
fi
if [[ -n "${MAX_MODEL_LEN}" && "${MAX_MODEL_LEN}" != "0" ]]; then
  VLLM_ARGS+=(--max-model-len "${MAX_MODEL_LEN}")
fi
if [[ -n "${QUANTIZATION}" ]]; then
  VLLM_ARGS+=(--quantization "${QUANTIZATION}")
fi
if [[ "${TRUST_REMOTE_CODE}" == "true" ]]; then
  VLLM_ARGS+=(--trust-remote-code)
fi
if [[ ${#EXTRA_ARGS[@]} -gt 0 ]]; then
  VLLM_ARGS+=("${EXTRA_ARGS[@]}")
fi

echo "[AILIS vLLM] vLLM command:"
printf '  %q' "${VENV_VLLM}" "${VLLM_ARGS[@]}"
printf '\n'

if [[ "${START_AFTER_INSTALL}" != "true" ]]; then
  echo "[AILIS vLLM] Install/update complete. Re-run with --start to launch vLLM."
  exit 0
fi

wait_ready() {
  local deadline=$((SECONDS + READY_TIMEOUT_SEC))
  while [[ ${SECONDS} -lt ${deadline} ]]; do
    if "${VENV_PYTHON}" - "${READY_URL}" <<'PY'
import json
import sys
import urllib.request

url = sys.argv[1]
try:
    with urllib.request.urlopen(url, timeout=5) as response:
        data = json.loads(response.read().decode("utf-8"))
    ids = [item.get("id") for item in data.get("data", []) if item.get("id")]
    print("[AILIS vLLM] Ready. /v1/models:", ", ".join(ids) or "(no model ids)")
    raise SystemExit(0)
except Exception:
    raise SystemExit(1)
PY
    then
      return 0
    fi
    sleep 3
  done
  return 1
}

if [[ "${DETACHED}" == "true" ]]; then
  LOG_DIR=".ailis-runtime/vllm"
  mkdir -p "${LOG_DIR}"
  STDOUT_LOG="${LOG_DIR}/vllm.out.log"
  STDERR_LOG="${LOG_DIR}/vllm.err.log"
  PID_FILE="${LOG_DIR}/vllm.pid"
  echo "[AILIS vLLM] Starting detached server..."
  nohup "${VENV_VLLM}" "${VLLM_ARGS[@]}" >"${STDOUT_LOG}" 2>"${STDERR_LOG}" &
  echo "$!" >"${PID_FILE}"
  echo "[AILIS vLLM] PID: $(cat "${PID_FILE}")"
  echo "[AILIS vLLM] stdout: ${STDOUT_LOG}"
  echo "[AILIS vLLM] stderr: ${STDERR_LOG}"
  if [[ "${WAIT_READY}" == "true" ]]; then
    if ! wait_ready; then
      echo "[AILIS vLLM] vLLM did not become ready within ${READY_TIMEOUT_SEC}s. Check ${STDERR_LOG}." >&2
      exit 4
    fi
  fi
  exit 0
fi

echo "[AILIS vLLM] Starting foreground server. Press Ctrl+C to stop."
exec "${VENV_VLLM}" "${VLLM_ARGS[@]}"
