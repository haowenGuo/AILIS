# Codex Memory Checkpoint

Date/time: 2026-06-20 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`
Git state: active web-search confidence/provider-chain patch ready to commit; stage only active-task files because the repo has many unrelated historical changes.

## Objective
- Make AILIS web research safer and more Codex-like.
- `web_search` should rank results, expose confidence, and require user clarification when a short/ambiguous target is not safe to follow.
- `web_search/web_fetch` should use the upgraded provider chain: SearXNG JSON, Firecrawl search, current HTML fallback, and Crawl4AI Markdown fetch when available.

## Latest User Intent
- "重要的是搜索结果要做一个排序，如果大模型判断置信度不够高，应该向用户进行询问，不该一路执行下去。并且把web_search/web_fetch 链路真正升级到 SearXNG/Firecrawl/Crawl4AI"

## Current State
- `scripts\mcp-ailis-research-server.cjs`
  - Default `web_search` provider chain is `searxng_json -> firecrawl_search -> bing_html -> duckduckgo_lite -> duckduckgo_html -> yahoo_html`.
  - GitHub/code queries still keep `github_repositories` first.
  - `AILIS_WEB_SEARCH_PROVIDER` supports `auto`, `searxng`, `firecrawl`, `html/current_html_fallback`, `external`, `github`, or comma-separated backend ids.
  - `AILIS_SEARXNG_URL` / `SEARXNG_URL` configure SearXNG. Unconfigured local SearXNG is short-probed at `http://127.0.0.1:8080`.
  - Hosted Firecrawl uses `FIRECRAWL_API_KEY`; self-hosted Firecrawl uses `AILIS_FIRECRAWL_URL` / `FIRECRAWL_BASE_URL`.
  - `web_fetch` auto short-probes local/configured Crawl4AI (`AILIS_CRAWL4AI_URL`, `CRAWL4AI_URL`, or `http://127.0.0.1:11235`) and falls back to current HTML/text extraction.
  - Chinese guide-like natural queries now produce a backend search query, e.g. `做一个小光的攻略` -> `小光 攻略`, while retaining the original query for confidence/diagnostics.
  - Search results now include `searchConfidence`, `clarificationRequired`, `candidateChoices`, `backendQuery`, and ranked relevance data.
- `electron\ailis-turn-items.cjs`
  - Nested MCP adapter details are unwrapped, including `structuredContent.result.structuredContent`.
  - Low-confidence/ambiguous web search is classified as `evidence_gap=ambiguous_search_requires_clarification`.
- `electron\ailis-agent-runner.cjs`
  - Both JSON executor and native direct-tool prompts now tell AILIS to stop web_search/web_fetch loops and ask the user when that evidence gap appears.

## Validation
- `node --check scripts\mcp-ailis-research-server.cjs`: passed.
- `node --check electron\ailis-turn-items.cjs`: passed.
- `node --check electron\ailis-agent-runner.cjs`: passed.
- `node --test tests\mcp-ailis-research-server.test.mjs`: 47/47 passed.
- `node --test tests\ailis-turn-items.test.mjs tests\ailis-tool-layer.test.mjs`: 25/25 passed.
- `node --test tests\ailis-agent-runner.test.mjs`: 3/3 passed.
- Real `webSearch({ query: "做一个小光的攻略" })` used `backendQuery: "小光 攻略"`, attempted `searxng_json` then `firecrawl_search` then `bing_html`, returned `clarificationRequired: true`, and produced no `suggestedNextCalls`.

## Known Problems
- This machine currently has no reachable local SearXNG at `127.0.0.1:8080` and no `FIRECRAWL_API_KEY`, so live default search still falls back to HTML until those services/keys are configured.
- Ambiguous short nicknames are now stopped for clarification rather than guessed, but final answer quality still depends on the model obeying the prompt and the UI surfacing the clarification naturally.

## Next Actions
1. Stage active files only.
2. Commit the patch.
3. Restart AILIS to test the full agent loop from UI/runtime.

## Do Not Forget
- User prefers direct execution and default commits.
- Do not reveal API keys or tokens.
- Keep future logs summarized; avoid dumping long transcripts into chat.
