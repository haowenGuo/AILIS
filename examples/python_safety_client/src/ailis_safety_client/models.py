from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class SafetyJudgeResult:
    algorithm: str
    risk_level: str
    risk_type: list[str] = field(default_factory=list)
    confidence: float = 0.0
    suggestion: str = ""
    summary: str = ""
    policy_hits: list[str] = field(default_factory=list)
    normalized_content: str | None = None
    latent_intent: str | None = None
    meta: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "SafetyJudgeResult":
        return cls(
            algorithm=str(payload.get("algorithm", "")),
            risk_level=str(payload.get("risk_level", "")),
            risk_type=list(payload.get("risk_type", []) or []),
            confidence=float(payload.get("confidence", 0.0) or 0.0),
            suggestion=str(payload.get("suggestion", "")),
            summary=str(payload.get("summary", "")),
            policy_hits=list(payload.get("policy_hits", []) or []),
            normalized_content=payload.get("normalized_content"),
            latent_intent=payload.get("latent_intent"),
            meta=dict(payload.get("meta", {}) or {}),
        )


@dataclass(slots=True)
class SafetyCheckResponse:
    task: str
    your_content: str
    risk_check: SafetyJudgeResult
    algorithms: dict[str, SafetyJudgeResult] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "SafetyCheckResponse":
        algorithms = {
            name: SafetyJudgeResult.from_dict(result)
            for name, result in (payload.get("algorithms", {}) or {}).items()
        }
        return cls(
            task=str(payload.get("task", "")),
            your_content=str(payload.get("your_content", "")),
            risk_check=SafetyJudgeResult.from_dict(payload.get("risk_check", {}) or {}),
            algorithms=algorithms,
        )


@dataclass(slots=True)
class LegacySafetyResponse:
    code: int
    msg: str
    data: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "LegacySafetyResponse":
        return cls(
            code=int(payload.get("code", 0) or 0),
            msg=str(payload.get("msg", "")),
            data=dict(payload.get("data", {}) or {}),
        )
