# AILIS on Hosted Harbor (candidate)

This directory implements the official Agent Client Protocol (ACP) boundary for
AILIS. It is not a replacement for Harbor, a new agent loop, or a benchmark
controller. Harbor still selects tasks, provisions environments, enforces task
timeouts, runs verifiers, and owns the scores.

## What runs

```text
Official Harbor ACP client
  -> Python ACP SDK (initialize / session/new / session/prompt / session/cancel)
  -> persistent Node worker, one frozen Gateway per session
  -> frozen AILIS Agent Loop -> existing tools -> original Codex exec-server
  -> configured model endpoint (credential supplied by Harbor)
```

| Component | Pin |
| --- | --- |
| Agent adapter | `ailis-harbor-acp` 0.1.0 |
| ACP SDK | `agent-client-protocol` 0.12.1, transitive dependencies in `uv.lock` |
| Frozen runtime | `512k-codex-exec-20261029` |
| Original archive SHA256 | `9e224d1a3f33dc8fea97358ebbd6069b4a078502b673dfb7667bd11cc60a5729` |
| Model / effort | `gpt-6-luna` / `xhigh` (other values are rejected) |
| Execution binary | Original Codex `exec-server` 0.159.0 |
| Task host | Linux x86_64 |

The model-facing prompt, tool implementation, tool schemas, compaction code and
context manager are **inside the unchanged archive**, not imported from the
current mutable main checkout. Its original `agent.cjs` is retained for audit;
the new `worker.cjs` supplies the same Gateway profile with a persistent session.

Differences from the historical local entry are explicit: API credentials and
an API provider replace local ChatGPT OAuth; ACP supplies the instruction and
working directory; one Gateway persists across prompts; ACP cancellation stops
that worker's process group. No old scheduler, proxy replay, score filtering or
custom task/environment adapter is included. Different provider serialization
is not claimed to be byte-identical to the historical OAuth transport.

## Hosted source fields

Use the candidate branch/commit, **not `main`**:

| Field | Value |
| --- | --- |
| Agent | `acp` |
| Repository | `haowenGuo/AILIS` |
| Source path | `evals/terminal-bench-4.0/official/cloud` |
| Manifest | `harbor-agent.json` |
| Ref | Pin the published candidate commit |
| Model | `openai/gpt-6-luna` |
| Credential mode | `direct` |
| Secret selected for this agent | `OPENAI_API_KEY` |

`OPENAI_API_KEY` contains the **dedicated inference relay key**, not a GitHub
token, Harbor API key or raw Codex `auth.json`. Do not put its value into source,
job JSON or the agent's `env`. Use Harbor's encrypted Secrets field.

Non-secret agent environment:

```json
{
  "OPENAI_BASE_URL": "https://150.109.13.189/api/llm/v1",
  "AILIS_API_FORMAT": "openai_responses",
  "AILIS_LOG_DIR": "/logs/agent/ailis"
}
```

The adapter honors `HOSTED_INFERENCE_TOKEN` and, when present,
`HOSTED_INFERENCE_URL`. Otherwise it reads `OPENAI_API_KEY` / `OPENAI_BASE_URL`.
There is no implicit switch to another account, model, endpoint or protocol.
`openai_chat_completions` is supported as an **explicit diagnostic setting**,
not an automatic fallback for a failed Responses request.

**Relay prerequisite:** the last real relay check had working Chat Completions
but no usable `/responses` endpoint. Local mock-Responses protocol tests are not
proof that this production endpoint works. Do not launch a benchmark until the
selected endpoint passes real model/tool/multimodal checks. This adapter does
not change the relay, authorize a hosted use of an upstream login, or launch jobs.

## Installation and artifact integrity

The runtime is a data-only Python wheel containing the original archive. Harbor's
normal `uv sync --frozen` installation downloads it, before task execution/network
isolation. At runtime the adapter only unpacks local data and checks SHA256; it
never runs npm install or downloads a second runtime during a task. Python SDK,
runtime wheel, Node, dependencies and execution binary are pinned.

An already-installed archive can be prepared using:

```sh
uv run --frozen python -m ailis_harbor_acp --prepare
```

The first extraction is setup overhead, not model inference. If the hosting
platform includes that startup in trial timing, do not subtract it from scores.
`AILIS_RUNTIME_ARCHIVE` is a local development override but must match the same
locked hash. There is no unverified `runtime_dir` override.

## Protocol and observability

- Harbor's single text instruction is forwarded unchanged. Direct image/audio
  prompts and external MCP injection are rejected, not silently dropped. The
  existing AILIS `view_image` tool remains inside the frozen runtime.
- Further prompts in the same ACP session keep the same Gateway and session ID.
- Different sessions have different workers, IDs and private log directories.
- A cancelled/crashed session cannot restart with an empty history under the
  same ID. The caller must create a new session.
- Tool events include available raw result metadata; the adapter adds no tool
  output truncation. Model/tool feedback remains owned by the frozen Gateway.
- Usage comes from Gateway's total, including semantic compaction, and is returned
  using ACP's session-cumulative usage fields. Missing usage is not fabricated as 0.
- Non-completed runtime results and protocol errors return ACP errors, not a fake
  successful `end_turn`. Scores are exclusively the official verifier's output.
- stdout carries ACP only. Private logs retain model/tool events, per-turn results
  and worker stderr. No API key is written into a launch config.

## Verification

See [the dated verification report](VERIFICATION.md) for the completed checks
and remaining production/Hosted prerequisites.

```sh
uv sync --frozen
uv run --frozen pytest -q
# Linux only, real frozen Gateway and real Codex exec-server, mock model endpoint:
AILIS_TEST_FROZEN_RUNTIME=1 uv run --frozen pytest -q
```

Tests cover official SDK stdio, two-turn continuity, session isolation, model
validation, cancellation, process exit, malformed worker messages, credential
routing, usage, archive hash/path safety, and actual command output reaching
the next model request. Mock model tests are transport checks, not ability scores.

For publication, `verify_runtime.py` scans the complete artifact and records
critical file hashes. Three exact-hash npm documentation/empty-file matches are
reviewed exceptions; no auth files are bundled. `build_runtime_wheel.py` wraps the
same archive, retaining dependency licenses and adding the AILIS MIT license.

Official references:
- https://docs.harborframework.com/hosted-harbor/custom-agents
- https://docs.harborframework.com/agents/acp
- https://docs.harborframework.com/hosted-harbor/submitting-jobs

No benchmark result, cloud dry-run acceptance or paid rollout is implied by
publishing this candidate.
