from __future__ import annotations

import argparse
import json
import os
import shutil
import shlex
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JOB_ID = "2026-04-22-16h-blog-autowriter"
RUN_DIR = ROOT / "backend" / "blog_content" / "auto_blog_runs" / JOB_ID
PROMPT_FILE = RUN_DIR / "RUNNER_PROMPT.md"
RUNNER_LOG = RUN_DIR / "RUNNER_LOG.md"
RUNNER_STATUS = RUN_DIR / "RUNNER_STATUS.json"
LAST_MESSAGE = RUN_DIR / "last_runner_message.md"
LOCK_FILE = RUN_DIR / "runner.lock"
MISSION_FILE = RUN_DIR / "mission.md"
ACCEPTANCE_FILE = RUN_DIR / "acceptance.md"
LOOP_POLICY_FILE = RUN_DIR / "loop-policy.json"
STATE_FILE = RUN_DIR / "state.json"
PROGRESS_FILE = RUN_DIR / "progress.json"
CONTROL_QUEUE = RUN_DIR / "control-queue.jsonl"
EVENT_LOG = RUN_DIR / "event-log.jsonl"
STOP_FILE = RUN_DIR / "stop.flag"
ITERATIONS_DIR = RUN_DIR / "iterations"

DEFAULT_MAIN_WORKTREE = Path("F:/AIGril_tmp_main")

ALLOWED_EXACT_PATHS = {
    "backend/blog_content/posts.json",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/STATUS.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/PROGRESS_LOG.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/final_100_page_report.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/mission.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/acceptance.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/loop-policy.json",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/LONGRUN_ENGINEERING_PLAN.md",
}

ALLOWED_PREFIXES = (
    "backend/blog_content/posts/zh/",
    "backend/blog_content/posts/en/",
)

IGNORED_RUNTIME_PATHS = {
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/RUNNER_LOG.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/RUNNER_STATUS.json",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/last_runner_message.md",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/event-log.jsonl",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/progress.json",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/state.json",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/control-queue.jsonl",
    "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/stop.flag",
}


def is_allowed_publish_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    if normalized in IGNORED_RUNTIME_PATHS:
        return False
    return normalized in ALLOWED_EXACT_PATHS or normalized.startswith(ALLOWED_PREFIXES)


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def append_log(text: str) -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    with RUNNER_LOG.open("a", encoding="utf-8") as fh:
        fh.write(text.rstrip() + "\n\n")


def read_json_file(path: Path, default: dict[str, object]) -> dict[str, object]:
    if not path.exists():
        return dict(default)
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return dict(default, parse_error=True)


def write_json_file(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_state() -> dict[str, object]:
    return read_json_file(
        STATE_FILE,
        {
            "jobId": JOB_ID,
            "status": "created",
            "iteration": 0,
            "completedIterations": 0,
            "failedIterations": 0,
            "pendingCommits": [],
            "lastConsumedControlLine": 0,
        },
    )


def write_state(**updates: object) -> dict[str, object]:
    state = read_state()
    state.update(updates)
    state["jobId"] = JOB_ID
    state["updatedAt"] = now_iso()
    write_json_file(STATE_FILE, state)
    return state


def append_event(
    event_type: str,
    summary: str,
    *,
    iteration: int | None = None,
    artifact_paths: list[str] | None = None,
    failure_category: str | None = None,
    extra: dict[str, object] | None = None,
) -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    event: dict[str, object] = {
        "at": now_iso(),
        "type": event_type,
        "jobId": JOB_ID,
        "iteration": iteration,
        "summary": summary,
        "artifactPaths": artifact_paths or [],
        "failureCategory": failure_category,
    }
    if extra:
        event.update(extra)
    with EVENT_LOG.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, ensure_ascii=False) + "\n")


def write_progress(
    *,
    status: str,
    current_action: str,
    latest_evidence: str = "",
    next_action: str = "",
    risk: str = "none",
    latest_artifact_path: str = "",
    active_agent_runs: int = 0,
    failure_category: str | None = None,
) -> None:
    state = read_state()
    payload = {
        "jobId": JOB_ID,
        "status": status,
        "iteration": int(state.get("iteration", 0) or 0),
        "currentAction": current_action,
        "activeAgentRuns": active_agent_runs,
        "controllerPid": os.getpid(),
        "lastUpdateAt": now_iso(),
        "lastUpdateAgeSeconds": 0,
        "completedSteps": int(state.get("completedIterations", 0) or 0),
        "failedSteps": int(state.get("failedIterations", 0) or 0),
        "pendingCommits": state.get("pendingCommits", []),
        "latestArtifactPath": latest_artifact_path,
        "latestEvidence": latest_evidence,
        "nextAction": next_action,
        "risk": risk,
        "failureCategory": failure_category,
    }
    write_json_file(PROGRESS_FILE, payload)


def write_status(**updates: object) -> None:
    current: dict[str, object] = {}
    if RUNNER_STATUS.exists():
        try:
            current = json.loads(RUNNER_STATUS.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            current = {"status_parse_error": True}
    current.update(updates)
    current["updated_at"] = now_iso()
    RUNNER_STATUS.write_text(
        json.dumps(current, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def run_cmd(
    args: list[str],
    cwd: Path = ROOT,
    timeout: int | None = None,
    check: bool = False,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        cwd=str(cwd),
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=timeout,
        check=check,
    )


def resolve_codex_command() -> str:
    """Use the Windows npm command shim; bare `codex` can resolve to a non-executable shim."""
    if os.name == "nt":
        for candidate in ("codex.cmd", "codex.bat"):
            path = shutil.which(candidate)
            if path:
                return path
    path = shutil.which("codex")
    return path or "codex"


def classify_failure(message: str) -> str:
    text = message.lower()
    if "cherry-pick" in text or "merge conflict" in text or "conflict" in text:
        return "merge_failed"
    if "failed to connect" in text or "could not connect" in text or "recv failure" in text:
        return "environment_failed"
    if "posts.json validation" in text or "json" in text and "validation" in text:
        return "schema_failed"
    if "timeout" in text or "timed out" in text or "codex" in text and "exit code" in text:
        return "runtime_failed"
    if "runner lock" in text or "dirty" in text or "pending" in text:
        return "orchestration_failed"
    if "test" in text or "verifier" in text:
        return "verifier_failed"
    return "runner_failed"


def consume_control_commands() -> str | None:
    state = read_state()
    last_consumed = int(state.get("lastConsumedControlLine", 0) or 0)
    if not CONTROL_QUEUE.exists():
        return None

    lines = CONTROL_QUEUE.read_text(encoding="utf-8").splitlines()
    command_to_apply: str | None = None
    for line_no, line in enumerate(lines, start=1):
        if line_no <= last_consumed or not line.strip():
            continue
        try:
            command = json.loads(line)
        except json.JSONDecodeError:
            append_event(
                "FAILURE_CLASSIFIED",
                f"Invalid control queue line {line_no}",
                failure_category="schema_failed",
            )
            continue

        command_type = str(command.get("type", "")).upper()
        append_event(
            "CONTROL_COMMAND_CONSUMED",
            f"Consumed control command {command_type or 'UNKNOWN'}",
            extra={"command": command, "line": line_no},
        )
        if command_type in {"STOP", "PAUSE", "CONTINUE", "REQUEST_REPORT"}:
            command_to_apply = command_type
        last_consumed = line_no

    write_state(lastConsumedControlLine=last_consumed)
    return command_to_apply


def acquire_lock() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    try:
        fd = os.open(str(LOCK_FILE), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
    except FileExistsError:
        raise RuntimeError(f"runner lock already exists: {LOCK_FILE}")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        fh.write(f"pid={os.getpid()}\nstarted_at={now_iso()}\n")


def release_lock() -> None:
    try:
        LOCK_FILE.unlink()
    except FileNotFoundError:
        pass


def build_codex_prompt() -> str:
    base_prompt = PROMPT_FILE.read_text(encoding="utf-8")
    return (
        base_prompt
        + "\n\n"
        + "## Runner Context\n\n"
        + f"- Runner started at: {now_iso()}\n"
        + "- Remember: do not run Git commands. The Python runner handles Git after you exit.\n"
    )


def run_codex_iteration(model: str, codex_timeout: int, iteration: int) -> int:
    prompt = build_codex_prompt()
    LAST_MESSAGE.write_text("", encoding="utf-8")
    codex_cmd = resolve_codex_command()
    args = [
        codex_cmd,
        "exec",
        "--cd",
        str(ROOT),
        "--model",
        model,
        "--dangerously-bypass-approvals-and-sandbox",
        "--output-last-message",
        str(LAST_MESSAGE),
        "-",
    ]
    append_log(
        "## Runner Iteration Started\n\n"
        f"- Time: `{now_iso()}`\n"
        f"- Command: `{shlex.join(args[:-1])} -`\n"
    )
    append_event(
        "AGENT_RUN_STARTED",
        "Started one Codex writing iteration",
        iteration=iteration,
        artifact_paths=[str(LAST_MESSAGE.relative_to(ROOT))],
    )
    write_progress(
        status="executing_iteration",
        current_action="running Codex writing worker",
        next_action="validate generated blog artifacts",
        latest_artifact_path=str(LAST_MESSAGE.relative_to(ROOT)),
        active_agent_runs=1,
    )
    proc = subprocess.run(
        args,
        input=prompt,
        cwd=str(ROOT),
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=codex_timeout,
    )
    append_log(
        "## Codex Worker Finished\n\n"
        f"- Time: `{now_iso()}`\n"
        f"- Exit code: `{proc.returncode}`\n\n"
        "```text\n"
        + proc.stdout[-6000:]
        + "\n```\n"
    )
    append_event(
        "AGENT_RUN_FINISHED",
        f"Codex writing worker exited with code {proc.returncode}",
        iteration=iteration,
        artifact_paths=[str(LAST_MESSAGE.relative_to(ROOT))],
    )
    return proc.returncode


def validate_posts_json() -> None:
    posts_json = ROOT / "backend" / "blog_content" / "posts.json"
    write_progress(
        status="verifying",
        current_action="validating posts.json",
        latest_artifact_path=str(posts_json.relative_to(ROOT)),
    )
    append_event("TEST_STARTED", "Validating posts.json", artifact_paths=[str(posts_json.relative_to(ROOT))])
    proc = run_cmd([sys.executable, "-m", "json.tool", str(posts_json)], timeout=30)
    if proc.returncode != 0:
        append_event(
            "FAILURE_CLASSIFIED",
            "posts.json validation failed",
            artifact_paths=[str(posts_json.relative_to(ROOT))],
            failure_category="schema_failed",
        )
        raise RuntimeError(f"posts.json validation failed:\n{proc.stdout}")
    append_event("TEST_FINISHED", "posts.json validation passed", artifact_paths=[str(posts_json.relative_to(ROOT))])


def changed_allowed_paths() -> list[str]:
    proc = run_cmd(["git", "status", "--porcelain=v1"], timeout=30)
    if proc.returncode != 0:
        raise RuntimeError(proc.stdout)

    paths: list[str] = []
    for line in proc.stdout.splitlines():
        if not line.strip():
            continue
        raw_path = line[3:]
        if " -> " in raw_path:
            raw_path = raw_path.split(" -> ", 1)[1]
        if is_allowed_publish_path(raw_path):
            paths.append(raw_path)
    return sorted(set(paths))


def commit_allowed_changes() -> str | None:
    cached = run_cmd(["git", "diff", "--cached", "--name-only"], timeout=30)
    if cached.returncode != 0:
        raise RuntimeError(cached.stdout)
    staged_unrelated = [
        path
        for path in cached.stdout.splitlines()
        if path and not is_allowed_publish_path(path)
    ]
    if staged_unrelated:
        raise RuntimeError(
            "refusing to commit because unrelated files are already staged:\n"
            + "\n".join(staged_unrelated)
        )

    paths = changed_allowed_paths()
    if not paths:
        append_log(f"## Git Commit Skipped\n\n- Time: `{now_iso()}`\n- Reason: no allowed blog changes\n")
        append_event("PATCH_CREATED", "No allowed blog changes to commit")
        return None

    write_progress(status="verifying", current_action="staging allowed blog artifacts")
    add_proc = run_cmd(["git", "add", "--", *paths], timeout=60)
    if add_proc.returncode != 0:
        raise RuntimeError(f"git add failed:\n{add_proc.stdout}")

    write_progress(status="verifying", current_action="committing allowed blog artifacts")
    commit_proc = run_cmd(["git", "commit", "-m", "docs: auto blog runner iteration"], timeout=120)
    if commit_proc.returncode != 0:
        raise RuntimeError(f"git commit failed:\n{commit_proc.stdout}")

    rev_proc = run_cmd(["git", "rev-parse", "HEAD"], timeout=30, check=True)
    commit_hash = rev_proc.stdout.strip()
    append_log(
        "## Git Commit Created\n\n"
        f"- Time: `{now_iso()}`\n"
        f"- Commit: `{commit_hash}`\n"
        f"- Files: `{len(paths)}`\n"
    )
    append_event(
        "PATCH_CREATED",
        f"Created blog publish commit {commit_hash}",
        artifact_paths=paths,
        extra={"commit": commit_hash, "fileCount": len(paths)},
    )
    return commit_hash


def push_pending_commits(commit_hashes: list[str], main_worktree: Path) -> None:
    if not commit_hashes:
        return

    if not main_worktree.exists():
        append_log(
            "## Push Skipped\n\n"
            f"- Time: `{now_iso()}`\n"
            f"- Reason: main worktree does not exist: `{main_worktree}`\n"
        )
        return

    write_progress(
        status="syncing_pending",
        current_action="checking publishing worktree",
        latest_evidence=", ".join(commit_hashes),
        next_action="fetch main and cherry-pick pending commits",
    )
    clear_empty_cherry_pick_if_needed(main_worktree)

    status = run_cmd(["git", "status", "--short"], cwd=main_worktree, timeout=30)
    if status.returncode != 0:
        raise RuntimeError(status.stdout)
    if status.stdout.strip():
        raise RuntimeError("main worktree is dirty:\n" + status.stdout)

    for cmd in (["git", "fetch", "origin", "main"], ["git", "pull", "--rebase", "origin", "main"]):
        proc = run_cmd(cmd, cwd=main_worktree, timeout=180)
        if proc.returncode != 0:
            raise RuntimeError(f"{shlex.join(cmd)} failed:\n{proc.stdout}")

    for commit_hash in commit_hashes:
        write_progress(
            status="syncing_pending",
            current_action=f"cherry-picking pending commit {commit_hash[:8]}",
            latest_evidence=commit_hash,
            next_action="push main after pending commits are applied",
        )
        proc = run_cmd(["git", "cherry-pick", commit_hash], cwd=main_worktree, timeout=180)
        if proc.returncode != 0:
            if skip_empty_cherry_pick_if_needed(main_worktree, commit_hash, proc.stdout):
                continue
            raise RuntimeError(f"git cherry-pick {commit_hash} failed:\n{proc.stdout}")

    proc = run_cmd(["git", "push", "origin", "HEAD:main"], cwd=main_worktree, timeout=180)
    if proc.returncode != 0:
        raise RuntimeError(f"git push origin HEAD:main failed:\n{proc.stdout}")

    append_log(
        "## Git Push Completed\n\n"
        f"- Time: `{now_iso()}`\n"
        f"- Commits: `{', '.join(commit_hashes)}`\n"
        f"- Main worktree: `{main_worktree}`\n"
    )
    append_event(
        "ITERATION_ACCEPTED",
        f"Pushed {len(commit_hashes)} pending commit(s) to main",
        extra={"commits": commit_hashes, "mainWorktree": str(main_worktree)},
    )


def cherry_pick_head_exists(main_worktree: Path) -> bool:
    git_path = run_cmd(["git", "rev-parse", "--git-path", "CHERRY_PICK_HEAD"], cwd=main_worktree, timeout=30)
    if git_path.returncode != 0:
        return False
    return (main_worktree / git_path.stdout.strip()).exists()


def clear_empty_cherry_pick_if_needed(main_worktree: Path) -> None:
    if not cherry_pick_head_exists(main_worktree):
        return

    status = run_cmd(["git", "status", "--porcelain"], cwd=main_worktree, timeout=30)
    if status.returncode != 0:
        raise RuntimeError(status.stdout)
    if status.stdout.strip():
        raise RuntimeError("main worktree has an in-progress cherry-pick with local changes:\n" + status.stdout)

    skip = run_cmd(["git", "cherry-pick", "--skip"], cwd=main_worktree, timeout=60)
    if skip.returncode != 0:
        raise RuntimeError(f"git cherry-pick --skip failed:\n{skip.stdout}")
    append_event(
        "REPAIR_FINISHED",
        "Skipped an empty in-progress cherry-pick before publishing pending commits",
        extra={"mainWorktree": str(main_worktree)},
    )


def skip_empty_cherry_pick_if_needed(main_worktree: Path, commit_hash: str, output: str) -> bool:
    text = output.lower()
    looks_empty = (
        "previous cherry-pick is now empty" in text
        or "nothing to commit, working tree clean" in text
        or "the patch is already applied" in text
    )
    if not looks_empty or not cherry_pick_head_exists(main_worktree):
        return False

    status = run_cmd(["git", "status", "--porcelain"], cwd=main_worktree, timeout=30)
    if status.returncode != 0 or status.stdout.strip():
        return False

    skip = run_cmd(["git", "cherry-pick", "--skip"], cwd=main_worktree, timeout=60)
    if skip.returncode != 0:
        raise RuntimeError(f"git cherry-pick --skip failed:\n{skip.stdout}")

    append_log(
        "## Pending Commit Skipped\n\n"
        f"- Time: `{now_iso()}`\n"
        f"- Commit: `{commit_hash}`\n"
        "- Reason: patch already exists in the publishing worktree\n"
    )
    append_event(
        "REPAIR_FINISHED",
        f"Skipped already-applied pending commit {commit_hash}",
        extra={"commit": commit_hash, "mainWorktree": str(main_worktree)},
    )
    return True


def push_existing_main_worktree_if_needed(main_worktree: Path) -> None:
    if not main_worktree.exists():
        return
    status = run_cmd(["git", "status", "--short"], cwd=main_worktree, timeout=30)
    if status.returncode != 0:
        raise RuntimeError(status.stdout)
    if status.stdout.strip():
        raise RuntimeError("main worktree is dirty:\n" + status.stdout)

    ahead = run_cmd(["git", "rev-list", "--count", "origin/main..HEAD"], cwd=main_worktree, timeout=30)
    if ahead.returncode != 0:
        raise RuntimeError(ahead.stdout)
    ahead_count = int((ahead.stdout.strip() or "0"))
    if ahead_count <= 0:
        return

    append_event(
        "REPAIR_STARTED",
        f"Publishing {ahead_count} already-applied main worktree commit(s) before new writing",
        extra={"mainWorktree": str(main_worktree), "aheadCount": ahead_count},
    )
    write_progress(
        status="syncing_pending",
        current_action=f"pushing {ahead_count} existing main worktree commit(s)",
        latest_evidence=str(main_worktree),
        next_action="start a new writing iteration only after push succeeds",
    )
    proc = run_cmd(["git", "push", "origin", "HEAD:main"], cwd=main_worktree, timeout=180)
    if proc.returncode != 0:
        raise RuntimeError(f"git push origin HEAD:main failed:\n{proc.stdout}")
    append_event(
        "REPAIR_FINISHED",
        f"Published {ahead_count} existing main worktree commit(s)",
        extra={"mainWorktree": str(main_worktree), "aheadCount": ahead_count},
    )


def run_once(args: argparse.Namespace) -> None:
    started = now_iso()
    command = consume_control_commands()
    if STOP_FILE.exists() or command in {"STOP", "PAUSE"}:
        state_name = "stopped" if STOP_FILE.exists() or command == "STOP" else "blocked"
        append_event("JOB_BLOCKED", f"Controller received {command or 'STOP_FLAG'}")
        write_state(status=state_name)
        write_progress(
            status=state_name,
            current_action="controller paused by control queue or stop flag",
            next_action="append CONTINUE to control-queue.jsonl and restart if needed",
            risk="user_controlled",
        )
        write_status(runner=state_name, last_run_finished_at=now_iso(), last_error=None)
        return

    state = read_state()
    pending_commits = list(state.get("pendingCommits", []) or [])
    if pending_commits and not args.no_push:
        append_event(
            "REPAIR_STARTED",
            f"Retrying {len(pending_commits)} pending publish commit(s) before new writing",
            extra={"pendingCommits": pending_commits},
        )
        write_status(runner="syncing_pending", last_run_started_at=started, last_error=None, mode="local-runner")
        push_pending_commits([str(commit) for commit in pending_commits], Path(args.main_worktree))
        write_state(status="sleeping", pendingCommits=[])
        write_progress(
            status="sleeping",
            current_action="pending commits synced; waiting for next writing iteration",
            latest_evidence=", ".join(str(commit) for commit in pending_commits),
            next_action="start a new Codex writing iteration on the next loop",
        )
        write_status(
            runner="idle",
            last_run_finished_at=now_iso(),
            last_exit_code=0,
            last_commit=pending_commits[-1],
            last_error=None,
            no_git=args.no_git,
            no_push=args.no_push,
        )
        append_event("REPAIR_FINISHED", "Pending publish commits synced successfully")
        return

    if not args.no_push:
        push_existing_main_worktree_if_needed(Path(args.main_worktree))

    iteration = int(state.get("iteration", 0) or 0) + 1
    ITERATIONS_DIR.joinpath(f"iter-{iteration:03d}", "artifacts").mkdir(parents=True, exist_ok=True)
    write_state(status="running", iteration=iteration)
    append_event("ITERATION_STARTED", "Started auto blog writing iteration", iteration=iteration)
    write_status(
        runner="active",
        last_run_started_at=started,
        last_error=None,
        mode="local-runner",
    )
    exit_code = run_codex_iteration(args.model, args.codex_timeout, iteration)
    if exit_code != 0:
        failed = int(read_state().get("failedIterations", 0) or 0) + 1
        write_state(status="failed", failedIterations=failed)
        append_event(
            "ITERATION_FAILED",
            f"Codex worker exited with code {exit_code}",
            iteration=iteration,
            failure_category="runtime_failed",
        )
        write_progress(
            status="failed",
            current_action="Codex worker failed",
            latest_evidence=f"exit_code={exit_code}",
            next_action="classify worker output and retry the smallest failing layer",
            risk="runtime_failed",
            failure_category="runtime_failed",
        )
        write_status(runner="error", last_run_finished_at=now_iso(), last_exit_code=exit_code)
        return

    validate_posts_json()
    commit_hash = None if args.no_git else commit_allowed_changes()
    pending_after_commit = list(read_state().get("pendingCommits", []) or [])
    if commit_hash:
        pending_after_commit.append(commit_hash)
        write_state(pendingCommits=pending_after_commit)
    if pending_after_commit and not args.no_push:
        push_pending_commits([str(commit) for commit in pending_after_commit], Path(args.main_worktree))
        write_state(pendingCommits=[])

    completed = int(read_state().get("completedIterations", 0) or 0) + 1
    write_state(status="sleeping", completedIterations=completed)
    write_progress(
        status="sleeping",
        current_action="iteration accepted and controller is waiting",
        latest_evidence=commit_hash or "no commit",
        next_action="sleep until the next scheduled iteration",
    )
    append_event(
        "VERDICT_CREATED",
        "Iteration completed successfully",
        iteration=iteration,
        extra={"commit": commit_hash, "pushed": bool(commit_hash and not args.no_push)},
    )

    write_status(
        runner="idle",
        last_run_finished_at=now_iso(),
        last_exit_code=exit_code,
        last_commit=commit_hash,
        no_git=args.no_git,
        no_push=args.no_push,
    )


def parse_until(value: str | None) -> float | None:
    if not value:
        return None
    normalized = value.replace("Z", "+00:00")
    return datetime.fromisoformat(normalized).timestamp()


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the AIGril auto blog writer locally.")
    parser.add_argument("--once", action="store_true", help="Run one iteration and exit.")
    parser.add_argument("--run-immediately", action="store_true", help="Run once before waiting.")
    parser.add_argument("--interval-seconds", type=int, default=300)
    parser.add_argument("--until", default="2026-04-22T23:50:00+08:00")
    parser.add_argument("--model", default="gpt-5.4")
    parser.add_argument("--codex-timeout", type=int, default=1800)
    parser.add_argument("--main-worktree", default=str(DEFAULT_MAIN_WORKTREE))
    parser.add_argument("--no-git", action="store_true")
    parser.add_argument("--no-push", action="store_true")
    args = parser.parse_args()

    until_ts = parse_until(args.until)
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    append_event(
        "CONTROLLER_STARTED",
        "Local long-run controller started",
        extra={"pid": os.getpid(), "intervalSeconds": args.interval_seconds, "until": args.until},
    )
    write_state(status="running")
    write_progress(
        status="running",
        current_action="controller started",
        next_action="run immediately or wait for next scheduled iteration",
    )
    write_status(
        runner="starting",
        interval_seconds=args.interval_seconds,
        until=args.until,
        main_worktree=args.main_worktree,
        no_git=args.no_git,
        no_push=args.no_push,
    )

    first = True
    while True:
        if until_ts and time.time() >= until_ts:
            write_status(runner="complete", completed_at=now_iso(), reason="until reached")
            write_state(status="completed")
            write_progress(
                status="completed",
                current_action="controller reached configured end time",
                latest_evidence=args.until,
            )
            append_event("JOB_COMPLETED", "Controller reached configured end time")
            append_log(f"## Runner Complete\n\n- Time: `{now_iso()}`\n- Reason: until reached\n")
            return 0

        if first and not args.run_immediately and not args.once:
            first = False
        else:
            try:
                acquire_lock()
                try:
                    run_once(args)
                finally:
                    release_lock()
            except Exception as exc:  # noqa: BLE001 - runner must persist and log failures.
                failure_category = classify_failure(str(exc))
                append_log(
                    "## Runner Error\n\n"
                    f"- Time: `{now_iso()}`\n"
                    f"- Error: `{exc}`\n"
                )
                append_event(
                    "FAILURE_CLASSIFIED",
                    str(exc)[:1000],
                    failure_category=failure_category,
                )
                failed = int(read_state().get("failedIterations", 0) or 0) + 1
                runner_state = "blocked" if failure_category in {"merge_failed", "environment_failed"} else "failed"
                write_state(status=runner_state, failedIterations=failed, lastFailureCategory=failure_category)
                write_progress(
                    status=runner_state,
                    current_action="controller classified a failure",
                    latest_evidence=str(exc)[:300],
                    next_action="retry pending sync or repair the smallest failing layer",
                    risk=failure_category,
                    failure_category=failure_category,
                )
                write_status(
                    runner=runner_state,
                    last_error=str(exc),
                    failure_category=failure_category,
                    last_run_finished_at=now_iso(),
                )
                release_lock()
                if args.once:
                    return 1

        if args.once:
            return 0

        next_run = time.time() + args.interval_seconds
        next_run_iso = datetime.fromtimestamp(next_run).astimezone().isoformat(timespec="seconds")
        write_state(status="sleeping", nextRunAt=next_run_iso)
        write_progress(
            status="sleeping",
            current_action="controller sleeping between iterations",
            next_action=f"wake at {next_run_iso}",
        )
        write_status(runner="sleeping", next_run_at=next_run_iso)
        time.sleep(args.interval_seconds)


if __name__ == "__main__":
    raise SystemExit(main())
