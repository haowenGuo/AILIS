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

## Product Packaging

AILIS release packages should include an application-private web runtime so end users do not need to install Python, uv, pip, Playwright, or Crawl4AI manually.

Packaging flow:

```powershell
pnpm ailis:web-runtime:prepare
pnpm desktop:package:win
```

`pnpm ailis:web-runtime:prepare` prepares `build-cache/ailis-web-runtime` from the developer/runtime cache and `electron-builder.yml` packages it as `resources/ailis-web-runtime`. This is a build-time step, not a first-run user install step.

If the existing `.ailis-runtime/crawl4ai-venv` is tied to a system Python such as Anaconda, the prepare script rebuilds it with uv-managed private Python before packaging. The prepared runtime can include:

- `crawl4ai-venv`: the ready-to-run Crawl4AI worker environment.
- `python`: optional portable/private Python copied from `.ailis-runtime/python` or `build-cache/ailis-web-runtime-source/python`.
- `uv`: optional private uv copied from `.ailis-runtime/uv` or `build-cache/ailis-web-runtime-source/uv`.
- `ms-playwright`: private Playwright browser cache used by Crawl4AI for rendered extraction.

If private Python cannot be downloaded or preseeded, packaging should fail rather than silently shipping a non-portable system-Python venv. Release builders can preseed `.ailis-runtime/python` or `build-cache/ailis-web-runtime-source/python` in offline environments.

At runtime, `web_fetch` resolves Crawl4AI Python in this order:

1. Explicit tool args or env vars: `crawl4aiPython`, `AILIS_CRAWL4AI_PYTHON`, `AILIS_PYTHON`.
2. Packaged runtime: `process.resourcesPath/ailis-web-runtime/crawl4ai-venv`, then `process.resourcesPath/ailis-web-runtime/python`.
3. Developer package cache: `build-cache/ailis-web-runtime/crawl4ai-venv`, then `build-cache/ailis-web-runtime/python`.
4. Local dev fallback: `.ailis-runtime/crawl4ai-venv`.
5. System `python`.

If the private runtime is missing or broken, AILIS falls back to builtin HTML/text extraction instead of blocking all search.

## Developer Install Without Docker

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-crawl4ai.ps1
```

This creates `.ailis-runtime/crawl4ai-venv`, installs `crawl4ai`, and installs Playwright Chromium. Developers can then run `pnpm ailis:web-runtime:prepare` to copy that runtime into `build-cache/ailis-web-runtime` for packaging.

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
