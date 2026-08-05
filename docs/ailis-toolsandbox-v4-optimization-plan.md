# AILIS Apple ToolSandbox V4 Optimization Plan

Last updated: 2026-07-20

## 1. Objective

V4 should improve AILIS task quality without weakening authenticity, model
autonomy, or no-regression evidence.

The primary engineering goals are:

1. Stop forcing tool execution when the model can answer directly or must
   surface an information gap.
2. Improve exact-match tool argument grounding without app-side answer
   rewriting or scenario-specific rules.
3. Preserve the strong state-dependency and multi-tool behavior already
   demonstrated by V3.
4. Reduce model calls, tokens, and wall-clock duration after quality gates
   pass.
5. Establish a new evidence protocol that cannot mislabel already-seen
   ToolSandbox scenarios as unseen generalization.

This is an implementation plan, not a new benchmark result.

## 2. Frozen Evidence Baseline

The immutable V3 evidence remains the historical comparison point. V4 must
never rewrite, pool into, or replace these artifacts.

### 2.1 Unseen holdout V3

| Metric | Frozen value |
| --- | ---: |
| Validation ID | `holdout-v3-20260719-01` |
| Processed / officially scored | 239 / 239 |
| Errors | 0 |
| Valid-only mean | 0.7150834063502134 |
| Errors-as-zero mean | 0.7150834063502134 |
| Perfect / zero | 91 / 45 |
| AILIS + user-simulator calls | 2,602 |
| AILIS + user-simulator tokens | 22,053,949 |
| Official interaction turns | 2,259 |
| Summed duration | 44,179,549 ms |

The per-scenario resource baseline is approximately 10.89 LLM calls, 92,276
tokens, and 3.08 minutes.

The V3 source fingerprint is
`786152E8F4D5C63DEAEEF8BC80AE0B04AF0617ECA89CFCCE8E4B46F0E340CFDD`.
Its source-mtime fingerprint is
`BF3891C4F3292501B68F38366CC4A3598745FCF5EB2E983F37628030C4C2DA80`.
These fingerprints are historical and must not be reused after source changes.

### 2.2 Targeted recovery

The fixed failure cohort produced 155 valid official scores, zero errors, zero
zeros, a mean of 0.8149472303285492, and 43 perfect scores.

This result is selection-conditioned targeted recovery. It is useful for
diagnosis and repair verification, but it is not an unbiased registry or
generalization estimate.

### 2.3 Stability V1

| Metric | Frozen value |
| --- | ---: |
| Deterministic sample | 64 / 64 |
| Errors | 0 |
| Frozen baseline mean | 0.7501482793003078 |
| New mean | 0.8830792571853442 |
| Paired mean delta | +0.13293097788503622 |
| Bootstrap 95% interval | [+0.04862654881339136, +0.21628423839623379] |
| Improved / unchanged / regressed | 29 / 22 / 13 |
| Severe regressions | 2 |

The low and medium baseline bands improved strongly, while the high and
perfect bands regressed by -0.0804301713932947 and -0.13892719478723164.
V4 therefore needs to improve weak cases while protecting already-strong
behavior.

### 2.4 Current quality interpretation

The frozen 0.7151 holdout mean represents solid but uneven task quality. It
shows broad real capability, especially on state dependency and multi-tool
work, but 45 zero-score cases and two severe stability regressions prevent a
high-reliability production claim.

The score distribution is:

| Score band | Count | Share |
| --- | ---: | ---: |
| Perfect, 1.0 | 91 | 38.1% |
| High but imperfect, [0.75, 1.0) | 57 | 23.8% |
| Medium, (0.50, 0.75) | 28 | 11.7% |
| Half score, (0.25, 0.50] | 18 | 7.5% |
| Hard zero | 45 | 18.8% |

The nonzero rate is 194/239, or 81.2%, but that is not a task success rate:
ToolSandbox similarity is continuous and a nonzero trajectory can still miss
important milestones. The better quality label is **strong research
prototype / pre-production agent**, not production-grade high reliability.

The 0.8831 stability mean is encouraging no-material-regression evidence on a
selected paired sample. It is not the product-wide success rate and must not
replace the 0.7151 holdout estimate.

### 2.5 Official paper reference, not an eligible leaderboard rank

The official project does not expose a continuously updated public submission
leaderboard. The authoritative ranking reference is the fixed model table in
the [ToolSandbox paper, Table 5](https://arxiv.org/html/2408.04682#S4), with
the [official repository](https://github.com/apple/ToolSandbox) providing the
runner and result-comparison notebooks.

| Paper order | Agent in official paper | Full-suite average |
| ---: | --- | ---: |
| 1 | GPT-4o-2024-05-13 | 73.0 |
| 2 | Claude-3-Opus-20240229 | 69.2 |
| 3 | GPT-3.5-Turbo-0125 | 65.6 |
| 4 | GPT-4-0125-Preview | 64.3 |
| 5 | Claude-3-Sonnet-20240229 | 63.8 |
| 6 | Gemini-1.5-Pro-001 | 60.4 |
| 7 | Claude-3-Haiku-20240307 | 54.9 |
| Reference only | AILIS V3 holdout | 71.5 |

AILIS is numerically 1.5 points below the paper's GPT-4o row and 2.3 points
above its Claude-3-Opus row. It is **not valid to place AILIS second on that
leaderboard**, because the protocols differ:

- The paper row covers all 1,032 scenarios; V3 covers a frozen 239-scenario
  non-RapidAPI holdout.
- The official repository requires `RAPID_API_KEY` for its API-backed
  scenarios. V3 permanently excludes those 304 scenarios.
- V3 is heavily skewed toward `INSUFFICIENT_INFORMATION`: 126/239, or 52.7%,
  versus 224/1,032, or 21.7%, in the paper's full suite.
- The agent wrapper, prompt, user-simulator model, and model version differ.
- AILIS is a multi-layer agent system, while the paper table is intended as a
  model comparison under a shared minimalist prompt.

The honest positioning is: **numerically near the top proprietary-model
reference band on a differently skewed subset, with no official rank claim**.

### 2.6 Directional category comparison

Category comparisons use the same 0-100 similarity scale but remain
descriptive because the scenario populations differ.

| Category | AILIS V3 | GPT-4o paper | Difference |
| --- | ---: | ---: | ---: |
| Multiple Tool Call | 83.4 | 80.1 | +3.3 |
| Multiple User Turn | 83.4 | 74.7 | +8.7 |
| State Dependency | 93.4 | 84.0 | +9.4 |
| Canonicalization | 83.1 | 76.6 | +6.5 |
| Insufficient Information | 60.9 | 42.0 | +18.9 |
| Three Distraction Tools | 71.0 | 75.0 | -4.0 |
| Ten Distraction Tools | 70.2 | 74.6 | -4.4 |
| All Tools Available | 75.2 | 72.6 | +2.6 |
| Tool Name Scrambled | 70.0 | 72.4 | -2.4 |
| Tool Description Scrambled | 66.6 | 69.3 | -2.7 |
| Argument Description Scrambled | 70.0 | 73.0 | -3.0 |
| Argument Type Scrambled | 73.7 | 71.9 | +1.8 |

The useful signal is not a rank. AILIS is already strong on multi-step state
reasoning, while distractor resistance and lossy schema descriptions are the
clearest robustness gaps.

## 3. Non-Negotiable Evaluation Boundaries

1. The formal ToolSandbox target remains 728 non-RapidAPI scenarios.
2. The 304 RapidAPI scenarios remain `excluded_environment`; they are never
   called, paid for, or counted.
3. V1 and V2 attempts remain isolated history. Cross-drift and post-drift V2
   results remain quarantined.
4. Raw completed counts, raw intermediate means, latest-attempt projections,
   retries, and targeted cohorts must not be reported as unbiased improvement.
5. All 728 offline scenarios have now been observed. No V4 replay of those
   scenarios may be called a new unseen holdout.
6. A new unseen-generalization claim requires a genuinely external or newly
   released scenario set that is frozen before any V4 result is observed.
7. AILIS and the official on-policy user simulator must use the declared
   provider/model only. No fallback, mock result, expected-answer injection,
   evaluator feedback, answer post-processing, or scenario-name branch is
   allowed.
8. The model remains the semantic decision-maker. Deterministic code may
   validate schemas, lifecycle, permissions, budgets, evidence references,
   and contracts, but must not decide task meaning by keyword, regex, scenario
   name, or answer rewrite.
9. Every primary phase uses one immutable first attempt per scenario. Errors
   remain in the primary report and count as zero before any retry batch is
   created.

## 4. Evidence-Backed Failure Diagnosis

### 4.1 Catastrophic minefield cohort: 45 hard zeros

Every zero has the same evaluator shape:

- `milestoneSimilarity = 1.0`
- `minefieldSimilarity = 1.0`
- final similarity = 0

The model satisfied the positive objective, then an unnecessary or
unsupported tool call destroyed the whole score. This exactly matches the
paper's minefield definition and its timestamp example: an unavailable fact
must lead to a limitation response, not a fabricated argument.

The 45 zeros divide into two mechanisms:

| Root family | Count | Share of zeros | Observed failure |
| --- | ---: | ---: | --- |
| Missing temporal observation | 42 | 93.3% | Fabricated or ambient-clock-derived time was passed into holiday/reminder tools |
| Missing identity/capability | 3 | 6.7% | Message history was treated as a contact directory and a phone identity was inferred |

The temporal failures contain 14 holiday-difference scenarios and 28
reminder recency/creation/modification scenarios. Ten holiday trajectories
share the sequence `search_holiday -> datetime_info_to_timestamp ->
timestamp_diff`; reminder failures similarly construct timestamps without an
official current-time observation.

The identity failures appear only when distractors make `search_messages`
available. One trajectory searched messages for a name, inferred the wrong
person-to-phone relationship from sender/recipient fields, enabled cellular,
and sent the message. The issue is not missing tool syntax; it is unsupported
identity provenance.

Four system mechanisms reinforce this behavior:

1. The ToolSandbox bridge sets both `requireTaskExecution: true` and
   `requireExecutionEvidence: true` for every scenario.
2. The persona is forced through `handoff_task`, and a no-work-tool final is
   treated as incomplete.
3. The model-visible `runtime_environment` exposes an authoritative host
   clock even when the official scenario intentionally withholds the
   `get_current_timestamp` capability.
4. A representative model-input transcript has persistent memory enabled and
   exposes the benchmark scenario name through its workspace/project path.

V4 must fix the protocol across the whole ToolSandbox adapter. It must not
detect scenario names or selectively hide information after recognizing a
task.

### 4.2 Half-score cohort: 18 deterministic semantic misses

All 18 low nonzero records score exactly 0.5 and have no minefield violation.
They split cleanly:

| Root family | Count | Failure |
| --- | ---: | --- |
| Relative weekday canonicalization | 14 | "Next Friday" was mapped to 2026-07-24 instead of the nearest upcoming Friday, 2026-07-17 |
| Missing reminder content | 4 | The model inserted generic content `"reminder"` instead of asking what the reminder was for |

The first family observed the official current timestamp but made the wrong
semantic choice. The second had a valid date and time but invented a required
task argument. Both need model-owned semantic decisions with explicit
provenance, not a runtime date parser or a hidden placeholder rewrite.

The paper independently identifies time canonicalization, hallucinated
timestamps, and premature decisions under ambiguity as common failure modes.

### 4.3 Medium-score cohort: 28 incomplete trajectories

The 28 scores in `(0.50, 0.75)` cluster into four families:

| Root family | Count | Main gap |
| --- | ---: | --- |
| Remove contact with removal capability withheld | 14 | Tried invalid mutation workarounds, then produced a verbose partial-match limitation response |
| Relationship update | 7 | Used plural surface forms such as `friends`/`enemies` instead of grounded canonical values |
| Message-recency contact update | 6 | Skipped the current-time milestone and did not ground the final person's name |
| Repeated relationship update | 1 | Partial exact-match and response-completeness loss |

These are not random one-off misses. They map to three reusable capabilities:
capability recognition before mutation, exact argument grounding, and
evidence-complete final responses.

### 4.4 Stability regressions

The 64-scenario stability sample improved overall, but 13 scenarios regressed.
The two severe cases are:

1. `find_days_till_holiday_insufficient_information_alt`: 1.0 to 0.0 from
   forced execution and a minefield call.
2. `update_contact_relationship_with_relationship_alt_all_tools`: 1.0 to 0.5
   from plural categorical arguments.

The remaining larger regressions concentrate in message-recency selection,
contact mutation, and state-recovery completion. Three message-search cases
dropped to 0.5 or 0.3333; two send-message cases dropped to 0.75 after
recovering cellular state; one contact update dropped to 0.5. V4 therefore
must protect already-correct high/perfect behavior, not only recover the
holdout zeros.

### 4.5 Exact-match categorical argument drift

The current prompt correctly warns against invented values, but its blanket
first-lookup literal-preservation rule conflicts with categorical
normalization when a tool schema exposes no enum. For example, the user phrase
"friends" is useful natural language but the official tool trace expects the
stored value `friend`.

This is a generic schema-grounding problem. Production code must not contain a
special case for `friend`, `friends`, contact tools, or any scenario ID.

### 4.6 Cost amplification

Forced persona handoff, mandatory execution evidence, repeated tool schemas,
and unnecessary work-tool calls amplify cost. V3 averaged 10.89 LLM calls,
92,276 tokens, and 3.08 minutes per holdout scenario.

The 239 records contain 592 official tool calls, or 2.48 per scenario, but 657
internal `handoff_task` calls, or 2.75 per scenario. The primary efficiency
opportunity is therefore orchestration overhead, not indiscriminately
removing useful official tool calls.

Cost optimization is secondary to quality. A cheaper run that increases
errors, zeros, or high-band regressions does not pass V4.

### 4.7 Optimization priority and expected leverage

| Priority | Mechanism | Directly affected evidence | Why first |
| --- | --- | ---: | --- |
| P0 | Model-owned outcome plus official epistemic boundary | 45 hard zeros + 1 severe regression | Removes catastrophic all-or-nothing failures |
| P1 | Temporal, missing-field, and identity provenance | 18 half scores + 42 temporal zeros + 3 identity zeros | Largest concentrated quality headroom |
| P1 | Exact categorical grounding | 7 medium scores + 2 relationship regressions | Restores exact-match behavior without answer rewriting |
| P2 | Recency evidence and completion grounding | 6 medium scores + 4 recency regressions | Protects high/perfect multi-step behavior |
| P2 | Capability-aware blocked responses | 14 medium scores | Avoids invalid mutation probes and improves concise completion |
| P3 | Handoff/context efficiency | 657 internal handoffs | Reduces cost only after quality gates pass |

If all 45 hard zeros merely rose to 0.80 while every other score stayed
unchanged, the holdout projection would rise from 0.7151 to approximately
0.8657. This is a headroom calculation, not a forecast: those scenarios are
already seen, and any replay is targeted evidence only.

## 5. Target Architecture

### 5.1 Model-owned execution outcome

Replace the benchmark-wide mandatory execution flags with a model-owned
execution outcome contract:

```text
outcome
  direct_answer
  clarification_needed
  executed
  blocked

answer
evidence_refs
missing_fields
public_reason
```

`public_reason` is a short auditable summary, not hidden chain of thought.

The model decides the outcome:

- `direct_answer` when visible evidence is already sufficient.
- `clarification_needed` when a required user field is absent.
- `executed` when external state, retrieval, calculation, or mutation was
  actually performed.
- `blocked` when a required capability or environment is unavailable.

The harness validates structure rather than meaning:

- `executed` requires at least one successful task-advancing tool result and a
  successful latest execution step.
- `direct_answer` and `clarification_needed` do not require a synthetic tool
  call.
- `blocked` requires a concrete missing field, capability, permission, or
  environment reason.
- The runtime never upgrades or downgrades the model's outcome based on text
  matching.

### 5.2 Model-owned argument grounding

Each tool argument should have trace-side provenance selected by the model:

```text
user_literal
schema_enum
prior_observation
model_semantic_normalization
```

The provenance is stored outside official tool arguments and is never passed
to ToolSandbox tools.

For exact-match categorical fields with no enum, the model chooses among:

1. Use the user value when it is already the contract value.
2. Perform a non-mutating discovery call and ground the later exact value in
   the returned records.
3. Apply a semantic normalization and record that provenance.
4. Omit the unsafe optional filter or request clarification.

The runtime validates declared schema types, enums, required fields, and
additional-property rules. It never singularizes, pluralizes, canonicalizes,
or rewrites a value behind the model's back.

### 5.3 Clean benchmark context

Each scenario must have:

- A unique session ID.
- `messageHistory` containing only official in-scenario conversation.
- `memoryPolicy: disabled` for persistent user/persona memory.
- A clean TaskAgent context at scenario start.
- In-scenario TaskAgent checkpoints retained only for official multi-turn
  continuity.
- Scenario IDs, benchmark labels, evaluator state, expected answers, and
  similarities absent from model-visible prompt payloads.
- Workspace and memory paths replaced by opaque model-visible handles so a
  scenario name cannot leak through a filesystem path.
- Scenario IDs retained out of band for artifact paths, tracing, and official
  score joins.
- The host/benchmark clock retained for deterministic runner bookkeeping but
  omitted from the model-visible ToolSandbox context.
- Time becoming model-visible only through an official user message, system
  message, or official tool result.

This hardening does not alter the frozen official V3 scores. However, the
newly observed clock and scenario-path exposure must be disclosed as a
comparability and clean-room audit limitation. V4 removes that exposure
prospectively and makes the protocol easier to audit and reproduce.

Clock visibility is a suite-level adapter rule, not a task classifier. The
adapter must not inspect scenario categories, tool names, or user wording to
decide whether to expose the clock.

### 5.4 Model-owned epistemic and capability state

Before execution, the model may emit a compact public decision record:

```text
required_facts
  field
  status: known | missing | ambiguous
  source_ref

required_capabilities
  capability
  status: available | unavailable | uncertain
  source_ref

selected_outcome
public_reason
```

The harness checks only structural facts:

- Referenced observations exist.
- A `known` field has a source reference.
- An `executed` mutation has successful execution evidence.
- A `blocked` or `clarification_needed` outcome names the missing fact or
  capability.

The harness does not infer which facts a task needs, map identities, interpret
relative dates, or choose a tool. Those remain model decisions.

## 6. Implementation Workstreams

### Workstream A: Execution decision contract

Candidate files:

- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`
- `electron/ailis-agent-runner.cjs`
- `electron/ailis-task-agent-harness.cjs`
- `electron/ailis-gateway.cjs`
- `electron/ailis-turn-context.cjs`

Changes:

1. Stop setting blanket mandatory-execution flags in the ToolSandbox bridge.
2. Add an explicit `executionPolicy: model_decides` protocol field.
3. Keep persona tool choice on `auto`; do not force `handoff_task`.
4. Add the structured outcome to TaskAgent finalization and handoff packets.
5. Apply execution-evidence validation only when the model selects
   `executed`.
6. Record the selected outcome and evidence references in runtime artifacts.
7. Preserve existing safety, approval, budget, interruption, and latest-step
   failure gates.

Acceptance tests:

- A model-selected direct answer completes without a work-tool call.
- A model-selected clarification completes with explicit missing fields.
- A model-selected execution cannot claim completion without successful work
  evidence.
- A failed latest mutation remains incomplete.
- Persona handoff remains available and succeeds for real stateful tasks.
- No deterministic task classifier is introduced.

### Workstream B: Exact-match argument grounding

Candidate files:

- `electron/ailis-agent-runner.cjs`
- `electron/ailis-model-input-builder.cjs`
- `electron/ailis-tool-runtime.cjs`
- `electron/ailis-tool-routing.cjs`
- `electron/ailis-tool-contracts.cjs`

Changes:

1. Preserve required fields, enum values, descriptions, and
   `additionalProperties` through model-facing schema conversion.
2. Audit schema compaction for lossy enum or description truncation.
3. Replace blanket first-lookup literal preservation with a semantic
   grounding instruction for exact-match categorical fields.
4. Add trace-side argument provenance without adding fields to official tool
   calls.
5. Let the model use a non-mutating discovery call when a canonical value is
   not exposed.
6. Return rejected calls as authoritative schema observations and retain the
   existing no-identical-retry guard.

Acceptance tests:

- Enum-backed values are passed exactly.
- Values returned by prior observations can be reused exactly.
- Surface-form and canonical-form fixture pairs are resolved by model choice,
  not runtime rewriting.
- Scrambled tool names, argument descriptions, and argument types remain
  routable.
- Production source contains no benchmark scenario IDs or fixture value
  branches.

### Workstream C: Epistemic, identity, and temporal provenance

Candidate files:

- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`
- `electron/ailis-agent-runner.cjs`
- `electron/ailis-model-input-builder.cjs`
- `electron/ailis-task-agent-harness.cjs`

Changes:

1. Remove the model-visible host clock for every ToolSandbox scenario while
   keeping it trace-side for deterministic runner timestamps.
2. Add the model-owned epistemic/capability decision record.
3. Attach source references to identity, current-time, relative-time, and
   mutation arguments.
4. Let the model block or clarify when a required fact or capability is
   absent.
5. Treat message sender/recipient fields as observations, not automatic
   person-name-to-phone bindings.
6. Add synthetic fixtures for unavailable time, ambiguous weekdays, missing
   reminder content, and uncertain identity.
7. Keep all semantic selection in the model; validators check only references
   and contracts.

Acceptance tests:

- No ToolSandbox model input contains the host clock.
- A model can use an official `get_current_timestamp` result as provenance.
- A missing current-time capability can end as `blocked` without a tool call.
- A required missing reminder field can end as `clarification_needed`.
- An identity cannot be marked grounded to an observation that does not
  expose the cited identifier.
- No test relies on a production keyword, scenario name, or fixed date.

### Workstream D: Benchmark isolation

Candidate files:

- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`
- `scripts/toolsandbox/run_ailis_toolsandbox.py`
- `electron/ailis-turn-context.cjs`
- `electron/ailis-agent-runner.cjs`

Changes:

1. Set `memoryPolicy: disabled` explicitly.
2. Assert one unique session and one clean TaskAgent root per scenario.
3. Preserve official multi-turn state only inside that scenario.
4. Split model-visible context from trace-only evaluation metadata.
5. Add a prompt-snapshot audit that rejects scenario name, expected answer,
   evaluator result, similarity, and post-score feedback exposure.
6. Keep RapidAPI exclusion before agent and user-simulator execution.

### Workstream E: Context and cost efficiency

Candidate files:

- `electron/ailis-agent-runner.cjs`
- `electron/ailis-model-input-builder.cjs`
- `electron/ailis-context-manager.cjs`
- `electron/ailis-context-compiler.cjs`
- `electron/codex-model-bridge.cjs`

Changes:

1. Avoid persona-to-TaskAgent handoff when the model chooses a direct outcome.
2. Audit whether tool schemas are duplicated in both the context package and
   provider tool payload; remove only confirmed duplication.
3. Keep all official tools required by the scenario visible. Do not hide tools
   to manufacture a higher score.
4. Cache invariant tool schemas where the provider supports prompt caching.
5. Stop work as soon as model-audited evidence is sufficient.
6. Use parallel calls only for independent reads; preserve ordering for state
   dependencies and mutations.
7. Keep full observations in artifacts and send compact evidence references
   back to the model.

### Workstream F: Observability

Add per-turn and per-scenario fields:

```text
model_selected_outcome
outcome_source
handoff_used
official_tool_calls
internal_tool_calls
successful_work_steps
evidence_refs
missing_fields
argument_provenance
required_fact_status
required_capability_status
clock_visibility
prompt_schema_bytes
prompt_context_bytes
ailis_calls_and_tokens
user_simulator_calls_and_tokens
duration_ms
```

Do not store hidden reasoning. Store only structured decisions, public
summaries, tool arguments, observations, references, and provider usage.

## 7. Implementation Batches

### V4.0: Protocol hardening

Deliver:

- Clean memory-disabled benchmark sessions.
- Model-visible versus trace-only metadata separation.
- Suite-wide removal of the model-visible host clock.
- Prompt leakage audit.
- New source-file and mtime fingerprint tooling.

Exit gate:

- Existing deterministic tests pass.
- Official ToolSandbox routing tests pass.
- Prompt snapshots contain no host clock or evaluation-only fields.
- RapidAPI exclusion remains before execution.

### V4.1: Model-owned execution outcome

Deliver:

- `executionPolicy: model_decides`.
- Structured final outcome.
- Conditional execution-evidence gate.
- Model-owned required-fact and capability status.
- Direct-answer and clarification tests.

Exit gate:

- The locked 45-scenario minefield cohort has no unsupported execution.
- Real state mutation tests still require and record successful execution.
- No new severe regression appears in the two locked sentinels.

### V4.2: Argument and temporal grounding

Deliver:

- Lossless schema path for required/enum/exact-match information.
- Trace-side argument provenance.
- Generic categorical grounding fixtures.
- Read-only discovery strategy for absent value domains.
- Current-time provenance and relative-time candidate records.
- Clarification behavior for missing required semantic fields.

Exit gate:

- Exact-match fixtures pass without runtime rewriting.
- Scrambled-schema routing remains non-inferior.
- The locked relationship regression sentinel returns to a full score in the
  targeted diagnostic phase.
- The locked 18 half-score cohort has no result below 0.75.

### V4.3: Recency and completion no-regression

Deliver:

- Evidence-complete recency selection.
- Entity-name grounding for user-facing completion responses.
- Sequential state-recovery completion checks.
- A locked replay of all 13 Stability V1 regressions.

Exit gate:

- No severe regression remains in the 13-scenario sentinel cohort.
- No sentinel is more than 0.10 below its frozen baseline.
- Full 64-scenario stability gates pass before expansion.

### V4.4: Efficiency

Deliver:

- Removed confirmed prompt/schema duplication.
- Reduced unnecessary handoffs and tool rounds.
- Paired cost report on a frozen scenario cohort.

Exit gate:

- All quality and stability gates still pass.
- Resource targets in Section 9 are met or the remaining gap is documented.

## 8. Validation Protocol

### Phase 0: Static and deterministic gates

Before any paid or long official run:

1. Run syntax, Python compile, unit, gateway, routing, and diff checks.
2. Scan production source for every frozen diagnostic and future holdout
   scenario name.
3. Audit model inputs for expected answers, evaluator outputs, similarities,
   scenario IDs, and benchmark-only metadata.
4. Verify provider/model pinning and absence of fallback.
5. Verify memory isolation and unique scenario sessions.
6. Compute and freeze the complete V4 source and source-mtime fingerprints.

Any content or mtime drift after freeze stops the run. Results after the drift
are quarantined and never mixed into the frozen report.

### Phase 1: Targeted diagnostics

Freeze one first-attempt diagnostic manifest containing:

- The 45 V3 hard-zero minefield scenarios.
- The 18 V3 exact-half-score scenarios.
- The 28 V3 medium-score scenarios.
- All 13 Stability V1 regressions.
- A deterministic exact-match categorical grounding slice.
- Deterministic epistemic, identity, missing-field, and temporal fixtures.
- A deterministic scrambled-schema slice.

This phase is targeted recovery only. It must be labeled as seen-task
diagnostics and never as unseen generalization.

Freeze the primary report before creating any retry batch.

### Phase 2: Stability and no-regression

Run the unchanged 64-scenario deterministic stability sample first for a
direct paired comparison. If it passes, expand to all affordable members of
the 334-scenario original-positive population, preferably the full population.

Report:

- Valid-only and errors-as-zero means.
- Paired deltas and deterministic bootstrap interval.
- Improved, unchanged, regressed, and severe-regression counts.
- Score-band and robustness-stratum results.
- Per-scenario call, token, turn, and duration deltas.

This remains stability evidence, not unseen holdout evidence.

### Phase 3: New external holdout

Acquire a genuinely new official ToolSandbox expansion, independently authored
task set, or externally maintained compatible suite.

Requirements:

- At least 100 non-RapidAPI scenarios unless the external release is smaller.
- Zero scenario or task-content overlap with the 728 known scenarios and V4
  development fixtures.
- Scenario list, source, provider/model, clock, and manifests frozen before
  execution.
- One primary attempt per scenario.
- Official or independently locked scoring with no score feedback to AILIS.

If no suitable external set exists, V4 must not publish a new unseen
generalization claim. The honest result is targeted improvement plus
no-regression evidence.

### Phase 4: Optional 728 latest projection

After all primary reports freeze, a complete 728-scenario replay may be used
to produce a latest-version projection.

It must be labeled `latest-attempt projection` or `seen-suite replay`. It may
not be pooled with V3 holdout, targeted recovery, stability, or retry means.

## 9. Proposed Preregistered Gates

These thresholds must be written into the V4 manifest before official
attempts begin.

### 9.1 Targeted diagnostic gates

| Gate | Proposed threshold |
| --- | ---: |
| Primary errors | 0 |
| Unsupported/minefield calls in locked 45 | 0 |
| Zero count in locked 45 | 0 |
| Mean of locked 45 | >= 0.90 |
| Mean of locked 18 half-score cohort | >= 0.85 |
| Scores below 0.75 in locked 18 | 0 |
| Mean improvement in locked 28 medium cohort | >= +0.10 |
| Severe regressions in locked 13 sentinels | 0 |
| Worst locked-sentinel delta | >= -0.10 |
| Exact-match grounding fixture pass rate | 100% |
| Epistemic/provenance fixture pass rate | 100% |
| Scenario-name or expected-answer source hits | 0 |

These are seen-task engineering gates, not estimates of generalization. Their
purpose is to reject a patch that leaves a known mechanism broken before an
expensive stability or external evaluation.

### 9.2 Stability gates

| Gate | Proposed threshold |
| --- | ---: |
| Overall valid-only paired delta | >= -0.02 |
| Overall errors-as-zero paired delta | >= -0.02 |
| Severe regressions | 0 |
| High baseline-band mean delta | >= -0.05 |
| Perfect baseline-band mean delta | >= -0.05 |
| Every robustness stratum with n >= 4 | mean delta >= -0.10 |
| Paired-bootstrap lower 95% bound | >= -0.05 |
| Primary errors | 0 |

These gates are deliberately stricter than Stability V1 because V4 directly
targets its two severe regressions.

### 9.3 External holdout gates

| Gate | Proposed threshold |
| --- | ---: |
| Coverage | 100% attempted |
| Error rate | <= 2% |
| Valid-only mean | >= 0.72 |
| Errors-as-zero mean | >= 0.70 |
| Provider/model violations | 0 |
| RapidAPI calls | 0 |
| Integrity/audit violations | 0 |

If the external suite has materially different difficulty or scoring, the
score thresholds may be recalibrated only before labels or results are
observed. The manifest must explain the calibration source.

### 9.4 Efficiency gates

Use paired comparisons on the same frozen cohort.

| Metric | V3 holdout reference | V4 target |
| --- | ---: | ---: |
| Calls per scenario | 10.89 | <= 8.0 |
| Tokens per scenario | 92,276 | <= 70,000 |
| Duration per scenario | 3.08 min | <= 2.3 min |

Quality gates take precedence. If an efficiency target conflicts with
stability, retain the higher-quality configuration and document the cost gap.

## 10. Artifact Contract

Each V4 phase must produce:

```text
manifest.json
source-files.json
source-mtimes.json
prompt-boundary-audit.json
provider-model-audit.json
primary-progress.jsonl
primary-report.md
primary-projection.json
primary-projection.sha256
retry-manifest.json        # only after primary freeze, if needed
retry-report.md            # never replaces primary
```

Reports must keep these views separate:

- Targeted recovery.
- Seen-suite diagnostics.
- Stability/no-regression.
- New unseen holdout generalization.
- Valid-only.
- Errors-as-zero.
- Retry recovery.
- Latest-attempt projection.

## 11. Rollback and Stop Rules

Stop and quarantine the active phase when:

- Source content or mtime fingerprint changes.
- A duplicate controller or worker appears.
- Provider, model, reasoning effort, or user simulator drifts.
- An expected answer, scenario ID, similarity, or evaluator result enters
  model-visible context.
- A mock, fallback, answer rewrite, or RapidAPI call is observed.
- OAuth, usage, or provider availability blocks valid scoring.
- Primary-attempt uniqueness is violated.

Rollback is by source commit and manifest, never by deleting evidence.
Historical attempts and reports remain immutable.

## 12. Definition of Done

V4 is complete only when:

1. Protocol hardening, model-owned execution outcome, epistemic provenance,
   and argument grounding are implemented without scenario-specific logic.
2. All static, deterministic, routing, memory-isolation, and prompt-boundary
   audits pass.
3. The targeted diagnostic primary report passes its registered gates.
4. The frozen stability primary report passes every stricter V4 gate.
5. Efficiency is measured on the same cohort and does not trade away quality.
6. A new external holdout report is frozen, or the final report explicitly
   states that no new unseen-generalization claim is available.
7. Every result is linked to immutable source, mtime, scenario, manifest,
   provider/model, and primary-projection hashes.

## 13. Immediate Next Implementation Batch

The first code batch should be narrow:

1. Wait for the currently changing runtime worktree to stabilize.
2. Create a dedicated `codex/` V4 branch from a clean pinned commit and record
   the pre-change deterministic baseline.
3. Add failing protocol tests proving that ToolSandbox prompts contain no
   host clock, memory, scenario ID, evaluator data, or forced execution flag.
4. Add model-contract tests for `direct_answer`, `clarification_needed`,
   `executed`, and `blocked`, including source-reference validation.
5. Implement only V4.0 and V4.1; run deterministic tests and a synthetic local
   protocol probe before touching argument grounding.
6. Add generic temporal, missing-field, categorical, identity, and capability
   fixtures with invented data that does not reproduce benchmark task text.
7. Implement V4.2 and rerun every deterministic gate.
8. Review the diff for keyword, regex, task-type, scenario-name, fixed-date,
   and fixed-value special cases before any official ToolSandbox attempt.
9. Freeze the 104-record seen-task diagnostic manifest (91 V3 scores below
   0.75 plus 13 stability regressions) only after the implementation diff,
   source fingerprint, and tests are stable.
10. Run one first attempt per diagnostic scenario, freeze its primary report,
    and make the full 64-scenario stability gate the next go/no-go decision.

No new official benchmark run should begin from the current dirty worktree.

## 14. Authoritative References

- [Apple Machine Learning Research: ToolSandbox](https://machinelearning.apple.com/research/toolsandbox-stateful-conversational-llm-benchmark)
- [ToolSandbox paper and official model table](https://arxiv.org/html/2408.04682#S4)
- [Apple ToolSandbox official repository](https://github.com/apple/ToolSandbox)
