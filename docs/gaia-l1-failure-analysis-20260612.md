# GAIA L1 Failure Analysis

Run id: `gaia-l1-full-retest-20260612`

Date: 2026-06-12

Scope: GAIA official validation Level 1, 53 tasks.

Artifacts:

- Summary: `F:\AILIS\eval-results\engineering\gaia-official\gaia-l1-full-retest-20260612.summary.json`
- Raw transcript JSONL: `F:\AILIS\eval-results\engineering\gaia-official\gaia-l1-full-retest-20260612.jsonl`
- Report: `F:\AILIS\eval-results\engineering\gaia-official\gaia-l1-full-retest-20260612.report.md`

## Result

| Metric | Value |
| --- | ---: |
| Total tasks | 53 |
| Correct | 17 |
| Score | 32.08% |
| Incorrect by scorer | 36 |
| Locally failed without usable answer | 28 |
| Locally completed or finalized but scored wrong | 8 |

Final status breakdown across the 36 incorrect tasks:

| Status | Count | Meaning |
| --- | ---: | --- |
| `missing_evidence` | 24 | Search or extraction never produced enough evidence to finalize. |
| `completed` | 5 | Runner produced an answer, but it was wrong or badly normalized. |
| `finalized` | 3 | Finalizer produced an answer, but it was wrong or the submission path drifted. |
| `runner_error` | 3 | Tool/runtime failure blocked the answer path. |
| `rejected_low_confidence` | 1 | The model found a candidate, but the gate rejected it as unsupported. |

## Executive Diagnosis

The benchmark is still dominated by retrieval collapse, not by one single reasoning bug.

The main failure mode is repeated `web_search` / `web_fetch` looping without closing on a verifiable source. The second biggest issue is answer handoff: some tasks reached a plausible answer, but the submitted answer diverged from the finalizer answer or lost canonical formatting. Runner failures are now a smaller bucket, but they still exist and hide the actual model quality on a few tasks.

Top tool usage across the incorrect tasks:

- `mcp__ailis_research__web_search`: 189 calls
- `mcp__ailis_research__web_fetch`: 186 calls
- `tool_search`: 63 calls
- `exec`: 56 calls
- `update_plan`: 25 calls
- `mcp__ailis_research__describe_image`: 11 calls
- `mcp__ailis_research__pdf_extract_text`: 10 calls
- `mcp__filesystem_ailis__read_media_file`: 9 calls
- `mcp__ailis_research__youtube_transcript`: 6 calls
- `mcp__ailis_research__paper_metadata_lookup`: 6 calls
- `mcp__ailis_research__read_document`: 5 calls
- `mcp__ailis_research__transcribe_audio`: 4 calls

## Failure Inventory

### Retrieval / Missing Evidence

These 24 tasks never produced enough evidence to submit a scorer-usable answer.

- `e1fc63a2-da7a-432f-be78-7c4a95598703` | Earth-Moon pace | final `17` | could not extract Moon minimum perigee from Wikipedia; web fetch kept returning truncated page previews.
- `8e867cd7-cff9-4e6c-867a-ff5ddc2550be` | Mercedes Sosa albums | final `3` | discography page was truncated before the 2000s.
- `a1e91b78-d3d8-4675-bb8d-62741b4b68a6` | YouTube bird species | final `3` | transcript failed and the agent fell back into broad web search.
- `46719c30-f4c3-4cad-be07-d5cb21eee6bb` | paper chronology / first paper | final `Mapping Human Oriented Information to Software Agents for Online Systems Usage` | multi-hop author lookup never cleanly closed.
- `4b6bb5f7-f634-410e-815d-e673ab7f8632` | Doctor Who maze | final `THE CASTLE` | repeated search/fetch loops, no clean source lock.
- `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb` | Secret Santa DOCX | final `Fred` | document reading happened, but the solver never cleanly finalized.
- `72e110e7-464c-453c-a309-90a95aed6538` | BASE country lookup | final `Guatemala` | broad web search did not converge to the country source.
- `cca530fc-4052-43b2-b130-b30968d8aa44` | chess image | final `Rd5` | vision/chess path never stabilized into a valid move submission.
- `4fc2f1ae-8625-45b5-ab34-ad4433bc21f8` | Featured Article nominator | final `FunkMonk` | history / nomination page evidence stayed partial.
- `5188369a-3bbe-43d8-8b94-11558f909a08` | Merriam-Webster quote | final `Annie Levin` | source lookup did not lock the quoted writer robustly.
- `9318445f-fe6a-4e1b-acbf-c68228c9906a` | fractions from image | final `3/4,1/4,3/4,3/4,2/4,1/2,5/35,7/21,30/5,30/5,3/4,1/15,1/3,4/9,1/8,32/23,103/170` | OCR/list extraction was incomplete and noisy.
- `65afbc8a-89ca-4ad5-8d62-355bb401f61d` | Excel map path | final `F478A7` | full 20x9 grid was never reconstructed from the partial spreadsheet observations.
- `cabe07ed-9eca-40ea-8ead-410ef5e83f91` | equine veterinarian surname | final `Louvrier` | source lookup never reached the relevant exercise block.
- `d0633230-7067-47a9-9dbf-ee11e0a2cdd6` | scikit-learn changelog | final `BaseLabelPropagation` | changelog extraction did not surface the specific patched predictor cleanly.
- `305ac316-eef6-4446-960a-92d80d542f82` | actor role chain | final `Wojciech` | cross-language entity chain stayed under-resolved.
- `7673d772-ef80-4f0f-a602-1bf4485c9b43` | Cornell LII amendment | final `inference` | the required rule page and amendment history were not fetched together.
- `c365c1c7-a3db-4d5e-a9a1-66f56eae7865` | presidents birth cities | final `Braintree, Honolulu` | geo comparison never got a reliable full city set.
- `dc22a632-937f-4e6a-b72f-ba0ff3f5ff97` | book title lookup | final `Five Hundred Things To Eat Before It's Too Late: and the Very Best Places to Eat Them` | the book metadata trail was not fully closed.
- `3f57289b-8c60-48be-bd80-01f8099ca449` | Yankees walks / at bats | final `519` | walk leader was found, but the at-bats source did not finalize.
- `23dd907f-1261-4488-b21c-e9185af91d5e` | Audre Lorde stanza number | final `2` | poem text/stanza structure was not recovered.
- `1f975693-876d-457b-a649-393859e79bf3` | sick-day study pages | final `132, 133, 134, 197, 245` | page-number extraction from the class materials was incomplete.
- `cf106601-ab4f-4af9-b045-5295fe67b37d` | Olympics country count | final `CUB` | table/tie-break logic did not settle cleanly.
- `a0c07678-e491-4bbc-8f0b-07405144218f` | pitchers around Taishō Tamai | final `Yoshida, Uehara` | roster lookup did not stabilize.
- `5a0c1adf-205e-4841-a666-7c3ef95def9d` | Malko Competition recipient | final `Claus` | nationality/recipient chain never fully closed.

### Runner Errors

These 3 tasks failed because the runtime or tool path broke before a stable answer could be submitted.

- `3cef3a44-215e-4aed-8e3b-b1e3f08063b7` | grocery list | final `broccoli, celery, fresh basil, lettuce, sweet potatoes` | runner error, not a logic verdict.
- `11af4e1a-5f45-467d-9aeb-46f4bb0bf034` | BERT layers | final `6` | runner error, answer likely recoverable with a cleaner verifier path.
- `840bfca7-4f7b-481a-8794-c560c340185d` | Universe Today paper id | final `80GSFC21M0002` | runner error / fetch failure interrupted an otherwise solvable paper chain.

### Low Confidence Rejection

- `0383a3ee-47a7-41a4-b493-519bdefe0488` | BBC Earth bird species | final `Rockhopper penguin` | the candidate was plausible, but the evidence only weakly supported it, so the gate rejected it.

### Completed Or Finalized But Wrong

These 8 tasks reached an answer path, but the answer was wrong or the handoff to the scorer was off.

- `ec09fa32-d03f-4bf8-84b0-1f16922c3ae4` | ping-pong riddle | submitted `100`, finalizer answer `3` | submission drifted away from the final answer.
- `b415aba4-4b68-4fc6-9b89-2c812e55a3e1` | Scientific Reports proceedings | submitted `quantum dots`, finalizer answer `diamond` | finalizer found the right paper class, but the submitted answer was the wrong surface form.
- `935e2cff-ae78-4218-b3f5-115589b19dae` | revision deletion policy | submitted `Revision`, finalizer answer `research` | answer selection drifted.
- `389793a7-ca17-4e82-81cb-2b3a2391b4b9` | tower spacing puzzle | submitted `4`, finalizer answer `3` | plain reasoning bug.
- `99c9cc74-fdc8-46c6-8f8d-3ce2d3bfeea3` | pie ingredient list | submitted `cornstarch, granulated sugar, lemon juice, ripe strawberries, vanilla extract` | list canonicalization and wording did not match the scorer's expected order.
- `e142056d-56ab-4352-b091-b56054bd1359` | game-show money puzzle | submitted `12000`, finalizer answer `16000` | arithmetic bug.
- `7d4a7d1d-cac6-44a8-96e8-ea9584a70825` | Girls Who Code years | submitted `26`, finalizer answer `22` | date arithmetic bug.
- `bda648d7-d618-4883-88f4-3466eabd860e` | specimen depository city | submitted `St. Petersburg`, finalizer answer `Saint Petersburg` | surface-form canonicalization issue.

## What This Means

1. The biggest loss is still evidence closure, not raw reasoning.
2. The second biggest loss is answer handoff, especially canonical formatting and submission drift.
3. Broad `web_search` / `web_fetch` loops are still the default failure spiral on source-heavy tasks.
4. `youtube_transcript`, `read_document`, `read_spreadsheet`, and `describe_image` help, but they are not yet paired with a strong enough finalizer.

## Next Repair Targets

1. Add a stricter final-answer gate that rejects narrative text and forces canonical list / number / string formats.
2. Keep the generic `tool_search` behavior intact, but make specialized tools return stronger `suggestedNextCalls` and a clearer evidence gap.
3. Add a source-closure verifier for web-heavy tasks so the agent cannot keep re-searching after the same evidence node.
4. For media and documents, keep the specific extractor first, then pass the extracted evidence into a finalizer that knows how to collapse to a single answer.
