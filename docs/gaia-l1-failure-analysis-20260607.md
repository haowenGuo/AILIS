# AIGL GAIA Validation L1 Failure Analysis

Run id: `official-validation-l1-aigl-current-20260607-1335`

Date: 2026-06-07

Scope: GAIA official validation Level 1, 53 tasks.

Artifacts:

- Summary: `F:\AIGril\eval-results\engineering\gaia-official\official-validation-l1-aigl-current-20260607-1335.summary.json`
- Raw transcript JSONL: `F:\AIGril\eval-results\engineering\gaia-official\official-validation-l1-aigl-current-20260607-1335.jsonl`
- Report: `F:\AIGril\eval-results\engineering\gaia-official\official-validation-l1-aigl-current-20260607-1335.report.md`

## Result

| Metric | Value |
| --- | ---: |
| Total tasks | 53 |
| Correct | 9 |
| Score | 16.98% |
| Locally completed with an answer | 27 |
| Locally failed without usable answer | 26 |
| Submitted but judged wrong | 18 |

Final status breakdown:

| Status | Count | Meaning |
| --- | ---: | --- |
| `completed` | 27 | Runner submitted a final answer artifact. |
| `plan_only_or_unknown_action` | 18 | Agent stopped with a plan/unknown action instead of tool call/final answer. |
| `error` | 4 | Runtime/tool/model path raised an error before final answer. |
| `blocked` | 2 | Agent declared blocked after retries. |
| `empty_response` | 1 | Model/tool path returned no usable response after retry. |
| `max_steps_reached` | 1 | Agent used all step budget without final answer. |

Attempt-level repair signals:

| Attempt status | Count |
| --- | ---: |
| `runner_error` | 4 |
| `blocked` | 2 |
| `invalid_agent_tool_call` | 1 |
| `empty_response` | 1 |

## Executive Diagnosis

The current AIGL pipeline can run the full GAIA L1 validation set end to end, but it is not yet in a stable benchmark state.

The largest blocker is not only base-model reasoning. The largest blocker is the harness: the Agent Loop often accepts non-terminal behavior as terminal, and the final-answer guard allows conversational or poorly formatted text into the scorer. On GAIA, a system can find useful evidence and still score zero if it does not produce the exact required answer string.

Priority failure classes:

1. `plan_only_or_unknown_action` collapse: 18 final failures. The model returned a plan, partial analysis, or unsupported action. The runner advanced to the next task without forcing a valid `tool_call`, `final`, or structured `blocked`.
2. Final answer guard weakness: several tasks submitted explanations, Chinese meta text, currency symbols, uppercase-only sentences, or wrong units.
3. Retrieval weakness: web search often returned irrelevant results, partial pages, or failed to follow multi-hop source trails.
4. Media/document tool gaps: YouTube/video, audio, PPTX/DOCX, image OCR/chess, and scientific PDF tasks were unreliable.
5. Tool schema/runtime repair weakness: `runner_error`, `invalid_agent_tool_call`, and empty responses were not repaired into valid alternate actions.
6. Domain reasoning gaps: arithmetic, combinatorics, logic from tables, fictional-language parsing, and list extraction need deterministic scratchpad/verifier paths.

## Failure Taxonomy

### F1. No Final Answer: Plan-Only Or Unknown Action

Symptoms:

- The agent has one or more tool observations but stops with a plan-like response.
- The runner records `plan_only_or_unknown_action`.
- `submitted_answer` is empty, so the scorer immediately marks the task wrong.

Likely root causes:

- The executor prompt allows natural-language planning as a top-level response.
- Transcript repair does not force a legal next action after an invalid turn.
- There is no mandatory finalizer pass before giving up.
- The runtime treats "not a valid action" as a task result rather than a repairable model error.

Required fixes:

- Treat `plan_only_or_unknown_action` as an invalid model turn, not a task terminal status.
- Add a repair prompt: "You must now choose exactly one of: tool_call, final, blocked."
- If evidence exists but no final was emitted, run a separate final-answer extractor.
- Track per-task state and forbid the same plan-only shape twice in a row.

### F2. Submitted Answer Is Not Scorer-Ready

Symptoms:

- The submitted answer contains explanatory text, Chinese narration, currency symbols, extra punctuation, or wrong answer unit.
- The content can be close to the gold answer but fails exact/quasi-exact match.

Likely root causes:

- AIGL persona style leaks into benchmark answers.
- The finalizer does not enforce the GAIA answer contract.
- Unit conversion instructions are not validated against the question wording.
- List answers are not canonicalized according to prompt requirements.

Required fixes:

- Add a benchmark mode final-answer guard that strips persona text and rejects explanations.
- Normalize currency/unit symbols only when the question requests them.
- Add type-aware validators: number, string, comma-separated list, sentence, formula.
- Add a "does this answer obey the requested output format?" check before submission.

### F3. Retrieval And Evidence Failure

Symptoms:

- Search returns irrelevant pages or broad search snippets.
- Agent does not pivot to direct source pages, archives, PDFs, or structured databases.
- The final answer is guessed from weak evidence.

Likely root causes:

- Search tool lacks domain targeting, page discovery, and source verification loops.
- Web fetch preview truncation hides the relevant part.
- No multi-hop research skill specialized for GAIA-style tasks.

Required fixes:

- Add source-seeking planner patterns: exact-title search, domain filter, source fetch, archive fallback.
- Add full-text fetch for PDFs/HTML instead of short previews only.
- Add a retrieval verifier that checks answer support with quoted/source-local evidence.

### F4. Media, Vision, And Document Tool Gaps

Symptoms:

- YouTube/audio/video questions fail or return plan-only.
- Image OCR and chess image analysis fail.
- DOCX/PPTX tasks do not consistently produce extracted text.

Likely root causes:

- Tool surface exists but is not consistently exposed with usage examples.
- Some media tasks need deterministic extractors before LLM reasoning.
- Vision answers need domain-specific engines, not only general image description.

Required fixes:

- For audio/video: transcript-first path, local ASR fallback, frame extraction fallback.
- For documents: deterministic text extraction for DOCX/PPTX/XLSX plus slide/page counters.
- For images: OCR and grid extraction; for chess, use board reconstruction plus a chess engine.

### F5. Tool Schema And Runtime Repair

Symptoms:

- `runner_error`, `invalid_agent_tool_call`, `empty_response`, and tool-specific errors interrupt a task.
- Retried task often falls back to plan-only instead of a corrected call.

Likely root causes:

- Tool schemas are not injected with enough examples.
- Invalid calls are not repaired into schema-valid calls.
- Retry loses useful partial state or does not explain the exact schema violation.

Required fixes:

- Add tool-call repair with schema-specific error messages.
- Preserve observations across retry and tell the model exactly what failed.
- Provide task-local scratch workspace paths and examples for file-based tools.

## No-Answer Failure Tasks

These 26 tasks produced no scorer-usable answer.

| # | Task id | Status | Type | Steps | Diagnosis | Priority fix |
| ---: | --- | --- | --- | ---: | --- | --- |
| 3 | `5d0080cb-90d7-4712-bc33-848150e917d3` | `plan_only_or_unknown_action` | Paper/PDF numeric lookup | 6 | Evidence search did not converge to final numeric volume. | Force finalizer after evidence; better PDF/source retrieval. |
| 4 | `a1e91b78-d3d8-4675-bb8d-62741b4b68a6` | `blocked` | YouTube/video counting | 4 | Video task blocked without visual counting fallback. | Add video frame sampling and local vision counting path. |
| 5 | `46719c30-f4c3-4cad-be07-d5cb21eee6bb` | `plan_only_or_unknown_action` | Scholarly multi-hop | 5 | Multi-hop author/paper lookup stopped before final title. | Research skill with exact title/source graph. |
| 7 | `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb` | `plan_only_or_unknown_action` | DOCX puzzle | 2 | Document parsed insufficiently, no combinatorial solver final. | Deterministic DOCX extraction and puzzle solver. |
| 12 | `b816bfce-3d80-4913-a07d-69b752ce6377` | `max_steps_reached` | Article/journal lookup | 20 | Agent kept searching without convergence. | Step-budget controller and evidence verifier. |
| 13 | `72e110e7-464c-453c-a309-90a95aed6538` | `blocked` | Library database search | 12 | Structured database task blocked after long search. | Add site-specific database/search fallback. |
| 16 | `cca530fc-4052-43b2-b130-b30968d8aa44` | `error` | Chess image | 5 | Vision/chess path errored before legal move answer. | Board OCR plus chess engine verifier. |
| 18 | `4fc2f1ae-8625-45b5-ab34-ad4433bc21f8` | `plan_only_or_unknown_action` | Wikipedia history | 7 | Search did not reach nomination record and stopped. | Wikipedia page history/FAC search skill. |
| 19 | `5188369a-3bbe-43d8-8b94-11558f909a08` | `error` | Web quote lookup | 10 | Web path errored after multiple steps. | Robust fetch/archive fallback and error repair. |
| 20 | `6f37996b-2ac7-44b0-8e68-6d28256631b4` | `error` | Table/logic | 1 | Simple table reasoning should not need external tool but errored. | Add local deterministic table solver; route pure reasoning tasks away from brittle tools. |
| 24 | `a3fbeb63-0e8c-4a11-bff6-0e3b484c3e9c` | `plan_only_or_unknown_action` | PPTX counting | 6 | Presentation content extraction/counting did not produce final. | PPTX text extraction and slide-level search. |
| 26 | `9d191bce-651d-4746-be2d-7ef8ecadb9c2` | `plan_only_or_unknown_action` | YouTube quote | 2 | Transcript/video lookup failed and stopped. | YouTube transcript, ASR, and web quote fallback. |
| 28 | `cabe07ed-9eca-40ea-8ead-410ef5e83f91` | `plan_only_or_unknown_action` | OER chemistry material | 3 | Search/source lookup did not reach target exercise. | Exact source retrieval and document search. |
| 31 | `d0633230-7067-47a9-9dbf-ee11e0a2cdd6` | `plan_only_or_unknown_action` | Source changelog | 13 | Many steps but no final class/name extraction. | GitHub/source changelog search skill. |
| 32 | `305ac316-eef6-4446-960a-92d80d542f82` | `plan_only_or_unknown_action` | Entity lookup | 5 | Multi-language actor/entity lookup did not finalize. | Multi-hop entity resolver; finalizer on candidate names. |
| 33 | `0383a3ee-47a7-41a4-b493-519bdefe0488` | `error` | BBC/YouTube video | 3 | Video/web path errored. | Video transcript/frame fallback. |
| 38 | `7673d772-ef80-4f0f-a602-1bf4485c9b43` | `plan_only_or_unknown_action` | Legal text lookup | 3 | Legal page amendment lookup stopped early. | Structured legal page fetch and section diff parser. |
| 39 | `c365c1c7-a3db-4d5e-a9a1-66f56eae7865` | `plan_only_or_unknown_action` | Geography/data reasoning | 2 | Did not build/compute city extremes. | Deterministic table build plus geocoding/distance. |
| 41 | `dc22a632-937f-4e6a-b72f-ba0ff3f5ff97` | `plan_only_or_unknown_action` | Food/book multi-hop | 1 | Stopped almost immediately. | Force continued research after one-step plan. |
| 42 | `3f57289b-8c60-48be-bd80-01f8099ca449` | `plan_only_or_unknown_action` | Sports statistics | 4 | Did not query/verify baseball stats. | Sports/stat table source skill. |
| 43 | `23dd907f-1261-4488-b21c-e9185af91d5e` | `plan_only_or_unknown_action` | Poem formatting | 2 | Did not inspect poem layout/stanzas. | Text layout extraction and stanza parser. |
| 45 | `840bfca7-4f7b-481a-8794-c560c340185d` | `plan_only_or_unknown_action` | Article -> paper -> contract id | 5 | Multi-hop source chain stopped without id. | Web/PDF source chain skill and final id extractor. |
| 46 | `a0068077-79f4-461a-adfe-75c1a4148545` | `plan_only_or_unknown_action` | ClinicalTrials/NIH | 1 | Retry after runner error ended in plan-only. | ClinicalTrials.gov structured API/tool. |
| 47 | `bda648d7-d618-4883-88f4-3466eabd860e` | `plan_only_or_unknown_action` | Scientific paper/PDF | 18 | Long search did not extract depository city. | PDF text extraction and citation/source follow. |
| 49 | `cf106601-ab4f-4af9-b045-5295fe67b37d` | `plan_only_or_unknown_action` | Olympics table/code | 3 | Did not build table and apply tie-break. | Tabular sports/Olympics data extraction. |
| 50 | `a0c07678-e491-4bbc-8f0b-07405144218f` | `empty_response` | Japanese baseball roster | 4 | Runner error followed by empty response. | Retry repair plus structured roster lookup. |

## Submitted-But-Wrong Tasks

These 18 tasks reached `completed` but scored zero.

| # | Task id | Submitted | Gold | Failure type | Diagnosis | Priority fix |
| ---: | --- | --- | --- | --- | --- | --- |
| 0 | `e1fc63a2-da7a-432f-be78-7c4a95598703` | `17000` | `17` | Unit/format | Question asks thousand hours; answer submitted raw hours-thousands mismatch. | Unit-aware final validator. |
| 1 | `8e867cd7-cff9-4e6c-867a-ff5ddc2550be` | `8` | `3` | Retrieval/count | Album count extracted incorrectly from source. | Source-specific list extraction and count verifier. |
| 6 | `4b6bb5f7-f634-410e-815d-e673ab7f8632` | `CASTLE CONFESSION` | `THE CASTLE` | Search disambiguation | Confused episode/script location with adjacent wording. | Exact-script source verification. |
| 11 | `dc28cf18-6431-458b-83ef-64b3ce566c10` | `5` | `2` | Reasoning | Family/counting puzzle solved incorrectly without tool. | Route arithmetic/counting puzzles through Python/verifier. |
| 14 | `42576abe-0deb-4869-8c63-225c2d75a95a` | `Maktay Zapple Pa` | `Maktay mato apple` | Symbolic language | Fictional grammar transformation wrong. | Structured rule parser and examples. |
| 15 | `b415aba4-4b68-4fc6-9b89-2c812e55a3e1` | Conversational Chinese text | `diamond` | Final contamination | Submitted a progress sentence instead of answer. | Hard reject non-answer final text. |
| 17 | `935e2cff-ae78-4218-b3f5-115589b19dae` | `Research(...)` | `research` | Extra explanation | Correct core token buried in explanation. | Strip explanation; answer-only postprocessor. |
| 21 | `9318445f-fe6a-4e1b-acbf-c68228c9906a` | Long fraction list with extras | Shorter fraction list | OCR/list extraction | Image OCR/list extraction inserted extra items and missed order. | OCR verifier and list diff pass. |
| 22 | `389793a7-ca17-4e82-81cb-2b3a2391b4b9` | `2` | `3` | Optimization | Text-file layout/coverage calculation wrong. | Deterministic parser and solver. |
| 29 | `3cef3a44-215e-4aed-8e3b-b1e3f08063b7` | `basil, broccoli, celery, lettuce, potatoes, sweet, zucchini` | `broccoli, celery, fresh basil, lettuce, sweet potatoes` | List semantics | Included wrong items, altered item names. | Semantic filter plus canonical item preservation. |
| 30 | `99c9cc74-fdc8-46c6-8f8d-3ce2d3bfeea3` | Chinese task description | Ingredient list | Audio/final contamination | Submitted an instruction-like summary, not extracted ingredients. | ASR transcript plus answer extractor. |
| 36 | `e142056d-56ab-4352-b091-b56054bd1359` | `$26000` | `16000` | Numeric reasoning | Game-show calculation wrong and included currency symbol. | Python simulation/exact math verifier; strip units. |
| 37 | `50ad0280-0819-4bd9-b275-5de32d3b5bcb` | Uppercase sentence | Proper sentence with punctuation | Formatting | Semantically close but scorer rejected casing/punctuation. | Preserve requested sentence casing/punctuation where inferable. |
| 40 | `7d4a7d1d-cac6-44a8-96e8-ea9584a70825` | `29` | `22` | Web/time-series reasoning | Wrong year difference from source data. | Source citation plus arithmetic verifier. |
| 44 | `1f975693-876d-457b-a649-393859e79bf3` | `132,133,134,197,245` | `132, 133, 134, 197, 245` | Comma-list formatting | Content appears close but spacing differed under local scorer. | Canonical comma-list formatting. |
| 48 | `50ec8903-b81f-4257-9450-1085afd2c319` | `orange, red` | `green, white` | Combinatorics | Rubik-cube color reasoning wrong. | Deterministic combinatorics solver. |
| 51 | `7bd855d8-463d-4ed5-93ca-5fe35145f733` | `$89706.00` | `89706.00` | Currency formatting | Numeric value correct, extra `$` caused zero. | Numeric answer sanitizer. |
| 52 | `5a0c1adf-205e-4841-a666-7c3ef95def9d` | `Jin` | `Claus` | Multi-hop lookup | Wrong person from competition/nationality chain. | Source graph verification. |

## Cross-Cutting Repair Plan

### P0: Benchmark Harness Correctness

1. Add a strict benchmark finalizer:
   - Input: question, tool observations, candidate answer.
   - Output: exact final answer only.
   - Reject: Chinese narration, progress text, markdown, units not requested, unsupported explanations.
2. Convert `plan_only_or_unknown_action` into a repair loop:
   - Do not advance tasks on plan-only output.
   - Re-prompt with legal actions only.
   - If the model repeats plan-only twice, call a fallback finalizer or mark structured blocked with evidence.
3. Add answer-type validators:
   - Numeric answer: no currency/unit symbols unless requested.
   - Thousand/unit phrasing: verify unit conversion.
   - Comma-list: canonical spacing and item preservation.
   - Sentence: preserve case and punctuation if the task requests a sentence.
4. Add tool-call schema repair:
   - Include exact schema error in the next model turn.
   - Preserve prior observations during retry.
   - Provide examples for file-path tools.

### P1: Tool Coverage For GAIA-Like Tasks

1. Documents:
   - DOCX/PPTX/XLSX deterministic extractors.
   - Slide/page/paragraph counters.
   - Spreadsheet numeric aggregation with unit/currency formatting guard.
2. Media:
   - YouTube transcript first.
   - Local ASR fallback for audio/video.
   - Video frame sampling for visual counting tasks.
3. Images:
   - OCR with coordinate-preserving output.
   - Chess board recognition plus engine.
   - Table/image list extraction with a diff verifier.
4. Web/PDF:
   - Full-text fetch instead of preview-only.
   - PDF text extraction, archive fallback, exact-title search.
   - Domain skills for Wikipedia history/FAC, ClinicalTrials.gov, sports stats, legal text, GitHub changelogs.

### P2: Reasoning And Verification

1. Force local Python/verifier use for:
   - Counting puzzles.
   - Probability/combinatorics.
   - Tables and matrix operations.
   - List comparison.
2. Add answer self-check:
   - Does answer satisfy requested type?
   - Does answer have source support?
   - Is there any extra prose?
   - Can a deterministic verifier reproduce the answer?

## Recommended Next Evaluation Loop

Do not rerun all 53 immediately after small edits. Use a staged repair loop:

1. Build a 12-task regression set:
   - 4 plan-only tasks.
   - 3 final-format tasks.
   - 2 media/document tasks.
   - 2 web multi-hop tasks.
   - 1 pure reasoning/table task.
2. Require this set to pass locally before a full GAIA L1 rerun.
3. Track two scores:
   - `answer_rate`: non-empty final answers / total.
   - `exact_score`: GAIA correct / total.
4. Target next milestone:
   - Answer rate from 50.9% to above 80%.
   - Exact score from 16.98% to above 35%.

The fastest score gain should come from P0, especially final-answer guard and plan-only repair. Several misses were not deep intelligence failures; they were harness failures that submitted nothing or submitted the wrong string shape.
