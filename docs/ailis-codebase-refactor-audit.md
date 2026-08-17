# AILIS Codebase Refactor Audit

Audit date: 2026-08-17
Accepted product parent: `fbf2454dbf32562d995b221386ce95d996b9fcb9`
Codex source reference: `3b5ad9c0b99cdad1febc085e6eed59a86b808804`

This audit separates product runtime, Harness kernel, tools, providers, tests, evaluation code, and historical compatibility. It does not treat lower line count as evidence of better Agent behavior, and it does not assign benchmark scores to commits that did not produce the corresponding frozen result artifacts.

## 1. Executive Verdict

The concern is directionally correct, but the cause is more specific than "too much defensive code" or "mostly dead code":

1. The accepted baseline contains about **247,906 lines of code-shaped text** across the repository.
2. The desktop product runtime under `electron/` and `src/` is about **125,381 lines**. Tests, benchmark runners, build scripts, and other support code account for the rest.
3. A statically traced Electron entry reaches 79 of 85 Electron JavaScript modules. There is no evidence that most runtime code is dead.
4. The largest maintainability problem is **live code with mixed ownership**. The fixed runner is 11,909 lines with 284 top-level functions; the Gateway imports 31 local modules.
5. Defensive behavior is independently reimplemented across modules. For example, `normalizeString` is defined in 49 product files, with 36 byte-equivalent normalized bodies; `cloneJson` is defined 23 times, with 17 equivalent bodies.
6. Explicit legacy markers are present but are not large enough to explain the whole codebase: 159 product lines contain `legacy`, 118 contain `compat`, and one contains `deprecated`. They should be isolated and retired, but deleting them will not turn 125K runtime lines into 20K.
7. **A 20K-25K Harness kernel is realistic. A 20K complete AILIS desktop product is not realistic without deleting major capabilities.** The production Agent platform, provider adapters, concrete tools, memory/persona services, desktop shell, and renderer must remain outside that kernel.

The correct objective is therefore not a big-bang rewrite. It is to make one small kernel own the execution semantics, push product integrations behind adapters, and then delete displaced implementations after differential replay proves equivalence.

## 2. Measurement Boundary

The repository totals below count physical lines in these extensions:

`cjs`, `mjs`, `js`, `ts`, `tsx`, `jsx`, `py`, `ps1`, `sh`, `html`, and `css`.

Generated images, VRM assets, JSONL datasets, Markdown documentation, lock files, and binary dependencies are excluded from the code total. The current-worktree count includes tracked and untracked source files; historical counts are read directly from Git objects.

These numbers are architecture indicators, not productivity metrics. A deleted validation rule can reduce LOC while making recovery unsafe. A well-factored protocol module can add LOC while reducing the cost of every future change.

## 3. Growth History

| Ref | All code-like lines | Electron | Renderer | Product runtime | Change from prior product ref |
|---|---:|---:|---:|---:|---:|
| `v1.0.5` | 149,709 | 59,416 | 18,576 | 77,992 | - |
| `v1.1.0` | 209,272 | 82,193 | 23,504 | 105,697 | +27,705 |
| `v1.2.0` | 243,009 | 98,518 | 24,755 | 123,273 | +17,576 |
| `v1.3.0` | 272,372 | 109,310 | 26,498 | 135,808 | +12,535 |
| `fbf2454` | 247,906 | 98,959 | 26,422 | 125,381 | -10,427 |
| Current dirty worktree | 253,803 | 99,938 | 26,437 | 126,375 | +994 vs `fbf2454` |

From `v1.0.5` to `fbf2454`, 128 commits touching `electron/` or `src/` added 79,328 lines and deleted 32,007, for a net increase of 47,321 lines. Several individual changes modified 30-45 product files at once. That change shape is a stronger predictor of regression risk than raw line count.

Examples of broad growth or churn include:

| Commit | Product additions | Product deletions | Files | Net | Subject |
|---|---:|---:|---:|---:|---|
| `1970229f` | 14,024 | 1,045 | 30 | +12,979 | Update runtime and multilingual local deployment |
| `533d7ce3` | 9,585 | 148 | 22 | +9,437 | Prepare AILIS 1.0.7 |
| `c490e6e0` | 5,942 | 548 | 45 | +5,394 | Align Agent runtime and safety Harness |
| `efda0777` | 3,988 | 81 | 5 | +3,907 | Add Memory v3 hybrid ledger |
| `4f8f435c` | 3,648 | 140 | 17 | +3,508 | Stabilize Harness and benchmark execution |

The repeated add/revert cycles around hosted TaskAgent and memory implementations also show that behavior ownership was not stable enough to make changes local.

## 4. What the Runtime Actually Contains

The fixed Electron baseline can be classified as follows. This is an architectural grouping, not a claim that every line in a group belongs in one package.

| Subsystem | Files | Lines | Intended future boundary |
|---|---:|---:|---|
| Harness kernel | 16 | 19,590 | Canonical protocol, journal, session/turn/goal, projection, scheduling |
| Tool platform | 20 | 19,731 | Registry, contracts, MCP, permissions, output storage |
| Concrete tools and artifact engines | 16 | 19,489 | Optional tool packages |
| Providers and local runtimes | 16 | 18,367 incl. workers | Provider adapters and runtime packs |
| Desktop composition | 4 | 13,973 | Electron IPC, settings, composition root |
| Memory, persona, safety, product services | 13 | 7,809 | Product feature packages |
| Renderer | 46 | 26,422 | Desktop UI, avatar, voice, rendering |

The existing Harness-kernel grouping is already close to 20K because it excludes the platform needed to run real tools and providers. A useful general Agent backend is closer to 30K-40K before concrete tools and desktop features are counted.

### Largest Fixed-Baseline Files

| File | Lines | Problem |
|---|---:|---|
| `electron/ailis-agent-runner.cjs` | 11,909 | 284 top-level functions plus the execution class; owns too many semantics |
| `electron/ailis-gateway.cjs` | 6,341 | Imports 31 local modules and acts as composition root, router, state coordinator, and API |
| `electron/main.cjs` | 5,702 | Electron lifecycle, IPC, settings, provider/runtime wiring |
| `electron/ailis-artifact-tools-adapters.cjs` | 4,897 | Multiple artifact domains and embedded worker logic |
| `electron/ailis-tool-acquisition-gateway.cjs` | 3,680 | Discovery, install, validation, persistence, and execution concerns |
| `electron/ailis-computer-tool.cjs` | 3,516 | Several process, desktop, filesystem, and session responsibilities |
| `electron/ailis-tool-contracts.cjs` | 2,778 | Declarative schemas mixed with validation and prompt rendering |

The top ten fixed Electron files contain about 46K lines. Reducing change blast radius therefore requires splitting ownership in those files; deleting small leaf modules first would produce a cleaner graph without materially improving the main execution path.

## 5. Why the Current Split Is Not Yet a Refactor

The dirty worktree replaces `electron/ailis-agent-runner.cjs` with a two-line compatibility wrapper, but the new `electron/agent-loop/runner.cjs` still contains about 11.7K measured lines. The complete new `agent-loop/` directory contains about 12.2K lines versus about 11.5K measured lines in the fixed runner.

This is useful scaffolding, but it has not yet reduced ownership or complexity. It currently:

- moves nearly the entire monolith under a new directory;
- adds small execution-control, delivery-protocol, and core-loop modules;
- leaves most prompt, transport, tool-policy, recovery, and result logic in one runner;
- is mixed with unrelated provider, OSWorld, SWE-bench, renderer, and documentation changes.

It must remain an unscored experiment. A production refactor should restart from a clean `fbf2454` worktree and extract one responsibility per commit.

## 6. Root Causes

### 6.1 Feature Breadth

AILIS is not only a coding Harness. It includes desktop composition, avatar rendering, voice, local model deployment, memory, persona, safety, email, computer control, artifacts, MCP, skills, and evaluation adapters. About half of the repository total is not the Agent execution kernel.

This code should be modularized, but it cannot be counted as dead merely because a terminal benchmark does not exercise it.

### 6.2 Mixed State Ownership

Thread, turn, goal, checkpoint, history, tool-call, timeout, and final-result concepts appear across Runner, Gateway, Runtime, TaskAgentHarness, ContextManager, Provider, AgentControl, and result-capsule code.

The same state can consequently exist as:

- a durable TaskAgent record;
- an active Runner object;
- a Gateway session field;
- a ContextManager response item;
- a prompt snapshot;
- a TaskResult capsule;
- a provider request or recovery checkpoint.

When state is projected several times by different owners, every lifecycle fix becomes a cross-file migration. This is how a local fix for continuation can lock later requests to an old task, or how a transport change can alter finalization behavior.

### 6.3 Repeated Boundary Logic

Measured duplicate definitions in the current product include:

| Helper | Definitions | Equivalent dominant body |
|---|---:|---:|
| `normalizeString` | 49 | 36 |
| `cloneJson` | 23 | 17 |
| `normalizeText` | 21 | multiple semantic variants |
| `normalizeNumber` | 13 | multiple range policies |
| `safeSegment` | 12 | ten subtly different variants |
| `readJsonFile` | 11 | six variants |
| `writeJsonFileAtomic` | 6 | five equivalent bodies |
| `isPathInside` | 8 | five equivalent local implementations plus adapters |

The raw savings are modest. The real cost is semantic drift: `cloneJson` can return the original value, `null`, a string wrapper, or throw depending on the module. A single generic helper must not silently erase these distinctions. Consolidation should expose explicit contracts such as `cloneOrThrow`, `cloneOrNull`, and `cloneOrIdentity`.

### 6.4 Compatibility Mixed Into Active Paths

Compatibility exists for TaskAgent records, TaskResult v1, MCP IDs, mailbox events, preferences, model providers, persona actions, artifact formats, and old voice/runtime caches.

Some compatibility is necessary for user data migration. The mistake is allowing it to remain interleaved with active execution indefinitely. Compatibility should live behind versioned readers and adapters with telemetry and an expiry release, not in the canonical state machine.

### 6.5 Policy Accretion in Runner

Before the `AILISAgentRunner` class begins, the fixed runner already contains roughly 7.7K lines of helpers. They cover:

- internal control-block parsing and stripping;
- provider reasoning and timeout policy;
- attachment staging and path checks;
- explicit natural-language command parsing;
- tool selection and tool-call validation;
- loop and no-progress detection;
- progress, prompt, and budget snapshots;
- handoff and final-result rendering;
- collaboration and subagent notifications;
- prompt assembly and provider response conversion.

The class then adds active-run state, steering, memory, approvals, plan persistence, tool execution, pending recovery, and the main run loop. This is a policy warehouse, not a single coordinator.

### 6.6 Evaluation and Product Code Share One Navigation Surface

Benchmark and evaluation code is correctly outside the main execution path, but it contributes heavily to repository size and `package.json` command surface. It should remain available for reproducibility while being moved into a dedicated workspace/package so that product developers do not load benchmark concerns while changing runtime code.

## 7. Defensive Code: Keep, Consolidate, Isolate, or Delete

| Category | Examples | Action |
|---|---|---|
| Essential boundary safety | Schema validation, path containment, permission checks, atomic writes, call-ID pairing, idempotency | Keep; implement once at the owning boundary |
| Essential recovery | Canonical checkpoint, retry classification, remaining-time accounting, ordered replay | Keep; move into one recovery subsystem |
| Duplicated primitives | String/number normalization, JSON cloning, JSON persistence, result envelopes | Consolidate into narrow typed modules; preserve semantic variants |
| State inference fallbacks | Guessing intent/action from stale result text or rebuilding authority from summaries | Remove after canonical state becomes authoritative |
| Legacy data migration | Old TaskAgent records, preferences, MCP IDs, persona fields | Isolate under `compat/`; add migration version and deletion date |
| Benchmark-specific policy | Site/task routing or answer heuristics | Keep outside production runtime; do not promote |
| Suspected dead code | Statically unreachable or unreferenced modules | Require runtime telemetry and import-graph proof before deletion |

The rule is: validate once where untrusted data enters, normalize once where a domain object is created, and do not repeatedly sanitize the same canonical object in every downstream module.

## 8. Codex Comparison

Codex is not a 20K-line implementation. At the fixed local source commit:

| Area | Files | Lines |
|---|---:|---:|
| `codex-rs/core/src` | 337 | 140,766 including colocated tests |
| `codex-rs/app-server/src` | 67 | 36,498 |
| `codex-rs/protocol/src` | 30 | 16,372 |

The useful difference is modular ownership, not magical smallness:

- session handling is split into turn, handlers, input queue, reconstruction, MCP, review, and turn context;
- context management is split into history, normalization, and updates;
- tools are split into registry, router, orchestrator, parallel execution, runtimes, specs, and handlers;
- production files in these paths are usually hundreds to a few thousand lines instead of one 12K policy warehouse;
- canonical history and tool-call identity are first-class data, so downstream layers do not need many independent fallbacks.

AILIS should copy this ownership discipline, not copy Codex prompts or try to beat Codex by deleting necessary protocol code.

## 9. Target Architecture and Line Budgets

### 9.1 Minimal Harness Kernel: 20K-25K

This package may depend only on standard data types and abstract provider/tool interfaces.

| Module | Target lines | Sole ownership |
|---|---:|---|
| `protocol/` | 1,500-2,000 | Response items, events, IDs, serialization |
| `journal/` | 1,500-2,500 | Append-only canonical task journal and replay |
| `session/` | 2,500-3,500 | Thread, turn, goal, steering, input queue |
| `context/` | 3,000-4,000 | One ContextProjector, compaction, stable prefix |
| `model/` | 1,500-2,000 | Provider-neutral request/response session interface |
| `scheduler/` | 3,000-4,000 | Model/tool loop, ordered concurrency, termination |
| `recovery/` | 1,500-2,500 | Retry, timeout budget, checkpoint, replay |
| `delivery/` and `telemetry/` | 2,000-3,000 | Final result projection and metrics |

### 9.2 Agent Platform: Additional 10K-15K

This layer owns the tool registry, contracts, permission boundary, MCP adapter, output/artifact references, and provider adapter registry. It must not own Thread or Turn state.

### 9.3 Product Integrations

Concrete tools, model providers, local runtimes, memory/persona, desktop IPC, voice, avatar, and UI stay in separate packages. Their size should be reduced independently, but they are not part of the 20K Harness-kernel target.

An aggressive but credible product-runtime target is 85K-100K while preserving current capability breadth. Reaching 20K for the complete desktop product would require removing major features or hiding equivalent complexity in dependencies.

## 10. Canonical Ownership Rules

| State | Single owner | Everyone else receives |
|---|---|---|
| Thread, Turn, Goal | `SessionEngine` | immutable IDs and snapshots |
| User/model/tool history | `TaskJournal` | ordered ResponseItems |
| Model-visible request | `ContextProjector` | one projection per request |
| Tool-call lifecycle | `ToolScheduler` | call events paired by `call_id` |
| Retry and timeout budget | `RecoveryEngine` | classified recovery decisions |
| Provider continuation/cache metadata | `ProviderSession` | stable provider request metadata |
| Final user-facing result | `DeliveryProjector` | a view over canonical journal state |
| Electron/HTTP routing | Gateway adapter | no durable Agent state |

No module may reconstruct authoritative state from display text when the canonical object exists.

## 11. Refactor Sequence

### R0. Clean Baseline and Characterization

- Create a clean worktree from `fbf2454`; do not refactor the current 45-entry dirty worktree.
- Freeze the exact provider/model/tool/timeout protocols used by the accepted evidence.
- Record canonical journal, model request, tool call, tool result, and final-result digests for stable correct and stable failed tasks.
- Add a generated dependency and LOC report so architecture drift is visible in CI.

Rollback: delete the worktree. No product behavior changes.

### R1. Pure Module Extraction

- Keep `electron/ailis-agent-runner.cjs` as a compatibility facade.
- Move one coherent responsibility per commit without rewriting algorithms.
- Start with control-block protocol, tool-call validation, handoff/delivery projection, and prompt projection.
- Require byte- or semantic-equivalent transcript replay after every extraction.
- Reduce the real runner body on every commit; moving the monolith to `agent-loop/runner.cjs` does not satisfy this gate.

Rollback: revert one extraction commit.

### R2. Shared Boundary Primitives

- Introduce explicit string, JSON, path, persistence, and tool-result contracts.
- Migrate only equivalent implementations first.
- Keep semantically different variants as named APIs until callers are intentionally changed.
- Remove local copies only after call-site tests pass.

Rollback: restore the local helper through the compatibility facade.

### R3. Canonical Journal and ContextProjector

- Make all model-visible history derive from one append-only journal.
- Eliminate prompt-state reconstruction in Gateway and Runner.
- Preserve provider metadata and stable-prefix ordering.
- Shadow the new projection beside A7 before switching requests.

Rollback: select the old projector with a single feature flag; never maintain dual writes indefinitely.

### R4. Session and Recovery Ownership

- Move Thread/Turn/Goal/steering into `SessionEngine`.
- Move retries, timeout reserve, checkpoint, and replay into `RecoveryEngine`.
- Gateway becomes stateless composition and routing.
- TaskAgent records reference active turns/goals instead of duplicating them.

Rollback: replay the same journal with the prior owner; no state format destruction.

### R5. Tool Platform and Provider Boundaries

- Make tool contracts declarative and generate model schemas from one source.
- Keep all tool calls and pair outputs by `call_id`.
- Separate provider transport recovery from Agent steps.
- Keep provider-specific reasoning fields in provider metadata without leaking provider rules into the loop.

Rollback: adapters remain behind stable interfaces.

### R6. Compatibility Retirement

- Move legacy readers to `compat/<version>/`.
- Record whether each path is exercised by real user state.
- Migrate persisted state once, then write only the canonical version.
- Delete compatibility after an announced support window and a backup/restore test.

### R7. Product Decomposition

- Move benchmark runners into an evaluation workspace.
- Move concrete tools, providers, memory/persona, voice, and rendering into packages with explicit public interfaces.
- Keep Electron `main` and Gateway as small composition roots.

## 12. Promotion Gates

### Structural

- No Harness-kernel source file above 3K lines without a written exception.
- Runner/coordinator below 2K lines; Gateway adapter below 1.5K lines.
- One state owner for each row in the ownership table.
- No equivalent local definitions of canonical JSON, path, persistence, or result helpers.
- No benchmark/site/task routing in product code.

### Behavioral

- Canonical transcript replay preserves item order, `call_id`, tool arguments, tool outputs, and final-result meaning.
- Stable-correct and stable-failed tasks are both included; a refactor must not only replay happy paths.
- Approval, steering, cancellation, checkpoint recovery, and provider stream recovery have deterministic integration tests.

### Performance

- Stable-prefix cache rate does not regress from the accepted A7 evidence.
- Uncached input per task, model calls, tool calls, wall time, and timeout rate are measured, not inferred.
- Added wrappers do not duplicate model requests or tool executions.

### Evaluation

1. deterministic unit and transcript replay;
2. fixed five-task Terminal control set;
3. fixed GAIA correct-side and failure-side controls;
4. stratified 20-task cross-benchmark sample;
5. full paired regression only after all prior gates pass.

LOC reduction alone is never a promotion criterion.

## 13. Immediate Recommendation

Do not continue broad feature work in the current dirty split. The next engineering unit should be a clean `fbf2454` refactor worktree that performs R0 and then one R1 extraction at a time.

The first milestone is not "delete 100K lines." It is:

1. make the canonical execution path readable in under ten modules;
2. make every mutable state field have one owner;
3. make Runner and Gateway coordinators rather than policy warehouses;
4. prove every extraction through transcript replay;
5. only then delete the displaced code.

This sequence addresses the real source of difficulty while preserving the benchmark quality and recovery behavior already earned by A7.
