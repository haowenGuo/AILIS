# P1 vs Codex L2/L3 Execution-Chain Study

Updated: 2026-07-29

## Decision and source locks

P1 is the active AILIS operational baseline by explicit engineering decision.
The code baseline is:

```text
7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b
```

The baseline-pointer commit is:

```text
260846e3e10f316433891ebc1f609329e3ab141c
```

The Codex source used for the architectural comparison is fixed at:

```text
da4c8ca57d40b074bdc1b5b1218851100150c56b
```

P0 `8ebc1e577a21e9badf081ae9b05fb3eb0607cb88` remains the historical
narrow-fix success reference. The frozen baseline
`6afc0ae6a4b51992fcf20092fb5b8e109dab98e5` remains immutable.

This operational promotion does not rewrite the old L1 paired result: P1
scored 48/53 twice and failed the earlier P0 no-regression gate. The new
decision is based on broader cross-level evidence and establishes the parent
for future work.

## Evaluation validity

The comparison contains all 165 public validation tasks:

- L1: 53
- L2: 86
- L3: 26

P1 used its fixed complete result. Codex's original high-concurrency run had
103 network-invalid rows. Those rows were replaced by a complete lower-
concurrency retry; one remaining direct sampling disconnect was replaced by a
single-task retry. No capability failure was selectively replaced.

The visible scorer was also audited against the actual final submission.
Three Codex rows and four P1 rows were permissive false positives:

- P1 indices 0, 6, 21, and 144
- Codex indices 6, 105, and 144

The raw visible scores are preserved for reproducibility. Architectural
conclusions use the audited submission score.

## Scores

| Agent | Score type | Overall | L1 | L2 | L3 | Response OK |
|---|---:|---:|---:|---:|---:|---:|
| P1 | visible | 109/165, 66.06% | 49/53 | 50/86 | 10/26 | 162/165 |
| P1 | audited | 105/165, 63.64% | 46/53 | 50/86 | 9/26 | 162/165 |
| Codex | visible | 133/165, 80.61% | 47/53 | 65/86 | 21/26 | 157/165 |
| Codex | audited | 130/165, 78.79% | 46/53 | 64/86 | 20/26 | 157/165 |

The audited L2/L3 comparison is therefore:

- P1: 59/112, 52.68%
- Codex: 84/112, 75.00%
- both correct: 55
- P1 only: 4
- Codex only: 29
- both wrong: 24

P1 has no audited unique win in L3.

## Cost and request shape

| Metric | P1 | Codex |
|---|---:|---:|
| Total tokens | 33,067,217 | 11,737,948 |
| Mean tokens/task | 200,407 | 71,139 |
| Mean duration/task | 337,844 ms | 198,707 ms |
| P95 duration | 825,972 ms | 597,358 ms |
| Completed tool calls | 918 | 1,135 |
| Mean tool calls/task | 5.56 | 6.88 |
| Cached/input token ratio | 32.39% | 60.76% |

Codex's CLI usage is aggregated at turn level, so its reported one model turn
must not be compared to P1's 1,093 internal bridge calls.

The important asymmetry is that Codex performs more small tool actions while
using about one third of P1's tokens. P1 repeatedly resends a growing prompt,
changing tool schemas and projections across bridge calls.

P1 has 49 tasks where the last prompt falls below half the preceding prompt.
This is the signature of the forced-finalization projection:

- 40 of 60 audited-wrong tasks have this collapse
- 9 of 105 audited-correct tasks have this collapse
- 16 of 26 L3 tasks have this collapse

This correlation does not prove that finalization reset is the sole cause of
each error. It does prove that the confirmed source-level bypass is heavily
concentrated in long-chain failures.

## Core execution-chain comparison

### P1

The common P1 path is:

```text
persona orchestrator
  -> handoff_task
  -> TaskAgent
  -> repeated model bridge request
  -> native tool result preview
  -> ContextManager.forPrompt()
  -> safety finalization package at the round boundary
```

P1 has a real `ContextManager`. During ordinary rounds it stores ordered
Responses-like items and preserves call/output pairing. It also has valuable
specialized readers, an output store, evidence artifacts, and an execution
workspace.

The material break occurs at forced finalization:

- `buildLosslessToolObservationDigest` is an alias for a digest that keeps
  only `stepResults.slice(-4)`.
- `forceFinalResponse` sets provider `input` to `null`.
- the effective request becomes a finalization instruction plus a bounded
  digest instead of the canonical ResponseItem history.

P1 also adds broad exact-answer audit/recovery state. That machinery can
preserve a good candidate, but it increases prompt variation, rounds, and
policy coupling. The full validation shows that completed responses are not
the main L3 problem: P1 returned a response for all 26 L3 tasks but only 9
actual submissions were correct.

### Codex

The fixed Codex path is:

```text
TurnInput
  -> canonical ResponseItem history
  -> ContextManager.for_prompt()
  -> model response
  -> tool call recorded in history
  -> tool output recorded in the same history
  -> optional persisted replacement_history compaction
  -> final assistant message in the same sampling loop
```

Codex maintains a single model-request authority. `WorldState` is a separate
replayable state plane, not a competing finalization memory. Compaction
installs a persisted canonical replacement history, and replay reconstructs
that history plus ordered tail items.

In the observed GAIA chains, Codex also treats the filesystem as a durable
data plane. It downloads raw HTML, CSV, PDFs, and archives, writes temporary
files, installs a missing generic reader when needed, and runs small scripts
over those artifacts. Model-visible text can stay bounded because the raw
resource remains addressable.

## Outcome-conditioned behavior

For the 29 audited Codex-only L2/L3 tasks:

- P1 averaged 289,413 tokens, 467,611 ms, 9.31 model calls, and 8.31 tools.
- Codex averaged 123,758 tokens, 201,819 ms, and 10.97 tools.

For the 55 tasks both got right:

- P1 averaged 180,436 tokens and 301,260 ms.
- Codex averaged 57,474 tokens and 157,944 ms.

For the four P1-only tasks:

- P1 averaged 125,129 tokens and 4.5 model calls.
- the wins were one Codex timeout and three concise semantic/numeric wins.

The P1 failure signature is therefore not insufficient willingness to act.
It is spending nearly the entire round/token budget without converting
resources into a stable, correctly scoped computation.

## Representative chains

### L2 index 61: semantic role binding

The question asks for enzyme commission numbers associated with the two most
common chemicals in a virus-testing method.

- P1 found chemical inventory identifiers and answered
  `205-710-6; 500-018-3`.
- Codex first resolved the assay method, then the two enzyme roles, then
  mapped alkaline phosphatase and horseradish peroxidase to
  `3.1.3.1; 1.11.1.7`.

The gap is not a missing enzyme-specific object. It is preserving the generic
relation chain:

```text
paper -> method -> reagent role -> entity -> requested identifier type
```

### L2 index 71: resource relation loss

The required PS relation is on each arXiv `/format/<id>` page.

- P1 searched the January listing, found 97 entries, ran a text search for
  `ps` on the listing, and concluded zero.
- Codex extracted article IDs and inspected the separate format resources.

P1's computation was reliable over the wrong resource. The repair target is
generic link/resource preservation, not an arXiv rule.

### L2 index 98: raw public-data fallback

- P1 relied mostly on search results and missed the Census difference by 12.
- Codex tried the API, detected the key/403 failures, switched transports,
  located official Census resources, and computed the two endpoint
  populations.

The useful mechanism is transport-independent artifact acquisition plus
local calculation. Codex used many tools here, but retained a coherent
objective while changing paths.

### L2 index 105: both systems wrong after strict audit

Codex downloaded and filtered World Bank data but included Venezuela in
addition to the four gold countries. The visible scorer accepted the gold
substring. P1 returned a much broader list.

This is an important negative control: raw data and code do not guarantee
correct semantics. Indicator definition, missing-value handling, entity
scope, and output set equality still matter.

### L2 index 116: P1-only structured attachment win

P1 used the spreadsheet reader and correctly applied the relation that the
awning is on the back of the house. It answered 8. Codex parsed the sheet but
inverted front-facing direction and answered 4.

This demonstrates a capability to preserve: concise structured attachment
reading plus ordinary model reasoning.

### L2 index 131: adaptive acquisition, weak proof

Codex moved from blocked OpenReview APIs to proceedings HTML and a public
OpenReview-derived CSV. It returned 3; P1 returned 2.

Codex did not obtain strong direct evidence for the exact “certain”
recommendation field for every paper. The correct result is useful evidence
for adaptable acquisition, but not proof that every Codex success has a
complete evidentiary chain.

### L3 index 140: both systems compute the wrong interpretation

Both agents parsed the five ORCID identifiers and fetched works. P1 answered
46.4 and Codex 36; the gold is 26.4. The unresolved issue is what the profile
page counts as a pre-2020 work when ORCID groups duplicate summaries and has
missing dates.

This is a shared semantic/data-definition failure, not a tool-availability
failure.

### L3 index 145: durable attachment processing

Codex unpacked the XML and legacy XLS, discovered that `xlrd` was absent,
installed it, printed the raw sheet, and compared the duplicate names. It
answered `Soups and Stews`.

P1 also used command execution repeatedly, but its intermediate outputs were
largely bounded previews and it selected `Legumes`. The difference is the
continuity of the local artifact-to-script-to-result chain, not the existence
of a spreadsheet-specific planner.

### L3 index 151: cross-paper table mapping

The spreadsheet has six rows.

- Codex inspected all six, fetched the target bibliography, downloaded
  candidate source papers, and returned six reference numbers.
- P1 used its spreadsheet/PDF tools but reached the round boundary and
  returned seven numbers, violating the attachment's output cardinality.

This case directly combines incomplete evidence acquisition with terminal
context loss.

### L3 index 152: historical revision plus local join

Codex fetched the exact Wikipedia revision current at the end of 2012,
retrieved the linked population table revision, filtered the CSV locally, and
returned `0.00033`.

P1 found an archive capture and current list page but did not obtain a
replayable historical population table. It ended with
`Unsupported by the supplied observations`.

The missing capability is a generic historical-resource data plane with raw
revision artifacts, not a penguin schema.

### L3 index 156: targeted retrieval and residual luck

Codex identified the vessel/menu and used targeted painting-title searches,
returning `pears, bananas` with a short chain. P1 found the menu but did not
secure the painting arrangement and guessed extra fruits.

This is partly better query focus and partly weakly evidenced success. It
should not motivate a title- or art-specific route.

## What P1 gets right

P1 should remain the base because its useful capabilities are real:

- high response integrity: 162/165
- strong L1 visible performance
- dedicated spreadsheet, PDF, media, metadata, and archive tools
- working command execution and attachment staging
- canonical ResponseItem history during ordinary rounds
- short-chain structured-data wins that Codex can still miss

The next candidate must preserve these properties. Replacing TaskAgent with
Codex or routing difficult tasks back to Codex would not improve AILIS and is
outside the objective.

## Measured P1 gaps

1. **Two request authorities.** Ordinary rounds use canonical history;
   terminal safety finalization uses a separate recent-step digest.
2. **Unstable request prefix.** Prompt/tool-schema variation halves the
   observed cache ratio relative to Codex.
3. **Preview-first data plane.** Tools often return bounded text while the
   answer-bearing raw resource or relation is not retained as a first-class,
   queryable artifact.
4. **Weak transport adaptation.** Codex switches API, HTML, raw download,
   archive, and local script paths within one coherent turn more naturally.
5. **High-cost repetition.** P1 wrong L2/L3 tasks tend to reach the round
   boundary after about nine bridge calls and 289k tokens.
6. **Completion without correctness.** L3 response OK is 26/26, while audited
   correctness is 9/26.
7. **Scorer/output observability.** The prior runner could report a sanitized
   matching substring instead of the actual submitted answer.

## Next candidate from P1

The next candidate must be reconstructed from P1, not stacked on P3-P10.
The code parent remains `7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b`.

### Phase A: shadow effective-request journal

Record, after every override:

- canonical input item IDs and hashes
- effective instructions hash
- effective advertised tool-schema hash
- world/runtime-state hash
- artifact and output references
- compaction/checkpoint parent
- exact provider payload digest

Replay must reproduce the provider payload digest. Shadow mode must not
change prompts, answers, tools, budgets, retries, or finalization.

### Phase B: one canonical projector

Make `ContextManager` the only request authority. Auxiliary ledgers and
context packages remain telemetry. Forced finalization must project from the
same canonical history or a persisted replacement history, while preserving
P1's existing round boundary.

Do not add more visible rounds. Do not add stricter answer audits.

### Phase C: generic content and artifact plane

Represent every tool result with the same small vocabulary:

```text
contentItems: bounded model-visible text/table/media descriptors
artifactRefs: durable raw resources with provenance, content type, parent
              relation, range/query metadata, and integrity hash
outputRefs:   durable command/tool outputs that can be searched or reopened
```

This is intentionally not a registry of poetry, chess, law, ORCID, arXiv, or
other special structures. A link relation, table row, historical revision,
PDF, API payload, and command output use the same generic resource model.

### Phase D: stable prefix and truthful generic execution

- keep base instructions and common tool schemas stable
- load long-tail schemas on demand without rewriting prior history
- expose the real Windows shell, filesystem, package, and network affordances
- preserve downloaded files and script outputs as artifact/output refs
- retry transport failures at the lifecycle layer without forcing a model
  action or changing the reasoning policy

### Phase E: bilateral proof before a full gate

1. Replay fixed P1 transcripts in shadow mode and require request-digest
   equality.
2. Activate one mechanism only.
3. Run failure-side cases whose missing resource is directly addressed.
4. Stop if none becomes correct.
5. Run genuine P1-correct controls from L1/L2/L3.
6. Stop on any stable-control regression.
7. Run a fixed cross-level sample with actual-submission scoring.
8. Only then freeze a commit and run two complete paired evaluations.

The gate must report visible and strict submitted-answer scores, per-task
transitions, response integrity, latency, total tokens, cache ratio, and
final-prompt-collapse rate.

## Bottom line

P1 is now the operational baseline, but not because its long-chain problem is
solved. On audited L2/L3 it trails Codex by 25 tasks while using 2.8 times the
tokens and 1.7 times the latency.

The transferable Codex advantage is not a hidden behavioral instruction. It
is the combination of one canonical request history, replayable state,
durable raw artifacts, flexible generic command execution, stable prefixes,
and lifecycle-level recovery. Those mechanisms should be added to P1 one at
a time, under shadow/replay and bilateral regression, without creating a
GAIA-specific tool maze.
