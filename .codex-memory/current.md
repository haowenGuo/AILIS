# Codex Memory Checkpoint

Date/time: 2026-06-21 11:55 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`
Git state: repo has many unrelated historical dirty files. Only stage active GAIA auto-optimizer files unless explicitly asked otherwise.

## Objective
- Keep the AILIS GAIA self-evolution controller running continuously.
- After each GAIA task: if passed, advance and later optimize efficiency; if failed, queue it in the repair backlog, mine the chain, fix generalized TOOLS/MCP/HARNESS bottlenecks, test, commit, and keep the main GAIA cursor moving.
- Avoid task-specific hardcoding; optimize generic capabilities.

## Latest User Intent
- User asked: “持续跑啊，持续监控啊，不要停止，每跑完一个任务就开启下一个任务”.
- A 5-minute heartbeat automation exists: `ailis-gaia-auto-optimizer-heartbeat`. It checks process/progress/state, avoids duplicate heavy runs, restarts the controller when idle and safe, and repairs when `repairRequired=true`.
- Because the user explicitly wants continuous execution, `loop-policy.json` now enables `continueAfterFailure`. A failed task should enter `repairBacklog` instead of stopping the whole controller.

## Current State
- Background controller is running:
  - controller PID: `5796`
  - runner PID: `29012`
  - command: `node scripts\run-ailis-gaia-auto-optimizer.mjs --loop --task-retries 1 --timeout-ms 900000`
  - current task: `official-validation-l1-offset-16`
  - current iteration: `iter-042-official-validation-l1-offset-16`
  - latest progress: `longrun/jobs/ailis-gaia-auto-optimizer/progress.json`
- Durable state after queueing the latest failed task:
  - `officialCursor`: `16`
  - completed official offsets: `0` through `12`
  - failed backlog: `official-validation-l1-offset-13`, `official-validation-l1-offset-14`, `official-validation-l1-offset-15`
  - `repairRequired`: `false`
  - last pass artifact: `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-038-official-validation-l1-offset-12/verdict.json`
- Offset 13 remains open and is not counted as passed. It is queued for repair because BASE/API access is blocked from this environment and the local search stack produced noise/empty evidence. Do not hardcode the answer; repair should stay generic.
- Offset 14 failed under the old evidence gate: empty submission, expected `Maktay mato apple`. It is queued in repair backlog.
- Offset 15 failed and is queued in repair backlog. It submitted `ZnO`; local gold expected `diamond`. It is a Scientific Reports/nano-compound retrieval task; observed issue included `pdf_find_and_extract` timing out after 90000ms and then settling on the wrong compound.
- Offset 16 started at `2026-06-21T03:52:27Z`; process is alive and stderr is empty as of this checkpoint. It has one attachment.

## Recent Fixes
- Commit `a3b17e5 Fix GAIA DOCX evidence finalization`
  - Fixed DOCX Secret Santa relation finalization.
  - Added full DOCX fallback parsing from `filePath` when agent step preview is truncated.
  - Offset 7 passed with `Fred`.
- Commit `741f631 Add HTML fallback for GAIA quote evidence`
  - Added `pdf_find_and_extract` HTML full-text fallback when discovered PDF links are unreadable/challenge HTML.
  - Added answer-candidate finalizer and quote-word evidence forcing so title-like direct answers do not bypass evidence.
  - Offset 12 initially failed `tricksy` vs expected `fluffy`, then passed after repair with `fluffy`.
  - Offsets 8, 9, 10, 11 also passed during continuous run.
- Current uncommitted changes:
  - `scripts/mcp-ailis-research-server.cjs`: exact-answer query planning, direct web_search rewrite for English fact questions, typed country answer candidates, and TLS certificate fallback for web_fetch.
  - `scripts/run-ailis-gaia-auto-optimizer.mjs`: `continueAfterFailure` repair-backlog behavior so one failed task does not halt the full GAIA sweep.
  - `scripts/run-gaia-level1-lite.mjs`: answer gate accepts structured web_search country candidates.
  - `electron/ailis-agent-runner.cjs` and `electron/ailis-evidence-artifacts.cjs`: exact-answer mode now creates a conservative `QuestionEvidence/source_question` artifact for self-contained logic/math/grammar/translation/rule tasks, so the evidence gate can accept problem-statement evidence without forcing pointless web/tool calls.
  - Tests updated for exact-answer planning, country candidates, answer gate, and continuous backlog policy.

## Validation
- `node --test tests\mcp-ailis-research-server.test.mjs tests\run-gaia-level1-lite.test.mjs tests\ailis-gaia-auto-optimizer.test.mjs`: 95/95 passed after continuous backlog/search-candidate repair.
- `node --test tests\ailis-agent-execution-flow.test.mjs tests\run-gaia-level1-lite.test.mjs tests\ailis-gaia-auto-optimizer.test.mjs`: 48/48 passed after source_question repair.
- `node --test tests\mcp-ailis-research-server.test.mjs tests\ailis-agent-execution-flow.test.mjs tests\run-gaia-level1-lite.test.mjs tests\ailis-gaia-auto-optimizer.test.mjs`: 114/114 passed.
- GAIA verification:
  - offset 7: passed, `Fred`
  - offset 8: passed, `right`
  - offset 9: passed, `No`
  - offset 10: passed, `(¬A → B) ↔ (A ∨ ¬B)`
  - offset 11: passed, `2`
  - offset 12: passed, `fluffy`
  - offset 13: failed/open, expected `Guatemala`, queued in repair backlog rather than blocking the sweep
  - offset 14: failed/open, expected `Maktay mato apple`, queued in repair backlog; root cause repaired generically by `QuestionEvidence/source_question`
  - offset 15: failed/open, submitted `ZnO`, expected `diamond`, queued in repair backlog
  - offset 16: running

## Files And Artifacts
- `scripts/run-gaia-level1-lite.mjs`: DOCX finalizer, quote evidence forcing, deterministic answerCandidates, web_search country candidate answer gate.
- `scripts/mcp-ailis-research-server.cjs`: `pdf_find_and_extract` HTML full-text fallback, exact-answer query planning, TLS fallback, typed country candidate extraction.
- `scripts/run-ailis-gaia-auto-optimizer.mjs`: restartable GAIA controller and repair-backlog continuation.
- `electron/ailis-agent-runner.cjs`: exact-answer source-question evidence injection and validation.
- `electron/ailis-evidence-artifacts.cjs`: `QuestionEvidence` evidence artifact type.
- `tests/run-gaia-level1-lite.test.mjs`: DOCX fallback, quoted-word gate, and country candidate answer gate regressions.
- `tests/mcp-ailis-research-server.test.mjs`: HTML fallback and exact-answer/country-candidate regressions.
- `tests/ailis-gaia-auto-optimizer.test.mjs`: controller backlog continuation regression.
- `tests/ailis-agent-execution-flow.test.mjs`: source_question positive/negative exact-answer regressions.
- `longrun/jobs/ailis-gaia-auto-optimizer/state.json`: cursor/status projection.
- `longrun/jobs/ailis-gaia-auto-optimizer/progress.json`: live progress projection.
- `longrun/jobs/ailis-gaia-auto-optimizer/event-log.jsonl`: durable event log.
- `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-039-official-validation-l1-offset-13/`: failed offset 13 evidence.
- `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-040-official-validation-l1-offset-13/`: retry evidence for offset 13, also failed/open.
- `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-040-official-validation-l1-offset-14/`: failed offset 14 evidence.
- `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-041-official-validation-l1-offset-15/`: failed offset 15 evidence.
- `longrun/jobs/ailis-gaia-auto-optimizer/iterations/iter-042-official-validation-l1-offset-16/`: current in-progress offset 16 iteration.

## Known Problems
- Offset 13 remains unresolved. Known generalized issue: local retrieval cannot reliably reach BASE or recover high-quality evidence, and broad HTML search can return SEO/noise. Repair web_search/web_fetch generically; do not write task-specific answer logic.
- Offset 14 should be rerun later using the new `source_question` repair; do not mark it passed until an actual rerun passes.
- Offset 15 needs retrieval-quality repair. Do not hardcode `diamond`; inspect the chain and improve PDF/search extraction generically.
- Offset 16 is currently running. If it exceeds timeout or stalls after result files appear, inspect `iter-042-official-validation-l1-offset-16/eval-results`, `gateway-audit`, `chain.json`, and `verdict.json`.
- `progress.json.lastUpdateAgeSeconds` is a stored projection and does not self-increment; use process checks and file mtimes to detect real staleness.
- `controller.stdout.log` and `controller.stderr.log` are untracked runtime logs; summarize them, do not paste huge logs.
- The repo contains many unrelated dirty rename/build/docs changes from earlier work; do not stage them.

## Next Actions
1. Continue monitoring controller PID `5796` and current runner PID `10432`.
2. If offset 16 passes, let controller immediately continue to offset 17.
3. If offset 16 fails, it should be queued in `repairBacklog` and the controller should advance unless the failure is a controller/runtime bug.
4. Repair backlog items generically: offset 14 can be rerun after the `source_question` repair; offsets 13 and 15 still need retrieval quality work.
5. Keep heartbeat ACTIVE; do not launch duplicate controllers if one is already running.

## Do Not Forget
- User prefers direct execution, continuous monitoring, and default commits after meaningful work.
- Do not store or print API keys/tokens/secrets.
- Keep outputs compact; summarize long logs.
