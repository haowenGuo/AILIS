"""Resumable official AgentBench runner for one task environment."""

from __future__ import annotations

import argparse
import json
import os
import sys
import pathlib
import time
import types
from typing import Any, Dict, Iterable, List

import src as agentbench_src

# AgentBench's package initializer eagerly imports optional FastChat agents.
# Register its client directory directly so this runner loads only the official
# TaskClient and AgentClient modules it actually uses.
official_client_package = types.ModuleType("src.client")
official_client_package.__path__ = [
    str(pathlib.Path(agentbench_src.__file__).resolve().parent / "client")
]
sys.modules.setdefault("src.client", official_client_package)

from src.client.task import TaskClient
from src.typings import TaskOutput

from evals.agentbench_official import AILISAgentClient
from evals.agentbench_official.records import (
    budget_violations,
    is_infrastructure_error,
    record_quality,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", required=True)
    parser.add_argument("--controller", default="http://127.0.0.1:5000/api")
    parser.add_argument("--bridge", default="http://127.0.0.1:5128/inference")
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--timeout-seconds", type=int, default=180)
    parser.add_argument("--wait-worker-seconds", type=int, default=600)
    parser.add_argument("--retry-errors", action="store_true")
    parser.add_argument("--max-calls", type=int, default=0)
    parser.add_argument("--max-tokens", type=int, default=0)
    parser.add_argument("--max-duration-ms", type=int, default=0)
    parser.add_argument("--max-consecutive-infrastructure-errors", type=int, default=3)
    return parser.parse_args()


def json_key(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_records(path: pathlib.Path) -> Dict[str, Dict[str, Any]]:
    records: Dict[str, Dict[str, Any]] = {}
    if not path.exists():
        return records
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        record = json.loads(line)
        records[json_key(record["index"])] = record
    return records


def append_record(path: pathlib.Path, record: Dict[str, Any]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
        handle.flush()
        os.fsync(handle.fileno())


def wait_for_worker(client: TaskClient, timeout_seconds: int) -> None:
    deadline = time.time() + max(1, timeout_seconds)
    while time.time() < deadline:
        if client.get_concurrency() > 0:
            return
        time.sleep(3)
    raise TimeoutError(f"AgentBench worker did not become ready for {client.name}")


def sum_usage(records: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    totals = {"calls": 0, "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    for record in records:
        for call in record.get("agent_calls") or []:
            totals["calls"] += 1
            usage = ((call.get("bridge") or {}).get("usage") or {})
            totals["prompt_tokens"] += int(usage.get("prompt_tokens") or 0)
            totals["completion_tokens"] += int(usage.get("completion_tokens") or 0)
            totals["total_tokens"] += int(usage.get("total_tokens") or 0)
    return totals


def main() -> None:
    args = parse_args()
    output_dir = pathlib.Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    stem = f"{args.run_id}.{args.task}"
    progress_path = output_dir / f"{stem}.progress.jsonl"
    summary_path = output_dir / f"{stem}.summary.json"

    client = TaskClient(name=args.task, controller_address=args.controller)
    wait_for_worker(client, args.wait_worker_seconds)
    all_indices = client.get_indices()
    selected = all_indices[max(0, args.offset) :]
    if args.limit > 0:
        selected = selected[: args.limit]

    records = load_records(progress_path)

    def enforce_budget() -> None:
        violations = budget_violations(
            list(records.values()),
            max_calls=args.max_calls,
            max_tokens=args.max_tokens,
            max_duration_ms=args.max_duration_ms,
        )
        if violations:
            raise RuntimeError(f"AgentBench stage budget exceeded: {','.join(violations)}")

    enforce_budget()
    consecutive_infrastructure_errors = 0
    for position, index in enumerate(selected, start=1):
        prior = records.get(json_key(index))
        if prior and not (args.retry_errors and is_infrastructure_error(prior)):
            print(f"[{position}/{len(selected)}] {index}: resume-skip", flush=True)
            continue
        agent = AILISAgentClient(
            bridge_url=args.bridge,
            session_id=f"{args.run_id}:{args.task}:{json_key(index)}",
            timeout_seconds=args.timeout_seconds,
        )
        started_at = time.time()
        result = client.run_sample(index, agent)
        task_output = result.output.dict() if result.output is not None else None
        record = {
            "task": args.task,
            "index": index,
            "error": result.error,
            "info": result.info,
            "duration_ms": round((time.time() - started_at) * 1000),
            "task_output": task_output,
            "agent_calls": agent.call_stats,
            "recorded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        append_record(progress_path, record)
        records[json_key(index)] = record
        print(
            f"[{position}/{len(selected)}] {index}: "
            f"error={result.error or 'none'} turns={len(agent.call_stats)}",
            flush=True,
        )
        if is_infrastructure_error(record):
            consecutive_infrastructure_errors += 1
        else:
            consecutive_infrastructure_errors = 0
        if consecutive_infrastructure_errors >= max(1, args.max_consecutive_infrastructure_errors):
            raise RuntimeError(
                "AgentBench runner circuit breaker opened after "
                f"{consecutive_infrastructure_errors} consecutive infrastructure errors"
            )
        enforce_budget()

    ordered_records = [records[json_key(index)] for index in selected if json_key(index) in records]
    task_outputs: List[TaskOutput] = [
        TaskOutput.parse_obj(record["task_output"])
        for record in ordered_records
        if record.get("task_output") is not None
    ]
    quality = record_quality(ordered_records)
    official_score = None
    valid = (
        len(ordered_records) == len(selected)
        and quality["infrastructure_errors"] == 0
        and bool(task_outputs)
        and len(task_outputs) == len(selected)
    )
    if valid:
        wait_for_worker(client, args.wait_worker_seconds)
        official_score = client.calculate_overall(task_outputs)
    summary = {
        "schema": "ailis.agentbench.official.environment.v1",
        "run_id": args.run_id,
        "task": args.task,
        "official_controller": args.controller,
        "selected": len(selected),
        "completed_records": len(ordered_records),
        "error_records": quality["infrastructure_errors"],
        "valid": valid and official_score is not None,
        "quality": quality,
        "duration_ms": sum(int(item.get("duration_ms") or 0) for item in ordered_records),
        "usage": sum_usage(ordered_records),
        "official_score": official_score,
        "progress_path": str(progress_path),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
