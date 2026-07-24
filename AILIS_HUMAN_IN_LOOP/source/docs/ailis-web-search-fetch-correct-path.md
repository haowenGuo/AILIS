# AILIS Web Search / Web Fetch Correct Path

Date: 2026-06-20

## Why The Chain Got Worse

The recent failure was not just "Bing is bad" or "the model is dumb". The broken part was the retrieval chain:

1. Search produced a mixed result set where broad official/home pages appeared before target-specific guide pages.
2. The search merge stage truncated raw results before reranking, so lower-ranked but relevant pages were lost.
3. `web_research` then fetched broad pages even when target terms were missing.
4. Fetch candidates were not diversified by host, so one JavaScript-heavy site could consume the whole page budget.
5. A fetched long page could look "complete" even if it was not answer-bearing for the target entity.

This means search quality must be controlled at every step, not only by adding more providers.

## What Good Systems Do

SearXNG shows the value of a real search API surface: structured parameters, engine/category selection, and JSON output. Its docs also warn that query syntax such as `site:` is passed to underlying search services, so not every engine honors it the same way. A robust agent search layer must treat provider results as candidates, not truth.

Reference: https://docs.searxng.org/dev/search_api.html

Firecrawl's search design combines discovery and optional page content retrieval. It supports web/news/image sources, search categories such as GitHub/research/PDF, domain include/exclude filters, and a search-then-scrape pattern. The important idea is not "call Firecrawl", but "separate discovery, filtering, scraping, and evidence packaging".

Reference: https://docs.firecrawl.dev/features/search

Firecrawl scrape emphasizes LLM-ready markdown and handling hard pages such as JS-rendered pages, PDFs, images, and dynamic content. That maps to AILIS as a fetch escalation policy: simple static fetch first, rendered extraction when static fetch returns a shell, and document/media tools for non-HTML.

Reference: https://docs.firecrawl.dev/features/scrape

Crawl4AI's useful ideas are content selection, markdown generation, link references, BM25/pruning filters, CSS/target element extraction, and preserving structured metadata/links. AILIS should return an evidence bundle with text, links, headings, tables, metadata, and quality labels, rather than dumping raw HTML text into the model.

References:
- https://docs.crawl4ai.com/core/markdown-generation/
- https://docs.crawl4ai.com/core/content-selection/

OpenAI's hosted web search design emphasizes citations, source metadata, and tunable search context. The agent should not just receive noisy snippets; it should receive a controlled evidence surface with source accounting.

Reference: https://platform.openai.com/docs/guides/tools-web-search

## Correct AILIS Direction

AILIS should keep `web_search`, `web_fetch`, and `web_research`, but their contract should be:

1. Query planning: preserve literal user intent, add exact entity variants, add vertical/source-focused variants only when context is specific enough.
2. Candidate collection: collect a wide pool, deduplicate, preserve source metadata, and never truncate before reranking.
3. Relevance gates: for multi-entity tasks, a result that only matches broad context terms is not a fetch candidate.
4. Fetch selection: diversify hosts before spending multiple fetches on one domain.
5. Fetch extraction: classify `sufficient_evidence`, `partial_evidence`, `off_target_evidence`, `js_shell`, `access_denied`, etc.
6. Controller behavior: if confidence is low or no answer-bearing page exists, stop and ask or report the gap; do not loop blindly.

## Patch Applied In This Pass

This pass implements the first repair slice:

1. Added search-result target coverage so results missing specific target terms are not considered relevant.
2. Penalized broad context-only pages before follow-up selection.
3. Stopped `web_research` from fetching irrelevant ranked results just to fill `maxPages`.
4. Added source-focused guide query variants for specific CJK guide tasks.
5. Expanded the web research merge pool so relevant lower-ranked results are not truncated before reranking.
6. Diversified fetch candidates by host so one JS-heavy domain cannot consume the whole budget.
7. Added regression coverage for broad-page rejection and host-diverse fetch selection.

## Validation Snapshot

Task: `绝区零 叶瞬光 小光 攻略`

Before: broad official/BWiki home pages were fetched or marked as off-target only after wasting the fetch budget.

After: search keeps target-specific pages such as TapTap/Bilibili/Miyoushe/Gamersky/BWiki candidates; fetch diversification retrieves at least one readable guide page; `answerReadiness` becomes `ready` when enough page evidence is available.

The remaining weakness is rendered extraction for JS-heavy sites such as Miyoushe/HoYoLAB. The next major upgrade should make `web_fetch` escalate from static fetch to rendered/Crawl4AI-style extraction when static fetch returns a shell.
