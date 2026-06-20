# Codex Memory Checkpoint

Date/time: 2026-06-20 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`
Git state: latest committed web-search confidence patch is `66355a8`; active follow-up patch changes Firecrawl to local/open-source only and adds a local web stack setup script. Stage only active-task files because the repo has many unrelated historical changes.

## Objective
- Make AILIS web research safer and more Codex-like.
- `web_search` should rank results, expose confidence, and require user clarification when a short/ambiguous target is not safe to follow.
- `web_search/web_fetch` should use the upgraded provider chain: SearXNG JSON, Firecrawl search, current HTML fallback, and Crawl4AI Markdown fetch when available.
- Use local/open-source SearXNG, Firecrawl, and Crawl4AI code rather than hosted Firecrawl or extra cloud keys.

## Latest User Intent
- "重要的是搜索结果要做一个排序，如果大模型判断置信度不够高，应该向用户进行询问，不该一路执行下去。并且把web_search/web_fetch 链路真正升级到 SearXNG/Firecrawl/Crawl4AI"
- Follow-up correction from user: use open-source code locally; do not call hosted Firecrawl or introduce another API key. AILIS LLM API/key is unrelated to these local retrieval services.

## Current State
- `scripts\mcp-ailis-research-server.cjs`
  - Default `web_search` provider chain is `searxng_json -> firecrawl_search -> bing_html -> duckduckgo_lite -> duckduckgo_html -> yahoo_html`.
  - GitHub/code queries still keep `github_repositories` first.
  - `AILIS_WEB_SEARCH_PROVIDER` supports `auto`, `searxng`, `firecrawl`, `html/current_html_fallback`, `external`, `github`, or comma-separated backend ids.
  - `AILIS_SEARXNG_URL` / `SEARXNG_URL` configure SearXNG. Unconfigured local SearXNG is short-probed at `http://127.0.0.1:8080`.
  - Firecrawl now defaults to local/self-hosted `http://127.0.0.1:3002`; hosted `https://api.firecrawl.dev` is blocked with `firecrawl_cloud_disabled`.
  - `FIRECRAWL_API_KEY` is not used by the main AILIS research MCP.
  - `web_fetch` auto short-probes local/configured Crawl4AI (`AILIS_CRAWL4AI_URL`, `CRAWL4AI_URL`, or `http://127.0.0.1:11235`) and falls back to current HTML/text extraction.
  - Chinese guide-like natural queries now produce a backend search query, e.g. `做一个小光的攻略` -> `小光 攻略`, while retaining the original query for confidence/diagnostics.
  - Search results now include `searchConfidence`, `clarificationRequired`, `candidateChoices`, `backendQuery`, and ranked relevance data.
- `electron\ailis-turn-items.cjs`
  - Nested MCP adapter details are unwrapped, including `structuredContent.result.structuredContent`.
  - Low-confidence/ambiguous web search is classified as `evidence_gap=ambiguous_search_requires_clarification`.
- `electron\ailis-agent-runner.cjs`
  - Both JSON executor and native direct-tool prompts now tell AILIS to stop web_search/web_fetch loops and ask the user when that evidence gap appears.
- `scripts\setup-ailis-local-web-stack.ps1`
  - Clones/downloads open-source SearXNG, Firecrawl, and Crawl4AI code under `.local\ailis-web-stack\src`.
  - Generates local endpoint env files and a Docker compose file for SearXNG + Crawl4AI.
  - Starts Firecrawl from its cloned source compose when `-Start` is used.
  - Handles flaky GitHub git clone by falling back to codeload zip, and excludes Windows-invalid SearXNG Linux template paths.
- Local source has been downloaded on this machine:
  - `.local\ailis-web-stack\src\searxng`
  - `.local\ailis-web-stack\src\firecrawl`
  - `.local\ailis-web-stack\src\crawl4ai`

## Validation
- `node --check scripts\mcp-ailis-research-server.cjs`: passed.
- `node --check electron\ailis-turn-items.cjs`: passed.
- `node --check electron\ailis-agent-runner.cjs`: passed.
- `node --test tests\mcp-ailis-research-server.test.mjs`: 49/49 passed after local-only Firecrawl tests.
- `node --test tests\ailis-turn-items.test.mjs tests\ailis-tool-layer.test.mjs`: 25/25 passed.
- `node --test tests\ailis-agent-runner.test.mjs`: 3/3 passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-local-web-stack.ps1 -Root .local\ailis-web-stack-smoke2 -NoClone`: passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-local-web-stack.ps1 -Root .local\ailis-web-stack`: succeeded; GitHub git clone was unstable, but zip fallback downloaded the sources.
- Real `webSearch({ query: "做一个小光的攻略" })` used `backendQuery: "小光 攻略"`, attempted `searxng_json` then `firecrawl_search` then `bing_html`, returned `clarificationRequired: true`, and produced no `suggestedNextCalls`.

## Known Problems
- Local source code is present, but Docker services have not been started in this turn. Until SearXNG/Firecrawl/Crawl4AI are running on their local ports, live search still falls back to current HTML providers.
- Ambiguous short nicknames are now stopped for clarification rather than guessed, but final answer quality still depends on the model obeying the prompt and the UI surfacing the clarification naturally.

## Next Actions
1. Stage active files only.
2. Commit the patch.
3. To start local retrieval services later, run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-local-web-stack.ps1 -Root .local\ailis-web-stack -Start`.
4. Restart AILIS to test the full agent loop from UI/runtime.

## Do Not Forget
- User prefers direct execution and default commits.
- Do not reveal API keys or tokens.
- Keep future logs summarized; avoid dumping long transcripts into chat.
