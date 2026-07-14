"""Official AgentBench AgentClient backed by the AILIS TaskAgent runtime."""

from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Dict, List, Optional

import requests

from src.client.agent import AgentClient
from src.typings import AgentContextLimitException


class AILISAgentClient(AgentClient):
    """Forward one official environment turn to the AILIS bridge.

    AgentBench owns the environment, full interaction history, termination, and
    scoring. AILIS receives that history and emits exactly one next action.
    """

    def __init__(
        self,
        bridge_url: str = "http://127.0.0.1:5128/inference",
        name: str = "ailis-task-agent",
        session_id: str = "",
        timeout_seconds: int = 180,
        **_: Any,
    ) -> None:
        super().__init__()
        self.bridge_url = bridge_url.rstrip("/")
        self.name = name
        self.session_id = session_id or f"agentbench-{time.time_ns()}"
        self.timeout_seconds = max(30, int(timeout_seconds))
        self.turn = 0
        self.call_stats: List[Dict[str, Any]] = []

    @staticmethod
    def _normalize_history(history: List[dict]) -> List[Dict[str, str]]:
        normalized: List[Dict[str, str]] = []
        for item in history or []:
            role = "assistant" if item.get("role") in ("agent", "assistant") else "user"
            normalized.append({"role": role, "content": str(item.get("content") or "")})
        return normalized

    def inference(self, history: List[dict]) -> str:
        normalized = self._normalize_history(history)
        if not normalized:
            raise ValueError("AgentBench supplied an empty interaction history")
        self.turn += 1
        history_digest = hashlib.sha256(
            json.dumps(normalized, ensure_ascii=False, sort_keys=True).encode("utf-8")
        ).hexdigest()
        started_at = time.time()
        response = requests.post(
            self.bridge_url,
            json={
                "session_id": self.session_id,
                "turn": self.turn,
                "history": normalized,
                "history_sha256": history_digest,
            },
            timeout=self.timeout_seconds,
        )
        if response.status_code in (413, 422):
            raise AgentContextLimitException(response.text)
        response.raise_for_status()
        payload: Optional[Dict[str, Any]] = response.json()
        if not isinstance(payload, dict) or not isinstance(payload.get("content"), str):
            raise RuntimeError(f"Invalid AILIS bridge response: {payload!r}")
        self.call_stats.append(
            {
                "turn": self.turn,
                "duration_ms": round((time.time() - started_at) * 1000),
                "history_items": len(normalized),
                "history_sha256": history_digest,
                "bridge": payload.get("metrics") or {},
            }
        )
        return payload["content"]
