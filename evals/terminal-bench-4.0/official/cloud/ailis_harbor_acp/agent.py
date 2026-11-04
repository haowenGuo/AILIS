"""ACP lifecycle adapter, not a second agent loop or benchmark controller."""

import asyncio
import contextlib
import json
import os
import signal
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from uuid import uuid4

from acp import Agent, PROTOCOL_VERSION, RequestError
from acp.schema import (
    AgentCapabilities, AgentMessageChunk, InitializeResponse, Implementation,
    NewSessionResponse, PromptCapabilities, PromptResponse, SessionConfigOptionSelect,
    SessionConfigSelectOption, SetSessionConfigOptionResponse, TextContentBlock,
    ToolCallStart, ToolCallProgress, Usage,
)

from .runtime import LOCK, PACKAGE, Settings, prepare_runtime


@dataclass
class Session:
    cwd: str
    process: asyncio.subprocess.Process | None = None
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    cancelled: bool = False
    broken: bool = False
    turns: int = 0
    totals: dict = field(default_factory=dict)
    missing_usage: set = field(default_factory=set)
    log_dir: Path | None = None


def model_options():
    return [SessionConfigOptionSelect(
        id="model", name="Model", category="model", type="select",
        current_value=LOCK["model"],
        options=[SessionConfigSelectOption(value=LOCK["model"], name="gpt-6-luna / xhigh")],
    )]


def read_usage(result):
    # Gateway's run total includes semantic compaction; event-only sums do not.
    usage = (result.get("cost") or {}).get("total", {}).get("llm", {}).get("usage") or {}
    fields = {"input_tokens": "promptTokens", "output_tokens": "completionTokens",
              "cached_read_tokens": "cachedTokens", "thought_tokens": "reasoningTokens"}
    values = {target: usage[source] for target, source in fields.items()
              if isinstance(usage.get(source), int) and usage[source] >= 0}
    if "input_tokens" not in values or "output_tokens" not in values:
        return None
    values["total_tokens"] = values["input_tokens"] + values["output_tokens"]
    return values


async def stop_process(process):
    if not process:
        return
    # The worker and Codex exec-server share a process group in the task sandbox.
    # Cancel must also clean tools, even if the Node leader has already exited.
    if os.name == "posix":
        with contextlib.suppress(ProcessLookupError):
            os.killpg(process.pid, signal.SIGTERM)
    elif process.returncode is None:
        process.terminate()
    try:
        await asyncio.wait_for(process.wait(), timeout=3)
    except asyncio.TimeoutError:
        if os.name != "posix":
            process.kill()
    finally:
        if os.name == "posix":
            with contextlib.suppress(ProcessLookupError):
                os.killpg(process.pid, signal.SIGKILL)
        await process.wait()


class AilisAgent(Agent):
    def __init__(self):
        self.sessions = {}
        self.conn = None
        self.runtime = None
        self.settings = None

    def on_connect(self, conn):
        self.conn = conn

    async def initialize(self, protocol_version, **kwargs):
        return InitializeResponse(
            protocol_version=PROTOCOL_VERSION,
            agent_info=Implementation(name="ailis", version="0.1.0"),
            agent_capabilities=AgentCapabilities(
                load_session=False, prompt_capabilities=PromptCapabilities(
                    image=False, audio=False, embedded_context=False)),
            auth_methods=[],
            field_meta={"profile": LOCK["profile"], "runtimeSha256": LOCK["sha256"]},
        )

    async def new_session(self, cwd, mcp_servers=None, additional_directories=None, **kwargs):
        if mcp_servers or additional_directories:
            raise RequestError(-32602, "External MCP/additional directories are not part of the frozen profile")
        if not Path(cwd).is_absolute() or not Path(cwd).is_dir():
            raise RequestError(-32602, "cwd must be an existing absolute task directory")
        session_id = uuid4().hex
        self.sessions[session_id] = Session(cwd=cwd)
        return NewSessionResponse(session_id=session_id, config_options=model_options())

    def session(self, session_id):
        if session_id not in self.sessions:
            raise RequestError(-32602, "Unknown sessionId")
        return self.sessions[session_id]

    async def set_config_option(self, config_id, session_id, value, **kwargs):
        self.session(session_id)
        if config_id != "model" or value not in (LOCK["model"], "openai/" + LOCK["model"]):
            raise RequestError(-32602, "Frozen profile requires gpt-6-luna/xhigh")
        return SetSessionConfigOptionResponse(config_options=model_options())

    async def start_worker(self, session_id, session):
        try:
            if self.settings is None:
                self.settings = Settings.from_env()
            if self.runtime is None:
                self.runtime = await asyncio.to_thread(prepare_runtime)
        except ValueError as error:
            raise RequestError(-32000, str(error)) from None
        env = dict(os.environ)
        # No fallback to the host's cached OAuth login, user state or direct key.
        for name in ("CODEX_HOME", "CODEX_AUTH_JSON_PATH", "CHATGPT_ACCESS_TOKEN"):
            env.pop(name, None)
        log_root = os.environ.get("AILIS_LOG_DIR")
        if log_root:
            session.log_dir = Path(log_root).resolve() / session_id
            session.log_dir.mkdir(parents=True, mode=0o700)
        else:
            session.log_dir = Path(tempfile.mkdtemp(prefix="ailis-acp-"))
        env.update({
            "OPENAI_API_KEY": self.settings.api_key, "OPENAI_BASE_URL": self.settings.base_url,
            "AILIS_PROVIDER": self.settings.provider, "AILIS_EXEC_BACKEND": "codex",
            "AILIS_PROJECT_ROOT": str(self.runtime / "ailis"),
            "AILIS_LOG_DIR": str(session.log_dir), "AILIS_SESSION_ID": session_id,
            "AILIS_RESEARCH_PYTHON": "python3",
            "PATH": str(self.runtime / "node/bin") + os.pathsep + env.get("PATH", ""),
        })
        with (session.log_dir / "worker.stderr.log").open("ab") as errors:
            session.process = await asyncio.create_subprocess_exec(
                str(self.runtime / "node/bin/node"), str(PACKAGE / "worker.cjs"),
                stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, stderr=errors,
                cwd=session.cwd, env=env, start_new_session=os.name == "posix",
                limit=64 * 1024 * 1024,
            )
        ready = await session.process.stdout.readline()
        if not ready or json.loads(ready).get("type") != "ready":
            raise RequestError(-32000, "Frozen runtime did not initialize")

    async def update(self, session_id, update):
        if self.settings:
            # Redact only credentials on the monitoring channel. This does not
            # change the tool result delivered to the model by the frozen core.
            serialized = update.model_dump_json(by_alias=True)
            escaped_key = json.dumps(self.settings.api_key)[1:-1]
            serialized = serialized.replace(escaped_key, "[REDACTED]")
            update = type(update).model_validate_json(serialized)
        await self.conn.session_update(session_id=session_id, update=update)

    async def forward_event(self, session_id, event):
        payload = event.get("payload") or {}
        call_id = payload.get("callId")
        if not call_id:
            return
        if event.get("type") == "tool.call.started":
            await self.update(session_id, ToolCallStart(
                session_update="tool_call", tool_call_id=call_id,
                title=payload.get("tool", "tool"), status="in_progress"))
        elif event.get("type") == "tool.call.finished":
            await self.update(session_id, ToolCallProgress(
                session_update="tool_call_update", tool_call_id=call_id,
                status="completed" if payload.get("ok") else "failed",
                raw_output=payload.get("result", payload.get("error")),
            ))

    async def prompt(self, session_id, prompt, **kwargs):
        session = self.session(session_id)
        # One text block is Harbor's task instruction. Reject unsupported content
        # instead of silently dropping images/resources or inventing separators.
        if len(prompt) != 1 or not isinstance(prompt[0], TextContentBlock):
            raise RequestError(-32602, "This frozen task profile accepts exactly one text block")
        if session.lock.locked():
            raise RequestError(-32602, "A prompt is already running in this session")
        if session.broken:
            raise RequestError(-32000, "Session ended or lost its worker; create a new session")
        async with session.lock:
            session.cancelled = False
            try:
                if session.process is None:
                    await self.start_worker(session_id, session)
                if session.cancelled:
                    await stop_process(session.process)
                    return PromptResponse(stop_reason="cancelled")
                session.process.stdin.write((json.dumps({"message": prompt[0].text}) + "\n").encode())
                await session.process.stdin.drain()
                while True:
                    line = await session.process.stdout.readline()
                    if session.cancelled:
                        return PromptResponse(stop_reason="cancelled")
                    if not line:
                        raise RequestError(-32000, "AILIS worker exited without a result")
                    message = json.loads(line)
                    if message.get("type") == "event":
                        await self.forward_event(session_id, message["event"])
                    elif message.get("type") == "error":
                        raise RequestError(-32000, message["error"])
                    elif message.get("type") == "result":
                        return await self.finish(session_id, session, message["result"])
                    else:
                        raise RequestError(-32000, "Unexpected worker message")
            except asyncio.CancelledError:
                session.broken = True
                await stop_process(session.process)
                raise
            except Exception as error:
                session.broken = True
                await stop_process(session.process)
                if session.cancelled:
                    return PromptResponse(stop_reason="cancelled")
                if isinstance(error, RequestError):
                    raise
                raise RequestError(-32000, "AILIS runtime/protocol failure; inspect private diagnostics") from None

    async def finish(self, session_id, session, result):
        session.turns += 1
        usage = read_usage(result)
        expected = {"input_tokens", "output_tokens", "total_tokens", "cached_read_tokens", "thought_tokens"}
        session.missing_usage.update(expected - set(usage or {}))
        if usage:
            for key, value in usage.items():
                session.totals[key] = session.totals.get(key, 0) + value
        text = result.get("displayText") or result.get("finalAnswer") or ""
        if text:
            await self.update(session_id, AgentMessageChunk(
                session_update="agent_message_chunk", content=TextContentBlock(type="text", text=text)))
        if not result.get("ok") or result.get("status") != "completed":
            # Protocol/model/permission failures must remain errors, not end_turn.
            raise RequestError(-32000, "AILIS did not complete the turn", data={
                "status": result.get("status"), "usage": session.totals or None,
            })
        known = {key: value for key, value in session.totals.items() if key not in session.missing_usage}
        complete_usage = not {"input_tokens", "output_tokens", "total_tokens"}.intersection(session.missing_usage)
        return PromptResponse(stop_reason="end_turn", usage=Usage(**known) if complete_usage else None,
                              field_meta={"profile": LOCK["profile"], "runtimeSha256": LOCK["sha256"]})

    async def cancel(self, session_id, **kwargs):
        session = self.session(session_id)
        if session.lock.locked():
            session.cancelled = True
            session.broken = True
            await stop_process(session.process)

    async def shutdown(self):
        for session in self.sessions.values():
            session.cancelled = True
            await stop_process(session.process)
