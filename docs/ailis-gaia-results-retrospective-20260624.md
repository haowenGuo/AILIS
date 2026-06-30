# AILIS GAIA Results Retrospective

Date: 2026-06-24

## Why GAIA Matters

`ailis-humanlike-eval` is useful as an internal product regression suite, but it is not externally authoritative because the rubric and dataset are AILIS-owned.

GAIA is a better public signal for AILIS's general assistant ability because it stresses:

- exact-answer discipline;
- web and document retrieval;
- file, image, audio, and video handling;
- multi-hop reasoning;
- tool use and recovery;
- answer normalization.

For public positioning, GAIA should be treated as a primary evidence track. Humanlike eval should stay as a product-quality companion track.

## Historical Result Summary

### GAIA Level 1 Lite Public

Artifacts are mostly under:

```text
F:\AIGril\eval-results\engineering\gaia-level1-lite-public
```

Main submitted runs:

| Run | Questions | Completed locally | Failed locally | Submitted | Public score | Correct |
| --- | ---: | ---: | ---: | --- | ---: | ---: |
| `full-20-r1-mcp` | 20 | 8 | 12 | yes | 30% | 6 / 20 |
| `full-20-r2-tools-finalizer` | 20 | 15 | 5 | yes | 45% | 9 / 20 |
| `full-20-r5-agent-repair-tools` | 20 | 19 | 1 | yes | 60% | 12 / 20 |

Best historical public-lite score:

```text
runId = full-20-r5-agent-repair-tools
score = 60% = 12 / 20
completed locally = 19 / 20
submitted = true
report = F:\AIGril\eval-results\engineering\gaia-level1-lite-public\full-20-r5-agent-repair-tools.report.md
summary = F:\AIGril\eval-results\engineering\gaia-level1-lite-public\full-20-r5-agent-repair-tools.summary.json
```

This is the cleanest public-facing score currently available. It should be labeled as **GAIA Level 1 Lite Public, 20-question subset**, not as a full official GAIA leaderboard result.

Recent v1.0.6 check:

| Run | Questions | Completed locally | Failed locally | Submitted | Score | Note |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| `release-v106-gaia2-20260623-163348` | 2 | 0 | 2 | yes | 0% | Not comparable to 20-question runs; both failed with `missing_evidence`. |

The recent 2-question run is a regression smoke, not a reliable benchmark score.

Current 2026-06-24 smoke:

```text
command = node scripts/run-gaia-level1-lite.mjs --limit 3 --no-submit --run-id current-lite-smoke-20260624
result file = F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-level1-lite-public\current-lite-smoke-20260624.jsonl
summary/report = not generated because the run exited early
```

Partial result:

| Task | Status | Answer | Note |
| --- | --- | --- | --- |
| `8e867cd7-cff9-4e6c-867a-ff5ddc2550be` | retry succeeded | `3` | First attempt aborted at 240s; retry fetched Wikipedia raw/section evidence and produced the expected style of short answer. |
| `a1e91b78-d3d8-4675-bb8d-62741b4b68a6` | aborted | empty | YouTube/video counting task hit the same runner timeout/media evidence failure pattern as earlier GAIA runs. |

This confirms that the current runtime can still solve ordinary web/table extraction when the source closes, but video/media tasks remain a major blocker.

### GAIA Official Validation Level 1

Artifacts are mostly under:

```text
F:\AIGril\eval-results\engineering\gaia-official
```

Main full-run results:

| Run | Scope | Completed locally | Failed locally | Correct | Score |
| --- | ---: | ---: | ---: | ---: | ---: |
| `official-validation-l1-aigl-current-20260607-1335` | 53 tasks | 27 | 26 | 9 | 16.98% |
| `gaia-l1-full-retest-20260612` | 53 tasks | 25 | 28 | 17 | 32.08% |

Best official validation L1 local score:

```text
runId = gaia-l1-full-retest-20260612
score = 32.08% = 17 / 53
scope = GAIA official validation Level 1
report = F:\AIGril\eval-results\engineering\gaia-official\gaia-l1-full-retest-20260612.report.md
summary = F:\AIGril\eval-results\engineering\gaia-official\gaia-l1-full-retest-20260612.summary.json
```

This is a stronger internal benchmark than the public-lite 20-question run, but it is still local validation, not a leaderboard claim.

## No-Visual Slice

Visual tasks here mean tasks whose question or attachment name directly requires video, YouTube, image, photo, chess-board image, or OCR-style visual reading. Tool logs were intentionally excluded from this classification to avoid false positives.

## Doubao Multimodal Smoke

Date: 2026-06-28

Configuration observed locally:

```text
provider = openai-compatible
baseUrl = https://ark.cn-beijing.volces.com/api/v3
model = doubao-seed-2-1-turbo-260628
```

API credentials were present locally but are intentionally not recorded here.

Targeted run:

```text
runId = doubao-mm-agent-smoke-20260628
scope = 4 previously failed GAIA official validation L1 tasks
local scorer = enabled
public submission = no
score = 25% = 1 / 4
result = F:\AIGril\eval-results\engineering\gaia-official\doubao-mm-agent-smoke-20260628.jsonl
summary = F:\AIGril\eval-results\engineering\gaia-official\doubao-mm-agent-smoke-20260628.summary.json
report = F:\AIGril\eval-results\engineering\gaia-official\doubao-mm-agent-smoke-20260628.report.md
```

Task results:

| Task | Capability | Submitted | Expected | Result | Note |
| --- | --- | --- | --- | --- | --- |
| `0383a3ee-47a7-41a4-b493-519bdefe0488` | YouTube/video evidence | `Ostrich` | `Rockhopper penguin` | wrong | Used YouTube search, then finalized from weak metadata/snippet evidence. Did not obtain visual/video evidence. |
| `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb` | DOCX relation reasoning | `Fred` | `Fred` | correct | The raw agent visible answer was wrong (`Ostrich`), but the deterministic finalizer mapped the DOCX gift assignments and corrected the submitted answer to `Fred`. |
| `cca530fc-4052-43b2-b130-b30968d8aa44` | Image/chess | `Qxf2#` | `Rd5` | wrong | The agent discovered the image tool but finalized without calling `describe_image` or a chess engine. |
| `65afbc8a-89ca-4ad5-8d62-355bb401f61d` | XLSX map/path planning | empty | `F478A7` | timeout/runner error | The agent copied the workbook into the workspace and read cell colors, then entered a slow script/repair loop and failed to submit in time. In the first run it eventually reasoned toward `FFFF00`, which is still wrong. |

Follow-up single-task rerun:

```text
runId = doubao-mm-agent-smoke-20260628-xlsx-long
task = 65afbc8a-89ca-4ad5-8d62-355bb401f61d
result = timeout, 0 / 1
```

Interpretation:

- Switching to a multimodal model did not automatically improve visual GAIA tasks, because the current GAIA runner still passes attachments mainly as file paths and relies on tool routing.
- The model did not actually receive the chess image as a native multimodal input in this run.
- The image/chess task is primarily a harness/tool-routing failure: after discovering `describe_image`, the agent finalized instead of calling it.
- The YouTube task is an evidence-closure failure: the agent stopped at search metadata instead of acquiring transcript/frame/video evidence.
- The DOCX task shows the finalizer layer can rescue a wrong raw model answer when a deterministic relation solver/finalizer has enough structured evidence.
- The XLSX task shows the need for a deterministic `xlsx_map_path_solver` or stronger `artifact_compute.find_path` path instead of letting the model write ad hoc scripts under time pressure.

Recommended next repairs:

1. For image attachments, enforce a gate: no final answer until `describe_image` or a vision-capable direct input evidence artifact exists.
2. For chess images, route to `image -> board/FEN -> Stockfish`, not general visual description alone.
3. For YouTube/video tasks, require transcript/frame/video evidence before finalizing from search results.
4. For XLSX map tasks, add a deterministic path solver that consumes workbook cell fills and returns the target cell color directly.

### GAIA Official Validation L1 Retest

Baseline:

```text
runId = gaia-l1-full-retest-20260612
score = 32.08% = 17 / 53
```

After removing visual tasks:

```text
removed visual tasks = 5
correct visual tasks = 1 / 5
remaining score = 33.33% = 16 / 48
```

After removing visual plus audio tasks:

```text
removed media tasks = 7
correct removed media tasks = 1 / 7
remaining score = 34.78% = 16 / 46
```

Visual tasks in this run:

| Task | Type | Correct | Expected / note |
| --- | --- | --- | --- |
| `a1e91b78-d3d8-4675-bb8d-62741b4b68a6` | YouTube/video counting | no | expected `3` |
| `cca530fc-4052-43b2-b130-b30968d8aa44` | chess image | no | expected `Rd5` |
| `9318445f-fe6a-4e1b-acbf-c68228c9906a` | image/OCR fractions | no | expected long fraction list |
| `9d191bce-651d-4746-be2d-7ef8ecadb9c2` | YouTube quote | yes | expected `Extremely` |
| `0383a3ee-47a7-41a4-b493-519bdefe0488` | YouTube/video species | no | expected `Rockhopper penguin` |

This means visual handling is weak, but it is not the only reason the official score is low. Removing visual tasks only moves the score from `32.08%` to `33.33%`; the larger problem remains evidence closure, answer extraction, and benchmark finalization across ordinary web/document tasks.

### GAIA Level 1 Lite Public

Best public-lite baseline:

```text
runId = full-20-r5-agent-repair-tools
score = 60% = 12 / 20
```

The public-lite artifact does not include per-task public scorer correctness, so the no-visual adjustment below uses manual/inferred correctness from the submitted answers and known expected answers:

```text
visual tasks = 3
inferred correct visual tasks = 2 / 3
estimated no-visual score = 58.82% = 10 / 17
```

Public-lite visual tasks:

| Task | Type | Submitted | Inferred result |
| --- | --- | --- | --- |
| `a1e91b78-d3d8-4675-bb8d-62741b4b68a6` | YouTube/video counting | `3` | correct |
| `cca530fc-4052-43b2-b130-b30968d8aa44` | chess image | `Nxg3` | wrong |
| `9d191bce-651d-4746-be2d-7ef8ecadb9c2` | YouTube quote | `extremely` | correct |

For the 20-question public-lite run, visual tasks did not drag the score down. Two of the three visual tasks were likely correct, so removing them slightly lowers the estimated score.

## Trend

The historical trend is real:

```text
GAIA Level 1 Lite Public:
30% -> 45% -> 60%

GAIA Official Validation L1:
16.98% -> 32.08%
```

The improvement came less from changing the base model and more from runtime repairs:

- better finalizer behavior;
- fewer plan-only failures;
- better tool routing;
- added document/media/research tools;
- stronger answer extraction;
- more targeted regression runs.

## Failure Evolution

### 2026-06-07 Official L1 Full Run

Run: `official-validation-l1-aigl-current-20260607-1335`

Result:

- 53 total tasks
- 9 correct
- 16.98%
- 27 locally completed with an answer
- 26 locally failed without usable answer
- 18 submitted but judged wrong

Dominant failures:

- `plan_only_or_unknown_action`: 18 final failures
- final answer contamination: explanations, Chinese narration, currency symbols, wrong units
- broad retrieval failures
- weak document/media handling
- tool schema and runtime repair weakness

Most important diagnosis: the harness often accepted non-terminal behavior as terminal. AILIS could partially reason or partially retrieve evidence but still score zero because it did not produce the exact answer string.

### 2026-06-12 Official L1 Full Retest

Run: `gaia-l1-full-retest-20260612`

Result:

- 53 total tasks
- 17 correct
- 32.08%
- 36 incorrect by scorer
- 28 locally failed without usable answer
- 8 locally completed/finalized but scored wrong

Dominant failures shifted:

- `missing_evidence`: 24 tasks
- wrong or badly normalized completed answers: 5 tasks
- finalized but wrong/submission drift: 3 tasks
- runner errors: 3 tasks
- low-confidence rejection: 1 task

This is meaningful progress. The main blocker moved from "agent loop cannot reliably end" toward "retrieval cannot close on verifiable source evidence."

## Current Environment Check

Checked on 2026-06-24:

- Desktop LLM settings exist.
- Provider: `openai-compatible`
- Base URL: `https://api.deepseek.com`
- Model: `deepseek-v4-flash`
- API key: present locally
- Hugging Face CLI: not logged in
- Current official GAIA dataset cache: missing

Missing official dataset files:

```text
F:\AILIS_self_evolution_runtime\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\metadata.level1.parquet
F:\AIGril\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\metadata.level1.parquet
```

Implication:

- GAIA Level 1 Lite Public can be rerun from the public scoring/file mirror path.
- GAIA official validation L1 needs Hugging Face login and dataset download/cache restoration before it can be rerun cleanly.

## What To Trust

Use these numbers when describing AILIS publicly:

1. **GAIA Level 1 Lite Public:** best historical score `60% = 12 / 20`.
2. **GAIA Official Validation L1 local:** best historical score `32.08% = 17 / 53`.

Do not use:

- the 2-question v1.0.6 run as a headline score;
- single-task debug runs as benchmark performance;
- internal humanlike eval as an external authority;
- local official validation score as a public leaderboard claim.

## What The Results Say About AILIS

AILIS already has enough runtime to produce a real GAIA signal. The 60% public-lite result is not trivial.

The weak point is not simply "model intelligence." The failure reports repeatedly show runtime and evidence mechanics:

- too much broad web search looping;
- insufficient source closure;
- weak structured retrieval for papers, videos, images, spreadsheets, and documents;
- answer handoff drift;
- final formatting/canonicalization problems;
- tool contract visibility problems.

The highest-leverage GAIA work is therefore:

1. Source-closure verifier.
2. Strict benchmark finalizer.
3. Direct tool contract exposure.
4. Document/media specialist tools.
5. Regression subset before every full run.

## Recommended Next GAIA Loop

Do not start with another full 53-task official run.

Recommended sequence:

1. Rerun a 3-question or 5-question GAIA Level 1 Lite smoke without submitting.
2. Inspect answers and failure modes.
3. Rerun the full 20-question public-lite set without submitting.
4. Submit only if the generated answers look sane.
5. Restore Hugging Face access and official Level 1 dataset cache.
6. Run a targeted 12-task regression set from historical failures.
7. Only then rerun official validation L1 53 tasks.

Suggested commands:

```powershell
node scripts/run-gaia-level1-lite.mjs --limit 5 --no-submit --run-id current-lite-smoke
node scripts/run-gaia-level1-lite.mjs --limit 20 --no-submit --run-id current-lite-full-nosubmit
node scripts/run-gaia-level1-lite.mjs --limit 20 --submit --run-id current-lite-full-submit
```

For official L1 after Hugging Face login:

```powershell
hf auth login
pnpm bench:gaia:official:download:l1
pnpm bench:gaia:official:l1
```
