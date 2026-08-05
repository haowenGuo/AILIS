# AILIS Artifact Tools Architecture

Version: 0.5

Reference design:
`C:\Users\Lenovo\Documents\New project 9\ARTIFACT_TOOLS_SYSTEM_DESIGN.md`

## Position

AILIS Artifact Tools is a local engineering-grade file runtime for agents. Its
core job is not "extract text from files" and not "run a document AI model".
Its core job is to let the agent reliably open, inspect, edit, render, validate,
trace, diff, and export complex user artifacts.

This supersedes the earlier idea of treating RAGFlow, Docling, MinerU, or other
document-AI projects as the core artifact runtime. Those systems may remain
optional parser or OCR backends, but the core AILIS runtime must be deterministic,
offline-first, format-aware, and built around file object models.

## Design Principles

1. Artifact-first, not parser-first.
   The agent works with stable artifact sessions and canonical entities, not raw
   ZIP/XML/PDF internals or RAG chunks.

2. Native structure before text.
   XLSX means sheets, ranges, formulas, fills, comments, charts, validations,
   images, drawings, and workbook relationships. DOCX means paragraphs, runs,
   tables, sections, headers, footers, comments, fields, and relationships.

3. Render is a first-class capability.
   Visual QA is required for layout, clipping, sheet maps, decks, pages, charts,
   and exported deliverables.

4. Editing is declarative and auditable.
   Tools should express operations such as `range.setValues`,
   `paragraph.insertAfter`, `slide.shape.update`, and record operation envelopes.

5. Validation is built in.
   Artifact work is not complete until formula errors, blank outputs, broken
   relationships, render failures, and layout diagnostics have been checked.

6. Adapters are format-specific.
   XLSX, DOCX, PPTX, PDF, CSV, HTML, and images share a runtime protocol, but
   each adapter owns its real file-format details.

7. Evaluation drives implementation.
   New capability is accepted through concrete artifact tasks and roundtrip
   checks, not through broad claims about a parser library.

## Runtime Layers

```text
Agent / LLM
  -> Tool API Layer
  -> Artifact Runtime
  -> Canonical Artifact Model
  -> Adapter Registry
     -> XLSX Adapter
     -> DOCX Adapter
     -> PPTX Adapter
     -> PDF Adapter
     -> CSV Adapter
     -> Image Adapter
  -> Inspect / Edit / Render / Validate / Export / Trace / Diff Engines
  -> Local storage, render cache, operation log, diagnostics
```

## Canonical Object Model

The object model is intentionally small at the core. Format adapters can attach
format-specific data under `native`.

### Artifact

```json
{
  "id": "art_...",
  "kind": "workbook|document|presentation|pdf|table|image|bundle",
  "format": "xlsx|docx|pptx|pdf|csv|png",
  "sourcePath": "F:/...",
  "createdAt": "ISO timestamp",
  "summary": "short model-facing description",
  "metadata": {},
  "capabilities": ["inspect", "render", "validate", "export", "trace"]
}
```

### Entity

Entities are addressable units inside an artifact:

- `page`
- `sheet`
- `slide`
- `range`
- `table`
- `text_run`
- `paragraph`
- `image`
- `shape`
- `chart`
- `formula`
- `comment`
- `relationship`
- `resource`

Each entity has:

```json
{
  "id": "ent_...",
  "artifactId": "art_...",
  "kind": "range",
  "locator": "Sheet1!A1:D20",
  "label": "optional model-facing label",
  "bounds": {},
  "style": {},
  "content": {},
  "native": {}
}
```

### Operation Envelope

Every edit, render, validation, export, trace, or diff operation is recorded:

```json
{
  "id": "op_...",
  "artifactId": "art_...",
  "action": "inspect|edit|render|validate|export|trace|diff",
  "target": "Sheet1!A1:D20",
  "status": "planned|completed|failed",
  "startedAt": "ISO timestamp",
  "finishedAt": "ISO timestamp",
  "input": {},
  "output": {},
  "diagnostics": []
}
```

### Diagnostic

Diagnostics must be actionable:

```json
{
  "code": "formula_error|render_failed|layout_overflow|blank_output",
  "severity": "info|warning|error|fatal",
  "target": "Sheet1!F12",
  "message": "Cell contains #REF!",
  "recoverable": true,
  "suggestedActions": ["inspect formula precedents", "recalculate workbook"]
}
```

## Tool API Surface

The stable Agent-facing API should converge on these actions:

- `artifact.load`
- `artifact.summary`
- `artifact.index`
- `artifact.inspect`
- `artifact.search`
- `artifact.query`
- `artifact.aggregate`
- `artifact.edit`
- `artifact.render`
- `artifact.validate`
- `artifact.export`
- `artifact.trace`
- `artifact.diff`
- `artifact.list_adapters`
- `artifact.plan_import`

Existing AILIS tools map into this surface:

| Current Tool | Target Role |
| --- | --- |
| `read_xlsx_workbook` | XLSX adapter read/inspect bootstrap |
| `artifact_query` | Query engine over registered sessions |
| `artifact_compute` | Deterministic compute engine |
| `artifact_tools` | Adapter registry, inspect/render/roundtrip/eval entry point |
| `artifact_import` | Legacy/context import entry point |
| RAGFlow-lite bridge | Optional table/RAG chunk backend, not core |

## Adapter Contract

Each adapter declares:

```json
{
  "id": "xlsx",
  "formats": ["xlsx", "xlsm"],
  "kinds": ["workbook"],
  "capabilities": ["load", "index", "inspect", "search", "query", "edit", "render", "validate", "export", "trace", "recalculate", "rollback"],
  "engines": {
    "parser": "exceljs/openpyxl/ooxml",
    "renderer": "native-canvas/libreoffice",
    "validator": "artifact-runtime"
  },
  "evaluationCases": ["gaia_xlsx_map", "financial_model_roundtrip"]
}
```

Adapters must not expose raw internal library objects to the model. They emit
canonical artifacts, entities, operations, diagnostics, and compact observations.

## Evaluation Method

Every capability needs at least one concrete artifact task:

| Case | Required Capabilities |
| --- | --- |
| XLSX map path | load, inspect range/styles, compute path, render range |
| XLSX finance model | formulas, dependencies, validation, export roundtrip |
| DOCX structured report | paragraphs, tables, render pages, layout QA |
| PPTX template edit | import, duplicate/edit shapes, render slides, export |
| PDF text/layout | text spans, page render, coordinate search |
| PDF scanned fallback | render page, detect missing text layer, optional OCR |
| CSV dirty data | schema inference, search, transform, export |

Acceptance should use deterministic checks first:

- roundtrip reopen
- cell/style equality
- formula-error scan
- page/slide/image render exists and is nonblank
- layout diagnostics
- output file opens through the chosen parser
- compact model-facing observation stays within budget

## Implementation Phases

### Phase 0: Architecture Skeleton

- Canonical model helpers.
- Adapter registry.
- Runtime session envelopes.
- Operation/diagnostic/evaluation schemas.
- Tests proving the skeleton can register adapters and plan imports.

### Phase 1: Runtime Entry Point

- New `artifact_tools` or upgraded `artifact_import` registry entry point.
- `list_adapters`, `schema`, `plan_import`, `open_session`.
- Keep existing `read_xlsx_workbook` and `artifact_query` working.

### Phase 2: Cross-Format Minimal Adapters

- XLSX adapter maps existing workbook payloads into canonical entities.
- PDF adapter maps text-layer extraction and page render metadata.
- DOCX/PPTX adapters start with structure + render roundtrip.

### Phase 3: Render And Validate

- Local render workers for sheet ranges, PDF pages, DOCX pages, PPTX slides.
- Validation gates and diagnostics.
- Render cache and operation logs.

### Phase 4: Edit And Export

- Declarative edits.
- Roundtrip export and reopen validation.
- Trace/diff.

## Non-Goals For Core Runtime

- Do not make RAG chunks the canonical artifact model.
- Do not require OCR or neural layout models for ordinary Office/PDF files.
- Do not make Docling/MinerU/Marker mandatory dependencies.
- Do not copy or reverse engineer private OpenAI `@oai/artifact-tool` code.
- Do not dump raw XML/JSON/binary payloads into model context.

## Current Implementation State

Phase 0 is implemented:

- `electron/ailis-artifact-tools-model.cjs`
- `electron/ailis-artifact-tools-runtime.cjs`
- `tests/ailis-artifact-tools-runtime.test.mjs`

Phase 1 and the first slice of Phase 2 are now connected:

- `electron/ailis-artifact-tools-adapters.cjs`
- `scripts/prepare-artifact-tools-fixtures.mjs`
- `scripts/run-artifact-tools-eval.mjs`
- `tests/ailis-artifact-tools-eval.test.mjs`
- `evals/artifact-tools/cases/baseline.cases.json`

The current executable adapters cover:

| Adapter | Current Checks |
| --- | --- |
| XLSX | workbook/sheet/range inspect, cached index, compact observation, cell/text/style/formula/error/table/merge/comment/defined-name/relationship/image/hidden search, table query/aggregate, values, fills, styles, formulas, formula errors, tables, merges, hidden rows/columns/sheets, data validations, drawing/image anchors, OOXML relationships, map path compute, declaration edits, operation log, rollback backup, export, cached PNG range render, render nonblank check, formula trace with defined-name expansion, local formula recalculation, native export/reopen |
| CSV | headers, inferred column types, malformed rows, SVG preview, normalized export/reopen |
| PDF | text-layer spans from simple text operators, page count, SVG preview, copy/reopen |
| DOCX | OOXML text runs and table count, SVG preview, copy/reopen |
| PPTX | slide XML inventory and text runs, SVG contact sheet, copy/reopen |

XLSX now has a first real adapter surface:

- `index` builds a cached workbook index keyed by file signature. It summarizes
  sheets, cells, formulas, formula errors, styles, comments, defined names, and
  lightweight OOXML package inventory including tables, relationships, drawings,
  image anchors, hidden rows/columns, and hidden or veryHidden sheets.
- `inspect` supports workbook summaries and targeted `sheet`, `range`,
  `table`, `style`, `formula`, `comment`, `definedName`, `relationship`,
  `chart`, `image`, `shape`, and `visibility` inventory views.
- `search` returns compact candidate evidence over cell text/values, styles,
  formulas, formula errors, tables, merges, comments, defined names,
  relationships, drawings, charts, images, image anchors, and hidden structure.
- `query` and `aggregate` reconstruct Excel table rows from indexed table
  ranges, then perform deterministic filter, group, sum, max, min, average, and
  count operations while returning row/range evidence.
- `observation` payloads are compact model-facing summaries rather than raw
  workbook dumps.
- `validate` scans formula errors such as `#REF!` and reports diagnostics.
- `render` uses a cached local XLSX range-to-PNG worker for workbook ranges and
  records a simple visual nonblank check. CSV, PDF, DOCX, and PPTX still use
  deterministic structural SVG previews.
- `edit` supports declaration-style operations:
  `sheet.add`, `range.setValues`, `range.setFormulas`, `range.setStyles`,
  `range.clear`, `range.merge`, and `range.unmerge`. It records operation logs,
  dirty ranges, affected objects, and a backup-based rollback handle.
- `rollback` restores an edit from the recorded backup path.
- `export` writes `.xlsx` and reopens the output for validation.
- `trace` builds a compact formula dependency graph for targeted formula cells,
  including cross-sheet cell/range references and defined-name targets.
- `recalculate` runs the current AILIS local formula engine, updates cached
  formula results, exports, and reopens the workbook.
- `run_checks` can execute an XLSX edit/export/roundtrip case from the eval
  manifest.

The current recalculation engine is intentionally narrow. It supports the first
GAIA-useful slice: cell references, cross-sheet references, bounded ranges,
`SUM`, and basic arithmetic. It is not a full Excel-compatible calculation
engine. LibreOffice is probed as an optional future backend, but it is not
installed in the current Windows environment.

The current XLSX adapter has passed the local "ultimate complex workbook" smoke
test for hidden rows, veryHidden sheets, defined-name trace, image anchors,
formula errors, and table aggregations. Next XLSX work should deepen fidelity
before broadening other formats:

- Turn the current file-signature index into durable searchable artifact
  sessions shared with `artifact_query`.
- Add LibreOffice/Excel recalculation fallback for broader formula coverage.
- Deepen charts, shapes, conditional formatting, hyperlinks, pivot tables,
  filters/slicers, workbook protection, and theme/computed-style fidelity.
- Add real diff and richer rollback/inverse-operation support.
- Add failure fixtures for broken formulas, invalid matrix writes, blank render
  outputs, and style/roundtrip regressions.
