# AILIS Artifact Tools Evaluation Plan

Version: 0.5

## Purpose

AILIS Artifact Tools should be evaluated as a local file runtime, not as a
generic document parser. Each evaluation case must prove an agent can obtain
stable structured evidence, optionally render the artifact, perform deterministic
checks, and return or export a reliable result.

## Evaluation Shape

Each case should define:

```json
{
  "id": "xlsx_map_path_color",
  "artifactKind": "workbook",
  "input": "path/to/file.xlsx",
  "goal": "answer a question or produce an edited/exported artifact",
  "requiredCapabilities": ["load", "inspect", "render", "validate"],
  "expectedEvidence": ["cell value", "fill color", "range address"],
  "expectedAnswer": "F478A7",
  "checks": ["structured equality", "render nonblank", "roundtrip reopen"]
}
```

## Core Metrics

- `answer_correct`: final answer or exported artifact matches expectation.
- `evidence_complete`: tool observations include all required fields.
- `structure_preserved`: styles, formulas, relationships, layout, or coordinates
  survive import/export.
- `render_valid`: rendered page/range/slide exists, is nonblank, and has expected
  dimensions.
- `roundtrip_valid`: exported artifact can be reopened and still contains the
  expected structure.
- `model_context_cost`: observation remains compact and queryable.
- `tool_steps`: task converges without unnecessary loops.
- `diagnostics_quality`: failures include actionable recovery hints.

## Baseline Case Families

### Workbook

1. `xlsx_map_path_color`
   - Read START/END cells, blocked fill colors, path cells, and target fill.
   - Requires exact styles and range coordinates.

2. `xlsx_formula_error_repair`
   - Detect formula errors, trace dependencies, edit formulas, export, reopen.

3. `xlsx_dashboard_visual_qa`
   - Render a dashboard range and detect clipped headers, unreadable colors, or
     blank charts.

4. `xlsx_search_index_observation`
   - Build a workbook index and search compact candidate evidence across text,
     styles, formulas, errors, tables, merges, comments, defined names, and
     package inventory.
   - Query table rows for filter/group/aggregate evidence, including hidden
     rows and image/drawing anchors.

### PDF

1. `pdf_text_layer_search`
   - Extract text spans and page coordinates without OCR.

2. `pdf_page_render`
   - Render specific pages, verify nonblank output, map text evidence to page.

3. `pdf_scanned_needs_ocr`
   - Detect no usable text layer and return `needs_ocr` rather than pretending
     the document is empty.

### DOCX

1. `docx_table_inspect`
   - Read paragraphs, headings, tables, and comments.

2. `docx_render_layout_gate`
   - Render pages and detect blank/clipped/overflow layout.

3. `docx_edit_roundtrip`
   - Apply a small edit, export, reopen, and verify.

### PPTX

1. `pptx_slide_inventory`
   - List slides, shapes, images, speaker notes, and layout/theme metadata.

2. `pptx_template_edit`
   - Duplicate/edit an existing slide while preserving visual system.

3. `pptx_render_contact_sheet`
   - Render slide previews and verify nonblank outputs.

### CSV / Plain Tables

1. `csv_schema_inference`
   - Detect delimiter, encoding, headers, types, and malformed rows.

2. `csv_transform_export`
   - Apply a deterministic transform and export a clean table.

## Evaluation Harness Design

The harness is data-driven:

```text
evals/artifact-tools/cases/*.json
evals/artifact-tools/fixtures/
scripts/prepare-artifact-tools-fixtures.mjs
scripts/run-artifact-tools-eval.mjs
```

Current commands:

```bash
pnpm eval:artifact-tools:prepare
pnpm eval:artifact-tools:plan
pnpm eval:artifact-tools:run
pnpm test:ailis-artifact-tools
```

The harness:

1. Loads the case manifest and chooses the registered adapter.
2. Runs `artifact_tools.run_checks`.
3. Performs structure checks against each case's `expected` block.
4. Writes render outputs under `eval-results/artifact-tools/renders/`. XLSX
   cases use real PNG range renders; CSV, PDF, DOCX, and PPTX currently use
   deterministic structural SVG previews.
5. Reopens an exported or copied artifact under
   `eval-results/artifact-tools/roundtrip/`.
6. Emits a compact text or JSON report with status, diagnostics, render paths,
   and roundtrip paths.

The first real fixture set covers:

- `xlsx_map_path_color`: real XLSX with exact fills and a unique non-blue path.
- `xlsx_formula_style_inspect`: real XLSX with tables, formulas, styles,
  validation, merges, and a known formula error.
- `xlsx_edit_export_roundtrip`: real XLSX declaration edits followed by export
  and reopen checks.
- `xlsx_render_trace_recalculate`: real XLSX range render, formula dependency
  trace, pre-recalculation edit, local formula recalculation, export, and
  reopen checks.
- `xlsx_search_index_observation`: real XLSX index/search case covering text,
  style, formula, formula error, table, merge, comment, defined name, hidden
  row, image inventory, image anchor search, and table query/aggregate checks.
- `pdf_text_layer_search`: real minimal PDF with a text layer.
- `docx_render_layout_gate`: real DOCX with paragraphs and a table.
- `pptx_render_contact_sheet`: real PPTX with two slides.
- `csv_schema_inference`: dirty CSV with malformed row diagnostics.

## Acceptance Rule

No adapter is "supported" until it passes at least:

- one structure-only case,
- one render or validation case,
- one failure/recovery case,
- one roundtrip case if the adapter supports edits or export.

This rule keeps AILIS from accumulating shallow parsers that look useful but fail
real agent tasks.

## Current Limitations

- XLSX is the priority adapter. Other formats are intentionally shallow until
  XLSX reaches the first-stage contract in the system design.
- XLSX render checks now produce PNG range renders through the XLSX adapter.
  Non-XLSX render checks still produce deterministic SVG structural previews,
  not final Poppler/LibreOffice page images.
- XLSX now has declaration-style edit/export/reopen checks. CSV has meaningful
  export/reopen checks. PDF, DOCX, and PPTX
  currently use copy/reopen roundtrip until edit/export adapters exist.
- XLSX formula tracing and recalculation are covered by the baseline harness,
  but recalculation is currently the narrow AILIS local formula engine, not a
  complete Excel-compatible engine.
- XLSX search/query is now covered by the baseline harness and returns compact
  candidate evidence for hidden rows, image anchors, and table aggregates. The
  current index is process-local and file-signature cached; it is not yet a
  durable cross-session artifact database.
- DOCX/PPTX structure inspection reads OOXML package parts through a local
  Python zip helper. This is deliberately lighter than a neural document-AI
  stack, but it is not yet a full Office object model.
