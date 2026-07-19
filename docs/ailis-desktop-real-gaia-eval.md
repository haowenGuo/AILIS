# AILIS Desktop-Real GAIA Evaluation

This document defines the GAIA evaluation path that is intended to measure
AILIS as users actually experience it in the desktop app.

## Why This Exists

AILIS has two different GAIA-like evaluation needs:

1. Strict exact-answer submission.
   This is the leaderboard-style path. It requires a clean machine-readable
   answer field such as `final_answer`.

2. Desktop-real product evaluation.
   This is the user-facing path. It should use the same gateway shape as the
   desktop chat UI: message history, attachments, persona orchestration, direct
   tool execution, and normal visible replies.

The previous full L1 run used the strict exact-answer harness with direct tool
execution disabled by default. That is useful for testing a submission protocol,
but it is not a faithful measurement of the desktop product path.

## Runner

Use:

```powershell
pnpm bench:gaia:desktop-real:smoke
```

or:

```powershell
pnpm bench:gaia:desktop-real:l1
```

Direct script usage:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 5
```

Dry plan without spending model tokens:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 5 --plan-only
```

## Codex Subscription Model Backend

The desktop-real runner can use the local Codex login as an evaluation-only
model backend. AILIS remains the harness: it owns context assembly, memory,
tool visibility, tool execution, observations, retries, evidence, finalization,
and interruption. Codex performs one stateless model inference per call.

Prerequisite:

```powershell
codex login status
```

The status must report that Codex is logged in with ChatGPT. No OpenAI API key
is read by this path.

Plan one task without spending model tokens:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs `
  --codex-model-bridge `
  --codex-model gpt-5.5 `
  --codex-reasoning-effort medium `
  --limit 1 `
  --plan-only
```

Run a resumable L1 evaluation:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs `
  --codex-model-bridge `
  --codex-model gpt-5.5 `
  --codex-reasoning-effort medium `
  --max-agent-steps 20 `
  --llm-timeout-ms 180000 `
  --request-timeout-ms 900000 `
  --run-id codex-model-bridge-gaia-l1 `
  --resume
```

Bridge isolation contract:

- Each inference starts a fresh ephemeral Codex app-server thread.
- `baseInstructions` and `developerInstructions` are replaced by a short
  model-backend contract.
- The temporary Codex home contains only a short-lived copy of `auth.json`.
  It does not contain global `AGENTS.md`, project instructions, MCP config,
  plugins, memories, or thread databases, and it is deleted after process exit.
- Shell, browser, computer-use, app, plugin, image, goal, multi-agent, workspace
  dependency, web-search, and MCP surfaces are disabled or empty.
- The bridge uses the official ChatGPT Codex backend with OAuth and forces HTTPS
  because WebSocket transport is unreliable on some networks.
- Tool decisions are constrained to the tool names currently exposed by AILIS.
  Codex returns structured tool-call intent; AILIS executes the tool and owns the
  next inference context.
- Any Codex-side tool item, server callback, loaded instruction source, invalid
  schema output, auth failure, or transport failure is recorded as a provider
  failure instead of being silently accepted.

This is a Codex CLI/app-server evaluation adapter, not a general OpenAI API and
not a production serving interface. Its latency and concurrency are bounded by
the local Codex process and the ChatGPT plan.

## Runtime Contract

The runner intentionally mirrors the desktop chat path:

- `directToolExecutor: true`
- `nativeDirectTools: true`
- `agentRole: persona_orchestrator`
- `memoryPolicy: disabled` for both the root request and delegated TaskAgent
- `workspaceRoot` defaults to the project root, matching the development
  desktop Gateway workspace

The GAIA runner disables both semantic-memory reads and memory writes. Separate
session IDs and workspaces are not sufficient isolation by themselves because a
shared persistent memory index can otherwise expose earlier benchmark tasks to
later tasks in the same run.
- `messageHistory` is empty by default for benchmark tasks, so the current
  question is not duplicated into both `message` and synthetic history
- file attachments are passed through the same attachment shape used by chat
- the current evaluation runner injects the `exact_answer_eval` execution profile
- the current evaluation runner enables `answerOnly` and `exactAnswerMode`
- tool approvals are automatic and every task starts with empty message history

This means the score answers a different question from the strict GAIA runner:

> Did the real desktop-style AILIS interaction produce a visible answer that
> contains the correct result?

## Metrics

Each run emits:

- `*.jsonl`: one final row per task.
- `*.summary.json`: aggregate metrics.
- `*.report.md`: readable report.
- `gateway-audit/<run-id>`: full gateway audit artifacts.
- `*.progress.jsonl`: append-only progress stream.

Headline metrics:

- `visibleCorrect`: visible answer matched the gold answer.
- `responseOk`: the agent run completed without runtime failure.
- `manualReview`: the visible response had content but no safe deterministic
  answer extraction.
- `durationMs`, `avgDurationMs`, `p50/p90/p95DurationMs`.
- token usage from gateway LLM events and response usage.
- optional estimated cost when `--cost-input-per-1m` and
  `--cost-output-per-1m` are provided.
- tool call count and tool error count in each task row.

## Scoring Policy

The desktop-real runner does not require a separate `final_answer` field.
It accepts:

- structured answer fields when available;
- visible answer lines such as `Answer: 3`, `Final answer: ...`, or `答案是...`;
- exact visible containment for longer non-ambiguous gold answers;
- list answers when all list parts appear.
- scaled-unit equivalents when the question explicitly asks for a scaled unit,
  such as accepting `17000 hours` as the visible desktop equivalent of `17`
  thousand hours.

For very short gold answers such as `3`, `b`, or `No`, the runner does not
count a random occurrence in a long paragraph. It requires a visible answer
line or a structured answer candidate.

This keeps the product score closer to user perception while avoiding obvious
false positives.

## Relationship To Strict GAIA

Use the strict runner when the question is:

> Can AILIS produce a machine-submittable GAIA answer field?

Use desktop-real when the question is:

> Can AILIS, as a desktop embodied assistant, solve the task for the user?

Both metrics matter. They should be reported separately.

## Level 2 Preparation

GAIA is gated on Hugging Face. Accept the dataset terms and authenticate once:

```powershell
hf auth login
```

Prepare the public Level 2 validation metadata and attachments:

```powershell
node scripts/run-gaia-official.mjs `
  --split validation `
  --levels 2 `
  --run-id gaia-l2-desktop-source `
  --download-only
```

The command emits `*.desktop-source.jsonl` and
`*.desktop-source.summary.json`. Run a low-cost desktop-real smoke first:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs `
  --source-jsonl eval-results/engineering/gaia-official/gaia-l2-desktop-source.desktop-source.jsonl `
  --source-summary eval-results/engineering/gaia-official/gaia-l2-desktop-source.desktop-source.summary.json `
  --codex-model-bridge `
  --isolated-workspace `
  --limit 3 `
  --no-resume
```

## Common Commands

Run three tasks:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 3
```

Run one task by task id:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --task-ids ec09fa32-d03f-4bf8-84b0-1f16922c3ae4
```

Run against a deliberately isolated temporary workspace:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 3 --isolated-workspace
```

Use a specific workspace root:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --workspace-root F:\AILIS_self_evolution_runtime --limit 3
```

Run with explicit cost estimates:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 10 --cost-input-per-1m 0.27 --cost-output-per-1m 1.10
```

Use an already running gateway:

```powershell
node scripts/run-ailis-desktop-real-gaia-eval.mjs --gateway-url http://127.0.0.1:3100 --limit 3
```

## Guardrails

- Start with `--plan-only` or `--limit 3` before a full L1 run.
- Report strict GAIA score and desktop-real score separately.
- Do not submit desktop-real visible-answer scores as official GAIA leaderboard
  results.
- Keep API keys out of reports; the runner redacts LLM settings.
- Verify `turnContext.memory.hasContext` is false and
  `turnContext.toolContext.memoryPolicy` is `disabled` in a smoke transcript
  before starting a full score run.
