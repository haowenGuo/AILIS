"""Durable record classification for staged official AgentBench runs."""

from __future__ import annotations

from typing import Any, Dict, Iterable, List


def bridge_call_failed(call: Dict[str, Any]) -> bool:
    bridge = call.get("bridge") or {}
    if bridge.get("ok") is False:
        return True
    status = str(bridge.get("status") or "").lower()
    return any(
        marker in status
        for marker in (
            "network",
            "timeout",
            "unavailable",
            "rate_limit",
            "overload",
            "terminated",
        )
    )


def is_infrastructure_error(record: Dict[str, Any]) -> bool:
    if record.get("error"):
        return True
    return any(bridge_call_failed(call) for call in record.get("agent_calls") or [])


def deduplicate_records(records: Iterable[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    latest: Dict[str, Dict[str, Any]] = {}
    for record in records:
        latest[str(record["index"])] = record
    return latest


def record_quality(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    infrastructure_errors = sum(1 for record in records if is_infrastructure_error(record))
    completed = sum(
        1
        for record in records
        if not is_infrastructure_error(record)
        and (record.get("task_output") or {}).get("status") == "completed"
    )
    total = len(records)
    return {
        "durable_records": total,
        "infrastructure_errors": infrastructure_errors,
        "valid_environment_records": total - infrastructure_errors,
        "completed_environment_records": completed,
        "infrastructure_valid_rate": (total - infrastructure_errors) / total if total else 0.0,
        "completion_rate": completed / total if total else 0.0,
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
            tokens += int((((call.get("bridge") or {}).get("usage") or {}).get("total_tokens")) or 0)
    violations = []
    if max_calls > 0 and calls > max_calls:
        violations.append("call_budget_exceeded")
    if max_tokens > 0 and tokens > max_tokens:
        violations.append("token_budget_exceeded")
    if max_duration_ms > 0 and duration_ms > max_duration_ms:
        violations.append("duration_budget_exceeded")
    return violations
