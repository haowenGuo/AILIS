# Codex-Style Network Retrieval Playbook

This document describes a public, reproducible retrieval architecture that matches the direction of OpenAI Codex guidance without claiming access to private implementation details. It combines:

- Public OpenAI/Codex docs about tools, internet access, MCP, and `AGENTS.md`
- Official API guidance from scholarly data providers
- The concrete implementation points in this repository

The goal is simple: for network-heavy tasks, especially GAIA-style research questions, the agent should prefer narrow, structured tools over broad `web_search`, preserve evidence in machine-readable form, and treat `403` or `429` as routing signals rather than “search harder” prompts.

## Public Codex Signals

OpenAI’s public docs consistently point in the same direction:

- Codex cloud tasks default to restricted internet access and can be configured with an allowlist. That means internet retrieval should be explicit and narrow, not an uncontrolled first move.
  Source: [Internet access](https://developers.openai.com/codex/cloud/internet-access)
- Codex uses `AGENTS.md` to provide durable repository instructions and task guidance.
  Source: [AGENTS.md](https://developers.openai.com/codex/local-config)
- Codex can dynamically load only the relevant tools for a task instead of exposing the whole tool surface at once.
  Source: [Tools](https://developers.openai.com/codex/cloud/tools)
- OpenAI’s general tool guidance emphasizes direct tool use, remote MCP servers, and structured tool definitions rather than free-form browsing.
  Source: [Responses API tools guide](https://developers.openai.com/api/docs/guides/tools)

The reproducible takeaway is not “copy Codex internals.” It is:

1. Keep the internet surface narrow.
2. Route by artifact or domain first.
3. Expose specific tools before generic search.
4. Preserve structured evidence all the way to finalization.

## The Architecture To Reproduce

### 1. Intent-first routing

Before the model sees a large tool list, classify the task into one of a few retrieval modes:

- Exact scholarly title or DOI
- Known webpage URL
- Known PDF URL or local PDF
- Word, spreadsheet, presentation, audio, image, or GitHub artifact
- Broad public discovery

Important boundary: do not turn the global `tool_search` implementation into a paper-specific parser. `tool_search` should stay a general deferred-tool discovery mechanism. Domain interpretation belongs inside the domain tool or its model-visible affordance:

- `paper_metadata_lookup` may normalize raw scholarly clues into `author`, `year`, `topic`, and `venue`.
- `web_search`, `web_fetch`, and `web_extract_links` may return `suggestedNextCalls` and `evidenceGap`.
- The runner may rank artifact-specific tools above `web_search` through routing metadata.
- The global tool index should not learn benchmark-specific paper fields that could degrade non-paper tasks.

Repository mapping:

- [ailis-tool-routing.cjs](F:/AILIS/electron/ailis-tool-routing.cjs)
- [ailis-mcp-session.cjs](F:/AILIS/electron/ailis-mcp-session.cjs)
- [ailis-gateway.cjs](F:/AILIS/electron/ailis-gateway.cjs)
- [ailis-tool-runtime.cjs](F:/AILIS/electron/ailis-tool-runtime.cjs)

### 2. Structured retrieval before HTML scraping

For paper and report questions, the first retrieval action should be metadata lookup from scholarly APIs, not `web_search` and not direct publisher scraping.

Default order:

1. `paper_metadata_lookup`
2. `pdf_find_and_extract`
3. `pdf_extract_text`
4. `web_fetch`
5. `web_search`

Why this order:

- Metadata lookup gives authors, year, DOI, venue, and likely landing/PDF URLs without hitting fragile publisher HTML.
- Fuzzy bibliographic clues such as author/year/topic/venue should be accepted by `paper_metadata_lookup` directly. If the model only passes a raw scholarly query, the tool can infer those fields internally instead of requiring `tool_search` to produce paper-shaped JSON.
- A second `paper_metadata_lookup` hop with `authorId` can list an author’s earlier works chronologically without falling back to generic search.
- If the upstream API is already sorted chronologically, for example OpenAlex author works with `sort=publication_date:asc`, preserve that order for “first paper” questions instead of re-ranking by relevance score afterward.
- Full-text extraction is only needed after metadata disambiguation.
- `web_search` is low precision for exact-title academic tasks and is easily polluted by common words.

Repository mapping:

- [mcp-ailis-research-server.cjs](F:/AILIS/scripts/mcp-ailis-research-server.cjs)
- [run-gaia-level1-lite.mjs](F:/AILIS/scripts/run-gaia-level1-lite.mjs)

### 3. Site policy awareness

Different domains need different treatment:

- `OpenAlex`: preferred structured scholarly index. Use an API key when available and avoid raw HTML scraping.
  Source: [OpenAlex API](https://docs.openalex.org/api-entities/works/search-works)
- `Crossref`: preferred DOI metadata source. Use polite-pool style contact information when available.
  Source: [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- `Semantic Scholar`: use the API with a key and explicit rate limiting; do not treat it like a generic fetch target.
  Sources: [Semantic Scholar API](https://www.semanticscholar.org/product/api), [Tutorial](https://www.semanticscholar.org/product/api/tutorial), [License](https://www.semanticscholar.org/product/api/license)
- `Google Scholar`: not a stable automated backend. Expect unusual-traffic challenges and avoid it as a default machine path.
  Source: [Google unusual traffic help](https://support.google.com/websearch/answer/86640?hl=en)
- Publisher pages such as ACM: metadata first, publisher HTML second. `403` usually means access control or anti-automation, not that the network is broken.

### 4. Error taxonomy, not generic failure

Every retrieval tool should return machine-readable failure states. These are routing instructions:

- `requires_auth` or `access_denied_403`
- `rate_limited_429`
- `bot_challenge`
- `unsupported_content_type`
- `no_results`
- `partial_evidence`
- `timeout_budget_exhausted`

Behavior rules:

- Do not retry the same publisher page repeatedly after `403`.
- Do not loop on the same API after `429`; back off or switch source.
- Do not read raw `.docx` or `.pptx` bytes when a dedicated parser already succeeded.
- Do not promote a preview string above the structured payload that produced it.

### 5. Structured evidence must survive to the finalizer

This is the part many agents get wrong. A narrow tool can succeed, yet the task still fails because the finalizer only sees a truncated preview.

Required rule:

- If a tool returns structured content, the evidence digest must prefer that structured content over `content[0].text`.

That matters for:

- `read_document`
- `read_spreadsheet`
- `read_presentation`
- API-backed tools such as ClinicalTrials and scholarly metadata
- `pdf_find_and_extract`, especially when the answer is a short word near a small evidence phrase. The tool should surface `answerCandidates`, `evidenceSnippets`, and PDF URL in structured form before long extracted text.

Repository mapping:

- [run-gaia-level1-lite.mjs](F:/AILIS/scripts/run-gaia-level1-lite.mjs)

### 6. Validate on traces, not just unit tests

Passing tests only prove code shape. For retrieval systems, we need three levels:

1. Unit tests for parser/tool behavior
2. Transcript inspection to verify the actual tool order
3. GAIA re-runs to verify end-to-end improvement

The acceptance question is:

Did the agent choose the right tool first, keep structured evidence intact, and avoid repeated low-value fallbacks?

## Concrete Routing Policy

Use this table directly.

| Task shape | First tool | Second tool | Fallback |
| --- | --- | --- | --- |
| Exact paper title or DOI | `paper_metadata_lookup` | `pdf_find_and_extract` | `web_search` |
| Known PDF URL | `pdf_extract_text` | `download_file` | none |
| Known HTML URL | `web_fetch` | `web_extract_links` | `web_search` |
| Word document | `read_document` | `run_python_file` only if parser failed | never raw binary read |
| Spreadsheet | `read_spreadsheet` | `run_python_file` only if computation is missing | never preview-only final answer |
| Presentation | `read_presentation` | image or OCR fallback if needed | no broad search |
| YouTube/video | transcript tool | frame extraction / vision fallback | `web_search` last |
| GitHub repo | `github_repo_read` | `web_search` only to discover repo | none |
| Broad fresh public fact | `web_search` | `web_fetch` | alternate backend |

## Implementation Checklist For This Repo

### Already implemented

- Intent-aware tool ranking that demotes `web_search` for artifact-specific tasks
- `paper_metadata_lookup` as a first-hop scholarly metadata tool
- `paper_metadata_lookup` now supports fuzzy bibliographic discovery from `author`, `year`, `topic`, and `venue` clues, not only exact title / DOI lookups
- `paper_metadata_lookup` can infer those bibliographic fields internally from a raw scholarly query, so `tool_search` remains generic
- Author chronology mode now preserves OpenAlex publication order instead of re-ranking same-year works by score
- `read_document` now returns full structured content, not only raw JSON text
- GAIA evidence digestion now prefers structured DOCX evidence
- `pdf_find_and_extract` now uses rare evidence-term weighting, OJS article/download discovery, and quoted-word answer candidates so title quotes do not outrank body evidence
- `pdf_find_and_extract` now uses DOI-aware scholarly candidates before generic document search, including OpenAlex DOI locations and arXiv DOI Atom entries
- `pdf_find_and_extract` now separates internal extraction length from returned text-window length, so late acknowledgements/funding sections can be found without dumping huge PDFs into the model
- `pdf_find_and_extract` now extracts award/grant/identifier candidates near evidence terms such as author initials, NASA, award, grant, or contract
- GAIA evidence digestion now preserves structured PDF `answerCandidates` / `evidenceSnippets`
- GAIA prompt/finalizer now preserve exact article dates for web/news discovery; month-only broadening is treated as a risk when the question gives an exact day
- `web_search`, `web_fetch`, and `web_extract_links` now return `suggestedNextCalls`, `evidenceGap`, and `recoveryHint` so the agent sees the next concrete move without benchmark-specific routing
- `web_search` now re-ranks candidates by query overlap and treats obviously off-target result sets as a diagnosis signal; for scholarly-looking queries it suggests `paper_metadata_lookup` instead of encouraging more blind clicks
- Search backend fallback continues past parsed but off-target result sets and includes Yahoo HTML parsing, which recovered Fafnir/OJS pages missed by earlier backends

### Next recommended steps

1. Add a keyed `Semantic Scholar` adapter with 1 RPS throttling and `Retry-After` handling.
2. Add video frame extraction after `youtube_transcript` failure.
3. Add guards that block raw `.docx`, `.pptx`, and `.xlsx` binary reads when a dedicated parser exists.
4. Add title surface-form normalization for exact-answer scoring on scholarly metadata titles, without changing the returned source title.
5. Add trace assertions in GAIA regression runs:
   - exact-title paper questions should start with `paper_metadata_lookup`
   - DOCX questions should not fall back to raw binary reads after successful `read_document`
   - repeated `web_search` after `403` or `429` should be treated as a regression

## Minimal Reproduction Recipe

If we wanted to rebuild the same pattern from scratch:

1. Put routing rules and failure policy in `AGENTS.md`.
2. Expose only narrow MCP tools with clear schemas.
3. Add a ranking layer that lifts domain-specific tools above generic search without changing global `tool_search` semantics.
4. Make each tool return both readable text and structured payloads.
5. Teach the finalizer to prefer structured payloads.
6. Evaluate with transcript inspection plus GAIA, not tests alone.

That is the closest public, reproducible version of the Codex approach that we can safely implement here.
