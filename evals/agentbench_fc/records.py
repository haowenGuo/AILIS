"""Durable record classification for staged AgentBench FC runs."""

from __future__ import annotations

from typing import Any, Dict, Iterable, List


INFRASTRUCTURE_ERROR_KINDS = frozenset(
    {
        "bridge_transport",
        "controller_transport",
        "environment_unavailable",
        "provider_error",
        "runner_error",
    }
)


def is_infrastructure_error(record: Dict[str, Any]) -> bool:
    error = record.get("error") or {}
    if isinstance(error, str):
        return bool(error)
    return str(error.get("kind") or "") in INFRASTRUCTURE_ERROR_KINDS


def deduplicate_records(records: Iterable[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    latest: Dict[str, Dict[str, Any]] = {}
    for record in records:
        latest[str(record["index"])] = record
    return latest


def record_quality(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    infrastructure_errors = sum(1 for record in records if is_infrastructure_error(record))
    valid = [record for record in records if not is_infrastructure_error(record)]
    completed = sum(1 for record in valid if record.get("status") == "completed")
    successes = sum(1 for record in valid if float(record.get("reward") or 0) > 0)
    total = len(records)
    return {
        "durable_records": total,
        "infrastructure_errors": infrastructure_errors,
        "valid_environment_records": len(valid),
        "completed_environment_records": completed,
        "successful_environment_records": successes,
        "infrastructure_valid_rate": len(valid) / total if total else 0.0,
        "completion_rate": completed / total if total else 0.0,
        "success_rate": successes / len(valid) if valid else 0.0,
    }


def budget_violations(
    records: List[Dict[str, Any]],
    max_calls: int = 0,
    max_tokens: int = 0,
    max_duration_ms: int = 0,
) -> List[str]:
    calls = 0
    tokens = 0
    duration_ms = 0
    for record in records:
        duration_ms += int(record.get("duration_ms") or 0)
        for call in record.get("agent_calls") or []:
            calls += 1
            tokens += int((call.get("usage") or {}).get("total_tokens") or 0)
    violations = []
    if max_calls > 0 and calls > max_calls:
        violations.append("call_budget_exceeded")
    if max_tokens > 0 and tokens > max_tokens:
        violations.append("token_budget_exceeded")
    if max_duration_ms > 0 and duration_ms > max_duration_ms:
        violations.append("duration_budget_exceeded")
    return violations
