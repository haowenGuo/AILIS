"""Real frozen Gateway and real Codex exec-server, deterministic model endpoint.

No benchmark task, verifier or cloud job is launched. The fake endpoint is only
a test fixture; its tool command executes through the actual frozen runtime.
"""

import asyncio
import json
import os
import signal
import shlex
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest
from acp import PROTOCOL_VERSION, spawn_agent_process, text_block

from test_adapter import RecordingClient

pytestmark = pytest.mark.skipif(
    sys.platform != "linux" or not os.environ.get("AILIS_TEST_FROZEN_RUNTIME"),
    reason="Explicit Linux frozen-runtime integration test",
)


@pytest.mark.parametrize("client_mode", ["sdk", "harbor", "cancel"])
async def test_frozen_gateway_real_tool_and_second_turn(tmp_path, client_mode):
    requests = []
    artifact = tmp_path / "acp-tool-proof.txt"
    command = f"printf 'ACP_REAL_TOOL_OK' > {shlex.quote(str(artifact))}; printf 'ACP_REAL_TOOL_OK'"
    if client_mode == "cancel":
        command = f"sleep 120 & child=$!; echo $child > {shlex.quote(str(artifact))}; wait $child"

    class Endpoint(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_POST(self):
            body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            requests.append(body)
            if len(requests) == 1:
                tools = {t["name"]: t for t in body["tools"]}
                if "exec_command" in tools:
                    name, arguments = "exec_command", {"cmd": command, "workdir": str(tmp_path)}
                else:
                    name = "exec"
                    arguments = {"input": "const r = await tools.exec_command(" + json.dumps({"cmd": command, "workdir": str(tmp_path)}) + "); text(r);"}
                schema = tools[name]["parameters"]
                for key in schema.get("required", []):
                    if key not in arguments and "null" in schema.get("properties", {}).get(key, {}).get("type", []):
                        arguments[key] = None
                output = [{"type": "function_call", "id": "fc_probe", "call_id": "call_probe",
                           "name": name, "arguments": json.dumps(arguments)}]
            else:
                output = [{"type": "message", "role": "assistant", "id": f"msg_{len(requests)}",
                           "content": [{"type": "output_text", "text": "ACP_PROBE_DONE"}]}]
            payload = json.dumps({"id": f"resp_{len(requests)}", "object": "response", "status": "completed",
                "model": "gpt-6-luna", "output": output,
                "usage": {"input_tokens": 100, "output_tokens": 10, "total_tokens": 110,
                          "input_tokens_details": {"cached_tokens": 60}}}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

    server = ThreadingHTTPServer(("127.0.0.1", 0), Endpoint)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    client = RecordingClient()
    env = dict(os.environ)
    env.pop("HOSTED_INFERENCE_TOKEN", None)
    env.pop("HOSTED_INFERENCE_URL", None)
    env.update({"OPENAI_API_KEY": "integration-test-only", "OPENAI_BASE_URL": f"http://127.0.0.1:{server.server_port}/v1",
                "AILIS_API_FORMAT": "openai_responses", "AILIS_LOG_DIR": str(tmp_path / "logs")})
    try:
        if client_mode == "harbor":
            runner = Path(os.environ.get("AILIS_TEST_HARBOR_RUNNER", "/root/.local/share/uv/tools/harbor/lib/python3.13/site-packages/harbor/agents/installed/acp_runner.py"))
            if not runner.is_file():
                pytest.skip("Official Harbor runner is not installed on this host")
            env["HARBOR_ACP_REQUESTED_MODEL"] = "openai/gpt-6-luna"
            process = await asyncio.create_subprocess_exec(
                sys.executable, "-c", "import runpy,sys; sys.argv=sys.argv[1:]; runpy.run_path(sys.argv[0],run_name='__main__')",
                str(runner), "--instruction", "FIRST_TURN_MARKER: Execute the tool and return its output.",
                "--logs-dir", str(tmp_path / "harbor-logs"),
                "--launcher", str(Path(sys.executable).parent / "ailis-harbor-acp"),
                cwd=tmp_path, env=env, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(process.communicate(), 90)
            assert process.returncode == 0, (stdout.decode(), stderr.decode())
            summary = json.loads((tmp_path / "harbor-logs/acp-summary.json").read_text())
            assert artifact.read_text() == "ACP_REAL_TOOL_OK"
            assert summary["prompt_response"]["stopReason"] == "end_turn"
            assert summary["prompt_response"]["usage"]["inputTokens"] == 200
            assert summary["prompt_response"]["usage"]["cachedReadTokens"] == 120
            assert summary["resolved_session_model_id"] == "gpt-6-luna"
            assert len(requests) == 2
            return
        async with spawn_agent_process(client, sys.executable, "-m", "ailis_harbor_acp",
                                       cwd=str(Path(__file__).parents[1]), env=env) as (conn, process):
            await conn.initialize(protocol_version=PROTOCOL_VERSION)
            session = await conn.new_session(cwd=str(tmp_path), mcp_servers=[])
            if client_mode == "cancel":
                running = asyncio.create_task(conn.prompt(session_id=session.session_id, prompt=[text_block("Execute the supplied test tool.")]))
                for _ in range(300):
                    if artifact.exists() and artifact.read_text().strip():
                        break
                    await asyncio.sleep(0.02)
                assert artifact.exists(), "Real tool did not start"
                child_pid = int(artifact.read_text())
                await conn.cancel(session_id=session.session_id)
                cancelled = await asyncio.wait_for(running, 10)
                assert cancelled.stop_reason == "cancelled"
                for _ in range(100):
                    stat = Path(f"/proc/{child_pid}/stat")
                    if not stat.exists() or stat.read_text().split()[2] == "Z":
                        break
                    await asyncio.sleep(0.03)
                else:
                    os.kill(child_pid, signal.SIGKILL)
                    pytest.fail("Cancelled tool process survived worker cleanup")
                return
            first = await asyncio.wait_for(conn.prompt(session_id=session.session_id,
                prompt=[text_block("FIRST_TURN_MARKER: Execute the tool and return its output.")]), 90)
            (tmp_path / "mock-requests.json").write_text(json.dumps(requests, ensure_ascii=False), encoding="utf-8")
            assert artifact.exists(), client.updates
            assert artifact.read_text() == "ACP_REAL_TOOL_OK"
            assert first.stop_reason == "end_turn"
            assert first.usage.input_tokens == 200
            assert first.usage.cached_read_tokens == 120
            second = await asyncio.wait_for(conn.prompt(session_id=session.session_id,
                prompt=[text_block("SECOND_TURN_MARKER: What was the result?")]), 90)
            assert second.stop_reason == "end_turn"
            assert second.usage.input_tokens == 300
        assert len(requests) == 3
        wire = json.dumps(requests[1], ensure_ascii=False)
        assert "ACP_REAL_TOOL_OK" in wire
        assert "function_call_output" in wire
        final_wire = json.dumps(requests[2], ensure_ascii=False)
        assert "FIRST_TURN_MARKER" in final_wire and "SECOND_TURN_MARKER" in final_wire
        assert all(r["model"] == "gpt-6-luna" for r in requests)
        assert all(r.get("reasoning", {}).get("effort") == "xhigh" for r in requests)
        assert any(u[1]["sessionUpdate"] == "tool_call_update" for u in client.updates)
        result_files = list((tmp_path / "logs").glob("*/turn-*.json"))
        assert len(result_files) == 2
    finally:
        server.shutdown()
        server.server_close()
