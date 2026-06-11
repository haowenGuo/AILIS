# GAIA L1 Runtime / Agent Loop No-Answer Failure Analysis

Run id: `official-validation-l1-aigl-current-20260607-1335`

Date: 2026-06-07

Scope: 26 tasks that produced no scorer-usable final answer in the GAIA official validation L1 run.

Internal-use note: this document analyzes local validation traces and should not be published as a public benchmark artifact.

## Summary

The no-answer failures are the most important signal in this run. A wrong answer can be improved by better reasoning or retrieval. A blank answer means the runtime failed to enforce the basic Agent contract: every task must end in a valid final answer, a valid tool call, or a structured blocked state with actionable evidence.

No-answer status breakdown:

| Status | Count | Main meaning |
| --- | ---: | --- |
| `plan_only_or_unknown_action` | 18 | The model returned a plan/unknown action and the runner accepted it as terminal. |
| `error` | 4 | Tool/runtime path raised an error before a final answer could be extracted. |
| `blocked` | 2 | The agent declared insufficient evidence after retries. |
| `empty_response` | 1 | The model returned empty output after retry. |
| `max_steps_reached` | 1 | The agent exhausted the step budget without producing a final answer. |

Tool activity inside the 26 failed tasks:

| Tool/result pattern | Count | Interpretation |
| --- | ---: | --- |
| `web_search completed` | 112 | Most failures were not hard tool crashes; search returned pages, but usually irrelevant pages. |
| `web_fetch error` | 7 | HTTP 403/404 and fetch limitations blocked source access. |
| `web_search error` | 6 | Search backend occasionally failed outright. |
| `computer error` | 4 | Desktop/file commands were brittle for Office extraction. |
| `web_fetch completed` | 4 | Fetch worked sometimes but truncation/link-following was insufficient. |
| `youtube_transcript error` | 3 | YouTube transcript path is not reliable. |
| `run_python_file error` | 3 | Tool schema/path/dependency problems. |

The dominant pattern is:

```text
bad or incomplete observation -> model keeps searching/planning -> no legal final -> runner moves on
```

This is a runtime/Agent Loop issue. The runner should not treat bad model control output as a task result. It should repair the turn and force one legal next action.

## Runtime-Level Root Causes

### R1. Plan-Only Output Is Treated As Terminal

The model often produced a plan, a status sentence, or an unsupported action after tool observations. The runner recorded `plan_only_or_unknown_action` and advanced to the next task.

This is the highest-impact bug class.

Required runtime behavior:

```text
If model output is not one of:
- valid tool_call
- valid final
- valid blocked

then it is an invalid model turn, not a task result.
Repair it in-place.
```

Repair prompt shape:

```text
Your previous response was not a valid executor action.
You must now choose exactly one:
1. tool_call: call one available tool with valid JSON args
2. final: answer the task with the exact short answer only
3. blocked: explain the missing evidence and the next source/tool needed

Do not provide a plan. Do not narrate.
```

### R2. Search Success Is Not Evidence Success

`web_search` returned `completed` 112 times in the no-answer tasks, but many results were irrelevant. The Agent Loop currently treats "tool returned OK" as progress, even when the observation does not contain task-relevant evidence.

Required runtime behavior:

- Every observation needs a usefulness score.
- After two low-usefulness searches, the agent must change strategy.
- Strategy escalation options:
  - exact title search
  - domain-restricted search
  - direct URL/source fetch
  - archive fallback
  - structured API
  - local file/document parser

### R3. Finalizer Is Passive

Several tasks had a finalizer object like `missing_evidence`, but the runner did not use it to drive repair. The finalizer diagnosed failure after the fact instead of feeding a new loop iteration.

Required runtime behavior:

- `missing_evidence` should become a repair action.
- The next loop should receive:
  - what evidence is missing
  - what sources were already tried
  - which tool/source strategy must change

### R4. Tool Schema Errors Are Not Self-Healing

Examples:

- `run_python_file requires an existing path`
- `ModuleNotFoundError: No module named 'chess'`
- Office/PPTX extraction commands failed
- `download_file requires http(s) url`

These errors are predictable and should be repaired by the runtime or tool wrapper, not left to the model.

Required runtime behavior:

- If a tool requires a path, provide a task-local scratch path helper.
- If a Python dependency is missing, either install/use bundled dependency or route to a fallback implementation.
- If a local file is not an HTTP URL, use file copy/extract tools instead of `download_file`.

### R5. Missing Deterministic Adapters

Several GAIA L1 tasks are "small but precise" and should not be solved by raw LLM guessing:

- DOCX/PPTX/XLSX extraction
- YouTube/audio transcript
- image OCR
- chess board solving
- table/combinatorics/math
- structured source lookups

These need deterministic adapters before LLM reasoning.

## Task-By-Task Failure Analysis

### 3. `5d0080cb-90d7-4712-bc33-848150e917d3`

Status: `plan_only_or_unknown_action`

Task type: paper/source numeric lookup.

Trace:

```text
web_search ok -> web_search ok -> web_search ok -> web_search ok -> web_search ok -> web_search ok
```

Observed behavior:

- Six searches completed but returned irrelevant pages.
- Finalizer reported missing evidence for the paper's numeric value.
- Runner accepted plan-only output as terminal and submitted nothing.

Root cause:

- Search backend found irrelevant results.
- No strategy escalation to exact paper title, PDF search, or institutional archive.
- No repair loop after `missing_evidence`.

Fix:

- Add `research_exact_paper` skill: exact title search, PDF discovery, full text extraction.
- After two irrelevant searches, force exact-title/domain search.
- Run finalizer repair instead of ending.

### 4. `a1e91b78-d3d8-4675-bb8d-62741b4b68a6`

Status: `blocked`

Task type: YouTube visual counting.

Trace:

```text
youtube_transcript error -> web_search ok -> web_search ok -> web_search ok
```

Observed behavior:

- Transcript extraction failed.
- Web search drifted into irrelevant pages.
- The task required visual evidence, but no video-frame fallback was attempted.

Root cause:

- YouTube transcript is treated as the main path.
- Runtime lacks frame sampling / visual counting fallback.

Fix:

- Add video pipeline:
  - download or stream metadata
  - sample frames
  - image recognition/counting
  - ask model to count from selected frames
- If transcript fails on a visual-counting task, automatically switch to frame analysis.

### 5. `46719c30-f4c3-4cad-be07-d5cb21eee6bb`

Status: `plan_only_or_unknown_action`

Task type: scholarly multi-hop lookup.

Trace:

```text
web_search ok -> web_search error -> web_search ok -> web_search ok -> web_search ok
```

Observed behavior:

- One search backend failed.
- Later searches returned irrelevant "pie" results instead of paper metadata.
- Finalizer identified missing evidence.

Root cause:

- Query rewriting failed to preserve exact title semantics.
- No academic source fallback, such as ACM/Google Scholar/Semantic Scholar/Crossref.

Fix:

- Add academic lookup skill with exact-title quoting and bibliographic APIs.
- Tool should extract authors, prior papers, and publication history deterministically.

### 7. `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb`

Status: `plan_only_or_unknown_action`

Task type: DOCX puzzle.

Trace:

```text
computer ok -> computer ok
```

Observed behavior:

- First command read raw DOCX binary ZIP bytes.
- Second command attempted Word COM extraction, but the trace did not yield clean structured text to the model.
- The puzzle solver never received usable document contents.

Root cause:

- DOCX was handled as raw bytes / ad hoc COM command instead of a deterministic document parser.
- The output from `computer` was not normalized into text observations.

Fix:

- Add `extract_docx_text` tool backed by a real parser.
- Return clean paragraphs/tables.
- Route the extracted text into a deterministic assignment/puzzle solver where possible.

### 12. `b816bfce-3d80-4913-a07d-69b752ce6377`

Status: `max_steps_reached`

Task type: article/journal lookup.

Trace:

```text
20 mostly web_search calls, mostly irrelevant
```

Observed behavior:

- Agent repeatedly searched around the target article.
- It exhausted all 20 steps without final answer.

Root cause:

- No loop-level stagnation detection.
- Search strategy did not change meaningfully despite repeated irrelevant results.

Fix:

- Add stagnation detector:
  - if search result domains/snippets repeat or remain irrelevant, force new strategy.
- Add archive/PDF/source lookup for niche journals.

### 13. `72e110e7-464c-453c-a309-90a95aed6538`

Status: `blocked`

Task type: structured database search.

Trace:

```text
web_search ok x8 -> web_fetch 403 -> web_search ok x4
```

Observed behavior:

- Search found BASE API/service pages but did not use a structured API.
- One fetch hit HTTP 403.
- Agent blocked after long irrelevant search.

Root cause:

- Runtime lacks a BASE/search API adapter.
- No browser/API fallback after HTTP 403.

Fix:

- Add adapter for BASE or generic structured catalog queries.
- If source exposes an API, prefer API over web snippets.

### 16. `cca530fc-4052-43b2-b130-b30968d8aa44`

Status: `error`

Task type: chess image.

Trace:

```text
describe_image timeout -> describe_image ok -> run_python_file error(path) -> write ok -> run_python_file error(missing chess module)
```

Observed behavior:

- Vision eventually identified a board.
- Python execution first failed because `run_python_file` requires an existing path.
- The generated script then failed because Python package `chess` was not installed.

Root cause:

- Tool schema mismatch was not repaired cleanly.
- Chess solving depends on an unavailable runtime dependency.

Fix:

- Add chess adapter:
  - board state extraction
  - legal move generation
  - bundled chess engine/library
- Add schema repair for `run_python_file`: write temp file automatically when code content is provided.

### 18. `4fc2f1ae-8625-45b5-ab34-ad4433bc21f8`

Status: `plan_only_or_unknown_action`

Task type: Wikipedia featured-article history.

Trace:

```text
web_search ok x6 -> web_fetch 404
```

Observed behavior:

- Search stayed on broad Wikipedia pages.
- Fetch hit a 404.
- The agent did not use FAC archives or Wikipedia internal pages.

Root cause:

- No Wikipedia-specific research skill.

Fix:

- Add Wikipedia FAC/history adapter:
  - featured article promotion archives
  - talk page nominations
  - WikiProject dinosaurs/category pages
  - page history/talk-page search

### 19. `5188369a-3bbe-43d8-8b94-11558f909a08`

Status: `error`

Task type: web quote lookup.

Trace:

```text
web_search ok x3 -> web_fetch 403 -> web_search ok x3 -> web_search error -> web_search ok -> web_fetch 403
```

Observed behavior:

- Source fetches hit HTTP 403.
- Search fallback did not retrieve the needed archived content.
- Runtime ended with error.

Root cause:

- No archive fallback after protected source pages.
- Fetch errors are not converted into alternate source plans.

Fix:

- Add archive.org/search-cache fallback.
- Add source mirror/search snippet verification.

### 20. `6f37996b-2ac7-44b0-8e68-6d28256631b4`

Status: `error`

Task type: pure table/logic.

Trace:

```text
run_python_file error(path)
```

Observed behavior:

- The task did not need web search.
- The agent tried Python incorrectly and failed immediately.

Root cause:

- Tool schema repair gap.
- No direct deterministic table parser/solver path.

Fix:

- Add `run_python_code` or make `run_python_file` accept content.
- For small tables, auto-generate and execute a scratch script.
- If Python tool errors on schema, repair within the same turn.

### 24. `a3fbeb63-0e8c-4a11-bff6-0e3b484c3e9c`

Status: `plan_only_or_unknown_action`

Task type: PPTX content counting.

Trace:

```text
computer error -> computer error -> computer ok -> computer error -> computer error -> download_file error(local path)
```

Observed behavior:

- Multiple PowerShell/Office extraction attempts failed.
- `download_file` was incorrectly used on a local staged file path.

Root cause:

- No proper PPTX parser.
- Tool selection confused local file handling with HTTP download.

Fix:

- Add `extract_pptx_text` with slide-level output.
- Add tool guard: `download_file` rejects local path with repair suggestion "use file parser/copy".

### 26. `9d191bce-651d-4746-be2d-7ef8ecadb9c2`

Status: `plan_only_or_unknown_action`

Task type: YouTube quote.

Trace:

```text
youtube_transcript error -> web_search ok
```

Observed behavior:

- Transcript failed.
- Only one broad web search followed.
- No ASR or video audio fallback.

Root cause:

- Media pipeline is too shallow.

Fix:

- Add YouTube audio download + local ASR fallback.
- Add quote search over transcript/video title/source snippets.

### 28. `cabe07ed-9eca-40ea-8ead-410ef5e83f91`

Status: `plan_only_or_unknown_action`

Task type: OER document/source lookup.

Trace:

```text
web_search ok x3
```

Observed behavior:

- Searches completed but did not reach the chemistry exercise source.

Root cause:

- No exact-source retrieval or OER/document adapter.

Fix:

- Add exact phrase search and PDF/HTML source extraction.

### 31. `d0633230-7067-47a9-9dbf-ee11e0a2cdd6`

Status: `plan_only_or_unknown_action`

Task type: source changelog / code documentation.

Trace:

```text
web_search ok x4 -> web_fetch ok -> web_fetch 404 x2 -> web_fetch ok -> web_fetch 404 -> web_search ok x4
```

Observed behavior:

- The agent reached some source pages but did not extract the exact predictor/base command.
- Several fetches hit 404.

Root cause:

- No GitHub/source changelog-specific search.
- No local repository/versioned-doc retrieval.

Fix:

- Add changelog adapter:
  - fetch versioned release notes
  - search within page
  - extract code identifiers
  - verify by exact string.

### 32. `305ac316-eef6-4446-960a-92d80d542f82`

Status: `plan_only_or_unknown_action`

Task type: multi-language entity lookup.

Trace:

```text
web_search ok x5
```

Observed behavior:

- Search remained broad and did not resolve actor/role chain.

Root cause:

- No entity graph resolver for cast/role/multi-language pages.

Fix:

- Add entity-resolution loop:
  - identify show
  - identify localized actor
  - fetch target role page
  - extract first name.

### 33. `0383a3ee-47a7-41a4-b493-519bdefe0488`

Status: `error`

Task type: BBC/YouTube video.

Trace:

```text
web_search ok -> web_search ok -> youtube_transcript timeout
```

Observed behavior:

- YouTube transcript timed out after 90 seconds.
- No fallback after transcript timeout.

Root cause:

- Media tool timeout is terminal.

Fix:

- Add transcript timeout fallback:
  - retry with video id
  - web quote/title search
  - local ASR/video frame sampling.

### 38. `7673d772-ef80-4f0f-a602-1bf4485c9b43`

Status: `plan_only_or_unknown_action`

Task type: legal text amendment lookup.

Trace:

```text
web_search ok x3
```

Observed behavior:

- Agent did not navigate from search results into the relevant Cornell LII rule section.

Root cause:

- No structured legal-page fetch/find/diff routine.

Fix:

- Add legal document adapter:
  - fetch rule page
  - locate section
  - parse amendment notes
  - extract deleted word.

### 39. `c365c1c7-a3db-4d5e-a9a1-66f56eae7865`

Status: `plan_only_or_unknown_action`

Task type: geography/data reasoning.

Trace:

```text
web_search ok x2
```

Observed behavior:

- Search results were irrelevant.
- No local data table of presidents' birthplaces was built.

Root cause:

- Agent treated a data reasoning task as generic search.

Fix:

- Build table from trusted source.
- Use geocoding/longitude calculation deterministically.

### 41. `dc22a632-937f-4e6a-b72f-ba0ff3f5ff97`

Status: `plan_only_or_unknown_action`

Task type: food/show/book multi-hop.

Trace:

```text
web_search ok
```

Observed behavior:

- Only one search was executed.
- It returned irrelevant AliExpress-style results.
- Runtime ended with plan-only.

Root cause:

- No minimum research depth after irrelevant first result.

Fix:

- If first search is irrelevant, force rewritten search with exact entities and domain hints.

### 42. `3f57289b-8c60-48be-bd80-01f8099ca449`

Status: `plan_only_or_unknown_action`

Task type: baseball statistics.

Trace:

```text
web_search ok x4
```

Observed behavior:

- Search returned broad 1977 pages, not player stat tables.

Root cause:

- No sports/statistics table adapter.

Fix:

- Add Baseball-Reference/stathead-style lookup fallback.
- Parse stat table and compute walks leader/AB.

### 43. `23dd907f-1261-4488-b21c-e9185af91d5e`

Status: `plan_only_or_unknown_action`

Task type: poem formatting/layout.

Trace:

```text
web_search ok x2
```

Observed behavior:

- Search found likely poem text but did not fetch/parse layout deeply.

Root cause:

- The agent did not continue from search result to full text and stanza indentation analysis.

Fix:

- Fetch candidate poem page.
- Preserve whitespace/layout.
- Count stanzas with indentation detection.

### 45. `840bfca7-4f7b-481a-8794-c560c340185d`

Status: `plan_only_or_unknown_action`

Task type: article -> linked paper -> contract/award id.

Trace:

```text
web_search ok -> web_search ok -> web_search ok -> web_fetch ok -> web_extract_links ok
```

Observed behavior:

- The agent found the article and extracted links.
- It did not follow the relevant paper link deeply enough.
- Link list or fetched content was likely truncated.

Root cause:

- Link extraction is not followed by ranked link selection and PDF fetch.

Fix:

- Add source-chain controller:
  - rank extracted links by relevance
  - fetch paper/PDF
  - search within paper for author/award number.

### 46. `a0068077-79f4-461a-adfe-75c1a4148545`

Status: `plan_only_or_unknown_action`

Task type: ClinicalTrials/NIH structured lookup.

Trace:

```text
web_search ok
```

Observed behavior:

- Search returned generic NIH pages.
- Runtime did not use ClinicalTrials.gov structured search/API.

Root cause:

- Missing domain adapter.

Fix:

- Add ClinicalTrials.gov API/tool:
  - query condition/intervention/date
  - extract enrollment actual count.

### 47. `bda648d7-d618-4883-88f4-3466eabd860e`

Status: `plan_only_or_unknown_action`

Task type: scientific paper/PDF multi-hop.

Trace:

```text
18 web_search calls, several search backend errors, no useful source
```

Observed behavior:

- Agent searched many times but failed to retrieve the paper/specimen repository information.
- No PDF or biodiversity/taxonomy source path was used.

Root cause:

- Search-only loop without source escalation.

Fix:

- Add paper/PDF/taxonomy source retrieval.
- After repeated irrelevant search, switch to exact author-title search and PDF databases.

### 49. `cf106601-ab4f-4af9-b045-5295fe67b37d`

Status: `plan_only_or_unknown_action`

Task type: Olympics table lookup.

Trace:

```text
web_search ok -> web_search ok -> web_fetch ok
```

Observed behavior:

- Agent fetched a general Olympics page but did not extract the table of participating countries/athlete counts.

Root cause:

- No table extraction and tie-break computation.

Fix:

- Parse country/athlete-count table.
- Sort by athlete count then country name.
- Return IOC code.

### 50. `a0c07678-e491-4bbc-8f0b-07405144218f`

Status: `empty_response`

Task type: Japanese baseball roster.

Trace:

```text
web_search ok x4 -> empty model response
```

Observed behavior:

- Search results were irrelevant.
- Model eventually returned empty output.

Root cause:

- Retrieval failed and the model did not produce a legal blocked/final action.
- Empty model response was not repaired into a new action.

Fix:

- Treat empty response as invalid model turn.
- Add Japanese/NPB roster lookup path with Romanization support.

## The Main Runtime Bugs Exposed

### Bug A: Invalid Control Output Advances The Benchmark

When the model emits plan-only or empty output, the benchmark runner should not mark the task final. This inflated the no-answer count by at least 19 tasks.

Expected behavior:

```text
invalid_action_count += 1
if invalid_action_count <= 2:
    repair_prompt()
else:
    force_finalizer_or_structured_blocked()
```

### Bug B: Tool OK Does Not Mean Evidence OK

Many no-answer tasks had many successful `web_search` calls. The runner needs an evidence-quality layer:

```text
observation.useful = contains_target_entities && contains_answer_candidate
```

If usefulness is low twice in a row, the planner must choose a different strategy.

### Bug C: File/Media Tasks Need Deterministic First Pass

For attachments and media, the agent should not improvise with generic computer commands. It should receive extracted structured content before LLM reasoning:

```text
DOCX -> paragraphs/tables
PPTX -> slide text per slide
XLSX -> sheets/tables
MP3/video -> transcript
PNG -> OCR/vision structured result
```

### Bug D: Tool Schema Repair Belongs In Runtime

The model should not have to discover that `run_python_file` needs an existing path. Runtime can fix this by offering:

```text
run_python_code({ code, cwd })
```

or by auto-writing code to a scratch file.

### Bug E: Domain APIs Are Missing

Several no-answer tasks are naturally solved by structured sources:

- ClinicalTrials.gov
- Wikipedia FAC/history
- Baseball statistics
- Olympics participation tables
- legal rules/amendments
- academic paper metadata

Generic search is too weak for these.

## Repair Priority

### P0: Agent Loop Contract

1. Make `plan_only_or_unknown_action` non-terminal.
2. Make `empty_response` non-terminal.
3. Add strict legal-action repair prompt.
4. Preserve observations across repair turns.
5. Add finalizer fallback before task failure.

Expected impact: high. It should mainly improve answer rate.

### P0: Finalizer As Active Repair

Current finalizer says "missing evidence" after failure. It should instead generate the next retrieval instruction.

Example:

```json
{
  "status": "missing_evidence",
  "missing": "full PDF text for target paper",
  "avoid": ["generic web_search for broad keywords"],
  "next": {
    "tool": "web_search",
    "args": {
      "query": "\"Can Hiccup Supply Enough Fish to Maintain a Dragon's Diet\" filetype:pdf"
    }
  }
}
```

### P1: Deterministic Attachment Adapters

Implement these before another full GAIA run:

- `extract_docx_text`
- `extract_pptx_text`
- `extract_xlsx_tables`
- `transcribe_audio`
- `youtube_transcript_or_asr`
- `image_ocr`
- `chess_position_solver`

### P1: Search Strategy Escalation

Add a retrieval controller:

```text
generic search
-> exact phrase search
-> domain-specific search
-> direct fetch
-> PDF/archive/API fallback
-> finalizer/check
```

### P2: Domain Mini-Adapters

Build small adapters only for repeated GAIA patterns:

- ClinicalTrials.gov query
- Wikipedia FAC/history
- sports stat table extraction
- legal document amendment parser
- academic metadata/PDF lookup

## Suggested No-Answer Regression Set

Use these 12 before rerunning full L1:

| Task index | Why it belongs |
| ---: | --- |
| 3 | Bad search results plus finalizer repair. |
| 7 | DOCX extraction and puzzle solving. |
| 12 | Stagnation and max-step handling. |
| 16 | Image/chess plus Python dependency/schema repair. |
| 20 | Pure reasoning plus Python code execution schema repair. |
| 24 | PPTX extraction and local-file tool selection. |
| 26 | YouTube transcript fallback. |
| 31 | Source changelog retrieval. |
| 39 | Data reasoning after weak search. |
| 45 | Article link extraction and paper follow-through. |
| 46 | ClinicalTrials structured API. |
| 50 | Empty response repair plus non-English entity lookup. |

Pass criteria:

- No `plan_only_or_unknown_action`.
- No `empty_response`.
- No raw tool schema errors reaching final task status.
- At least 10/12 tasks submit a non-empty final answer.
- At least 6/12 exact correct before full GAIA rerun.

## Bottom Line

The 26 no-answer failures are mostly not "AIGL cannot reason" failures. They are control-plane failures:

- invalid model actions became terminal task failures
- irrelevant searches were treated as progress
- tool errors were not repaired
- file/media tasks lacked deterministic adapters
- finalizer diagnosed failure too late

Fixing these should raise answer rate before any model upgrade. The most urgent engineering change is to make the Agent Loop stricter: every turn must produce a valid tool call, final answer, or actionable blocked state, and invalid turns must be repaired immediately rather than recorded as benchmark results.
