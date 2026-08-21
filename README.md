<div align="center">
  <img alt="AILIS character waving" src="Resources/Emotes/ailis-small/wave.png" width="156">
  <h1>AILIS</h1>
  <p><strong>A desktop AI companion with a visible character, voice, memory, and a Codex-style tool runtime.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.0-2563eb?style=for-the-badge">
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
    <a href="https://github.com/haowenGuo/AILIS/releases/latest">Download</a> ·
    <a href="docs/ailis-embodied-agent-architecture.md">Architecture</a> ·
    <a href="docs/ailis-evaluation-master-scorecard-20260817.md">Benchmarks</a>
  </p>
</div>

---

## Evaluation Snapshot

AILIS is an evaluated Agent system, not only a character demo. Under the same Luna model, AILIS now operates in the same task-execution performance band as Codex: it leads the full GAIA public-validation comparison and reaches 67.42% on Terminal-Bench 2.1.

### Headline scores

| Benchmark | Capability | AILIS |
| --- | --- | ---: |
| **GAIA public validation** | General research, tools, multi-hop reasoning | **72.12%** |
| **Terminal-Bench 2.1** | Long-horizon terminal and coding work | **67.42%** |
| **Apple ToolSandbox** | Stateful tool use | **71.51%** |
| **LongMemEval-S** | Long-term memory QA | **71.60%** |
| **LoCoMo** | Conversational memory and multi-hop synthesis | **24.69 token-F1** |
| **PersonaMem Balanced-140** | Preference and persona continuity | **65.71%** |

### Same-model comparison with Codex

| Benchmark | AILIS | Codex | Delta |
| --- | ---: | ---: | ---: |
| **GAIA 165 · Luna medium** | **72.12%** | 64.85% | **+7.27 pp** |
| **Terminal-Bench 2.1 · Luna max** | **67.42%** | 75.73% +/- 1.32% | -8.31 pp |

#### GAIA by level

| GAIA level | AILIS-Luna | Codex-Luna | AILIS delta |
| --- | ---: | ---: | ---: |
| L1 | **43 / 53, 81.13%** | 41 / 53, 77.36% | **+2 tasks, +3.77 pp** |
| L2 | **64 / 86, 74.42%** | 57 / 86, 66.28% | **+7 tasks, +8.14 pp** |
| L3 | **12 / 26, 46.15%** | 9 / 26, 34.62% | **+3 tasks, +11.54 pp** |
| **All levels** | **119 / 165, 72.12%** | **107 / 165, 64.85%** | **+12 tasks, +7.27 pp** |

#### GAIA efficiency

| Metric, same 165 tasks | AILIS-Luna | Codex-Luna | AILIS performance |
| --- | ---: | ---: | ---: |
| Score | **72.12%** | 64.85% | **+7.27 pp** |
| Mean task time | **210.4 s** | 255.9 s | **17.8% faster** |
| P50 task time | **140.1 s** | 229.3 s | **38.9% faster** |
| P95 task time | **575.0 s** | 584.7 s | **1.7% faster** |
| Logical input tokens | **31.04M** | 68.56M | **54.7% fewer** |
| Output tokens | **330.7K** | 497.0K | **33.5% fewer** |

#### Terminal-Bench 2.1 performance

| Terminal-Bench metric | AILIS A7 | Official Codex-Luna Max | Difference |
| --- | ---: | ---: | ---: |
| Score | **60 / 89, 67.42%** | **75.73% +/- 1.32%** | 89.0% of Codex |
| Mean trial time | 1,088.0 s | **457.3 s** | AILIS 2.38x |
| Logical input per task | **2.569M** | 3.183M | **19.3% fewer** |
| Cached input per task | 1.270M | **3.093M** |  |
| Uncached input per task | 1.299M | **89.9K** | AILIS 14.44x |
| Output per task | 23.95K | 23.89K | Nearly identical |
| Input cache rate | 49.44% | **97.17%** | -47.73 pp |
| Timeout rate | 23.60% | **3.37%** | Current optimization target |

| A7 complete-pass resource profile | Result |
| --- | ---: |
| Model / tool calls | 4,273 / 4,306 |
| Logical / cached / uncached input | 228.63M / 113.02M / 115.61M |
| Output tokens | 2.131M |
| Peak request | 245,017 tokens |
| Agent mean / P50 / P95 | 934.1 s / 662.6 s / 2,617.9 s |

### Memory and stateful-task performance

| Track | Score | Retrieval performance | End-to-end latency |
| --- | ---: | --- | ---: |
| **ToolSandbox frozen holdout** | **71.51%** | Stateful trajectory scoring | **3.08 min/scenario** |
| **LongMemEval-S** | **71.60%** | Session R@8 93.53%; turn R@8 83.31% | **P50 18.6 s / P95 39.1 s** |
| **PersonaMem Balanced-140** | **65.71%** | Retrieval mean 1.15 s; P95 1.78 s | **P50 26.41 s / P95 53.83 s** |
| **LoCoMo** | **24.69 token-F1** | Session R@8 89.67%; turn R@8 71.75% | **P50 12.72 s / P95 30.44 s** |

[Complete evaluation scorecard](docs/ailis-evaluation-master-scorecard-20260817.md) ·
[Machine-readable scorecard](evals/benchmark-catalog/ailis-evaluation-master-scorecard-20260817.json) ·
[Official Codex Terminal-Bench result](https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/6/leaderboards/main/rows/e5f3feda-4629-46ba-963f-300dcf7c2a4c) ·
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

The accepted product parent, frozen experiment commits, and score-ownership
rules are recorded in the [version registry](docs/ailis-version-registry.md).
The current execution-chain audit and next development gates are in the
[Harness architecture roadmap](docs/ailis-harness-architecture-audit-roadmap.md).
The measured code-growth and rollback-safe modularization plan is in the
[codebase refactor audit](docs/ailis-codebase-refactor-audit.md).

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

New desktop installations default to **AILIS Cloud**, so users can start chatting without creating or entering an API key. Persona orchestration, memory storage, TaskAgent, approvals, and computer/file tools continue to run on the user's PC. Only the model-facing inference payload is relayed through the AILIS server, using a short-lived signed session and server-owned upstream credentials.

AILIS remains provider-agnostic at the application layer. Advanced users can switch providers through the desktop control panel or local environment files:

- AILIS Cloud managed relay (default; internet required; no user API key).
- OpenAI-compatible cloud providers.
- Local vLLM endpoints.
- Ollama-oriented local workflows.
- Custom base URLs, model names, request timeouts, and private API keys.
- Optional local ASR and desktop TTS runtime preparation.

Model-visible conversation context, tool schemas/results, and any user-approved image or file content included in a turn can be sent through the selected model provider. Local tool execution and persistent memory databases are not moved to the AILIS server. Choose Ollama or another local endpoint when an offline or fully local inference path is required.

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
- [Codebase Refactor Audit](docs/ailis-codebase-refactor-audit.md)
- [Codex Multi-Agent Data-Flow Migration](docs/ailis-codex-multi-agent-dataflow-migration.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## Project Status

Current release line: `v1.4.0`.

AILIS is in active development. It already has a substantial desktop runtime, agent harness, tool layer, and evaluation surface, but it should still be treated as an alpha-stage product/runtime rather than a production-grade Agent OS. The near-term priority is reliability: clearer tool contracts, safer approvals, stronger memory behavior, better local model setup, and higher-quality end-to-end evaluation.

## Privacy And Safety

AILIS is designed for personal desktop use, so privacy and control are part of the architecture:

- Vision capture is permission-aware and should be used to understand context, not to silently act.
- Mutating or high-risk tool actions should pass through explicit approval.
- Local memory and runtime state should remain machine-local unless the user chooses otherwise.
- Secrets belong in local configuration, never in source control.

## License

AILIS source code is released under the [MIT License](LICENSE). Some bundled or third-party assets, models, motions, and voice resources may have their own licenses; check asset-specific notes before redistribution.
