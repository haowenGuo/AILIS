# AILIS Standard Tool Packs

Date: 2026-06-14

## Goal

Stop optimizing one benchmark/task at a time. AILIS should import mature tool backends as standard packs, compile them into canonical contracts, expose only verified callable tools, and keep auth-required/local tools visible as contract-only until smoke validation passes.

## Packs

| Pack | Purpose | Default callable |
| --- | --- | --- |
| `email_productivity_pack` | Gmail API, Microsoft Graph mail, Composio Gmail fallback | No. Requires OAuth/auth profiles. |
| `document_reader_pack` | Docling, MarkItDown, and lightweight Python document extraction contracts | `python_document_extract` can become callable after local dependency smoke. |
| `web_retrieval_pack` | Firecrawl, Tavily, Jina Reader adapter contract | No by default. Requires API keys or adapter. |
| `academic_metadata_pack` | OpenAlex, Crossref, Semantic Scholar metadata | OpenAlex/Crossref/Semantic Scholar public read-only contracts are callable. |
| `media_transcription_pack` | YouTube search/metadata, transcript, ASR, cookies, frame fallback contract | `youtube_video_search` is MCP-local when yt-dlp is installed; transcript may still need cookies/ASR. |

## Commands

Dry-run compile/lint/exposure:

```bash
node scripts/setup-ailis-standard-tool-packs.mjs --dry-run
```

Write exposure state:

```bash
pnpm ailis:setup-standard-tool-packs
```

Expose only public read-only tools:

```bash
node scripts/setup-ailis-standard-tool-packs.mjs --write --public-only
```

Expose selected packs:

```bash
node scripts/setup-ailis-standard-tool-packs.mjs --write --pack academic_metadata_pack,document_reader_pack
```

Expose auth/local adapters and run smoke verification:

```bash
pnpm ailis:setup-standard-tool-packs:verify
```

Run tests:

```bash
pnpm test:ailis-standard-tool-packs
```

## Runtime Behavior

- `search_tool_candidates` now includes standard tool pack candidates.
- `tool_search` can surface standard public OpenAPI tools such as OpenAlex and Crossref as `external__provider__tool`.
- `expose_standard_tool_packs` imports packs through the existing contract compiler/linter and writes verified exposure state.
- Auth-required tools remain non-callable unless `enableAuthRequiredAdapters` is explicitly used and auth profiles are configured.
- Local adapter tools remain non-callable until `enableLocalAdapters` and `verifyAdapters` pass dependency smoke.
- No API keys or tokens are stored in pack definitions. Auth profiles reference env vars only.
- `read_document` now emits `DOCUMENT_READ_COMPLETE`, completeness counts, `fullTextPath`, and structured `document.paragraphs/tables` so the agent can stop reading raw DOCX/ZIP after a successful parse.
- `youtube_video_search` resolves title/channel clues to YouTube URLs through local yt-dlp. `youtube_transcript` classifies anti-bot/cookie failures as `anti_bot_blocked` instead of a generic failure.
- `paper_metadata_lookup` author-history calls now carry both `authorId` and author name, and its answer candidate includes title variants for metadata sources that lower-case or hyphenate titles.
- External HTTP executor failures include normalized recovery affordance:
  - HTTP 429 -> `failureReason: "rate_limited"` with retry/backoff and alternate-source guidance.
  - HTTP 403 -> `failureReason: "forbidden_or_blocked"` with guidance to switch to official APIs, metadata mirrors, or authenticated access instead of query rewrites.
  - HTTP 401 -> `failureReason: "authentication_required"` and auth-profile setup guidance.

## Current Smoke Findings

- `pnpm ailis:setup-standard-tool-packs:verify` promoted public OpenAlex/Crossref/Semantic Scholar contracts and local `python_document_extract`; Gmail/Graph/Composio/Firecrawl/Tavily remained `needs_config`; Docling/MarkItDown remained `missing_dependency`.
- Real yt-dlp search smoke resolved `BBC Earth Top 5 Silliest Animal Moments` to `https://www.youtube.com/watch?v=2Njmx-UuU3M`.
- Real transcript smoke for that URL returned `anti_bot_blocked`, because YouTube required browser cookies; this is an access/cookie/backend issue, not a query wording problem.
- GAIA targeted retest after the YouTube affordance change passed `0383a3ee-47a7-41a4-b493-519bdefe0488` with `Rockhopper penguin`.
- GAIA targeted retest after paper author disambiguation/title candidates passed `46719c30-f4c3-4cad-be07-d5cb21eee6bb`.
- GAIA Secret Santa DOCX retest changed from `missing_evidence` to a submitted answer, but the answer was still wrong (`Tyson` vs gold `Fred`); remaining issue is document reasoning/QA, not raw DOCX extraction.

## Auth Profiles

Examples:

```json
{
  "action": "configure_external_auth_profile",
  "authProfileId": "gmail-oauth",
  "provider": "openapi",
  "authType": "bearer_env",
  "envVar": "GMAIL_ACCESS_TOKEN"
}
```

```json
{
  "action": "configure_external_auth_profile",
  "authProfileId": "composio-main",
  "provider": "composio",
  "authType": "composio_api_key_env",
  "envVar": "COMPOSIO_API_KEY",
  "baseUrl": "https://backend.composio.dev/api/v3"
}
```

## Maintenance Rule

When a task fails, do not immediately add task-specific routing. First classify the failure against the pack layer:

1. Missing backend: add a mature backend contract to a pack.
2. Bad schema: improve the contract/lint examples and bad examples.
3. Tool not callable: add auth/adapter/smoke, then expose.
4. Agent did not pick it: improve pack keywords/search text and tool affordance.
5. Tool returned insufficient evidence: improve structured output or recovery hints.
