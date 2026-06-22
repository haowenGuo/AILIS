# AILIS vs Codex: GAIA L1 Failed Tasks Source-Level Report

Date: 2026-06-11

Scope:
- Current AILIS code in `F:\AILIS`
- Local Codex reference source in `F:\AILIS\AILISClaw\.refs\openai-codex`
- GAIA rerun artifacts in `F:\AILIS\eval-results\engineering\gaia-official`

## 1. Bottom line

This is not mainly a prompt problem.

My judgment from the current code and rerun artifacts is:
- Around 20% is prompt/wording/benchmark steering.
- Around 80% is runtime architecture, tool exposure shape, contract visibility, observation quality, and adapter correctness.

The single biggest difference from Codex is not "Codex writes a smarter prompt". The biggest difference is:

1. AILIS currently exposes one native meta-tool, `ailis_agent_decision`, and asks the model to output a JSON object that contains `tool_call.tool` plus freeform `tool_call.args`.
2. Codex exposes the real tools themselves to the model: `exec_command`, `write_stdin`, `request_permissions`, `tool_search`, MCP tools, and so on.
3. Because of that, Codex gets real per-tool JSON schema at the exact call boundary, while AILIS often asks the model to guess nested tool args before the exact tool contract is loaded.

That single design choice explains a lot of the current failures:
- `tool_search` gets called with `question` instead of `query`
- `youtube_transcript` gets called with `video_id` even though it requires a URL
- external direct tools drift into wrong parameter names like `studyId`
- the loop repeatedly falls back to `web_search` because the model is operating on prose hints plus truncated observations, not a hard tool-level contract surface

## 2. Empirical state of the rerun

I reran the 26 previously failed GAIA L1 tasks.

Current state:
- 2 now pass with exact usable answers: `5d0080cb...`, `cffe0e32...`
- 3 now produce answers but are still wrong or formatter-incorrect: `6f37996b...`, `cabe07ed...`, `d0633230...`
- 21 still fail operationally, mostly `max_steps_reached`

So the current "still incorrect" set is 24 tasks.

Primary bottleneck buckets for these 24 incorrect tasks:
- Long-chain retrieval: 6
- Web evidence localization: 2
- Video/vision/multimedia: 4
- Specialized source / adapter / structured field extraction: 8
- Finalizer / answer formatting / observation capture: 4

This matters because it means the problem is not "the model is just dumb". The failures cluster around interface and evidence mechanics.

## 3. The architecture gap, in code

### 3.1 AILIS is still a meta-decision architecture

In AILIS, the first-turn tool catalog is explicitly deferred:

- `electron/ailis-agent-runner.cjs:1950-1970`

Key point:
- `contract: 'deferred'`
- `deferred_contracts: true`
- the note explicitly says detailed tool contracts, input schemas, return schemas, and usage limits are deferred into later `capability_context`

The decision schema then lets the model emit one big object with:
- `action`
- `capability_request`
- `tool_call.tool`
- `tool_call.args`

See:
- `electron/ailis-agent-runner.cjs:3320-3389`

And when native tool calling is enabled, AILIS still only gives the model one tool:
- `electron/ailis-agent-runner.cjs:3409-3419`

The important line is effectively:

```js
tools: [buildAgentDecisionNativeTool()]
```

So even in native mode, the model is not directly calling `tool_search`, `exec`, `request_permissions`, or `mcp__ailis_research__pdf_find_and_extract`.
It is calling one meta-tool that returns a JSON decision object.

That is the opposite of Codex.

### 3.2 Codex exposes the real tools directly

Codex defines real tool specs for the actual operations:

- `codex-rs/core/src/tools/handlers/shell_spec.rs:15-100`
- `codex-rs/core/src/tools/handlers/shell_spec.rs:103-140`
- `codex-rs/core/src/tools/handlers/shell_spec.rs:217-265`

Examples:
- `exec_command` has first-class params like `cmd`, `workdir`, `shell`, `login`
- `write_stdin` has `session_id`, `chars`, `yield_time_ms`
- `request_permissions` has its own permission schema

Codex then wires those tools to real handlers:
- `codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs:72-120`
- `codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs:222-297`
- `codex-rs/core/src/tools/handlers/unified_exec/write_stdin.rs:44-79`

This means the model is not asked to invent a nested `args` blob from prose. It calls the actual function tool.

### 3.3 Why this matters in practice

In AILIS, nested tool args are weakly constrained until after planning.

Evidence:
- `electron/ailis-gateway.cjs:1450-1457` validates only local core tool contracts before execution
- `electron/ailis-tool-contracts.cjs:1468-1475` says unknown tools return `ok: true` with `status: 'no_contract'`
- external virtual tools skip this core validation path entirely: `electron/ailis-gateway.cjs:1450-1451`

So for MCP direct tools and external direct tools, the model often reaches execution with only partial or deferred contract visibility.

This is exactly what showed up in the reruns:
- `tool_search` called with `question` instead of `query`
- `youtube_transcript` called with `video_id` instead of `url`
- `external__clinicaltrials__get_study` called with a parameterization that produced a 404

Codex avoids much of this because the tool surface itself is the schema.

## 4. Codex mechanisms that AILIS only partially has

### 4.1 Tool discovery is runtime-native in Codex

Codex `tool_search` is not a prose suggestion layer. It is a real deferred-tool search surface:

- `codex-rs/core/src/tools/handlers/tool_search_spec.rs:7-55`
- `codex-rs/core/src/tools/handlers/tool_search.rs:23-52`
- `codex-rs/core/src/tools/handlers/tool_search.rs:85-123`

Important details:
- It says it searches deferred tool metadata with BM25
- It returns loadable tool specs for the next model call
- It is designed as part of the real tool runtime, not just as guidance text

AILIS has a similar idea in Gateway:
- `electron/ailis-gateway.cjs:686-742`

That is good progress. But the model still reaches `tool_search` through the meta-decision JSON path, and its args are not enforced by the actual `tool_search` function schema at generation time.

### 4.2 Codex has a real exec session mainline

Codex does not make the model overuse fragile one-liner shell strings for everything. It gives:
- `exec_command`
- `write_stdin`
- session IDs
- output truncation rules
- approval fields
- apply-patch interception

See:
- `codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs:222-297`
- `codex-rs/core/src/tools/handlers/unified_exec/write_stdin.rs:106-119`

This matters for tasks like the PPT question. Codex can naturally do:
- write a short script
- run it
- poll output
- inspect results

AILIS currently tends to do brittle `python -c "..."` strings or route into `run_python_file`, which only accepts an existing file path:
- `scripts/mcp-ailis-research-server.cjs:2258-2267`

### 4.3 Codex permissions are a first-class runtime loop

Codex `request_permissions` is a real tool:
- `codex-rs/core/src/tools/handlers/request_permissions.rs:17-74`

Delegated subagents and parent sessions route approvals through a proper bridge:
- `codex-rs/core/src/codex_delegate.rs:306-356`
- `codex-rs/core/src/codex_delegate.rs:735-759`
- `codex-rs/core/src/codex_delegate.rs:795-813`

AILIS already has the concept and the prompt tells the model to use it:
- `electron/ailis-agent-runner.cjs:3225`

So permissions are not the main GAIA blocker right now. But Codex's implementation shows what "tool-native approval flow" looks like.

### 4.4 Codex MCP and connectors are part of the runtime fabric

Codex treats MCP and connector discovery as runtime-managed capability surfaces:
- `codex-rs/core/src/connectors.rs:87-104`
- `codex-rs/core/src/connectors.rs:161-176`
- `codex-rs/core/src/connectors.rs:211-241`
- `codex-rs/core/src/codex_thread.rs:516-546`
- `codex-rs/core/src/codex_delegate.rs:72-114`

This means:
- discover accessible connector tools from MCP
- cache them
- call MCP resources and tools from a stable thread abstraction
- relay subagent events and approvals

AILIS has some of this, but the model-facing execution path is still dominated by the meta JSON executor rather than a true direct-tool runtime.

## 5. AILIS's current weak points, in code

### 5.1 Too much behavior is prompt-side, not tool-side

The AILIS system prompt is already telling the model many correct things:
- use `tool_search` for missing capability
- prefer direct MCP ids
- use `pdf_find_and_extract` for papers
- treat failed tools as observations
- request permissions via tool

See:
- `electron/ailis-agent-runner.cjs:3220-3248`
- `scripts/run-gaia-level1-lite.mjs:156-166`

So the prompt is not empty or naive. It is already fairly good.

But when behavior still fails after all that prose, the remaining issue is not "add another sentence". The remaining issue is "move behavior into the runtime and tool interface".

### 5.2 AILIS contracts are real, but still mostly core-tool schemas

The core contract layer is useful:
- `electron/ailis-tool-contracts.cjs:58-112`
- `electron/ailis-tool-contracts.cjs:555-685`
- `tests/ailis-tool-contracts.test.mjs:14-205`

What it has:
- versioned schemas
- error codes
- risk metadata
- experience metadata

What it still lacks for many tasks:
- strong per-tool examples on the model-facing path
- `whenToUse`
- `whenNotToUse`
- parameter alias normalization for external/MCP direct tools
- field-level result extraction guidance

Notice the difference:
- core contracts are strong for `exec`, `request_permissions`, `tool_search`
- but many GAIA failures happen on MCP direct tools or external direct tools, where the outer decision layer still carries a freeform nested `args` object

### 5.3 Observation quality is still too summary-heavy

The turn-item layer builds compact observations and recovery hints:
- `electron/ailis-turn-items.cjs:155-203`
- `electron/ailis-turn-items.cjs:242-304`
- `electron/ailis-turn-items.cjs:386-413`

This is a good start, but it is still mostly:
- preview text
- regex-based failure classes
- regex-based evidence-gap classes

That is weaker than a typed evidence object like:
- source URL
- normalized entity ID
- extracted field name
- extracted field value
- page/section anchor
- confidence

In other words: AILIS often tells the model "you probably need a PDF parser" or "you probably need a structured API", but it does not always preserve the answer-bearing field in a stable structured slot.

### 5.4 The benchmark finalizer is too permissive

The finalizer prompt is decent:
- `scripts/run-gaia-level1-lite.mjs:376-390`

But the acceptance rule is too loose:
- `scripts/run-gaia-level1-lite.mjs:501-510`
- `scripts/run-gaia-level1-lite.mjs:595-610`

If `finalizer.ok` and there is any non-empty answer, it becomes the submitted answer.
There is no hard gate like:
- confidence must be high or medium
- reason must not contain guess-like wording
- field must match answer format contract exactly

This is why `d0633230...` could submit a low-confidence guessed answer.

### 5.5 Formatting normalization is still too weak

The answer formatter mainly strips units:
- `scripts/run-gaia-level1-lite.mjs:264-277`

It does not normalize many benchmark-sensitive exact-answer formats.

That is why `6f37996b...` can lose on `b,e` vs `b, e`.

## 6. Representative failures under the microscope

### 6.1 `a0068077...` ClinicalTrials

What AILIS actually did:
- found the trial via v2 API
- fetched the full study JSON
- searched tools and found `external__clinicaltrials__get_study`
- called the external direct tool
- got a 404 on `https://clinicaltrials.gov/api/v2/studies/?studyId=NCT03411733`

Evidence:
- rerun JSONL shows the path
- gateway audit already captured this exact sequence

Why this is not a prompt problem:
- the model already reached the correct domain, the correct NCT id, and the correct class of tool
- the failure is adapter correctness plus result shaping

Why Codex-style runtime would do better:
- either direct structured API tool with the correct schema
- or `exec_command` / `write_stdin` / `curl` / local script fallback
- or a better direct observation that extracts `enrollmentCount` into a typed field instead of leaving it buried in JSON text

Root gap:
- adapter smoke coverage is too toy-level
- external direct tool contracts are not enforced strongly enough
- structured API responses are not normalized into stable evidence fields

### 6.2 `a1e91b78...` YouTube bird-species counting

What AILIS actually did:
- called `youtube_transcript` with `video_id` and failed immediately because the tool requires a URL
- retried with full URL and still failed
- fetched the YouTube HTML, which only returned boilerplate
- called `tool_search` with `question` instead of `query`, so tool discovery itself failed
- fell back to noisy web search

Evidence:
- `scripts/mcp-ailis-research-server.cjs:2407-2478` requires a YouTube URL
- `electron/ailis-tool-contracts.cjs:661-685` makes `tool_search` require `query`/`q`

Why this is not mainly the base model being dumb:
- the runtime made the model express nested tool args through a meta decision object
- the actual tool schema was not the primary surface at generation time

Codex-style path:
- direct tool schema would make wrong arg keys less likely
- if transcript fails, the model would much more naturally move to "I need video download/frame sampling/vision", not keep pretending web HTML is evidence

Important nuance:
- Codex is not magic here either
- without a real frame sampler or vision counting path, Codex also needs an extra primitive
- but Codex is much better at reaching that conclusion early and cleanly

### 6.3 `a3fbeb63...` PPT crustaceans count

What AILIS actually did:
- first `tool_search` failed because it used `question` not `query`
- then it used fragile `python -c` one-liners
- one run exited with `0` but produced no count in the captured observation
- another run failed because `python-pptx` was missing
- it installed `python-pptx`
- then went back to another broken `python -c` string

This is not a "missing PPT tool only" issue.
It is also an exec-mainline issue.

Codex-style path would more likely be:
- write a short script to disk
- run it through `exec_command`
- inspect stdout
- if needed, iterate using `write_stdin` or rerun the script

Current AILIS path is too dependent on brittle inline shell code, and the benchmark finalizer then sees "script ran" without seeing the actual answer.

### 6.4 `46719c30...` paper author-history chain

What AILIS actually did:
- correctly started with `pdf_find_and_extract`
- then fell into repeated `web_search` for the title
- generic search got polluted by food/pie results
- later called `pdf_extract_text` with `title` instead of a direct PDF path or URL, which the tool contract rejects

This is exactly the kind of failure that proves the problem is not "missing one more prompt line".

The missing piece is:
- a retrieval controller that can pivot from exact title -> canonical paper page -> author list -> author history
- plus field-aware document parsing

Codex does not solve this with a magical `paper_pdf_search` tool.
It solves it by combining:
- direct tools
- scripts
- controlled iteration
- better tool-selection ergonomics

## 7. Per-failed-task AILIS vs Codex comparison

### 7.1 Long-chain retrieval

- `305ac316...` AILIS did 8 rounds of `web_search` and never stabilized the actor identity chain from Polish Raymond -> actor -> Magda M. role; Codex-style would split the chain into two entity resolutions and then fetch one answer-bearing page; gap: retrieval controller.
- `46719c30...` AILIS started correctly with `pdf_find_and_extract` but then lost the chain and went back to noisy web search; Codex-style would hold onto the canonical paper and move to author-history extraction; gap: chain persistence plus paper metadata extraction.
- `840bfca7...` AILIS never completed the link chain from Universe Today article -> linked paper -> acknowledgements -> NASA award; Codex-style would treat each hop as a concrete artifact fetch; gap: link-follow controller.
- `b816bfce...` AILIS spent all 8 steps in broad web search and never anchored the exact article/journal; Codex-style would shift to title-specific retrieval or library search; gap: exact-title paper routing.
- `bda648d7...` AILIS repeated generic search without obtaining the paper text; Codex-style would move to document acquisition earlier; gap: source acquisition.
- `dc22a632...` AILIS never concretized the chain TV show -> restaurant -> recommenders -> book title; Codex-style would decompose the entities and verify each hop before finalizing; gap: multihop decomposition.

### 7.2 Web evidence localization

- `23dd907f...` The rerun aborted, but the question itself is layout-sensitive: stanza indentation is not plain-text retrieval; Codex-style would fetch a rendering or formatted source, not just search text; gap: formatting-aware evidence extraction.
- `5188369a...` AILIS found the Word of the Day page but not the quoted writer; Codex-style would keep drilling inside the page structure rather than treating page fetch as near-final evidence; gap: within-page field localization.

### 7.3 Video / vision / multimedia

- `0383a3ee...` AILIS looped `web_search` on a BBC Earth YouTube question and never reached transcript or frame evidence; Codex-style would switch faster from search to media evidence; gap: multimedia escalation.
- `9d191bce...` AILIS could not recover the exact quote because transcript acquisition kept failing and search never found the line; Codex-style would keep looking for transcript-like evidence or downloadable captions, then only fall back if absent; gap: quote-level media extraction.
- `a1e91b78...` AILIS hit both arg-shape errors and missing frame-analysis capability; Codex-style would expose the contract better and identify the need for frame sampling earlier; gap: per-tool schema visibility plus missing media primitive.
- `cca530fc...` AILIS used image description and computer actions, but no stable board extraction plus engine solve path; Codex-style would either use a chess-specific tool or write a small board parser and engine script; gap: vision-to-structured-state conversion.

### 7.4 Specialized source / adapter / structured data

- `3f57289b...` Yankees 1977 walks/at-bats needs structured baseball stats, not loose search; Codex-style would target a roster/stat table or script extraction from a known source; gap: sports table adapter.
- `4fc2f1ae...` Wikipedia Featured Article nomination history is a source-specific structure problem; Codex-style would use page history / talk / FA promotion logs, not generic search; gap: Wikipedia FA adapter.
- `72e110e7...` BASE with the unique flag/language row is a source-specific result-table problem and likely dynamic; Codex-style would use browser/table extraction or a dedicated source adapter; gap: interactive table extraction.
- `7673d772...` Cornell LII amendment diff requires legal source structure and amendment note parsing; Codex-style would localize the exact rule article and then inspect amendment text; gap: legal-source adapter.
- `a0068077...` ClinicalTrials shows AILIS can now discover the external tool, but the adapter and field extraction are still wrong; Codex-style would win here by adapter correctness, not by a longer prompt; gap: adapter correctness plus structured result normalization.
- `a0c07678...` NPB pitcher number adjacency needs a reliable roster source and name normalization; Codex-style would use a concrete roster page or structured sports adapter; gap: source-specific roster extraction.
- `c365c1c7...` Presidents' birth cities farthest apart needs a complete list plus coordinates plus computation; Codex-style would move into a small script once the source list is acquired; gap: list acquisition plus compute handoff.
- `cf106601...` 1928 Olympics least athletes is a structured table problem; Codex-style would use a source-specific medal/participant table or script against a stable page; gap: Olympics table adapter.

### 7.5 Finalizer / formatting / observation capture

- `a3fbeb63...` The answer likely existed in execution attempts, but the count never became stable evidence for the finalizer; Codex-style would preserve stdout as the answer-bearing observation; gap: execution observation capture.
- `6f37996b...` `b,e` vs `b, e` is a pure exact-answer formatter miss; Codex-style benchmark harness would normalize comma-separated symbol sets more strictly; gap: answer normalization.
- `cabe07ed...` AILIS found a plausible mention inside a giant PDF and then finalized the wrong surname with high confidence; Codex-style would need section anchoring or stronger evidence filters here too; gap: document section localization plus finalizer trust policy.
- `d0633230...` AILIS submitted `BaseEstimator` with low confidence and explicitly insufficient evidence; the harness still accepted the non-empty answer; gap: finalizer confidence gate.

## 8. What Codex would not magically solve either

To stay honest:
- Video frame counting still really wants a frame sampler or vision pipeline.
- Chess still really wants board-state extraction plus an engine.
- Some obscure academic-library tasks still need a browser or custom parser.

So the answer is not "Codex has a secret prompt and therefore can do anything".

The real answer is:
- Codex is much better at getting to the true missing primitive
- much better at using low-level tools to build that primitive on the fly
- much better at keeping parameter contracts and execution state coherent across turns

## 9. What AILIS should change next

### P0

1. Stop using only one meta decision tool in task mode.
Expose actual runtime tools directly to the model for benchmark / task execution mode, especially:
- `tool_search`
- `request_permissions`
- `read`
- `write`
- `exec`
- `apply_patch`
- selected `mcp__ailis_research__...` direct tools

2. Keep persona JSON separate from task tool calls.
The current single JSON object mixes:
- persona surface state
- plan update
- tool selection
- tool args
- final user answer

That is elegant for product UX, but weak for exact execution.

3. Promote tool contracts from deferred prose to first-class callable schemas.
The current deferred catalog is the direct reason `question` and `video_id` mistakes survive until execution.

4. Add typed evidence objects, not only preview text.
For structured or document tools, persist:
- `source_url`
- `entity_id`
- `field_name`
- `field_value`
- `section/page anchor`
- `confidence`

5. Fix adapter smoke testing with real canonical examples.
The current external ClinicalTrials smoke test proves the toy adapter shape, not the real production call path:
- `tests/ailis-gateway.test.mjs:193-259`

6. Harden the benchmark finalizer.
Do not submit finalizer answers when:
- confidence is low
- reason contains guess-like wording
- evidence is missing

7. Expand only the truly missing primitives.
Right now the only obviously missing primitive classes are:
- video frame sampling / frame vision
- chess board extraction + engine

Most of the remaining failures do not need dozens of new tools.
They need a better runtime shape.

## 10. The key answer in one sentence

Codex gets to "download the paper, parse the PDF, switch to an API, write a script, inspect stdout, request permissions, or search for a new tool" more reliably not because it wrote a better paragraph in the system prompt, but because its runtime exposes those operations as the actual model-facing objects, with real schemas, session semantics, approval loops, and evidence-preserving observations.
