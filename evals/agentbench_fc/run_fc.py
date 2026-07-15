"""Resumable pass@1 runner for the official AgentBench FC controller API."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple

from evals.agentbench_fc import AGENTBENCH_FC_SCHEMA
from evals.agentbench_fc.records import (
    budget_violations,
    is_infrastructure_error,
    record_quality,
)


@dataclass
class HttpFailure(Exception):
    kind: str
    status: int
    message: str
    payload: Optional[Any] = None

    def __str__(self) -> str:
        return f"{self.kind} ({self.status}): {self.message}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", required=True)
    parser.add_argument("--controller", default="http://127.0.0.1:5020/api")
    parser.add_argument("--bridge", default="http://127.0.0.1:5128/v1")
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--timeout-seconds", type=int, default=180)
    parser.add_argument("--max-environment-turns", type=int, default=20)
    parser.add_argument("--temperature", type=float, default=0.8)
    parser.add_argument("--retry-errors", action="store_true")
    parser.add_argument("--max-calls", type=int, default=0)
    parser.add_argument("--max-tokens", type=int, default=0)
    parser.add_argument("--max-duration-ms", type=int, default=0)
    parser.add_argument("--max-consecutive-infrastructure-errors", type=int, default=3)
    return parser.parse_args()


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def json_key(value: Any) -> str:
    return canonical_json(value)


def normalize_usage(value: Any) -> Dict[str, int]:
    usage = value if isinstance(value, dict) else {}
    prompt = int(usage.get("prompt_tokens") or usage.get("input_tokens") or 0)
    completion = int(usage.get("completion_tokens") or usage.get("output_tokens") or 0)
    total = int(usage.get("total_tokens") or prompt + completion)
    return {
        "prompt_tokens": prompt,
        "completion_tokens": completion,
        "total_tokens": total,
    }


def request_json(
    method: str,
    url: str,
    payload: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
    timeout_seconds: int = 180,
    failure_kind: str = "controller_transport",
) -> Tuple[Any, Dict[str, str]]:
    body = canonical_json(payload).encode("utf-8") if payload is not None else None
    request_headers = {"accept": "application/json", **(headers or {})}
    if body is not None:
        request_headers["content-type"] = "application/json"
    request = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=max(1, timeout_seconds)) as response:
            raw = response.read().decode("utf-8", errors="replace")
            data = json.loads(raw or "{}")
            return data, {key.lower(): value for key, value in response.headers.items()}
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        try:
            data = json.loads(raw or "{}")
        except json.JSONDecodeError:
            data = None
        error_payload = data.get("error") if isinstance(data, dict) else None
        message = (
            error_payload.get("message")
            if isinstance(error_payload, dict)
            else error_payload
        ) or raw or str(error)
        raise HttpFailure(failure_kind, error.code, str(message), data) from error
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        raise HttpFailure(failure_kind, 0, str(error), None) from error


def load_records(path: pathlib.Path) -> Dict[str, Dict[str, Any]]:
    records: Dict[str, Dict[str, Any]] = {}
    if not path.exists():
        return records
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            record = json.loads(line)
            records[json_key(record["index"])] = record
    return records


def append_record(path: pathlib.Path, record: Dict[str, Any]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
        handle.flush()
        os.fsync(handle.fileno())


def strip_none_fields(messages: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {key: value for key, value in message.items() if value is not None}
        for message in messages
        if isinstance(message, dict)
    ]


def cancel_sample(controller: str, session_id: str, timeout_seconds: int) -> None:
    try:
        request_json(
            "POST",
            f"{controller.rstrip('/')}/cancel",
            {},
            {"session_id": session_id},
            timeout_seconds,
        )
    except HttpFailure:
        pass


def call_bridge(
    bridge: str,
    messages: List[Dict[str, Any]],
    tools: List[Dict[str, Any]],
    temperature: float,
    timeout_seconds: int,
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    started_at = time.time()
    payload = {
        "model": "ailis-desktop-configured-model",
        "messages": messages,
        "tools": tools,
        "tool_choice": "auto",
        "parallel_tool_calls": False,
        "temperature": temperature,
        "max_completion_tokens": 1024,
        "stream": False,
    }
    data, _ = request_json(
        "POST",
        f"{bridge.rstrip('/')}/chat/completions",
        payload,
        timeout_seconds=timeout_seconds,
        failure_kind="bridge_transport",
    )
    choices = data.get("choices") if isinstance(data, dict) else None
    message = choices[0].get("message") if choices and isinstance(choices[0], dict) else None
    if not isinstance(message, dict):
        raise HttpFailure("provider_error", 502, "Bridge returned no OpenAI assistant message", data)
    message = {key: value for key, value in message.items() if value is not None}
    message["role"] = "assistant"
    metric = {
        "duration_ms": round((time.time() - started_at) * 1000),
        "usage": normalize_usage(data.get("usage")),
        "tool_call_count": len(message.get("tool_calls") or []),
        "message_sha256": hashlib.sha256(canonical_json(message).encode("utf-8")).hexdigest(),
    }
    return message, metric


def _record(
    args: argparse.Namespace,
    index: Any,
    started_at: float,
    status: str,
    reward: Optional[float],
    error: Optional[Dict[str, Any]],
    messages: List[Dict[str, Any]],
    tools: List[Dict[str, Any]],
    agent_calls: List[Dict[str, Any]],
    session_id: str,
) -> Dict[str, Any]:
    return {
        "task": args.task,
        "index": index,
        "status": status,
        "reward": reward,
        "error": error,
        "duration_ms": round((time.time() - started_at) * 1000),
        "environment_turns": len(agent_calls),
        "agent_calls": agent_calls,
        "messages": messages,
        "tools_sha256": hashlib.sha256(canonical_json(tools).encode("utf-8")).hexdigest(),
        "session_id": session_id,
        "recorded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def run_sample(args: argparse.Namespace, index: Any) -> Dict[str, Any]:
    controller = args.controller.rstrip("/")
    started_at = time.time()
    messages: List[Dict[str, Any]] = []
    tools: List[Dict[str, Any]] = []
    agent_calls: List[Dict[str, Any]] = []
    session_id = ""
    try:
        initial, headers = request_json(
            "POST",
            f"{controller}/start_sample",
            {"name": args.task, "index": index},
            timeout_seconds=args.timeout_seconds,
        )
        session_id = headers.get("session_id") or str(initial.get("session_id") or "")
        if not session_id:
            raise HttpFailure("controller_transport", 502, "Controller omitted session_id", initial)
        messages.extend(strip_none_fields(initial.get("messages") or []))
        tools = list(initial.get("tools") or [])
        if not tools:
            raise HttpFailure(
                "environment_unavailable",
                502,
                "AgentBench FC did not provide function tools",
                initial,
            )
        if not messages:
            return _record(
                args,
                index,
                started_at,
                "environment_terminal",
                0.0,
                {
                    "kind": "benchmark_task_error",
                    "status": 200,
                    "message": "Official task terminated before the first agent turn",
                },
                messages,
                tools,
                agent_calls,
                session_id,
            )

        for turn in range(1, args.max_environment_turns + 1):
            message, metric = call_bridge(
                args.bridge,
                strip_none_fields(messages),
                tools,
                args.temperature,
                args.timeout_seconds,
            )
            metric["turn"] = turn
            agent_calls.append(metric)
            messages.append(message)
            environment, _ = request_json(
                "POST",
                f"{controller}/interact",
                {"messages": [message]},
                {"session_id": session_id},
                args.timeout_seconds,
            )
            if bool(environment.get("finish")):
                return _record(
                    args,
                    index,
                    started_at,
                    "completed",
                    float(environment.get("reward") or 0),
                    None,
                    messages,
                    tools,
                    agent_calls,
                    session_id,
                )
            messages.extend(strip_none_fields(environment.get("messages") or []))

        cancel_sample(controller, session_id, args.timeout_seconds)
        return _record(
            args,
            index,
            started_at,
            "turn_limit",
            0.0,
            None,
            messages,
            tools,
            agent_calls,
            session_id,
        )
    except HttpFailure as error:
        if session_id:
            cancel_sample(controller, session_id, args.timeout_seconds)
        return _record(
            args,
            index,
            started_at,
            "infrastructure_error",
            None,
            {"kind": error.kind, "status": error.status, "message": error.message},
            messages,
            tools,
            agent_calls,
            session_id,
        )
    except Exception as error:  # pragma: no cover - final fail-closed boundary
        if session_id:
            cancel_sample(controller, session_id, args.timeout_seconds)
        return _record(
            args,
            index,
            started_at,
            "infrastructure_error",
            None,
            {"kind": "runner_error", "status": 0, "message": str(error)},
            messages,
            tools,
            agent_calls,
            session_id,
        )


def sum_usage(records: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    totals = {"calls": 0, "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    for record in records:
        for call in record.get("agent_calls") or []:
            totals["calls"] += 1
            usage = call.get("usage") or {}
            totals["prompt_tokens"] += int(usage.get("prompt_tokens") or 0)
            totals["completion_tokens"] += int(usage.get("completion_tokens") or 0)
            totals["total_tokens"] += int(usage.get("total_tokens") or 0)
    return totals


def main() -> None:
    args = parse_args()
    if args.max_environment_turns != 20:
        raise ValueError("Official AgentBench FC runs require exactly 20 environment turns")
    output_dir = pathlib.Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    stem = f"{args.run_id}.{args.task}"
    progress_path = output_dir / f"{stem}.progress.jsonl"
    summary_path = output_dir / f"{stem}.summary.json"

    query = urllib.parse.urlencode({"name": args.task})
    all_indices, _ = request_json(
        "GET", f"{args.controller.rstrip('/')}/get_indices?{query}", timeout_seconds=args.timeout_seconds
    )
    if not isinstance(all_indices, list):
        raise RuntimeError(f"Controller returned invalid indices: {all_indices!r}")
    selected = [index for index in all_indices if index != -1][max(0, args.offset) :]
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
            raise RuntimeError(f"AgentBench FC stage budget exceeded: {','.join(violations)}")

    enforce_budget()
    consecutive_infrastructure_errors = 0
    for position, index in enumerate(selected, start=1):
        prior = records.get(json_key(index))
        if prior and not (args.retry_errors and is_infrastructure_error(prior)):
            print(f"[{position}/{len(selected)}] {index}: resume-skip", flush=True)
            continue
        record = run_sample(args, index)
        append_record(progress_path, record)
        records[json_key(index)] = record
        print(
            f"[{position}/{len(selected)}] {index}: status={record['status']} "
            f"reward={record.get('reward')} turns={record['environment_turns']}",
            flush=True,
        )
        consecutive_infrastructure_errors = (
            consecutive_infrastructure_errors + 1 if is_infrastructure_error(record) else 0
        )
        if consecutive_infrastructure_errors >= max(1, args.max_consecutive_infrastructure_errors):
            raise RuntimeError(
                "AgentBench FC runner circuit breaker opened after "
                f"{consecutive_infrastructure_errors} consecutive infrastructure errors"
            )
        enforce_budget()

    ordered_records = [records[json_key(index)] for index in selected if json_key(index) in records]
    quality = record_quality(ordered_records)
    valid_records = [record for record in ordered_records if not is_infrastructure_error(record)]
    rewards = [float(record.get("reward") or 0) for record in valid_records]
    valid = len(ordered_records) == len(selected) and quality["infrastructure_errors"] == 0
    official_score = None
    if valid and rewards:
        official_score = {
            "metric": "average_reward_pass_at_1",
            "average_reward": sum(rewards) / len(rewards),
            "successful_samples": sum(1 for reward in rewards if reward > 0),
            "exact_reward_one_samples": sum(1 for reward in rewards if reward == 1),
            "total_samples": len(rewards),
        }
    summary = {
        "schema": AGENTBENCH_FC_SCHEMA,
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
        "protocol": {
            "style": "openai_function_calling",
            "max_environment_turns": args.max_environment_turns,
            "temperature": args.temperature,
        },
        "progress_path": str(progress_path),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
