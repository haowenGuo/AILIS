from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
import traceback
import uuid
from collections import defaultdict
from pathlib import Path
from typing import Any, Optional

from tool_sandbox.common.execution_context import DatabaseNamespace, RoleType
from tool_sandbox.common.message_conversion import Message
from tool_sandbox.common.tool_conversion import convert_to_openai_tool, convert_to_openai_tools
from tool_sandbox.common.tool_discovery import ToolBackend
from tool_sandbox.roles.base_role import BaseRole
from tool_sandbox.roles.execution_environment import ExecutionEnvironment
from tool_sandbox.roles.openai_api_user import OpenAIAPIUser
from tool_sandbox.scenarios import named_scenarios


PROTOCOL_PREFIX = "@@AILIS_TOOL_SANDBOX@@"
CODEX_PROTOCOL_PREFIX = "@@AILIS_CODEX_PROVIDER@@"
RAPID_API_TOOLS = {
    "search_lat_lon",
    "search_location_around_lat_lon",
    "search_weather_around_lat_lon",
    "search_stock",
    "convert_currency",
}
AUGMENTATION_SUFFIXES = (
    "_3_distraction_tools_tool_description_scrambled",
    "_3_distraction_tools_arg_description_scrambled",
    "_3_distraction_tools_arg_type_scrambled",
    "_3_distraction_tools_tool_name_scrambled",
    "_10_distraction_tools",
    "_3_distraction_tools",
    "_all_tools",
)
DEFAULT_SMOKE_SCENARIOS = [
    "cellular_off",
    "get_cellular",
    "wifi_off",
    "search_phone_number_with_name",
    "send_message_with_phone_number_and_content",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate the full AILIS production chain on Apple ToolSandbox.")
    parser.add_argument("--project-root", default=r"F:\AILIS_self_evolution_runtime")
    parser.add_argument("--output-dir", default=r"F:\AILIS_self_evolution_runtime\eval-results\toolsandbox-smoke")
    parser.add_argument("--run-id", default=f"ailis-toolsandbox-{time.strftime('%Y%m%d-%H%M%S')}")
    parser.add_argument("--scenario", action="append", dest="scenarios")
    parser.add_argument("--all", action="store_true", help="Run all official named scenarios.")
    parser.add_argument("--resume", action="store_true", help="Skip scenarios already completed in progress.jsonl.")
    parser.add_argument("--retry-errors", action="store_true", help="Retry prior error or blocked records when resuming.")
    parser.add_argument("--max-scenarios", type=int)
    parser.add_argument("--max-agent-steps", type=int, default=7)
    parser.add_argument("--provider", choices=["desktop", "codex-model-bridge"], default="codex-model-bridge")
    parser.add_argument("--codex-model", default=os.environ.get("AILIS_CODEX_MODEL", "gpt-5.5"))
    parser.add_argument(
        "--codex-reasoning-effort",
        default=os.environ.get("AILIS_CODEX_REASONING_EFFORT", "low"),
    )
    parser.add_argument("--llm-timeout-ms", type=int, default=180000)
    return parser.parse_args()


def append_jsonl(path: Path, value: dict[str, Any]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False) + "\n")


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def usage_summary(usage: Optional[dict[str, Any]]) -> dict[str, int]:
    usage = usage or {}
    prompt = int(usage.get("prompt_tokens") or usage.get("promptTokens") or 0)
    completion = int(usage.get("completion_tokens") or usage.get("completionTokens") or 0)
    total = int(usage.get("total_tokens") or usage.get("totalTokens") or prompt + completion)
    return {"promptTokens": prompt, "completionTokens": completion, "totalTokens": total}


class CodexJsonlClient:
    def __init__(
        self,
        *,
        project_root: Path,
        output_dir: Path,
        model: str,
        reasoning_effort: str,
        timeout_ms: int,
    ) -> None:
        self.project_root = project_root
        self.output_dir = output_dir
        self.model = model
        self.reasoning_effort = reasoning_effort
        self.timeout_ms = timeout_ms
        self.process: Optional[subprocess.Popen[str]] = None
        self.stderr_handle = None

    def start(self) -> None:
        if self.process is not None:
            return
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.stderr_handle = (self.output_dir / "codex-user-simulator.stderr.log").open(
            "a", encoding="utf-8"
        )
        script = self.project_root / "scripts" / "toolsandbox" / "codex-provider-jsonl.mjs"
        self.process = subprocess.Popen(
            ["node", str(script)],
            cwd=str(self.project_root),
            env=os.environ.copy(),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=self.stderr_handle,
            text=True,
            encoding="utf-8",
            bufsize=1,
        )

    def _send(self, payload: dict[str, Any]) -> None:
        self.start()
        assert self.process is not None and self.process.stdin is not None
        self.process.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")
        self.process.stdin.flush()

    def _read(self) -> dict[str, Any]:
        assert self.process is not None and self.process.stdout is not None
        while True:
            line = self.process.stdout.readline()
            if line == "":
                raise RuntimeError(
                    f"Codex user-simulator bridge exited with code {self.process.poll()}"
                )
            if line.startswith(CODEX_PROTOCOL_PREFIX):
                return json.loads(line[len(CODEX_PROTOCOL_PREFIX) :])

    def infer(
        self,
        *,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]],
    ) -> dict[str, Any]:
        request_id = str(uuid.uuid4())
        self._send(
            {
                "type": "infer",
                "requestId": request_id,
                "model": self.model,
                "reasoningEffort": self.reasoning_effort,
                "timeoutMs": self.timeout_ms,
                "messages": messages,
                "tools": tools,
                "toolChoice": "auto",
            }
        )
        while True:
            response = self._read()
            if response.get("type") == "inference_result" and response.get("requestId") == request_id:
                if response.get("ok") is not True:
                    raise RuntimeError(
                        f"Codex user simulator failed: {response.get('code')}: {response.get('error')}"
                    )
                return response
            if response.get("type") == "fatal_error":
                raise RuntimeError(response.get("error", "Codex user simulator bridge failed"))

    def close(self) -> None:
        if self.process is not None and self.process.poll() is None:
            try:
                self._send({"type": "shutdown", "requestId": str(uuid.uuid4())})
                self.process.wait(timeout=10)
            except Exception:
                self.process.terminate()
        if self.process is not None:
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.process.kill()
        if self.stderr_handle is not None:
            self.stderr_handle.close()


class CodexToolSandboxUser(BaseRole):
    role_type = RoleType.USER

    def __init__(
        self,
        *,
        project_root: Path,
        output_dir: Path,
        model: str,
        reasoning_effort: str,
        timeout_ms: int,
    ) -> None:
        self.client = CodexJsonlClient(
            project_root=project_root,
            output_dir=output_dir,
            model=model,
            reasoning_effort=reasoning_effort,
            timeout_ms=timeout_ms,
        )
        self.calls: list[dict[str, Any]] = []

    def respond(self, ending_index: Optional[int] = None) -> None:
        messages = self.get_messages(ending_index=ending_index)
        self.messages_validation(messages)
        messages = self.filter_messages(messages)
        if messages[-1].sender == RoleType.SYSTEM:
            return
        available_tools = self.get_available_tools()
        tools = (
            [convert_to_openai_tool(tool) for tool in available_tools.values()]
            if messages[-1].sender == RoleType.AGENT
            else []
        )
        result = self.client.infer(
            messages=OpenAIAPIUser.to_openai_messages(messages),
            tools=tools,
        )
        self.calls.append(
            {
                "provider": result.get("provider"),
                "model": result.get("model"),
                "usage": usage_summary(result.get("usage")),
            }
        )
        tool_calls = result.get("toolCalls") if isinstance(result.get("toolCalls"), list) else []
        if not tool_calls:
            self.add_messages(
                [
                    Message(
                        sender=RoleType.USER,
                        recipient=RoleType.AGENT,
                        content=str(result.get("content") or ""),
                    )
                ]
            )
            return
        context = __import__(
            "tool_sandbox.common.execution_context", fromlist=["get_current_context"]
        ).get_current_context()
        response_messages: list[Message] = []
        for index, call in enumerate(tool_calls, start=1):
            name = str(call.get("name") or "")
            if name not in available_tools:
                raise RuntimeError(f"Codex user simulator selected unavailable tool: {name}")
            args = call.get("arguments") if isinstance(call.get("arguments"), dict) else {}
            tool_call_id = str(call.get("id") or f"user_call_{uuid.uuid4().hex}_{index}")
            execution_name = context.get_execution_facing_tool_name(name)
            code = (
                f"{tool_call_id}_parameters = {args!r}\n"
                f"{tool_call_id}_response = {execution_name}(**{tool_call_id}_parameters)\n"
                f"print(repr({tool_call_id}_response))"
            )
            response_messages.append(
                Message(
                    sender=RoleType.USER,
                    recipient=RoleType.EXECUTION_ENVIRONMENT,
                    content=code,
                    openai_tool_call_id=tool_call_id,
                    openai_function_name=name,
                )
            )
        self.add_messages(response_messages)

    def metrics(self) -> dict[str, Any]:
        totals = {"promptTokens": 0, "completionTokens": 0, "totalTokens": 0}
        for call in self.calls:
            for key in totals:
                totals[key] += int(call["usage"].get(key) or 0)
        return {"llmCalls": len(self.calls), **totals, "calls": self.calls}

    def teardown(self) -> None:
        self.client.close()


class AILISToolSandboxAgent(BaseRole):
    role_type = RoleType.AGENT

    def __init__(
        self,
        *,
        project_root: Path,
        output_dir: Path,
        run_id: str,
        scenario_name: str,
        original_task: str,
        max_agent_steps: int,
        provider: str,
        codex_model: str,
        codex_reasoning_effort: str,
        llm_timeout_ms: int,
    ) -> None:
        self.project_root = project_root
        self.output_dir = output_dir
        self.run_id = run_id
        self.scenario_name = scenario_name
        self.original_task = original_task
        self.max_agent_steps = max_agent_steps
        self.provider = provider
        self.codex_model = codex_model
        self.codex_reasoning_effort = codex_reasoning_effort
        self.llm_timeout_ms = llm_timeout_ms
        self.process: Optional[subprocess.Popen[str]] = None
        self.stderr_handle = None
        self.turn = 0
        self.last_result: dict[str, Any] = {}
        self.initialized: dict[str, Any] = {}

    def _send(self, payload: dict[str, Any]) -> None:
        if self.process is None or self.process.stdin is None:
            raise RuntimeError("AILIS ToolSandbox bridge is not running")
        self.process.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")
        self.process.stdin.flush()

    def _read_protocol_message(self) -> dict[str, Any]:
        if self.process is None or self.process.stdout is None:
            raise RuntimeError("AILIS ToolSandbox bridge is not running")
        while True:
            line = self.process.stdout.readline()
            if line == "":
                code = self.process.poll()
                raise RuntimeError(f"AILIS ToolSandbox bridge exited unexpectedly with code {code}")
            if line.startswith(PROTOCOL_PREFIX):
                return json.loads(line[len(PROTOCOL_PREFIX) :])

    def _agent_tool_specs(self) -> list[dict[str, Any]]:
        tools = self.get_available_tools()
        converted = convert_to_openai_tools(tools)
        return [entry["function"] for entry in converted]

    def _start(self) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        stderr_path = self.output_dir / "ailis-bridge.stderr.log"
        self.stderr_handle = stderr_path.open("a", encoding="utf-8")
        bridge_path = self.project_root / "scripts" / "toolsandbox" / "ailis-toolsandbox-bridge.mjs"
        env = os.environ.copy()
        env["AILIS_PROJECT_ROOT"] = str(self.project_root)
        self.process = subprocess.Popen(
            ["node", str(bridge_path)],
            cwd=str(self.project_root),
            env=env,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=self.stderr_handle,
            text=True,
            encoding="utf-8",
            bufsize=1,
        )
        request_id = str(uuid.uuid4())
        self._send(
            {
                "type": "initialize",
                "requestId": request_id,
                "outputDir": str(self.output_dir),
                "runId": self.run_id,
                "scenarioName": self.scenario_name,
                "sessionId": f"toolsandbox-{self.run_id}-{self.scenario_name}",
                "originalTask": self.original_task,
                "maxAgentSteps": self.max_agent_steps,
                "provider": self.provider,
                "codexModel": self.codex_model,
                "codexReasoningEffort": self.codex_reasoning_effort,
                "llmTimeoutMs": self.llm_timeout_ms,
                "tools": self._agent_tool_specs(),
            }
        )
        while True:
            message = self._read_protocol_message()
            if message.get("type") == "initialized" and message.get("requestId") == request_id:
                self.initialized = message
                return
            if message.get("type") == "bridge_error":
                raise RuntimeError(message.get("error", "AILIS bridge initialization failed"))

    def _execute_official_tool(self, request: dict[str, Any]) -> dict[str, Any]:
        name = str(request.get("name", ""))
        args = request.get("args") if isinstance(request.get("args"), dict) else {}
        context = __import__("tool_sandbox.common.execution_context", fromlist=["get_current_context"]).get_current_context()
        execution_name = context.get_execution_facing_tool_name(name)
        tool_call_id = f"call_{uuid.uuid4().hex}"
        code = (
            f"{tool_call_id}_parameters = {args!r}\n"
            f"{tool_call_id}_response = {execution_name}(**{tool_call_id}_parameters)\n"
            f"print(repr({tool_call_id}_response))"
        )
        call_message = Message(
            sender=RoleType.AGENT,
            recipient=RoleType.EXECUTION_ENVIRONMENT,
            content=code,
            openai_tool_call_id=tool_call_id,
            openai_function_name=name,
        )
        self.add_messages([call_message])
        ExecutionEnvironment().respond()
        response = self.get_messages()[-1]
        return {
            "ok": response.tool_call_exception is None,
            "content": response.content or "",
            "error": response.tool_call_exception,
            "toolTrace": response.tool_trace,
        }

    def respond(self, ending_index: Optional[int] = None) -> None:
        messages = self.get_messages(ending_index=ending_index)
        self.messages_validation(messages)
        if messages[-1].sender == RoleType.SYSTEM:
            return
        if self.process is None:
            self._start()
        self.turn += 1
        request_id = str(uuid.uuid4())
        self._send(
            {
                "type": "run",
                "requestId": request_id,
                "turn": self.turn,
                "message": messages[-1].content or "",
            }
        )
        while True:
            response = self._read_protocol_message()
            if response.get("type") == "tool_call":
                result = self._execute_official_tool(response)
                self._send(
                    {
                        "type": "tool_result",
                        "requestId": response.get("requestId"),
                        "result": result,
                    }
                )
                continue
            if response.get("type") == "bridge_error":
                raise RuntimeError(response.get("error", "AILIS bridge failed"))
            if response.get("type") == "run_result" and response.get("requestId") == request_id:
                self.last_result = response
                self.add_messages(
                    [
                        Message(
                            sender=RoleType.AGENT,
                            recipient=RoleType.USER,
                            content=str(response.get("text") or "AILIS completed the requested action."),
                        )
                    ]
                )
                return

    def teardown(self) -> None:
        if self.process is not None and self.process.poll() is None:
            request_id = str(uuid.uuid4())
            try:
                self._send({"type": "shutdown", "requestId": request_id})
                deadline = time.time() + 10
                while time.time() < deadline:
                    message = self._read_protocol_message()
                    if message.get("type") == "shutdown_complete":
                        break
            except Exception:
                pass
            finally:
                if self.process.poll() is None:
                    self.process.terminate()
        if self.process is not None:
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.process.kill()
        if self.stderr_handle is not None:
            self.stderr_handle.close()


class AutoEndUser(BaseRole):
    role_type = RoleType.USER

    def respond(self, ending_index: Optional[int] = None) -> None:
        messages = self.get_messages(ending_index=ending_index)
        self.messages_validation(messages)
        if messages[-1].sender == RoleType.SYSTEM:
            return
        self.add_messages(
            [
                Message(
                    sender=RoleType.USER,
                    recipient=RoleType.EXECUTION_ENVIRONMENT,
                    content="end_conversation()",
                )
            ]
        )
        ExecutionEnvironment().respond()


def latest_user_task(scenario: Any) -> str:
    database = scenario.starting_context.get_database(
        DatabaseNamespace.SANDBOX,
        get_all_history_snapshots=True,
        drop_sandbox_message_index=False,
    )
    rows = database.filter(
        (database["sender"] == RoleType.USER) & (database["recipient"] == RoleType.AGENT)
    ).to_dicts()
    if not rows:
        raise RuntimeError("Scenario has no USER -> AGENT task message")
    return str(rows[-1]["content"])


def summarize_ailis_audit(scenario_output: Path) -> dict[str, Any]:
    transcript_root = scenario_output / "ailis-audit" / "transcripts"
    llm_events: dict[str, dict[str, Any]] = {}
    tool_events: dict[str, dict[str, Any]] = {}
    if transcript_root.exists():
        for transcript_path in transcript_root.rglob("*.jsonl"):
            for line in transcript_path.read_text(encoding="utf-8").splitlines():
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue
                event_id = str(event.get("id") or "")
                if event.get("type") == "agent.llm_call" and event_id:
                    llm_events[event_id] = event
                elif event.get("type") == "tool.call" and event_id:
                    tool_events[event_id] = event
    prompt_tokens = 0
    completion_tokens = 0
    total_tokens = 0
    providers: set[str] = set()
    models: set[str] = set()
    for event in llm_events.values():
        payload = event.get("payload", {})
        usage = payload.get("usage", {})
        prompt_tokens += int(usage.get("promptTokens") or usage.get("prompt_tokens") or 0)
        completion_tokens += int(usage.get("completionTokens") or usage.get("completion_tokens") or 0)
        total_tokens += int(usage.get("totalTokens") or usage.get("total_tokens") or 0)
        if payload.get("provider"):
            providers.add(str(payload["provider"]))
        if payload.get("model"):
            models.add(str(payload["model"]))
    return {
        "llmCalls": len(llm_events),
        "promptTokens": prompt_tokens,
        "completionTokens": completion_tokens,
        "totalTokens": total_tokens,
        "providers": sorted(providers),
        "models": sorted(models),
        "toolCalls": len(tool_events),
        "toolNames": [
            str(event.get("payload", {}).get("tool") or event.get("payload", {}).get("toolName") or "")
            for event in tool_events.values()
        ],
    }


def base_scenario_name(scenario_name: str) -> str:
    for suffix in AUGMENTATION_SUFFIXES:
        if scenario_name.endswith(suffix):
            return scenario_name[: -len(suffix)]
    return scenario_name


def requires_rapid_api(
    scenario_name: str, scenarios: dict[str, Any]
) -> bool:
    base_name = base_scenario_name(scenario_name)
    base = scenarios.get(base_name)
    if base is None:
        return False
    return bool(RAPID_API_TOOLS.intersection(base.starting_context.tool_allow_list or []))


def load_latest_progress(path: Path) -> dict[str, dict[str, Any]]:
    latest: dict[str, dict[str, Any]] = {}
    if not path.exists():
        return latest
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        scenario = str(record.get("scenario") or "")
        if scenario:
            latest[scenario] = record
    return latest


def classify_fatal_provider_error(error_text: str) -> Optional[str]:
    normalized = error_text.lower()
    checks = {
        "codex_usage_limited": ("codex_usage_limited", "usage or rate limit", "quota"),
        "codex_auth_required": ("codex_auth_required", "not logged in", "oauth credentials"),
        "codex_not_found": ("codex_not_found", "codex cli javascript entrypoint was not found"),
    }
    for code, needles in checks.items():
        if any(needle in normalized for needle in needles):
            return code
    return None


def build_summary(
    *,
    args: argparse.Namespace,
    selected: list[str],
    latest: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    results = [latest[name] for name in selected if name in latest]
    scored = [item for item in results if isinstance(item.get("similarity"), (int, float))]
    by_category: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in scored:
        for category in item.get("categories") or []:
            by_category[str(category)].append(item)
    category_results = {
        category: {
            "count": len(items),
            "averageSimilarity": sum(float(item["similarity"]) for item in items) / len(items),
            "averageTurnCount": sum(float(item.get("turnCount") or 0) for item in items) / len(items),
        }
        for category, items in sorted(by_category.items())
    }
    usage = {
        "agentPromptTokens": 0,
        "agentCompletionTokens": 0,
        "agentTotalTokens": 0,
        "userSimulatorPromptTokens": 0,
        "userSimulatorCompletionTokens": 0,
        "userSimulatorTotalTokens": 0,
    }
    for item in results:
        agent_metrics = item.get("ailisMetrics") or {}
        user_metrics = item.get("userSimulatorMetrics") or {}
        usage["agentPromptTokens"] += int(agent_metrics.get("promptTokens") or 0)
        usage["agentCompletionTokens"] += int(agent_metrics.get("completionTokens") or 0)
        usage["agentTotalTokens"] += int(agent_metrics.get("totalTokens") or 0)
        usage["userSimulatorPromptTokens"] += int(user_metrics.get("promptTokens") or 0)
        usage["userSimulatorCompletionTokens"] += int(user_metrics.get("completionTokens") or 0)
        usage["userSimulatorTotalTokens"] += int(user_metrics.get("totalTokens") or 0)
    usage["totalTokens"] = usage["agentTotalTokens"] + usage["userSimulatorTotalTokens"]
    return {
        "runId": args.run_id,
        "benchmark": "Apple ToolSandbox",
        "protocol": "AILIS production Persona -> persistent TaskAgent -> official ToolSandbox tools -> Persona output",
        "provider": args.provider,
        "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",
        "reasoningEffort": args.codex_reasoning_effort if args.provider == "codex-model-bridge" else None,
        "userSimulator": (
            "official on-policy role/messages/tools driven by codex-model-bridge"
            if args.provider == "codex-model-bridge"
            else "deterministic end-after-first-response"
        ),
        "selected": len(selected),
        "recorded": len(results),
        "completed": len(scored),
        "errors": sum(item.get("status") == "error" for item in results),
        "blockedEnvironment": sum(item.get("status") == "blocked_environment" for item in results),
        "fatalProviderErrors": sum(bool(item.get("fatalProviderError")) for item in results),
        "averageSimilarity": sum(float(item["similarity"]) for item in scored) / len(scored) if scored else 0,
        "perfect": sum(item.get("similarity") == 1 for item in scored),
        "usage": usage,
        "categoryAggregatedResults": category_results,
        "results": results,
    }


def main() -> int:
    args = parse_args()
    project_root = Path(args.project_root).resolve()
    output_root = Path(args.output_dir).resolve() / args.run_id
    output_root.mkdir(parents=True, exist_ok=True)
    progress_path = output_root / "progress.jsonl"
    state_path = output_root / "state.json"
    summary_path = output_root / "summary.json"
    scenarios = named_scenarios(preferred_tool_backend=ToolBackend.DEFAULT)
    selected = list(scenarios) if args.all else (args.scenarios or DEFAULT_SMOKE_SCENARIOS)
    if args.max_scenarios is not None:
        selected = selected[: max(0, args.max_scenarios)]
    missing = [name for name in selected if name not in scenarios]
    if missing:
        raise KeyError(f"Unknown ToolSandbox scenarios: {missing}")

    latest = load_latest_progress(progress_path) if args.resume else {}
    write_json(
        state_path,
        {
            "runId": args.run_id,
            "status": "running",
            "provider": args.provider,
            "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",
            "selected": len(selected),
            "completed": sum(
                isinstance(latest.get(name, {}).get("similarity"), (int, float)) for name in selected
            ),
            "currentScenario": None,
            "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        },
    )
    for index, scenario_name in enumerate(selected, start=1):
        prior = latest.get(scenario_name)
        if args.resume and prior:
            if isinstance(prior.get("similarity"), (int, float)):
                continue
            if prior.get("status") == "error" and not args.retry_errors:
                continue
            if prior.get("status") == "blocked_environment" and "RAPID_API_KEY" not in os.environ:
                continue
        scenario = scenarios[scenario_name]
        original_task = latest_user_task(scenario)
        categories = [str(category) for category in scenario.categories]
        if requires_rapid_api(scenario_name, scenarios) and "RAPID_API_KEY" not in os.environ:
            record = {
                "index": index,
                "attempt": int((prior or {}).get("attempt") or 0) + 1,
                "scenario": scenario_name,
                "baseScenario": base_scenario_name(scenario_name),
                "task": original_task,
                "categories": categories,
                "status": "blocked_environment",
                "error": "RAPID_API_KEY is required by an official necessary tool for this scenario.",
                "durationMs": 0,
            }
            latest[scenario_name] = record
            append_jsonl(progress_path, record)
            continue
        attempt = int((prior or {}).get("attempt") or 0) + 1
        scenario_output = output_root / "scenarios" / scenario_name / f"attempt-{attempt:03d}"
        agent = AILISToolSandboxAgent(
            project_root=project_root,
            output_dir=scenario_output,
            run_id=args.run_id,
            scenario_name=scenario_name,
            original_task=original_task,
            max_agent_steps=args.max_agent_steps,
            provider=args.provider,
            codex_model=args.codex_model,
            codex_reasoning_effort=args.codex_reasoning_effort,
            llm_timeout_ms=args.llm_timeout_ms,
        )
        user: BaseRole
        if args.provider == "codex-model-bridge":
            user = CodexToolSandboxUser(
                project_root=project_root,
                output_dir=scenario_output,
                model=args.codex_model,
                reasoning_effort=args.codex_reasoning_effort,
                timeout_ms=args.llm_timeout_ms,
            )
        else:
            user = AutoEndUser()
        write_json(
            state_path,
            {
                "runId": args.run_id,
                "status": "running",
                "provider": args.provider,
                "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",
                "selected": len(selected),
                "completed": sum(
                    isinstance(latest.get(name, {}).get("similarity"), (int, float))
                    for name in selected
                ),
                "currentIndex": index,
                "currentScenario": scenario_name,
                "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            },
        )
        started_at = time.time()
        record: dict[str, Any]
        try:
            result = scenario.play_and_evaluate(
                roles={
                    RoleType.AGENT: agent,
                    RoleType.USER: user,
                    RoleType.EXECUTION_ENVIRONMENT: ExecutionEnvironment(),
                },
                output_directory=scenario_output,
                scenario_name=scenario_name,
            )
            evaluation = result.evaluation_result
            record = {
                "index": index,
                "attempt": attempt,
                "scenario": scenario_name,
                "baseScenario": base_scenario_name(scenario_name),
                "task": original_task,
                "categories": categories,
                "status": "completed",
                "similarity": evaluation.similarity,
                "milestoneSimilarity": evaluation.milestone_similarity,
                "minefieldSimilarity": evaluation.minefield_similarity,
                "turnCount": evaluation.turn_count,
                "durationMs": round((time.time() - started_at) * 1000),
                "outputDir": str(scenario_output),
                "ailis": agent.last_result,
            }
        except Exception as error:
            error_traceback = traceback.format_exc()
            fatal_provider_error = classify_fatal_provider_error(f"{error!r}\n{error_traceback}")
            record = {
                "index": index,
                "attempt": attempt,
                "scenario": scenario_name,
                "baseScenario": base_scenario_name(scenario_name),
                "task": original_task,
                "categories": categories,
                "status": "error",
                "error": repr(error),
                "traceback": error_traceback,
                "fatalProviderError": fatal_provider_error,
                "durationMs": round((time.time() - started_at) * 1000),
                "outputDir": str(scenario_output),
                "ailis": agent.last_result,
            }
        finally:
            agent.teardown()
            if isinstance(user, CodexToolSandboxUser):
                user.teardown()
        record["ailisMetrics"] = summarize_ailis_audit(scenario_output)
        record["userSimulatorMetrics"] = (
            user.metrics() if isinstance(user, CodexToolSandboxUser) else {}
        )
        latest[scenario_name] = record
        append_jsonl(progress_path, record)
        print(json.dumps(record, ensure_ascii=False), flush=True)
        if record.get("fatalProviderError"):
            break

    summary = build_summary(args=args, selected=selected, latest=latest)
    write_json(summary_path, summary)
    final_status = (
        "completed"
        if summary["completed"] == len(selected)
        else "provider_blocked"
        if summary["fatalProviderErrors"]
        else "blocked_or_incomplete"
    )
    write_json(
        state_path,
        {
            "runId": args.run_id,
            "status": final_status,
            "provider": args.provider,
            "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",
            "selected": len(selected),
            "completed": summary["completed"],
            "errors": summary["errors"],
            "blockedEnvironment": summary["blockedEnvironment"],
            "fatalProviderErrors": summary["fatalProviderErrors"],
            "currentScenario": None,
            "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        },
    )
    print(json.dumps(summary, ensure_ascii=False), flush=True)
    if summary["completed"] == len(selected):
        return 0
    if summary["fatalProviderErrors"]:
        return 3
    return 2 if summary["blockedEnvironment"] else 1


if __name__ == "__main__":
    sys.exit(main())
