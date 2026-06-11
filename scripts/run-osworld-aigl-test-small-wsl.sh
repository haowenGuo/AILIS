#!/usr/bin/env bash
set -uo pipefail

AIGL_ROOT="${AIGL_ROOT:-/mnt/f/AIGril}"
OSWORLD_DIR="${OSWORLD_DIR:-${AIGL_ROOT}/build-cache/OSWorld}"
OSWORLD_VENV="${OSWORLD_VENV:-/root/aigl-osworld-venv}"
TEST_META="${TEST_META:-evaluation_examples/test_small.json}"
RESULT_DIR="${RESULT_DIR:-${AIGL_ROOT}/eval-results/engineering/osworld-aigl-test-small}"
ACTION_SPACE="${ACTION_SPACE:-pyautogui}"
OBSERVATION_TYPE="${OBSERVATION_TYPE:-screenshot_a11y_tree}"
MODEL_NAME="${MODEL_NAME:-aigl-osworld}"
MAX_STEPS="${MAX_STEPS:-15}"
PER_TASK_TIMEOUT_SECONDS="${PER_TASK_TIMEOUT_SECONDS:-480}"
SLEEP_AFTER_EXECUTION="${SLEEP_AFTER_EXECUTION:-0.2}"
PREFETCH_ASSETS="${PREFETCH_ASSETS:-1}"

if [[ ! -f "${OSWORLD_VENV}/bin/activate" ]]; then
  echo "OSWorld venv not found: ${OSWORLD_VENV}" >&2
  exit 1
fi

source "${OSWORLD_VENV}/bin/activate"
export PYTHONPATH="${AIGL_ROOT}/scripts/osworld:${OSWORLD_DIR}:${PYTHONPATH:-}"

if [[ "${PREFETCH_ASSETS}" != "0" ]]; then
  python "${AIGL_ROOT}/scripts/osworld/prefetch_osworld_assets.py" \
    --osworld-dir "${OSWORLD_DIR}" \
    --test-all-meta-path "${TEST_META}" \
    --cache-dir cache || echo "asset prefetch reported failures; continuing so cached/online tasks can still run"
fi

task_count="$(
  cd "${OSWORLD_DIR}" && python - "${TEST_META}" <<'PY'
import json
import sys
with open(sys.argv[1], "r", encoding="utf-8") as handle:
    meta = json.load(handle)
print(sum(len(items) for items in meta.values()))
PY
)"

task_info() {
  cd "${OSWORLD_DIR}" && python - "${TEST_META}" "$1" <<'PY'
import json
import sys
with open(sys.argv[1], "r", encoding="utf-8") as handle:
    meta = json.load(handle)
flat = [(domain, example_id) for domain, ids in meta.items() for example_id in ids]
domain, example_id = flat[int(sys.argv[2])]
print(domain)
print(example_id)
PY
}

mark_zero() {
  local domain="$1"
  local example_id="$2"
  local reason="$3"
  local example_dir="${RESULT_DIR}/${ACTION_SPACE}/${OBSERVATION_TYPE}/${MODEL_NAME}/${domain}/${example_id}"
  mkdir -p "${example_dir}"
  if [[ ! -f "${example_dir}/result.txt" ]]; then
    printf '0.0\n' > "${example_dir}/result.txt"
  fi
  printf '{"Error":%s}\n' "$(python -c 'import json,sys; print(json.dumps(sys.argv[1]))' "${reason}")" >> "${example_dir}/traj.jsonl"
}

stop_osworld_containers() {
  docker ps --filter ancestor=happysixd/osworld-docker:latest -q | xargs -r docker stop >/dev/null 2>&1
}

mkdir -p "${RESULT_DIR}/batch-logs"

echo "AIGL OSWorld batch starting: ${task_count} tasks"
echo "result_dir=${RESULT_DIR}"
echo "per_task_timeout=${PER_TASK_TIMEOUT_SECONDS}s"

for idx in $(seq 0 $((task_count - 1))); do
  mapfile -t info < <(task_info "${idx}")
  domain="${info[0]}"
  example_id="${info[1]}"
  result_file="${RESULT_DIR}/${ACTION_SPACE}/${OBSERVATION_TYPE}/${MODEL_NAME}/${domain}/${example_id}/result.txt"
  log_file="${RESULT_DIR}/batch-logs/task-${idx}-${domain}-${example_id}.log"

  if [[ -f "${result_file}" ]]; then
    echo "[$((idx + 1))/${task_count}] skip ${domain}/${example_id}: result exists"
    continue
  fi

  echo "[$((idx + 1))/${task_count}] run ${domain}/${example_id}"
  timeout --kill-after=30s "${PER_TASK_TIMEOUT_SECONDS}s" \
    bash "${AIGL_ROOT}/scripts/run-osworld-aigl-wsl.sh" \
      --provider_name docker \
      --headless \
      --action_space "${ACTION_SPACE}" \
      --observation_type "${OBSERVATION_TYPE}" \
      --model "${MODEL_NAME}" \
      --include_screenshot \
      --test_all_meta_path "${TEST_META}" \
      --result_dir "${RESULT_DIR}" \
      --start_index "${idx}" \
      --limit 1 \
      --max_steps "${MAX_STEPS}" \
      --task_timeout_seconds "$((PER_TASK_TIMEOUT_SECONDS - 30))" \
      --sleep_after_execution "${SLEEP_AFTER_EXECUTION}" \
      >"${log_file}" 2>&1
  status=$?

  if [[ ${status} -eq 124 || ${status} -eq 137 ]]; then
    echo "[$((idx + 1))/${task_count}] timeout ${domain}/${example_id}"
    mark_zero "${domain}" "${example_id}" "outer_task_timeout_${PER_TASK_TIMEOUT_SECONDS}s"
  elif [[ ${status} -ne 0 ]]; then
    echo "[$((idx + 1))/${task_count}] failed ${domain}/${example_id}: exit ${status}"
    mark_zero "${domain}" "${example_id}" "outer_task_exit_${status}"
  else
    echo "[$((idx + 1))/${task_count}] done ${domain}/${example_id}"
  fi

  stop_osworld_containers
done

cd "${OSWORLD_DIR}" && python "${AIGL_ROOT}/scripts/osworld/run_aigl_osworld.py" \
  --validate_only \
  --action_space "${ACTION_SPACE}" \
  --observation_type "${OBSERVATION_TYPE}" \
  --model "${MODEL_NAME}" \
  --test_all_meta_path "${TEST_META}" \
  --result_dir "${RESULT_DIR}"
