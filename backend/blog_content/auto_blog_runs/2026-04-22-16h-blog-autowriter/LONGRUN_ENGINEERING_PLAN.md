# LongRun Engineering Plan

This run follows the `auto-longrun-task` architecture.

## Layers

1. LongRun Controller: `scripts/auto_blog_runner.py`
2. Codex Execution Adapter: `codex.cmd exec` launched by the controller
3. Conversation Projector: heartbeat reads durable files and reports progress

## Durable Files

- `mission.md`: long-running task goal
- `acceptance.md`: completion and verification contract
- `loop-policy.json`: duration, cadence, retry, and stop policy
- `state.json`: local controller projection, not committed
- `progress.json`: heartbeat-first progress projection, not committed
- `control-queue.jsonl`: local pause/stop/report commands, not committed
- `event-log.jsonl`: append-only local event source, not committed

## Replanned Control Flow

1. Read control queue and stop flag.
2. If pending commits exist, retry publishing before writing anything new.
3. Start exactly one Codex writing iteration.
4. Validate `posts.json`.
5. Commit only allowed blog artifacts.
6. Add the commit to `pendingCommits`.
7. Publish pending commits in order through the main worktree.
8. Clear `pendingCommits` only after successful push.
9. Classify failures and record events before retrying.

## Failure Policy

- `environment_failed`: network, GitHub, permission, or missing tool failures
- `merge_failed`: cherry-pick, conflict, or dirty publishing worktree failures
- `schema_failed`: invalid JSON or malformed structured files
- `runtime_failed`: Codex worker timeout, crash, or non-zero exit
- `orchestration_failed`: lock, queue, resume, or state machine issues
- `verifier_failed`: acceptance checks fail

The controller should retry the smallest failing layer. It should not generate a new article while a previous publish commit is still pending.
