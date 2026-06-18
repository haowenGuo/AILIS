# Codex Memory Checkpoint

Date/time: 2026-06-18, Asia/Shanghai
Workspace: F:\AILIS_self_evolution_runtime
Git state: branch AILIS-self-evolution, dirty worktree with many pre-existing local changes; do not revert unrelated user changes.

## Objective
- Continue AILIS Agent runtime optimization from a source-backed plan based on Codex and Claude Code.
- Implement generic runtime infrastructure, not brittle business-specific fixes.

## Latest User Intent
- User asked to return to the real large-text mainline instead of expanding XLSX-specific fixes.
- Implement three generic layers: discoverable Exec Output Store tools, generic `text_artifact`, and generic `document_artifact`.
- Keep following `docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md`: Codex/Claude Code-style generic runtime, not hardcoded GitHub/XLSX/Windows patches.

## Current State
- Source-backed plan exists at `docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md` and is about 51KB.
- Existing AILIS Context/Artifact Runtime v1 is present:
  - `electron/humanclaw-context-artifact-store.cjs`
  - `artifact_query`
  - `read_xlsx_workbook`
  - generated artifact raw-read guard
- First doc-based optimization slice is implemented:
  - `artifact_query grid/range` now emits structured spreadsheet `coverage` metadata.
  - Complete, non-truncated, reasoning-ready artifact observations are pinned into `record.metadata.pinnedEvidence`.
  - Subsequent narrower range queries that are covered by older pinned evidence return normal values plus `coveredByEvidence`, instead of hard-blocking.
  - Agent evidence artifacts and Codex-like turn items now preserve `artifactId`, `sheet`, `range`, `coverage`, `complete`, `truncated`, `reasoningReady`, `pinnedEvidenceId`, and `coveredByEvidence`.
- Second doc-based optimization slice is implemented:
  - New direct runtime tool `artifact_compute`.
  - `artifact_compute profile` summarizes managed spreadsheet artifacts without dumping payloads.
  - `artifact_compute find_path` runs deterministic grid path search over spreadsheet artifacts with parameter-driven start/end/passable/blocked constraints.
  - The tool is exposed through runtime definitions, contracts, tool_search routing, Agent capability catalog, Agent contract text, Gateway `/tools/call`, and tests.
- Third doc-based optimization slice is implemented:
  - New generic `evidence_sufficiency` prompt object in both JSON planner and native direct tool executor payloads.
  - `evidence_sufficiency` is derived only from generic tool result fields: `complete`, `truncated`, `reasoningReady`, `artifactId`, `coverage`, `coveredByEvidence`, and compact compute result metadata.
  - The gate recommends reasoning/final when ready evidence exists, and warns against repeating covered artifact/range reads. It does not classify task domains or hard-block tools.
- Fourth large-text optimization slice is implemented:
  - `output_read`, `output_tail`, and `output_search` are now deferred/discoverable instead of hidden when the experimental direct surface is off.
  - `exec_command` truncated previews now tell the model to use `tool_search` for output-store tools and then query by `outputId`, instead of rerunning commands or treating `outputId` as a file path.
  - Large `.txt/.log/.md/.json/.jsonl/.csv/.tsv/.xml/.yaml/.yml/.toml` reads can create managed `text_artifact` records with preview, counts, and query hints.
  - `.docx` and `.pdf` reads try to create managed `document_artifact` records before falling back to binary-file guidance.
  - `artifact_query` now supports text/document actions: `text_schema`, `text_range`, `text_search`, `text_tail`, `document_schema`, `document_search`, `document_page`, and `document_section`.
- Fifth PDF-engine slice is implemented:
  - Added `pdfjs-dist@6.0.227` as the primary PDF parser.
  - Added `electron/humanclaw-pdf-document-engine.cjs` with PDF.js text/page/metadata extraction, page sections, and a legacy minimal-PDF fallback.
  - `computer.read` now calls the async PDF engine for `.pdf` before creating `document_artifact`.
  - Gateway PDF test helper now generates a valid xref PDF instead of an invalid pseudo-PDF.
- Sixth scanned-PDF/OCR guard slice is implemented:
  - PDF.js `pdf_no_text_extracted` now becomes `scanned_pdf_needs_ocr` and no longer falls through to `basic_pdf_stream_text_fallback`.
  - `computer.read` catches `scanned_pdf_needs_ocr` in both document parse branches and returns a structured OCR-needed error with `tool_search` guidance.
  - Scanned/image-only PDFs no longer create fake `DOCUMENT_ARTIFACT_CREATED` payloads from PDF image-stream garbage.
- Current runtime already contains partial environment/context/tool-search/output-store/artifact work, but it needs cleanup and deeper generic behavior.

## Decisions And Constraints
- Keep `runtime_environment` in per-run/turn context, not long-term memory.
- Do not convert Unix commands to PowerShell with brittle regexes. Teach the model through accurate runtime environment/tool contract and execute exactly what it asks.
- Large outputs and large structured files should be stored and queried, not pasted whole into model context.
- Tool failures should return structured, human-readable causes, not fixed generic apology text.
- Do not store API keys, tokens, passwords, or provider secrets in checkpoint files.

## Files And Artifacts
- `docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md`: detailed Codex/Claude Code-backed optimization plan.
- `electron/humanclaw-agent-runner.cjs`: Agent prompts, planner/execution loop, tool selection, evidence artifacts, sanitizer.
- `electron/humanclaw-gateway.cjs`: HTTP gateway and Agent Lab event payloads.
- `electron/humanclaw-tool-runtime.cjs`: local tool runtime and dispatch.
- `electron/humanclaw-computer-tool.cjs`: computer/read/exec tool implementation.
- `electron/humanclaw-tool-contracts.cjs`: tool contracts/schemas.
- `electron/ailis-tool-specs.cjs`: tool catalog/spec exposure.
- `electron/ailis-tool-routing.cjs`: tool discovery/routing metadata.

## Commands And Results
- `git -C F:\AILIS_self_evolution_runtime branch --show-current`: `AILIS-self-evolution`.
- `git -C F:\AILIS_self_evolution_runtime status --short`: many existing modified/untracked files; patch only relevant runtime/docs/tests.
- Read `early-memory-compaction` skill and refreshed this checkpoint before continuing.
- `node --check electron\humanclaw-context-artifact-store.cjs`: passed.
- `node --check electron\humanclaw-evidence-artifacts.cjs`: passed.
- `node --check electron\humanclaw-turn-items.cjs`: passed.
- `node --test tests\humanclaw-xlsx-workbook-tool.test.mjs tests\humanclaw-agent-execution-flow.test.mjs`: passed, 8 tests.
- `node --test tests\humanclaw-gateway.test.mjs`: passed, 7 tests.
- `node --test tests\humanclaw-xlsx-workbook-tool.test.mjs`: passed.
- `node --test tests\humanclaw-tool-contracts.test.mjs`: passed.
- `node --test tests\ailis-tool-layer.test.mjs`: passed.
- `node --test tests\humanclaw-agent-execution-flow.test.mjs`: passed.
- `node --test tests\humanclaw-gateway.test.mjs`: first run had an unrelated transient `exec` child-process assertion at line 144; immediate rerun passed all 7 tests.
- `node --test tests\humanclaw-runtime.test.mjs`: passed.
- `node --check electron\humanclaw-computer-tool.cjs`: passed.
- `node --check electron\humanclaw-context-artifact-store.cjs`: passed.
- `node --check electron\humanclaw-tool-contracts.cjs`: passed.
- `node --check electron\ailis-tool-specs.cjs`: passed.
- `node --check electron\humanclaw-agent-runner.cjs`: passed.
- `node --test tests\ailis-tool-layer.test.mjs tests\humanclaw-tool-contracts.test.mjs`: passed, 12 tests.
- `node --test tests\humanclaw-gateway.test.mjs`: passed, 8 tests, includes text/document artifact creation and querying.
- `node --test tests\humanclaw-computer-tool.test.mjs`: passed, 4 tests.
- `node --check electron\humanclaw-pdf-document-engine.cjs`: passed.
- `node --check electron\humanclaw-computer-tool.cjs`: passed after PDF.js integration.
- `node --test tests\humanclaw-pdf-document-engine.test.mjs`: passed, 2 tests, verifies PDF.js multi-page extraction and fallback for legacy minimal PDFs.
- `node --test tests\humanclaw-gateway.test.mjs`: passed after valid-PDF helper upgrade.
- `node --test tests\humanclaw-computer-tool.test.mjs`: passed after PDF.js integration.
- `node --test tests\ailis-tool-layer.test.mjs tests\humanclaw-tool-contracts.test.mjs`: passed after PDF.js integration.
- `node --test tests\humanclaw-pdf-document-engine.test.mjs`: passed, 3 tests after scanned-PDF guard.
- `node --test tests\humanclaw-gateway.test.mjs`: passed, 8 tests after scanned-PDF guard.
- `node --test tests\humanclaw-computer-tool.test.mjs`: passed, 4 tests after scanned-PDF guard.
- Manual scanned-image PDF regression on `tmp/pdfs/complex-pdf-regression/synthetic_scanned_image_only.pdf`: `computer.read` returned `status=scanned_pdf_needs_ocr`, no `DOCUMENT_ARTIFACT_CREATED`, and suggested `tool_search` for OCR/page-render/vision tools.
- Manual GAIA XLSX regression on `gaia-practice-tasks\task2-excel-map.xlsx`:
  - `tool_search` ranked `read_xlsx_workbook` first.
  - `read_xlsx_workbook` created `ctx-spreadsheet-*` artifact; model-facing read summary was about 2.5KB and did not expose `fullJsonPath`.
  - Stored artifact payload was about 109KB; raw payload read was blocked by `context_artifact_raw_read_blocked`.
  - `artifact_query grid A1:I20` returned complete/non-truncated/reasoning-ready coverage with about 1.9KB model-facing text.
  - `artifact_compute find_path` found a 64-address path avoiding blue cells; step 22 / turn 11 landed on `E3`.
  - `artifact_query range E3:E3` returned `F478A7`, matching the task gold answer.
- `node --test tests\humanclaw-agent-execution-flow.test.mjs`: passed with evidence sufficiency coverage.
- `node --test tests\humanclaw-llm-planner.test.mjs`: passed, 23 tests, verifies planner payload includes `evidence_sufficiency`.
- `node --test tests\humanclaw-xlsx-workbook-tool.test.mjs tests\ailis-tool-layer.test.mjs tests\humanclaw-tool-contracts.test.mjs`: passed, 13 tests.
- `node --test tests\humanclaw-gateway.test.mjs`: passed.
- `node --test tests\humanclaw-runtime.test.mjs`: passed.

## Known Problems
- PowerShell access was previously slow in this thread, but the latest commands completed.
- Worktree is dirty from prior work. Treat unrelated files as user/pre-existing changes.
- `electron/humanclaw-context-artifact-store.cjs`, `electron/humanclaw-pdf-document-engine.cjs`, `tests/humanclaw-pdf-document-engine.test.mjs`, `.codex-memory/current.md`, and `docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md` are currently untracked; include them if committing this runtime.
- PDF.js now handles real PDF text/page extraction. Scanned/image-only PDFs are correctly rejected as OCR-needed instead of fake text artifacts; OCR execution itself is still a future tool/backend layer.
- The XLSX regression proves the large-table artifact/query layer works for the previous GAIA map task. It does not by itself prove every live LLM run will choose the correct tools on the first attempt; that requires a full Agent run with the configured model.

## Next Actions
1. Optionally run an end-to-end Agent task against a large `.log/.json/.csv/.pdf/.docx` and inspect whether the model discovers query tools naturally.
2. Extend Agent Lab to show output-store/text/document artifact query chains and evidence sufficiency graph.
3. Add OCR and table-structure extraction for scanned/image-only PDFs and complex tables if required by GAIA-style tasks.
4. Keep avoiding task-specific classifiers and business-specific success/failure rules.

## Do Not Forget
- User strongly dislikes hardcoded classifier-like fixes and wants Codex/Claude Code style standard Agent runtime code.
- Explain changes in plain Chinese and distinguish observed source references from inferred architecture.
