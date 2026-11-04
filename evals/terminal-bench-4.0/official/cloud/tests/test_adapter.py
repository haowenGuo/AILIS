import asyncio
import hashlib
import io
import json
import os
import sys
import tarfile
from pathlib import Path

import pytest
from acp import PROTOCOL_VERSION, RequestError, spawn_agent_process, text_block
from acp.interfaces import Client
from acp.schema import ImageContentBlock

from ailis_harbor_acp.agent import AilisAgent, read_usage, stop_process
from ailis_harbor_acp.runtime import LOCK, Settings, extract_archive, verify_archive


class RecordingClient(Client):
    def __init__(self):
        self.updates = []

    async def session_update(self, session_id, update, **kwargs):
        self.updates.append((session_id, update.model_dump(mode="json", by_alias=True, exclude_none=True)))


class ScriptAgent(AilisAgent):
    """Only tests substitute a worker; production never selects this class."""
    def __init__(self, script):
        super().__init__()
        self.script = script

    async def start_worker(self, session_id, session):
        session.process = await asyncio.create_subprocess_exec(
            sys.executable, "-u", "-c", self.script,
            stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.DEVNULL, start_new_session=os.name == "posix",
        )


ECHO = '''
import sys,json
history=[]
for line in sys.stdin:
    history.append(json.loads(line)['message'])
    print(json.dumps({'type':'result','result':{'ok':True,'status':'completed',
      'displayText':json.dumps(history,ensure_ascii=False),
      'cost':{'total':{'llm':{'usage':{'promptTokens':10,'completionTokens':2,'cachedTokens':6}}}}}}),flush=True)
'''


def settings(**extras):
    return Settings.from_env({"OPENAI_API_KEY": "test-only", "OPENAI_BASE_URL": "https://example.test/v1", **extras})


def test_hosted_credential_and_gateway_precedence():
    cfg = settings(HOSTED_INFERENCE_TOKEN="hosted", HOSTED_INFERENCE_URL="https://gateway.test/v1")
    assert cfg.api_key == "hosted"
    assert cfg.base_url == "https://gateway.test/v1"
    assert cfg.provider == "openai-responses"


@pytest.mark.parametrize("env", [{}, {"OPENAI_API_KEY": "test-only"}])
def test_missing_config_is_not_replaced_with_local_login(env):
    with pytest.raises(ValueError):
        Settings.from_env(env)


@pytest.mark.parametrize("url", ["http://example.test/v1", "https://user:pass@example.test/v1", "https://example.test/v1?key=secret", "codex://chatgpt-oauth"])
def test_unsafe_url_rejected(url):
    with pytest.raises(ValueError):
        settings(OPENAI_BASE_URL=url)


@pytest.mark.parametrize("change", [{"AILIS_MODEL": "different"}, {"AILIS_REASONING_EFFORT": "medium"}, {"AILIS_API_FORMAT": "automatic"}])
def test_no_silent_model_or_transport_fallback(change):
    with pytest.raises(ValueError):
        settings(**change)


def test_explicit_chat_diagnostic_and_loopback():
    cfg = settings(OPENAI_BASE_URL="http://127.0.0.1:1234/v1", AILIS_API_FORMAT="openai_chat_completions")
    assert cfg.provider == "openai-compatible"


def test_runtime_hash(tmp_path):
    artifact = tmp_path / "runtime.tar.gz"
    artifact.write_bytes(b"test artifact")
    verify_archive(artifact, hashlib.sha256(b"test artifact").hexdigest())
    with pytest.raises(ValueError, match="SHA256"):
        verify_archive(artifact)


@pytest.mark.parametrize("name", ["../escape", "/tmp/escape"])
def test_archive_path_safety(tmp_path, name):
    artifact = tmp_path / "runtime.tar.gz"
    with tarfile.open(artifact, "w:gz") as tar:
        member = tarfile.TarInfo(name)
        member.size = 1
        tar.addfile(member, io.BytesIO(b"x"))
    target = tmp_path / "unpacked"
    target.mkdir()
    # data_filter strips leading '/' (rather than writing to /tmp); traversal fails.
    if name.startswith("../"):
        with pytest.raises(tarfile.FilterError):
            extract_archive(artifact, target)
    else:
        extract_archive(artifact, target)
        assert (target / "tmp/escape").is_file()
    assert not (tmp_path / "escape").exists()


def test_usage_includes_cache_but_does_not_double_count_reasoning():
    result = {"cost": {"total": {"llm": {"usage": {
        "promptTokens": 100, "completionTokens": 20, "cachedTokens": 60, "reasoningTokens": 15,
    }}}}}
    usage = read_usage(result)
    assert usage == {"input_tokens": 100, "output_tokens": 20, "cached_read_tokens": 60,
                     "thought_tokens": 15, "total_tokens": 120}
    assert read_usage({}) is None


async def test_two_turns_preserve_unicode_prompt_and_live_session(tmp_path):
    agent = ScriptAgent(ECHO)
    client = RecordingClient()
    agent.on_connect(client)
    session = await agent.new_session(str(tmp_path))
    try:
        first = "第一轮\n  keep spacing  \n"
        one = await agent.prompt(session.session_id, [text_block(first)])
        pid = agent.sessions[session.session_id].process.pid
        two = await agent.prompt(session.session_id, [text_block("second")])
        assert agent.sessions[session.session_id].process.pid == pid
        assert json.loads(client.updates[-1][1]["content"]["text"]) == [first, "second"]
        assert one.usage.input_tokens == 10
        assert two.usage.input_tokens == 20
        assert two.usage.cached_read_tokens == 12
    finally:
        await agent.shutdown()


async def test_sessions_are_isolated(tmp_path):
    agent = ScriptAgent(ECHO)
    client = RecordingClient()
    agent.on_connect(client)
    try:
        sessions = [await agent.new_session(str(tmp_path)) for _ in range(2)]
        for i, session in enumerate(sessions):
            await agent.prompt(session.session_id, [text_block(str(i))])
        assert [json.loads(update[1]["content"]["text"]) for update in client.updates] == [["0"], ["1"]]
    finally:
        await agent.shutdown()


async def test_model_validation_and_unsupported_inputs(tmp_path):
    agent = AilisAgent()
    session = await agent.new_session(str(tmp_path))
    await agent.set_config_option("model", session.session_id, "openai/gpt-6-luna")
    with pytest.raises(RequestError):
        await agent.set_config_option("model", session.session_id, "gpt-other")
    with pytest.raises(RequestError):
        await agent.new_session("relative")
    with pytest.raises(RequestError):
        await agent.new_session(str(tmp_path), mcp_servers=[{"name": "external"}])
    with pytest.raises(RequestError):
        await agent.prompt("unknown", [text_block("hi")])
    with pytest.raises(RequestError):
        await agent.prompt(session.session_id, [ImageContentBlock(type="image", data="eA==", mime_type="image/png")])
    with pytest.raises(RequestError):
        await agent.prompt(session.session_id, [text_block("a"), text_block("b")])


@pytest.mark.parametrize("script", ["raise SystemExit(3)", "print('not json',flush=True)",
    "print('{\"type\":\"result\",\"result\":{\"ok\":false,\"status\":\"failed\"}}',flush=True)"])
async def test_worker_failures_are_not_successful_end_turn(tmp_path, script):
    agent = ScriptAgent(script)
    agent.on_connect(RecordingClient())
    session = await agent.new_session(str(tmp_path))
    try:
        with pytest.raises(RequestError):
            await agent.prompt(session.session_id, [text_block("hi")])
        with pytest.raises(RequestError, match="Session ended"):
            await agent.prompt(session.session_id, [text_block("retry")])
    finally:
        await agent.shutdown()


async def test_cancel_and_concurrent_prompt_rejection(tmp_path):
    agent = ScriptAgent("import time; time.sleep(60)")
    agent.on_connect(RecordingClient())
    session = await agent.new_session(str(tmp_path))
    task = asyncio.create_task(agent.prompt(session.session_id, [text_block("hi")]))
    try:
        for _ in range(100):
            if agent.sessions[session.session_id].process:
                break
            await asyncio.sleep(0.01)
        with pytest.raises(RequestError, match="already running"):
            await agent.prompt(session.session_id, [text_block("second")])
        await agent.cancel(session.session_id)
        result = await asyncio.wait_for(task, 5)
        assert result.stop_reason == "cancelled"
        assert agent.sessions[session.session_id].process.returncode is not None
    finally:
        await agent.shutdown()


async def test_tool_events_keep_result_metadata():
    agent = AilisAgent()
    client = RecordingClient()
    agent.on_connect(client)
    raw = {"output": "head\nlast error", "exit_code": 1, "session_id": None, "wall_time_seconds": 0.1}
    await agent.forward_event("s", {"type": "tool.call.started", "payload": {"callId": "c", "tool": "exec_command"}})
    await agent.forward_event("s", {"type": "tool.call.finished", "payload": {"callId": "c", "ok": True, "result": raw}})
    assert client.updates[-1][1]["rawOutput"] == raw


async def test_official_sdk_stdio_handshake(tmp_path):
    client = RecordingClient()
    async with spawn_agent_process(client, sys.executable, "-m", "ailis_harbor_acp",
                                   cwd=str(Path(__file__).parents[1])) as (conn, process):
        result = await conn.initialize(protocol_version=PROTOCOL_VERSION)
        assert result.agent_info.name == "ailis"
        assert result.field_meta["runtimeSha256"] == LOCK["sha256"]
        session = await conn.new_session(cwd=str(tmp_path), mcp_servers=[])
        assert session.config_options[0].current_value == "gpt-6-luna"
        await conn.set_config_option(session_id=session.session_id, config_id="model", value="gpt-6-luna")
