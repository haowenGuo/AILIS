# Codex Memory Checkpoint

Date/time: 2026-06-20 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`
Git state: based on `3f15c9d` (`Improve AILIS web search relevance reranking`); provider-chain implementation is complete and ready to commit. Worktree has many unrelated historical changes, so stage only files touched for the active task.

## Objective
- Upgrade AILIS `web_search` from fragile built-in HTML scraping toward an agent-grade provider chain.
- Requested provider order: `searxng_json -> firecrawl_search -> current_html_fallback`.
- Add config: `AILIS_SEARXNG_URL`, `AILIS_WEB_SEARCH_PROVIDER`, optional `FIRECRAWL_API_KEY`.
- Default behavior: if local SearXNG is available, prefer its JSON API and avoid Bing HTML scraping.
- `web_fetch`: add Crawl4AI support when configured, fallback to current fetch/extract otherwise.

## Latest User Intent
- Implement the above provider chain and Crawl4AI fallback direction in AILIS.
- Keep generic quality, do not hardcode the previous "小光" task.

## Current State
- `scripts\mcp-ailis-research-server.cjs` now supports `searxng_json` and `firecrawl_search` backends plus the old HTML fallback chain.
- Default `web_search` provider chain is `searxng_json -> firecrawl_search -> bing_html -> duckduckgo_lite -> duckduckgo_html -> yahoo_html`.
- GitHub/code repository queries still keep `github_repositories` first, then the new provider chain.
- `AILIS_WEB_SEARCH_PROVIDER` supports `auto`, `searxng`, `firecrawl`, `html/current_html_fallback`, `external`, `github`, or comma-separated backend ids.
- `AILIS_SEARXNG_URL` / `SEARXNG_URL` configure SearXNG. If unset, AILIS briefly probes `http://127.0.0.1:8080` with a short timeout so users without SearXNG do not wait a full backend timeout.
- `FIRECRAWL_API_KEY` enables hosted Firecrawl; self-hosted Firecrawl can use `AILIS_FIRECRAWL_URL` / `FIRECRAWL_BASE_URL`.
- `web_fetch` can use Crawl4AI Markdown through `AILIS_CRAWL4AI_URL` / `CRAWL4AI_URL`, or explicit `provider: "crawl4ai"`, and falls back to current HTML/text extraction on failure.

## Decisions And Constraints
- Keep the new relevance reranker as the common post-processing layer across all providers.
- Add external providers as optional runtime backends, not mandatory dependencies.
- Do not remove current HTML fallback yet; use it as compatibility fallback.
- Do not store API keys in this checkpoint or logs.
- Use `apply_patch` for manual edits and commit when done unless the user explicitly says not to.

## Files And Artifacts
- `scripts\mcp-ailis-research-server.cjs`: provider normalization, SearXNG JSON backend, Firecrawl search backend, Node JSON fetch helper, Crawl4AI Markdown fetch path, and updated tool schemas.
- `tests\mcp-ailis-research-server.test.mjs`: provider-chain, SearXNG JSON, Firecrawl fallback, Crawl4AI success, and Crawl4AI fallback regressions.
- `.runtime-logs\xiaoguang-rerank-summary-20260620_093040.json`: previous real task retest showed remaining failure was entity disambiguation, not result reranking.

## Commands And Results
- `node --check scripts\mcp-ailis-research-server.cjs`: passed.
- `node --test tests\mcp-ailis-research-server.test.mjs`: 45/45 passed.
- `node --test tests\ailis-tool-layer.test.mjs tests\ailis-turn-items.test.mjs`: 24/24 passed.
- Local SearXNG check at `http://127.0.0.1:8080/search?q=ailis&format=json`: unavailable/timed out on this machine, so current runtime will fall back unless SearXNG is started or `AILIS_SEARXNG_URL` points elsewhere.

## Known Problems
- Broad ambiguous nicknames such as "小光" still need entity disambiguation in a later change.
- Some PowerShell commands in this large repo can be slow; use narrow `git -C ...` commands.

## Next Actions
1. Stage only `.codex-memory/current.md`, `scripts/mcp-ailis-research-server.cjs`, and `tests/mcp-ailis-research-server.test.mjs`.
2. Commit the provider-chain implementation.
3. If the user wants live validation, start/configure SearXNG or Firecrawl, restart AILIS, then rerun the real strategy/Kaggle task.
4. Later separate fix: add short-nickname entity disambiguation for tasks like "小光攻略".

## Do Not Forget
- User prefers direct execution and default commits.
- Avoid verbose logs in chat; summarize only.
- Never reveal local API keys or tokens.
