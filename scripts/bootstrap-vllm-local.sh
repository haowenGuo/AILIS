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
VLLM_PACKAGE="${AILIS_VLLM_PACKAGE:-auto}"
PIP_INDEX_URL_ARG="${AILIS_PIP_INDEX_URL:-}"
PIP_EXTRA_INDEX_URL_ARG="${AILIS_PIP_EXTRA_INDEX_URL:-}"
PIP_MIRROR_POLICY="${AILIS_PIP_MIRROR_POLICY:-auto}"
TENSOR_PARALLEL_SIZE="1"
GPU_MEMORY_UTILIZATION="0.9"
MAX_MODEL_LEN=""
CPU_OFFLOAD_GB=""
SWAP_SPACE=""
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
  --source hf|modelscope|local    Model source. Default: hf
  --model MODEL_ID_OR_PATH        HF/ModelScope model id, or a local model directory when --source local.
  --served-model-name NAME        Stable model id exposed by /v1/models.
  --host HOST                     vLLM listen host. Default: 127.0.0.1
  --port PORT                     vLLM port. Default: 8000
  --venv-dir PATH                 Python venv path. Default: .ailis-runtime/vllm-venv
  --download-dir PATH             vLLM model cache/download directory.
  --dtype auto|float16|bfloat16   vLLM dtype. Default: auto
  --vllm-package SPEC             vLLM pip package: auto, stable, latest, or e.g. vllm==0.5.5.
  --pip-index-url URL             Optional pip index URL for slow or regional networks.
  --pip-extra-index-url URL       Optional extra pip index URL.
  --tensor-parallel-size N        Multi-GPU tensor parallel size.
  --gpu-memory-utilization FLOAT  vLLM GPU memory fraction. Default: 0.9
  --max-model-len N               Reduce context length when GPU memory is tight.
  --cpu-offload-gb N              Offload model weights to CPU RAM when GPU memory is tight.
  --swap-space N                  CPU swap space in GiB for vLLM.
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
    --vllm-package) VLLM_PACKAGE="${2:-auto}"; shift 2 ;;
    --pip-index-url) PIP_INDEX_URL_ARG="${2:-}"; shift 2 ;;
    --pip-extra-index-url) PIP_EXTRA_INDEX_URL_ARG="${2:-}"; shift 2 ;;
    --tensor-parallel-size) TENSOR_PARALLEL_SIZE="${2:-}"; shift 2 ;;
    --gpu-memory-utilization) GPU_MEMORY_UTILIZATION="${2:-}"; shift 2 ;;
    --max-model-len) MAX_MODEL_LEN="${2:-}"; shift 2 ;;
    --cpu-offload-gb) CPU_OFFLOAD_GB="${2:-}"; shift 2 ;;
    --swap-space) SWAP_SPACE="${2:-}"; shift 2 ;;
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
  local|path|folder) SOURCE="local" ;;
  hf|huggingface) SOURCE="hf" ;;
  ms|modelscope) SOURCE="modelscope" ;;
  *) echo "[AILIS vLLM] --source must be hf, modelscope, or local." >&2; exit 2 ;;
esac

expand_user_path() {
  local value="${1:-}"
  case "${value}" in
    "~") printf '%s' "${HOME}" ;;
    "~/"*) printf '%s/%s' "${HOME}" "${value#\~/}" ;;
    *) printf '%s' "${value}" ;;
  esac
}

VENV_DIR="$(expand_user_path "${VENV_DIR}")"
if [[ -n "${DOWNLOAD_DIR}" ]]; then
  DOWNLOAD_DIR="$(expand_user_path "${DOWNLOAD_DIR}")"
fi

if [[ -z "${MODEL}" ]]; then
  echo "[AILIS vLLM] --model cannot be empty." >&2
  exit 2
fi

PYTHON_BIN="${PYTHON_BIN:-python3}"
LEGACY_VLLM_TRANSFORMERS_VERSION="4.44.2"

local_model_declares_modern_transformers() {
  [[ "${SOURCE}" == "local" ]] || return 1
  [[ -f "${MODEL}/config.json" ]] || return 1
  command -v "${PYTHON_BIN}" >/dev/null 2>&1 || return 1
  "${PYTHON_BIN}" - "${MODEL}/config.json" "${LEGACY_VLLM_TRANSFORMERS_VERSION}" <<'PY' >/dev/null 2>&1
import json
import re
import sys

config_path = sys.argv[1]
legacy_version = sys.argv[2]

def parse_version(value):
    numbers = [int(part) for part in re.findall(r"\d+", str(value or ""))[:3]]
    return tuple((numbers + [0, 0, 0])[:3])

try:
    with open(config_path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
except Exception:
    raise SystemExit(1)

declared = data.get("transformers_version") or ""
raise SystemExit(0 if declared and parse_version(declared) > parse_version(legacy_version) else 1)
PY
}

local_model_transformers_requirement() {
  [[ "${SOURCE}" == "local" ]] || return 1
  [[ -f "${MODEL}/config.json" ]] || return 1
  command -v "${PYTHON_BIN}" >/dev/null 2>&1 || return 1
  "${PYTHON_BIN}" - "${MODEL}/config.json" <<'PY' 2>/dev/null
import json
import sys

try:
    with open(sys.argv[1], "r", encoding="utf-8") as handle:
        data = json.load(handle)
except Exception:
    raise SystemExit(1)

value = str(data.get("transformers_version") or "").strip()
if not value:
    raise SystemExit(1)
print(value)
PY
}

resolve_vllm_package() {
  local requested="${VLLM_PACKAGE:-auto}"
  case "${requested,,}" in
    latest)
      echo "vllm"
      return 0
      ;;
    stable)
      echo "vllm==0.5.5"
      return 0
      ;;
    auto)
      if local_model_declares_modern_transformers; then
        echo "vllm"
        return 0
      fi
      local driver_major=""
      if command -v nvidia-smi >/dev/null 2>&1; then
        driver_major="$(nvidia-smi --query-gpu=driver_version --format=csv,noheader 2>/dev/null | head -n 1 | sed -E 's/^([0-9]+).*/\1/' || true)"
      fi
      if [[ -n "${driver_major}" && "${driver_major}" =~ ^[0-9]+$ && "${driver_major}" -lt 550 ]]; then
        echo "vllm==0.5.5"
        return 0
      fi
      echo "vllm"
      return 0
      ;;
    *)
      echo "${requested}"
      return 0
      ;;
  esac
}

build_pip_args() {
  if [[ -z "${PIP_INDEX_URL_ARG}" ]]; then
    case "${PIP_MIRROR_POLICY,,}" in
      off|none|disabled)
        ;;
      *)
        PIP_INDEX_URL_ARG="https://pypi.tuna.tsinghua.edu.cn/simple"
        ;;
    esac
  fi
  PIP_COMMON_ARGS=(--timeout 60 --retries 3)
  if [[ -n "${PIP_INDEX_URL_ARG}" ]]; then
    PIP_COMMON_ARGS+=(--index-url "${PIP_INDEX_URL_ARG}")
  fi
  if [[ -n "${PIP_EXTRA_INDEX_URL_ARG}" ]]; then
    PIP_COMMON_ARGS+=(--extra-index-url "${PIP_EXTRA_INDEX_URL_ARG}")
  fi
}

build_vllm_compat_packages() {
  VLLM_COMPAT_PACKAGES=()
  if [[ "${RESOLVED_VLLM_PACKAGE}" == "vllm==0.5.5" ]]; then
    # vLLM 0.5.x predates transformers 5.x; pin the known-compatible stack.
    VLLM_COMPAT_PACKAGES+=("transformers==4.44.2" "tokenizers==0.19.1" "huggingface-hub==0.36.2")
  else
    local required_transformers=""
    required_transformers="$(local_model_transformers_requirement || true)"
    if [[ -n "${required_transformers}" ]]; then
      VLLM_COMPAT_PACKAGES+=("transformers>=${required_transformers},<5")
    fi
  fi
}

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
RESOLVED_VLLM_PACKAGE="$(resolve_vllm_package)"
build_pip_args
build_vllm_compat_packages

echo "[AILIS vLLM] One-click environment bootstrap"
echo "[AILIS vLLM] Source: ${SOURCE}"
echo "[AILIS vLLM] Python: ${PYTHON_VERSION}"
echo "[AILIS vLLM] venv: ${VENV_DIR}"
echo "[AILIS vLLM] vLLM package: ${RESOLVED_VLLM_PACKAGE} (requested: ${VLLM_PACKAGE})"
if [[ ${#VLLM_COMPAT_PACKAGES[@]} -gt 0 ]]; then
  echo "[AILIS vLLM] compatibility pins: ${VLLM_COMPAT_PACKAGES[*]}"
fi
if [[ -n "${PIP_INDEX_URL_ARG}" ]]; then
  echo "[AILIS vLLM] pip index: ${PIP_INDEX_URL_ARG}"
fi
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

read_ready_model_ids() {
  "${PYTHON_BIN}" - "${READY_URL}" <<'PY' 2>/dev/null || true
import json
import sys
import urllib.request

url = sys.argv[1]
try:
    with urllib.request.urlopen(url, timeout=3) as response:
        data = json.loads(response.read().decode("utf-8"))
except Exception:
    raise SystemExit(0)
for item in data.get("data", []):
    model_id = item.get("id")
    if model_id:
        print(model_id)
PY
}

find_vllm_pids_for_port() {
  ps -eo pid=,args= 2>/dev/null | awk -v port="${PORT}" '
    BEGIN {
      space_pattern = "--port " port
      equals_pattern = "--port=" port
    }
    tolower($0) ~ /vllm/ && $0 ~ /serve/ && ($0 ~ space_pattern || $0 ~ equals_pattern) {
      print $1
    }
  ' || true
}

stop_vllm_pids_for_port() {
  local pids
  pids="$(find_vllm_pids_for_port)"
  if [[ -z "${pids}" ]]; then
    pkill -f "[v]llm.*serve.*--port[ =]${PORT}" 2>/dev/null || true
    sleep 2
    pids="$(find_vllm_pids_for_port)"
  fi
  if [[ -z "${pids}" ]]; then
    echo "[AILIS vLLM] No matching vLLM process was found for port ${PORT}."
    return 0
  fi
  echo "[AILIS vLLM] Stopping vLLM process(es) on port ${PORT}: ${pids//$'\n'/, }"
  kill ${pids} 2>/dev/null || true
  sleep 3
  pids="$(find_vllm_pids_for_port)"
  if [[ -n "${pids}" ]]; then
    echo "[AILIS vLLM] Force stopping vLLM process(es) on port ${PORT}: ${pids//$'\n'/, }"
    kill -9 ${pids} 2>/dev/null || true
    sleep 1
  fi
}

exit_if_existing_vllm_serves_target() {
  local current_ids
  current_ids="$(read_ready_model_ids)"
  if [[ -n "${current_ids}" ]] && printf '%s\n' "${current_ids}" | grep -Fxq "${MODEL_ID}"; then
    echo "[AILIS vLLM] Existing vLLM service already serves ${MODEL_ID}. Nothing to restart."
    exit 0
  fi
  if [[ -n "${current_ids}" ]]; then
    echo "[AILIS vLLM] Existing vLLM service is serving: ${current_ids//$'\n'/, }"
    echo "[AILIS vLLM] AILIS will keep it alive until the new runtime has been installed and verified."
  fi
}

stop_existing_vllm_for_port() {
  if [[ "${START_AFTER_INSTALL}" != "true" ]]; then
    return 0
  fi
  local current_ids
  current_ids="$(read_ready_model_ids)"
  if [[ -n "${current_ids}" ]] && printf '%s\n' "${current_ids}" | grep -Fxq "${MODEL_ID}"; then
    echo "[AILIS vLLM] Existing vLLM service already serves ${MODEL_ID}. Nothing to restart."
    exit 0
  fi
  if [[ -n "${current_ids}" ]]; then
    echo "[AILIS vLLM] Existing vLLM service is serving: ${current_ids//$'\n'/, }"
    echo "[AILIS vLLM] Switching model now that the new runtime has been verified."
    stop_vllm_pids_for_port
    return 0
  fi
  if [[ -n "$(find_vllm_pids_for_port)" ]]; then
    echo "[AILIS vLLM] Found an existing vLLM process on port ${PORT} before readiness check completed."
    stop_vllm_pids_for_port
  fi
}

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "[AILIS vLLM] Dry run. Would create venv, install vLLM, and optionally start server."
  exit 0
fi

exit_if_existing_vllm_serves_target

vllm_runtime_import_ok() {
  [[ -x "${VENV_PYTHON}" ]] || return 1
  "${VENV_PYTHON}" - <<'PY' >/dev/null 2>&1
import importlib
importlib.invalidate_caches()
import vllm  # noqa: F401
PY
}

local_model_config_supported_by_runtime() {
  [[ "${SOURCE}" == "local" ]] || return 0
  [[ -d "${MODEL}" ]] || return 1
  "${VENV_PYTHON}" - "${MODEL}" <<'PY'
import sys
from transformers import AutoConfig

AutoConfig.from_pretrained(sys.argv[1], trust_remote_code=True)
PY
}

RUNTIME_REUSED="false"
if [[ "${SOURCE}" == "local" && -x "${VENV_PYTHON}" ]]; then
  echo "[AILIS vLLM] Checking existing vLLM runtime before installing packages..."
  if vllm_runtime_import_ok; then
    if compat_output="$(local_model_config_supported_by_runtime 2>&1)"; then
      RUNTIME_REUSED="true"
      echo "[AILIS vLLM] Existing vLLM runtime is usable for this local model. Skipping pip install."
    else
      echo "[AILIS vLLM] Existing vLLM runtime imports, but it cannot read this model config yet."
      printf '%s\n' "${compat_output}" | sed -n '1,4p'
      echo "[AILIS vLLM] AILIS will upgrade/repair the vLLM runtime before launching this model."
    fi
  else
    echo "[AILIS vLLM] Existing vLLM runtime is not usable yet. AILIS will repair/install it."
  fi
fi

mkdir -p "$(dirname "${VENV_DIR}")"
if [[ ! -x "${VENV_PYTHON}" ]]; then
  echo "[AILIS vLLM] Creating Python virtual environment..."
  "${PYTHON_BIN}" -m venv "${VENV_DIR}"
fi

if [[ "${RUNTIME_REUSED}" != "true" ]]; then
  echo "[AILIS vLLM] Upgrading pip tooling..."
  "${VENV_PYTHON}" -m pip install "${PIP_COMMON_ARGS[@]}" --upgrade pip setuptools wheel

  echo "[AILIS vLLM] Installing vLLM and model download helpers..."
  if [[ "${SOURCE}" == "modelscope" ]]; then
    "${VENV_PYTHON}" -m pip install "${PIP_COMMON_ARGS[@]}" --upgrade --upgrade-strategy eager "${RESOLVED_VLLM_PACKAGE}" "${VLLM_COMPAT_PACKAGES[@]}" modelscope huggingface_hub
  else
    "${VENV_PYTHON}" -m pip install "${PIP_COMMON_ARGS[@]}" --upgrade --upgrade-strategy eager "${RESOLVED_VLLM_PACKAGE}" "${VLLM_COMPAT_PACKAGES[@]}" huggingface_hub modelscope
  fi
else
  echo "[AILIS vLLM] Reusing vLLM runtime at ${VENV_DIR}."
fi

echo "[AILIS vLLM] Verifying vLLM runtime import..."
"${VENV_PYTHON}" - <<'PY'
import importlib
import os
import sys
import sysconfig
import traceback

def verify():
    importlib.invalidate_caches()
    import vllm  # noqa: F401

try:
    verify()
except ModuleNotFoundError as error:
    missing = error.name or ""
    if missing not in {"pyairports", "pyairports.airports"}:
        raise
    site_packages = sysconfig.get_paths().get("purelib") or ""
    if not site_packages:
        raise
    package_dir = os.path.join(site_packages, "pyairports")
    os.makedirs(package_dir, exist_ok=True)
    init_path = os.path.join(package_dir, "__init__.py")
    airports_path = os.path.join(package_dir, "airports.py")
    if not os.path.exists(init_path):
        with open(init_path, "w", encoding="utf-8") as handle:
            handle.write("# Compatibility shim for broken pyairports wheels.\n")
    with open(airports_path, "w", encoding="utf-8") as handle:
        handle.write(
            "# Minimal compatibility data used only to let outlines initialize.\n"
            "AIRPORT_LIST = [('Beijing Capital International Airport', 'China', 'Beijing', 'PEK')]\n"
        )
    print("[AILIS vLLM] Applied pyairports compatibility shim for broken upstream wheel.")
    verify()
except Exception:
    traceback.print_exc()
    raise SystemExit(1)
else:
    print("[AILIS vLLM] vLLM import check passed.")
PY

if [[ "${SOURCE}" == "local" ]]; then
  echo "[AILIS vLLM] Verifying this runtime can read the local model config..."
  if ! compat_output="$(local_model_config_supported_by_runtime 2>&1)"; then
    echo "[AILIS vLLM] vLLM runtime still cannot read this local model config after install/repair." >&2
    printf '%s\n' "${compat_output}" | sed -n '1,12p' >&2
    echo "[AILIS vLLM] Please upgrade vLLM/Transformers, choose a smaller supported model, or use a quantized/Ollama model." >&2
    exit 14
  fi
  echo "[AILIS vLLM] Local model config compatibility check passed."
fi

download_model_snapshot() {
  MODEL_RUNTIME_PATH="${MODEL}"
  if [[ "${SOURCE}" == "local" || -d "${MODEL}" || -f "${MODEL}" ]]; then
    if [[ ! -d "${MODEL}" && ! -f "${MODEL}" ]]; then
      echo "[AILIS vLLM] Local model path was not found: ${MODEL}" >&2
      return 12
    fi
    echo "[AILIS vLLM] Model is a local path. Skipping remote snapshot download."
    return 0
  fi

  echo "[AILIS vLLM] Downloading model snapshot into local cache..."
  local snapshot_path_file
  snapshot_path_file="$(mktemp)"

  download_from_modelscope() {
    "${VENV_PYTHON}" - "${MODEL}" "${DOWNLOAD_DIR}" "${snapshot_path_file}" <<'PY'
import sys
from modelscope import snapshot_download

model_id = sys.argv[1]
download_dir = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else ""
snapshot_path_file = sys.argv[3] if len(sys.argv) > 3 else ""
kwargs = {}
if download_dir:
    kwargs["cache_dir"] = download_dir
local_path = snapshot_download(model_id, **kwargs)
if snapshot_path_file:
    with open(snapshot_path_file, "w", encoding="utf-8") as handle:
        handle.write(local_path)
print(f"[AILIS vLLM] ModelScope snapshot ready: {local_path}")
PY
  }

  download_from_huggingface() {
    "${VENV_PYTHON}" - "${MODEL}" "${DOWNLOAD_DIR}" "${snapshot_path_file}" <<'PY'
import sys
from huggingface_hub import snapshot_download

repo_id = sys.argv[1]
download_dir = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else ""
snapshot_path_file = sys.argv[3] if len(sys.argv) > 3 else ""
kwargs = {"repo_id": repo_id}
if download_dir:
    kwargs["cache_dir"] = download_dir
local_path = snapshot_download(**kwargs)
if snapshot_path_file:
    with open(snapshot_path_file, "w", encoding="utf-8") as handle:
        handle.write(local_path)
print(f"[AILIS vLLM] Hugging Face snapshot ready: {local_path}")
PY
  }

  if [[ "${SOURCE}" == "modelscope" ]]; then
    if ! download_from_modelscope; then
      echo "[AILIS vLLM] ModelScope download failed. Trying Hugging Face as fallback..." >&2
      download_from_huggingface
    fi
  else
    if ! download_from_huggingface; then
      echo "[AILIS vLLM] Hugging Face download failed. Trying ModelScope as fallback..." >&2
      download_from_modelscope
    fi
  fi
  if [[ -s "${snapshot_path_file}" ]]; then
    MODEL_RUNTIME_PATH="$(cat "${snapshot_path_file}")"
    echo "[AILIS vLLM] Runtime model path: ${MODEL_RUNTIME_PATH}"
  fi
  rm -f "${snapshot_path_file}"
}

download_model_snapshot

VLLM_ARGS=(serve "${MODEL_RUNTIME_PATH}" --host "${HOST_NAME}" --port "${PORT}" --dtype "${DTYPE}" --gpu-memory-utilization "${GPU_MEMORY_UTILIZATION}")
if [[ -n "${SERVED_MODEL_NAME}" || "${MODEL_RUNTIME_PATH}" != "${MODEL}" ]]; then
  VLLM_ARGS+=(--served-model-name "${MODEL_ID}")
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
if [[ -n "${CPU_OFFLOAD_GB}" && "${CPU_OFFLOAD_GB}" != "0" ]]; then
  VLLM_ARGS+=(--cpu-offload-gb "${CPU_OFFLOAD_GB}")
fi
if [[ -n "${SWAP_SPACE}" && "${SWAP_SPACE}" != "0" ]]; then
  VLLM_ARGS+=(--swap-space "${SWAP_SPACE}")
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

stop_existing_vllm_for_port

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
