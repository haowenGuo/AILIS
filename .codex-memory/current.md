# Codex Memory Checkpoint

Date/time: 2026-06-20 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`
Git state: latest committed work includes `115fbd9` for product-grade `web_research` query planning, evidence scoring, diagnostics, and routing. Active patch comes from testing `{做一个小光的攻略}` and tightens exact-query de-duplication plus target-entity coverage. Stage only active-task files because the repo has many unrelated historical changes.

## Objective
- Make AILIS web research safer, more Codex-like, and more generic.
- `web_search` should rank results, expose confidence, and ask the user when a short/ambiguous target is not safe to follow.
- Build an AILIS-owned search system with quality closer to SearXNG/Firecrawl/Crawl4AI: discovery, aggregation, fetch, extraction, evidence quality, and model-facing bundles.
- Use SearXNG/Firecrawl/Crawl4AI as local open-source references for search quality ideas, not as mandatory deployed services or hosted APIs.

## Latest User Intent
- User clarified that they do not want a Docker/deployment solution.
- Desired direction: reference SearXNG, Firecrawl, and Crawl4AI search optimization ideas, then migrate useful mechanisms into AILIS with minimal large-scale changes.
- User clarified the true goal: "建立一套质量类似SearXNG/Firecrawl/Crawl4AI的搜索系统".
- Avoid writing task-specific hacks; preserve generality.

## Current State
- `scripts\mcp-ailis-research-server.cjs`
  - New `web_research` tool provides an end-to-end evidence-bundle entrypoint: `web_search` -> candidate selection -> `web_fetch` on top high-signal HTML/text pages -> `evidencePages` with `answerReadiness`, `evidenceQuality`, `htmlRelations`, `suggestedNextCalls`, and `evidenceGap`.
  - Active patch adds query planning for `web_research`: original query, effective term rewrite, and exact phrase variants when there is enough context.
  - Query expansion is adaptive: high-confidence results with fetch candidates stop early by default; `expandQueries:true` can force all planned variants.
  - Search results from query variants are merged, de-duplicated, re-ranked, and surfaced with `searchQueries` / `searchAggregation.queryPlan` diagnostics.
  - Fetched pages now get `evidenceScore`, `evidenceScoreBreakdown`, and `evidenceSnippets`, then are sorted by evidence quality rather than raw search order.
  - Active patch preserves exact-query quote semantics during query-plan de-duplication, so `绝区零 叶瞬光 小光 攻略` can expand to `绝区零 "叶瞬光" "小光" 攻略`.
  - Active patch adds target-entity coverage checks. Multi-entity guide tasks no longer treat broad source/homepage pages as ready evidence unless a specific target term is covered strongly or all required specific target terms are present.
  - `pipelineSteps` records query planning, search outcomes, candidate ranking, and fetch/evidence-quality diagnostics.
  - `web_research` stops before fetching when `searchConfidence` requires clarification, preserving the existing short-nickname ambiguity guard.
  - Default `web_search` provider chain remains `searxng_json -> firecrawl_search -> bing_html -> duckduckgo_lite -> duckduckgo_html -> yahoo_html`.
  - GitHub/code queries still keep `github_repositories` first.
  - Search results now preserve `sourceBackends`, `sourceEngines`, and source rank metadata.
  - Result ranking includes a small source-consensus score, inspired by meta-search result merging.
  - Auto/provider-chain mode can aggregate multiple successful providers when the first success is off-target, then de-duplicate, re-rank, and return a single observation.
  - Short ambiguous guide queries still stop for clarification instead of broadening blindly.
  - Hosted Firecrawl remains disabled; `FIRECRAWL_API_KEY` is not used by the main AILIS research MCP.
  - `web_fetch` still probes optional Crawl4AI Markdown output and falls back to built-in HTML/text extraction.
- `scripts\setup-ailis-local-web-stack.ps1`
  - Now source-only: clones/downloads SearXNG, Firecrawl, and Crawl4AI under `.local\ailis-web-stack\src`.
  - Writes `sources.json` and `README.md` provenance/reference notes.
  - Does not create deployment files, runtime env files, or service startup flows.
  - Notes licenses: SearXNG/Firecrawl are AGPL-family, Crawl4AI is Apache-2.0.
- Local source code is present on this machine:
  - `.local\ailis-web-stack\src\searxng`
  - `.local\ailis-web-stack\src\firecrawl`
  - `.local\ailis-web-stack\src\crawl4ai`
- `electron\ailis-tool-routing.cjs`
  - Public/current information tasks now prefer `web_research` while preserving `web_search` fallback when `web_research` is unavailable.
  - Routing advice tells the model to use `web_research` for guide/latest/research evidence tasks and bare `web_search` only for discovery-only result lists.

## Validation
- `node --check scripts\mcp-ailis-research-server.cjs`: passed.
- `node --check electron\ailis-tool-routing.cjs`: passed.
- `node --test tests\mcp-ailis-research-server.test.mjs`: 56/56 passed.
- `node --test tests\ailis-tool-layer.test.mjs`: 17/17 passed.
- Real `webResearch({query:"做一个小光的攻略"})`: returned `clarification_required`, `needs_clarification`, no pages fetched.
- Real `webResearch({query:"绝区零 叶瞬光 小光 攻略"})`: generated exact target query; current live Bing fallback still returns broad ZZZ pages, now marked `off_target_evidence` / `needs_followup` instead of false-ready.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-local-web-stack.ps1 -Root .local\ailis-web-stack-source-smoke -NoClone`: passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-local-web-stack.ps1 -Root .local\ailis-web-stack -NoClone`: refreshed the real local source README/manifest.

## Known Constraints
- The local source repositories are references. AILIS does not require those projects to be running to use its built-in search/fetch fallbacks.
- Direct code copying from SearXNG/Firecrawl needs AGPL compliance review. Prefer reimplementing portable ideas unless the project intentionally accepts those obligations.
- The repo has many unrelated historical changes; do not stage broad rename/build artifacts unless the user explicitly asks.

## Next Actions
1. Stage only active files for this task.
2. Commit the target-coverage follow-up patch.
3. Restart AILIS if the user wants to test the full UI/agent loop.

## Do Not Forget
- User prefers direct execution and default commits.
- Do not reveal API keys or tokens.
- Keep future logs summarized; avoid dumping long transcripts into chat.
