#!/usr/bin/env python
"""Local Crawl4AI adapter for AILIS research MCP.

This worker intentionally calls the Python Crawl4AI package directly instead of
requiring a Docker container or a long-running HTTP service. It prints one JSON
object to stdout so the Node MCP server can safely fall back when dependencies
are missing.
"""

from __future__ import annotations

import argparse
import asyncio
import inspect
import json
import sys
import traceback
from typing import Any


def _json_default(value: Any) -> str:
    return str(value)


def emit(payload: dict[str, Any], exit_code: int = 0) -> None:
    print(json.dumps(payload, ensure_ascii=False, default=_json_default))
    raise SystemExit(exit_code)


def compact_error(error: BaseException) -> str:
    return f"{error.__class__.__name__}: {error}".strip()


def object_to_plain(value: Any, depth: int = 0) -> Any:
    if depth > 4:
        return str(value)
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(k): object_to_plain(v, depth + 1) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [object_to_plain(v, depth + 1) for v in value]
    if hasattr(value, "model_dump"):
        try:
            return object_to_plain(value.model_dump(), depth + 1)
        except Exception:
            pass
    if hasattr(value, "__dict__"):
        return {
            str(k): object_to_plain(v, depth + 1)
            for k, v in vars(value).items()
            if not str(k).startswith("_")
        }
    return str(value)


def pick_supported_kwargs(cls: Any, candidates: dict[str, Any]) -> dict[str, Any]:
    try:
        params = inspect.signature(cls).parameters
    except Exception:
        return candidates
    if any(param.kind == inspect.Parameter.VAR_KEYWORD for param in params.values()):
        return candidates
    return {key: value for key, value in candidates.items() if key in params}


def extract_attr_or_key(value: Any, *names: str) -> Any:
    if value is None:
        return None
    if isinstance(value, dict):
        for name in names:
            if name in value:
                return value[name]
        return None
    for name in names:
        if hasattr(value, name):
            return getattr(value, name)
    return None


def extract_markdown(result: Any) -> str:
    candidates = [
        result,
        extract_attr_or_key(result, "markdown", "raw_markdown", "fit_markdown", "text", "content"),
        extract_attr_or_key(result, "cleaned_html"),
        extract_attr_or_key(result, "html"),
    ]
    for candidate in candidates:
        if isinstance(candidate, str) and candidate.strip():
            return candidate.strip()
        nested = extract_attr_or_key(candidate, "fit_markdown", "raw_markdown", "markdown", "text", "content")
        if isinstance(nested, str) and nested.strip():
            return nested.strip()
    return ""


def normalize_links(raw_links: Any, limit: int) -> list[dict[str, str]]:
    plain = object_to_plain(raw_links)
    rows: list[Any] = []
    if isinstance(plain, dict):
        for bucket in ("internal", "external", "links", "all"):
            value = plain.get(bucket)
            if isinstance(value, list):
                rows.extend(value)
    elif isinstance(plain, list):
        rows = plain
    links: list[dict[str, str]] = []
    seen: set[str] = set()
    for row in rows:
        if len(links) >= limit:
            break
        if isinstance(row, dict):
            href = str(row.get("href") or row.get("url") or row.get("link") or "").strip()
            text = str(row.get("text") or row.get("title") or row.get("label") or href).strip()
        else:
            href = str(row).strip()
            text = href
        if not href or href in seen:
            continue
        seen.add(href)
        links.append({"text": text[:240], "url": href})
    return links


async def crawl(args: argparse.Namespace) -> dict[str, Any]:
    try:
        from crawl4ai import AsyncWebCrawler  # type: ignore
        from crawl4ai import BrowserConfig  # type: ignore
        from crawl4ai import CrawlerRunConfig  # type: ignore
        try:
            from crawl4ai import CacheMode  # type: ignore
        except Exception:
            CacheMode = None  # type: ignore
    except Exception as error:
        return {
            "ok": False,
            "status": 0,
            "errorCode": "crawl4ai_missing_dependency",
            "error": compact_error(error),
            "backend": "crawl4ai_local",
            "installCommands": [
                "python -m pip install -U crawl4ai",
                "python -m playwright install chromium",
            ],
            "recoveryHint": "Install Crawl4AI in the configured Python environment, then retry web_fetch.",
        }

    browser_kwargs = pick_supported_kwargs(
        BrowserConfig,
        {
            "browser_type": "chromium",
            "headless": True,
            "verbose": False,
            "user_agent": args.user_agent,
        },
    )
    run_candidates: dict[str, Any] = {
        "word_count_threshold": 1,
        "page_timeout": args.timeout_ms,
        "wait_for": args.wait_for or None,
        "delay_before_return_html": args.delay_ms / 1000 if args.delay_ms else None,
    }
    if CacheMode is not None:
        run_candidates["cache_mode"] = getattr(CacheMode, "BYPASS", None)
    run_kwargs = pick_supported_kwargs(
        CrawlerRunConfig,
        {key: value for key, value in run_candidates.items() if value is not None},
    )
    try:
        browser_config = BrowserConfig(**browser_kwargs)
        run_config = CrawlerRunConfig(**run_kwargs)
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(url=args.url, config=run_config)
    except TypeError:
        async with AsyncWebCrawler(**browser_kwargs) as crawler:
            result = await crawler.arun(url=args.url)
    except Exception as error:
        return {
            "ok": False,
            "status": 0,
            "errorCode": "crawl4ai_crawl_failed",
            "error": compact_error(error),
            "traceback": traceback.format_exc(limit=4),
            "backend": "crawl4ai_local",
        }

    markdown = extract_markdown(result)
    status = extract_attr_or_key(result, "status_code", "status") or 200
    success = extract_attr_or_key(result, "success")
    if success is False:
        return {
            "ok": False,
            "status": status,
            "errorCode": "crawl4ai_result_failed",
            "error": str(extract_attr_or_key(result, "error_message", "error") or "Crawl4AI returned success=false."),
            "backend": "crawl4ai_local",
            "metadata": object_to_plain(extract_attr_or_key(result, "metadata")),
        }
    if not markdown:
        return {
            "ok": False,
            "status": status,
            "errorCode": "crawl4ai_no_markdown",
            "error": "Crawl4AI completed but returned no markdown/text content.",
            "backend": "crawl4ai_local",
            "metadata": object_to_plain(extract_attr_or_key(result, "metadata")),
        }
    return {
        "ok": True,
        "status": status,
        "contentType": "text/markdown; charset=utf-8",
        "markdown": markdown,
        "links": normalize_links(extract_attr_or_key(result, "links"), args.max_links),
        "metadata": object_to_plain(extract_attr_or_key(result, "metadata")),
        "backend": "crawl4ai_local",
        "crawler": "crawl4ai.AsyncWebCrawler",
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AILIS local Crawl4AI worker")
    parser.add_argument("--url", required=True)
    parser.add_argument("--query", default="")
    parser.add_argument("--timeout-ms", type=int, default=90000)
    parser.add_argument("--max-links", type=int, default=80)
    parser.add_argument("--wait-for", default="")
    parser.add_argument("--delay-ms", type=int, default=0)
    parser.add_argument("--user-agent", default="AILISResearchMCP/0.1 (+local Crawl4AI worker)")
    return parser.parse_args(argv)


def main(argv: list[str]) -> None:
    args = parse_args(argv)
    payload = asyncio.run(crawl(args))
    emit(payload, 0 if payload.get("ok") else 2)


if __name__ == "__main__":
    main(sys.argv[1:])
