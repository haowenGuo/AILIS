<div align="center">
  <img alt="AILIS character waving" src="Resources/Emotes/ailis-small/wave.png" width="156">
  <h1>AILIS</h1>
  <p><strong>A desktop AI companion with a visible character, voice, memory, and a Codex-style tool runtime.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.1.0-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=for-the-badge">
  </p>
  <p>
    <img alt="ToolSandbox frozen holdout mean 71.51 percent" src="https://img.shields.io/badge/ToolSandbox_holdout-71.51%25-2563eb?style=for-the-badge">
    <img alt="AILIS-LUNA GAIA 165-task semantic score 72.12 percent" src="https://img.shields.io/badge/AILIS--LUNA_GAIA_165-72.12%25-059669?style=for-the-badge">
    <img alt="AILIS TaskAgent A7 Terminal-Bench 2.1 pass at one 67.42 percent" src="https://img.shields.io/badge/Terminal--Bench_2.1-67.42%25-d97706?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
  <p>
    <a href="https://101.133.239.56/Test/">Homepage</a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases/tag/v1.1.0">Download</a> ·
    <a href="docs/ailis-embodied-agent-architecture.md">Architecture</a> ·
    <a href="docs/ailis-evaluation-master-scorecard-20260817.md">Benchmarks</a>
  </p>
</div>

---

## Evaluation Snapshot

AILIS is developed as an evaluated agent system, not only as a character demo. The public summary below only includes complete runs or evaluation sets large enough to support a useful claim. Small smoke tests, partial desktop batches, harness self-tests, and infrastructure-invalid attempts are deliberately omitted.

| Evaluation track | Result | Scale and protocol | Evidence status |
| --- | ---: | ---: | --- |
| **Apple ToolSandbox** | **71.51%** frozen holdout mean | 239 / 239 officially scored, 0 errors | Primary public task-quality result |
| **GAIA full validation (AILIS-LUNA)** | **119 / 165, 72.12%** semantic correctness | Public L1-L3 validation; `gpt-5.6-luna`, medium | Same-model comparison: +12 tasks and +7.27 pp over Codex-LUNA; not an official leaderboard submission |
| **Terminal-Bench 2.1 (TaskAgent A7)** | **60 / 89, 67.42%** pass@1 | Complete 89-task source run; `gpt-5.6-luna`, max | One complete pass; Codex-Luna Max official aggregate is 75.73% +/- 1.32% |
| **LongMemEval-S** | **358 / 500, 71.60%** QA accuracy | 500 / 500 completed; Luna reader and judge | Complete local protocol |
| **PersonaMem Balanced-140** | **92 / 140, 65.71%** | Ledger + BM25/MMR retrieval; Luna medium | Complete internal engineering set |
| **LoCoMo** | **24.69 token-F1** | 1,986 / 1,986 completed | Complete local protocol; retrieval is stronger than answer synthesis |
| **Longitudinal companion eval** | **78.46 / 100** weighted mean | 171 judged checkpoints from 30-day scenarios | Internal product evaluation |

> **How to read this table:** ToolSandbox is a continuous scenario-quality score, GAIA and Terminal-Bench are task success rates, and LoCoMo is token-F1. They measure different capabilities and must not be averaged into one synthetic score. On the controlled 165-task GAIA comparison, AILIS-LUNA scores **119 / 165 (72.12%)** versus **107 / 165 (64.85%)** for Codex-LUNA. On Terminal-Bench 2.1, AILIS A7 scores **60 / 89 (67.42%)**, while the official five-run Codex-Luna Max aggregate is **75.73% +/- 1.32%**.

[Complete evaluation scorecard](docs/ailis-evaluation-master-scorecard-20260817.md) ·
[Machine-readable scorecard](evals/benchmark-catalog/ailis-evaluation-master-scorecard-20260817.json) ·
[GAIA methodology](docs/ailis-desktop-real-gaia-eval.md) ·
[BrowseComp-Plus fixed-corpus protocol](docs/ailis-browsecomp-plus-eval.md) ·
[ToolSandbox protocol and gates](docs/ailis-toolsandbox-v4-optimization-plan.md)

<p align="center">
  <img alt="How people use AILIS as a desktop AI companion" src="docs/assets/readme-localized/en/ailis-user-flow.png">
</p>

## Meet AILIS

AILIS is built to feel less like a blank chat box and more like a presence on your desktop. It combines a 3D character surface, realtime dialogue, voice output, memory, screen/file context, and a tool-using agent runtime for real work.

The product direction is simple: a companion you can talk with naturally, and a work partner that can switch into task mode when you need help with code, research, files, email, or desktop workflows.

## Product Surface

<p align="center">
  <img alt="AILIS happy expression" src="Resources/Emotes/ailis-small/happy.png" width="128">
  <img alt="AILIS thinking expression" src="Resources/Emotes/ailis-small/thinking.png" width="128">
  <img alt="AILIS sparkle expression" src="Resources/Emotes/ailis-small/sparkle.png" width="128">
</p>

AILIS brings three layers together:

- **Character layer**: VRM character, expressions, motions, lip sync, speech bubbles, tray and desktop windows.
- **Companion layer**: conversational style, user preferences, memory blocks, relationship state, and lightweight reflection.
- **Agent layer**: tool routing, approvals, evidence logs, recovery loops, model provider configuration, and local runtime utilities.

## What It Can Do

- VRM desktop character with expressions, motions, lip sync, and dialogue bubbles.
- Electron pet window, chat window, control panel, tray integration, and local persistent state.
- OpenAI-compatible model provider configuration, including custom base URLs and local-provider workflows.
- Voice output through desktop TTS workers and cloud provider paths.
- Optional local speech recognition worker for desktop voice input.
- Permission-aware visual context through screenshot, window, and region capture flows.
- Memory blocks, project context, relationship state, and lightweight reflection, with the
  evaluated [`BM25 phrase v2 + MMR 0.2`](docs/ailis-memory-bm25-mmr-baseline.md) local retrieval
  baseline (no dense model or retrieval-time query planner on the default path).
- Tool layer for file operations, code work, computer actions, email, MCP skills, web/search support, and local runtime utilities.
- Approval-aware execution model for actions that can affect files, apps, accounts, or external services.
- EMBER-Harness stage gates for checking untrusted inputs, tool calls, tool results, and final outputs during agent execution.
- Humanlike experience evals, tool-contract tests, gateway checks, and agent execution smoke tests.

## Why It Is Different

AILIS is not only an expressive avatar and not only an automation console. The interesting part is the bridge:

- It can stay soft and conversational during daily interaction.
- It can become explicit and auditable during task execution.
- It keeps provider, memory, model, voice, and local runtime choices under the user's control.
- It is open source under MIT, so the character surface and the agent harness can evolve together.

## GAIA: General Agent Capability

### Model-controlled 165-task comparison

The current comparison runs AILIS-LUNA and native Codex-LUNA on the complete GAIA public validation set. Both systems use `gpt-5.6-luna` at medium reasoning effort, the same 165-task list and manifest, and the same semantic judging policy over the complete answer visible to the user. This removes the model-version mismatch in the earlier comparison.

| Level | AILIS-LUNA | Codex-LUNA | AILIS lead |
| --- | ---: | ---: | ---: |
| L1 | **43 / 53, 81.13%** | 41 / 53, 77.36% | **+2 tasks, +3.77 pp** |
| L2 | **64 / 86, 74.42%** | 57 / 86, 66.28% | **+7 tasks, +8.14 pp** |
| L3 | **12 / 26, 46.15%** | 9 / 26, 34.62% | **+3 tasks, +11.54 pp** |
| **All levels** | **119 / 165, 72.12%** | **107 / 165, 64.85%** | **+12 tasks, +7.27 pp** |

Semantic scoring evaluates whether the complete user-visible response matches the reference answer in meaning rather than requiring identical wording or relying only on a short-answer extractor. Under this controlled protocol, AILIS leads Codex at every difficulty level. L3 still has the lowest absolute accuracy and remains the main capability target.

This is a local diagnostic on the public validation split, not an official private-test leaderboard submission. It is intended as a reproducible system-level comparison under a shared model and evaluation protocol.

### Next evaluation policy

AILIS will keep GAIA as the primary general-assistant diagnostic, with the immediate engineering focus on generic L3 failure mechanisms: durable raw artifacts, long-chain context continuity, multi-source joins, local computation, and adaptive tool fallback. It will not add GAIA-specific prompts, answer routes, site rules, or expected-answer logic.

GAIA alone is not a promotion gate. Candidate releases should also pass fixed, versioned subsets of [Terminal-Bench](https://github.com/harbor-framework/terminal-bench) for end-to-end terminal work, [OSWorld](https://github.com/xlang-ai/OSWorld) for real desktop operation, and [tau2-bench](https://github.com/sierra-research/tau2-bench) or an equivalent frozen tool-agent-user interaction suite for multi-turn collaboration. In short: use GAIA L3 to locate the next mechanisms to improve, but use a mixed benchmark portfolio to decide whether the system actually got better.

## TaskAgent A7 Context Baseline

TaskAgent A7 is the current context-management baseline on `main`. Its frozen
Terminal-Bench 2.1 source run scored **60 / 89 (67.42%)**, compared with the A6
control at **53 / 89 (59.55%)**. The mainline integration keeps the general
mechanism: tool-layer-bounded observations remain in canonical history, Luna
uses a 272k input profile, and semantic compaction starts at 244.8k rather than
on a small tool-result count.

This is a development baseline, not a stable release claim. The source run fixed
18 A6 failures but regressed 11 A6 successes and has only one complete pass. See
the [A7 context baseline](docs/ailis-a7-taskagent-context-baseline.md) and
[machine-readable provenance](evals/terminal-bench-2.1/A7_BASELINE.json).

### Earlier Level 1 runs

The earlier strict-memory-isolated protocol was frozen at commit `6afc0ae`. Its first complete run scored **41 / 53 (77.36%)**; the planned second run was not incorporated into a final mean or stability score. An unexpected Windows reboot interrupted the first run after 46 completed rows. Recovery reused the same run ID, skipped every completed task, and executed only the seven unfinished tasks; no failed task was retried, replaced, or re-scored.

<p align="center">
  <img alt="Historical AILIS GAIA Level 1 validation diagnostics: 81.13 percent and 90.57 percent across two runs, with an 85.85 percent mean" src="docs/assets/benchmarks/gaia-l1-validation-20260719.svg">
</p>

AILIS completed two fixed-commit runs of the 53-task GAIA 2023 Level 1 public validation set. Codex's ChatGPT OAuth bridge supplied the `gpt-5.5` model, while AILIS retained ownership of the agent harness, context management, tool execution, and answer pipeline.

| Metric | Result |
| --- | ---: |
| Run 1 | 43 / 53, **81.13%** |
| Run 2 | 48 / 53, **90.57%** |
| Two-run mean | 45.5 / 53, **85.85%** |
| Stable pass | 40 / 53 tasks passed both runs |
| Outcome agreement | 42 / 53, **79.25%** |

These are retained as historical diagnostics, not the current reproducibility claim. A post-run audit found that workspace isolation did not disable persistent semantic-memory retrieval between tasks inside each run. That task-to-task contamination risk invalidates calling the runs independent, even though run IDs, workspaces, retries, and score files were isolated. The evaluation runner now sets `memoryPolicy: disabled`; a new full rerun is required before publishing a replacement primary score.

This is a local `desktop-real` visible-answer evaluation on the public validation split, not an official submission to the private 93-task Level 1 test leaderboard. Both historical runs used commit `4f8f435`, separate run IDs and isolated workspaces, with no resume, per-task retry, failed-task replacement, or score merging, but without strict per-task memory isolation. See the [evaluation methodology](docs/ailis-desktop-real-gaia-eval.md) and [benchmark scorecard](docs/ailis-demo-benchmark-scorecard.md).

## ToolSandbox: Stateful Tool Use

<p align="center">
  <img alt="AILIS Apple ToolSandbox offline evaluation: 728 of 728 certified non-RapidAPI scenarios, 71.51 percent frozen holdout mean, 81.49 percent targeted recovery mean, and 88.31 percent stability sample mean" src="docs/assets/benchmarks/apple-toolsandbox-offline-20260719.svg">
</p>

AILIS completed official offline scoring for all **728 non-RapidAPI** Apple ToolSandbox scenarios through the production agent and the official on-policy user simulator. The remaining 304 RapidAPI-dependent scenarios were excluded from calls, cost, and every metric.

ToolSandbox returns a continuous scenario similarity score from `0` to `1`, reflecting milestone completion and minefield avoidance. It is therefore better read as a quality score than as a binary pass rate. We disclose several views instead of hiding them behind one headline number:

| Evidence lens | Result | How to interpret it |
| --- | ---: | --- |
| Certified coverage | **728 / 728, 100%** | Evaluation completeness, not task accuracy |
| Frozen v3 primary holdout | **71.51%** mean, 239 / 239 scored, 0 errors | Primary frozen-source generalization estimate |
| Holdout non-zero / perfect | **81.17% / 38.08%** | 194 non-zero and 91 perfect scores out of 239 |
| Targeted recovery | **81.49%** mean, 155 / 155 valid, 0 zeros | Selected analyzed failures; diagnostic, not an unbiased global score |
| Stability sample | **75.01% -> 88.31%**, paired **+13.29 pp** | Separate no-material-regression evidence on 64 original positives |
| Stability outcomes | 29 improved / 22 unchanged / 13 regressed | Includes 2 severe regressions; all preregistered gates passed |

The primary public quality number is the frozen holdout mean, **71.51%**. `valid-only` and `errors-as-zero` are identical because the v3 and stability primary batches had zero errors. The targeted-recovery and stability means answer different questions and must not be averaged with the holdout score or presented as a randomized causal gain. V1, V2, raw intermediate, cross-drift, and quarantined results are excluded from the primary claim.

## Reproduce And Audit

The repository keeps benchmark planning, task-level results, progress streams, audit events, transcripts, and readable reports separate. GAIA regression admission requires two complete baseline runs and two complete candidate runs over an identical task set:

```bash
pnpm bench:gaia:desktop-real:smoke
pnpm bench:gaia:desktop-real:l1
pnpm bench:gaia:compare -- \
  --baseline baseline-run-1.jsonl \
  --baseline baseline-run-2.jsonl \
  --candidate candidate-run-1.jsonl \
  --candidate candidate-run-2.jsonl \
  --expected-tasks 53 \
  --output eval-results/engineering/gaia-regression-gate.md
pnpm eval:ailis-humanlike:longitudinal-agent:validate
pnpm bench:osworld:readiness
pnpm bench:osworld:ailis:test-small:wsl
pnpm bench:osworld:ailis:verified:smoke:wsl
pnpm bench:browsecomp-plus:preflight
```

The default GAIA comparison gate rejects missing or replaced tasks, lower visible success, more timeouts, P95 latency increases above 15%, mean-token increases above 10%, and stable per-task regressions. Benchmark-specific answer routing is not an accepted optimization strategy.

## Architecture

<p align="center">
  <img alt="AILIS desktop AI runtime architecture" src="docs/assets/readme-localized/en/ailis-architecture.png">
</p>

```text
User / Voice / Screen
        |
        v
AILIS Desktop UI
  - VRM character
  - Chat window
  - Control panel
        |
        v
Agent Harness
  - planner
  - tool router
  - approval gate
  - EMBER-Harness stage gates
  - evidence log
  - recovery loop
        |
        v
Runtime Services
  - model providers
  - voice / ASR / TTS
  - vision capture
  - memory store
  - local tools / MCP
        |
        v
Validation
  - tests
  - evals
  - smoke checks
```

## EMBER-Harness Stage Gates

AILIS includes an EMBER-Harness integration for stage-level safety control inside the agent execution chain. Instead of only checking the final answer, the harness can inspect several boundaries where risk may enter or spread:

- User input before it enters the agent context.
- Tool calls before execution, especially actions with side effects.
- Tool results before they are added back into the model context.
- Final output before it is shown to the user.

The harness records auditable check events with snapshot hashes, approximate token counts, stage names, decisions, and rollback targets. The control panel exposes Off, Observe, and Enforce modes; Off neither loads nor downloads a safety model. The default evaluator runs a quantized multilingual DistilBERT ONNX classifier locally without a generative LLM. Its first enable downloads about 136 MB into the persistent AILIS state directory. This lightweight profile targets overt toxicity and hate risk, not subtle implicit-bias or stereotype reasoning. Deployments can override it through `AILIS_EMBER_HARNESS`, `AILIS_EMBER_HARNESS_MODE`, `AILIS_EMBER_SAFETY_MODEL`, and threshold environment variables. Runtime status remains available at `/ember-harness/status`.

## Repository Layout

```text
electron/   Desktop main process, preload bridge, runtime services, local tool adapters
src/        Renderer apps for the pet, chat, control panel, speech, vision UI, and bubbles
backend/    Optional FastAPI backend, API schemas, memory services, and static assets
Resources/  VRM model, VRMA motions, reference audio, and character assets
docs/       Architecture notes, memory design, tool ecosystem, evaluation, and release planning
evals/      Humanlike experience scenarios and long-term companionship evaluation data
scripts/    Runtime preparation, validation, smoke tests, benchmarks, and packaging helpers
tests/      Node test suites for runtime, memory, tools, contracts, gateway, and agent behavior
```

## Quick Start

Install dependencies:

```bash
pnpm install
```

Run the desktop app in development mode:

```bash
pnpm desktop:dev
```

Build and start the desktop app:

```bash
pnpm desktop:start
```

Package the Windows desktop app:

```bash
pnpm desktop:package
```

Optional backend setup:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## Model And Voice Setup

AILIS is provider-agnostic at the application layer. Configure providers through the desktop control panel or local environment files:

- OpenAI-compatible cloud providers.
- Local vLLM endpoints.
- Ollama-oriented local workflows.
- Custom base URLs, model names, request timeouts, and private API keys.
- Optional local ASR and desktop TTS runtime preparation.

Never commit real API keys, account credentials, chat transcripts, local model caches, runtime logs, or generated eval outputs.

## Useful Commands

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

Full gateway validation is heavier and runs a larger set of runtime, contract, tool, memory, agent, and smoke checks:

```bash
pnpm ailis:validate-gateway
```

## Core Documents

- [Documentation Index](docs/README.md)
- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [System TaskAgent Architecture](docs/ailis-system-taskagent-architecture.md)
- [Codex Multi-Agent Data-Flow Migration](docs/ailis-codex-multi-agent-dataflow-migration.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## Project Status

Current release line: `v1.1.0`.

AILIS is in active development. It already has a substantial desktop runtime, agent harness, tool layer, and evaluation surface, but it should still be treated as an alpha-stage product/runtime rather than a production-grade Agent OS. The near-term priority is reliability: clearer tool contracts, safer approvals, stronger memory behavior, better local model setup, and higher-quality end-to-end evaluation.

## Privacy And Safety

AILIS is designed for personal desktop use, so privacy and control are part of the architecture:

- Vision capture is permission-aware and should be used to understand context, not to silently act.
- Mutating or high-risk tool actions should pass through explicit approval.
- Local memory and runtime state should remain machine-local unless the user chooses otherwise.
- Secrets belong in local configuration, never in source control.

## License

AILIS source code is released under the [MIT License](LICENSE). Some bundled or third-party assets, models, motions, and voice resources may have their own licenses; check asset-specific notes before redistribution.
