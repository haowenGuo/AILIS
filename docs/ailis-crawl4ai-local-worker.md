# AILIS Crawl4AI Local Worker

Date: 2026-06-22

AILIS should treat Crawl4AI as the default mature rendering/extraction backend for difficult web pages, not as a Docker-only side service.

## Runtime Shape

```text
web_search / web_research
  -> candidate URLs
  -> web_fetch
     -> local Crawl4AI worker first when enabled or explicitly requested
     -> legacy Crawl4AI HTTP URL only when configured
     -> builtin fetch/extract fallback when Crawl4AI is unavailable
```

The local worker is `scripts/ailis-crawl4ai-worker.py`. It calls the Python `crawl4ai` package directly with `AsyncWebCrawler`, then returns JSON containing Markdown, links, metadata, and structured failure information.

## Install Without Docker

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-crawl4ai.ps1
```

This creates `.ailis-runtime/crawl4ai-venv`, installs `crawl4ai`, and installs Playwright Chromium.

To force AILIS to use that venv:

```powershell
$env:AILIS_CRAWL4AI_PYTHON = "$PWD\.ailis-runtime\crawl4ai-venv\Scripts\python.exe"
$env:AILIS_CRAWL4AI_ENABLED = "1"
```

## Configuration

- `AILIS_CRAWL4AI_ENABLED=1`: enable full local Crawl4AI worker use in auto mode.
- `AILIS_CRAWL4AI_WORKER`: override worker script path.
- `AILIS_CRAWL4AI_PYTHON`: override Python executable.
- `AILIS_CRAWL4AI_URL`: legacy HTTP service base URL, only for users who intentionally run a Crawl4AI service.
- `AILIS_WEB_FETCH_PROVIDER=builtin`: disable Crawl4AI and use the builtin fetch/extract path.

## Tool Behavior

- `web_fetch({ provider: "crawl4ai" })` forces local rendered Crawl4AI extraction unless a legacy `crawl4aiUrl` is supplied.
- `web_fetch({ provider: "builtin" })` disables rendered fallback.
- `web_research` passes the Crawl4AI worker/python settings down to `web_fetch`, so search-selected pages benefit automatically.
- If the Python package is missing, the worker returns `crawl4ai_missing_dependency` with install commands, and `web_fetch` safely falls back to builtin extraction instead of submitting empty evidence.

## Why This Replaces Further Hand-Rolled HTML Optimization

The goal is not to keep adding custom HTML heuristics. Crawl4AI provides the mature browser/render/Markdown layer. AILIS should focus on evidence-chain orchestration: candidate ranking, source disambiguation, PDF routing, evidence cards, and final-answer verification.
