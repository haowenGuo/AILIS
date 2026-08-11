"""Run official OSWorld tasks with the production AILIS TaskAgent.

Python owns DesktopEnv and the official evaluator. A short-lived HTTP bridge exposes
only generic computer_13 actions to the Windows AILIS Gateway process. No benchmark
answer, task router, or task-specific skill is implemented here.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import logging
import os
import socket
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

from desktop_env.desktop_env import DesktopEnv


LOGGER = logging.getLogger("ailis.osworld.clean")
SUPPORTED_ACTION_TYPES = {
    "MOVE_TO",
    "CLICK",
    "RIGHT_CLICK",
    "DOUBLE_CLICK",
    "DRAG_TO",
    "SCROLL",
    "TYPING",
    "PRESS",
    "HOTKEY",
    "WAIT",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Clean OSWorld runner using the current production AILIS TaskAgent"
    )
    parser.add_argument("--provider-name", default="docker")
    parser.add_argument("--path-to-vm", default=None)
    parser.add_argument("--headless", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--screen-width", type=int, default=1920)
    parser.add_argument("--screen-height", type=int, default=1080)
    parser.add_argument("--suite", choices=["small", "verified", "all"], default="small")
    parser.add_argument("--test-meta", default="")
    parser.add_argument("--test-config-base-dir", default="evaluation_examples")
    parser.add_argument("--domain", default="all")
    parser.add_argument("--start-index", type=int, default=0)
    parser.add_argument("--limit", type=int, default=1)
    parser.add_argument("--max-actions", type=int, default=50)
    parser.add_argument("--task-timeout-seconds", type=int, default=900)
    parser.add_argument("--bridge-action-timeout-seconds", type=int, default=120)
    parser.add_argument("--sleep-after-action", type=float, default=0.4)
    parser.add_argument("--settle-before-agent", type=float, default=15.0)
    parser.add_argument("--settle-before-eval", type=float, default=3.0)
    parser.add_argument(
        "--result-dir",
        default="/mnt/f/AILIS/main/eval-results/engineering/osworld-clean-task-agent",
    )
    parser.add_argument("--node-executable", default="/mnt/f/Nodejs/node.exe")
    parser.add_argument("--codex-model", default=os.environ.get("AILIS_CODEX_MODEL", "gpt-5.6-luna"))
    parser.add_argument(
        "--codex-reasoning-effort",
        default=os.environ.get("AILIS_CODEX_REASONING_EFFORT", "medium"),
    )
    parser.add_argument("--llm-timeout-ms", type=int, default=120000)
    parser.add_argument("--temperature", type=float, default=0.2)
    parser.add_argument("--record-video", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--resume", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--vm-secret-mount", action="append", default=None)
    args = parser.parse_args()
    suite_meta = {
        "small": "evaluation_examples/test_small.json",
        "verified": "evaluation_examples/test_nogdrive.json",
        "all": "evaluation_examples/test_all.json",
    }
    args.test_meta = args.test_meta or suite_meta[args.suite]
    args.result_dir = str(Path(args.result_dir).resolve())
    args.limit = max(0, args.limit)
    args.max_actions = max(1, args.max_actions)
    args.task_timeout_seconds = max(60, args.task_timeout_seconds)
    return args


def configure_logging(result_dir: Path) -> None:
    result_dir.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s %(levelname)s] %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(result_dir / "run.log", encoding="utf-8"),
        ],
    )


def flatten_meta(meta: Dict[str, List[str]]) -> List[Tuple[str, str]]:
    return [
        (domain, example_id)
        for domain, example_ids in meta.items()
        for example_id in example_ids
    ]


def selected_tasks(args: argparse.Namespace) -> List[Tuple[str, str]]:
    with open(args.test_meta, "r", encoding="utf-8") as handle:
        meta = json.load(handle)
    tasks = flatten_meta(meta)
    if args.domain != "all":
        tasks = [item for item in tasks if item[0] == args.domain]
    tasks = tasks[args.start_index :]
    return tasks[: args.limit] if args.limit else tasks


def windows_path(path_value: Path) -> str:
    result = subprocess.run(
        ["wslpath", "-w", str(path_value.resolve())],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def wsl_ip_address() -> str:
    candidates = socket.gethostbyname_ex(socket.gethostname())[2]
    candidates = [ip for ip in candidates if not ip.startswith("127.")]
    if candidates:
        return candidates[0]
    output = subprocess.check_output(["hostname", "-I"], text=True).strip().split()
    if not output:
        raise RuntimeError("Unable to determine WSL IP address for the Windows bridge")
    return output[0]


def json_safe(value: Any) -> Any:
    try:
        json.dumps(value)
        return value
    except TypeError:
        return str(value)


class OSWorldSession:
    def __init__(
        self,
        env: DesktopEnv,
        result_dir: Path,
        max_actions: int,
        action_pause: float,
    ) -> None:
        self.env = env
        self.result_dir = result_dir
        self.max_actions = max_actions
        self.action_pause = action_pause
        self.action_count = 0
        self.done = False
        self.last_observation: Dict[str, Any] = {}
        self.lock = threading.Lock()
        self.traj_path = self.result_dir / "traj.jsonl"

    def set_initial_observation(self, observation: Dict[str, Any]) -> Path:
        self.last_observation = observation
        screenshot_path = self.result_dir / "initial_state.png"
        screenshot_path.write_bytes(observation["screenshot"])
        self._append_trajectory(
            {
                "record_type": "initial_observation",
                "instruction": observation.get("instruction"),
                "screenshot_file": screenshot_path.name,
            }
        )
        return screenshot_path

    def _append_trajectory(self, record: Dict[str, Any]) -> None:
        with self.traj_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=False, default=str) + "\n")

    def observation_payload(self, **extra: Any) -> Dict[str, Any]:
        screenshot = self.last_observation.get("screenshot") or b""
        return {
            "ok": True,
            "status": "done" if self.done else "completed",
            "done": self.done,
            "step": self.action_count,
            "limit_reached": self.action_count >= self.max_actions,
            "screenshot_base64": base64.b64encode(screenshot).decode("ascii"),
            "accessibility_tree": self.last_observation.get("accessibility_tree") or "",
            **extra,
        }

    def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        requested_action = str(payload.get("requested_action") or "")
        actions = payload.get("actions")
        if not isinstance(actions, list) or not actions:
            raise ValueError("Bridge action request requires a non-empty actions list")
        with self.lock:
            if self.done or self.action_count >= self.max_actions:
                return self.observation_payload(
                    ok=False,
                    status="action_budget_exhausted",
                    limit_reached=True,
                )
            executed: List[Dict[str, Any]] = []
            for action in actions:
                if self.action_count >= self.max_actions:
                    break
                if not isinstance(action, dict):
                    raise ValueError("OSWorld action must be an object")
                action_type = str(action.get("action_type") or "").upper()
                if action_type not in SUPPORTED_ACTION_TYPES:
                    raise ValueError(f"Unsupported OSWorld action_type: {action_type}")
                normalized = {**action, "action_type": action_type}
                observation, reward, done, info = self.env.step(
                    normalized, pause=self.action_pause
                )
                self.action_count += 1
                self.done = bool(done)
                self.last_observation = observation
                timestamp = dt.datetime.now().strftime("%Y%m%d@%H%M%S%f")
                screenshot_name = f"step_{self.action_count}_{timestamp}.png"
                (self.result_dir / screenshot_name).write_bytes(observation["screenshot"])
                self._append_trajectory(
                    {
                        "record_type": "computer_action",
                        "step_num": self.action_count,
                        "action_timestamp": timestamp,
                        "requested_action": requested_action,
                        "requested_args": json_safe(payload.get("requested_args") or {}),
                        "action": normalized,
                        "reward": reward,
                        "done": done,
                        "info": json_safe(info),
                        "screenshot_file": screenshot_name,
                    }
                )
                executed.append(normalized)
                if self.done:
                    break
            return self.observation_payload(executed_actions=executed)


class BridgeHandler(BaseHTTPRequestHandler):
    server: "BridgeServer"

    def log_message(self, _format: str, *_args: Any) -> None:
        return

    def _send(self, status: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/health":
            self._send(200, {"ok": True, "status": "ready"})
        elif self.path == "/observe":
            with self.server.session.lock:
                self._send(200, self.server.session.observation_payload())
        else:
            self._send(404, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/action":
            self._send(404, {"ok": False, "error": "not_found"})
            return
        try:
            length = int(self.headers.get("content-length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            self._send(200, self.server.session.execute(payload))
        except Exception as error:  # pylint: disable=broad-except
            LOGGER.exception("Bridge action failed: %s", error)
            self._send(400, {"ok": False, "status": "invalid_action", "error": str(error)})


class BridgeServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address: Tuple[str, int], session: OSWorldSession) -> None:
        self.session = session
        super().__init__(address, BridgeHandler)


def start_bridge(session: OSWorldSession) -> Tuple[BridgeServer, threading.Thread, str]:
    server = BridgeServer(("0.0.0.0", 0), session)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    bridge_url = f"http://{wsl_ip_address()}:{server.server_address[1]}"
    return server, thread, bridge_url


def build_node_command(
    args: argparse.Namespace,
    ailis_root: Path,
    example_dir: Path,
    instruction_path: Path,
    initial_screenshot_path: Path,
    bridge_url: str,
) -> List[str]:
    node_script = ailis_root / "scripts" / "run-osworld-task-agent.mjs"
    output_path = example_dir / "agent-result.json"
    artifact_dir = example_dir / "agent-observations"
    workspace_dir = example_dir / "agent-workspace"
    return [
        args.node_executable,
        windows_path(node_script),
        "--bridge-url",
        bridge_url,
        "--instruction-file",
        windows_path(instruction_path),
        "--initial-screenshot",
        windows_path(initial_screenshot_path),
        "--output",
        windows_path(output_path),
        "--artifact-dir",
        windows_path(artifact_dir),
        "--workspace-root",
        windows_path(workspace_dir),
        "--codex-model",
        args.codex_model,
        "--codex-reasoning-effort",
        args.codex_reasoning_effort,
        "--llm-timeout-ms",
        str(args.llm_timeout_ms),
        "--temperature",
        str(args.temperature),
    ]


def make_env(args: argparse.Namespace) -> DesktopEnv:
    return DesktopEnv(
        provider_name=args.provider_name,
        path_to_vm=args.path_to_vm,
        action_space="computer_13",
        screen_size=(args.screen_width, args.screen_height),
        headless=args.headless,
        os_type="Ubuntu",
        require_a11y_tree=True,
        vm_secret_mounts=args.vm_secret_mount,
    )


def await_screenshot(
    env: DesktopEnv,
    observation: Dict[str, Any],
    timeout_seconds: float = 60.0,
) -> Dict[str, Any]:
    """Wait for the official VM service to return a complete visual observation."""
    deadline = time.monotonic() + timeout_seconds
    current = observation
    while not current.get("screenshot") and time.monotonic() < deadline:
        LOGGER.info("OSWorld screenshot is not ready; polling the official VM service...")
        time.sleep(2)
        current = env._get_obs()
    if not current.get("screenshot"):
        raise RuntimeError(
            f"OSWorld did not return a screenshot within {timeout_seconds:.0f}s"
        )
    return current


def load_example(args: argparse.Namespace, domain: str, example_id: str) -> Dict[str, Any]:
    path_value = (
        Path(args.test_config_base_dir) / "examples" / domain / f"{example_id}.json"
    )
    with path_value.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def run_one(
    args: argparse.Namespace,
    ailis_root: Path,
    env: DesktopEnv,
    domain: str,
    example_id: str,
) -> Dict[str, Any]:
    example = load_example(args, domain, example_id)
    example_dir = Path(args.result_dir) / args.suite / domain / example_id
    example_dir.mkdir(parents=True, exist_ok=True)
    result_path = example_dir / "result.txt"
    if args.resume and result_path.exists():
        return {
            "domain": domain,
            "example_id": example_id,
            "status": "skipped_existing",
            "score": float(result_path.read_text(encoding="utf-8").strip() or 0),
        }

    instruction = str(example["instruction"])
    instruction_path = example_dir / "instruction.txt"
    instruction_path.write_text(instruction + "\n", encoding="utf-8")
    LOGGER.info("Resetting %s/%s: %s", domain, example_id, instruction)
    observation = env.reset(task_config=example)
    if args.settle_before_agent:
        time.sleep(args.settle_before_agent)
        observation = env._get_obs()  # Official DesktopEnv public observation payload.
    observation = await_screenshot(env, observation)
    session = OSWorldSession(env, example_dir, args.max_actions, args.sleep_after_action)
    initial_screenshot = session.set_initial_observation(observation)

    recording_started = False
    if args.record_video:
        env.controller.start_recording()
        recording_started = True
    server, thread, bridge_url = start_bridge(session)
    node_command = build_node_command(
        args,
        ailis_root,
        example_dir,
        instruction_path,
        initial_screenshot,
        bridge_url,
    )
    started_at = time.monotonic()
    node_result: Optional[subprocess.CompletedProcess[str]] = None
    runner_error = ""
    try:
        node_result = subprocess.run(
            node_command,
            cwd=str(ailis_root),
            capture_output=True,
            text=True,
            errors="replace",
            timeout=args.task_timeout_seconds,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        runner_error = f"AILIS TaskAgent exceeded {args.task_timeout_seconds}s"
        (example_dir / "node-timeout.json").write_text(
            json.dumps(
                {
                    "error": runner_error,
                    "stdout": error.stdout or "",
                    "stderr": error.stderr or "",
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)

    if node_result:
        (example_dir / "node-stdout.log").write_text(node_result.stdout or "", encoding="utf-8")
        (example_dir / "node-stderr.log").write_text(node_result.stderr or "", encoding="utf-8")
        if node_result.returncode != 0:
            runner_error = f"AILIS TaskAgent exited with code {node_result.returncode}"

    if not session.done:
        session.last_observation, _, session.done, _ = env.step("DONE", pause=0)
    if args.settle_before_eval:
        time.sleep(args.settle_before_eval)
    score = float(env.evaluate())
    result_path.write_text(f"{score}\n", encoding="utf-8")
    if recording_started:
        env.controller.end_recording(str(example_dir / "recording.mp4"))
    summary = {
        "schema": "ailis.osworld.official_result.v1",
        "suite": args.suite,
        "verified_status": (
            "local_verified_compatible_not_officially_verified"
            if args.suite == "verified"
            else "not_applicable"
        ),
        "domain": domain,
        "example_id": example_id,
        "instruction": instruction,
        "score": score,
        "status": "completed" if not runner_error else "agent_runner_error",
        "runner_error": runner_error,
        "action_count": session.action_count,
        "max_actions": args.max_actions,
        "duration_seconds": round(time.monotonic() - started_at, 3),
        "node_returncode": node_result.returncode if node_result else None,
        "model": args.codex_model,
        "reasoning_effort": args.codex_reasoning_effort,
        "agent_protocol": "production_ailis_gateway_clean_computer_transport",
    }
    (example_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return summary


def summarize(args: argparse.Namespace, results: Iterable[Dict[str, Any]]) -> Dict[str, Any]:
    rows = list(results)
    scored = [float(row["score"]) for row in rows if row.get("score") is not None]
    summary = {
        "schema": "ailis.osworld.run_summary.v1",
        "suite": args.suite,
        "test_meta": args.test_meta,
        "task_count": len(rows),
        "scored_count": len(scored),
        "average_score": sum(scored) / len(scored) if scored else 0.0,
        "model": args.codex_model,
        "reasoning_effort": args.codex_reasoning_effort,
        "agent_protocol": "production_ailis_gateway_clean_computer_transport",
        "results": rows,
    }
    path_value = Path(args.result_dir) / f"{args.suite}-summary.json"
    path_value.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def validate_existing(args: argparse.Namespace) -> Dict[str, Any]:
    rows: List[Dict[str, Any]] = []
    root = Path(args.result_dir) / args.suite
    for result_path in root.glob("*/*/result.txt") if root.exists() else []:
        rows.append(
            {
                "domain": result_path.parent.parent.name,
                "example_id": result_path.parent.name,
                "score": float(result_path.read_text(encoding="utf-8").strip() or 0),
                "status": "existing",
            }
        )
    return summarize(args, rows)


def main() -> int:
    args = parse_args()
    result_dir = Path(args.result_dir)
    configure_logging(result_dir)
    if args.validate_only:
        print(json.dumps(validate_existing(args), ensure_ascii=False, indent=2))
        return 0

    ailis_root = Path(__file__).resolve().parents[2]
    tasks = selected_tasks(args)
    LOGGER.info(
        "AILIS clean OSWorld run: suite=%s tasks=%d model=%s effort=%s",
        args.suite,
        len(tasks),
        args.codex_model,
        args.codex_reasoning_effort,
    )
    env = make_env(args)
    results: List[Dict[str, Any]] = []
    try:
        for index, (domain, example_id) in enumerate(tasks, start=1):
            LOGGER.info("[%d/%d] %s/%s", index, len(tasks), domain, example_id)
            try:
                results.append(run_one(args, ailis_root, env, domain, example_id))
            except Exception as error:  # pylint: disable=broad-except
                LOGGER.exception("Task %s/%s failed: %s", domain, example_id, error)
                results.append(
                    {
                        "domain": domain,
                        "example_id": example_id,
                        "status": "runner_exception",
                        "score": 0.0,
                        "error": str(error),
                    }
                )
    finally:
        env.close()
    print(json.dumps(summarize(args, results), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
