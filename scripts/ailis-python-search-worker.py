#!/usr/bin/env python3
import json
import os
import re
import sys
import time
from urllib.parse import parse_qs, quote_plus, unquote, urljoin, urlparse

import requests
from bs4 import BeautifulSoup


USER_AGENT = "AILISResearchMCP/0.1 (+local python search worker)"


def norm(value):
    return str(value or "").strip()


def clean_text(value):
    return re.sub(r"\s+", " ", norm(value)).strip()


def normalize_base_url(value):
    return norm(value).rstrip("/")


def unwrap_redirect_url(url):
    text = norm(url)
    if not text:
        return ""
    parsed = urlparse(text)
    if parsed.netloc.endswith("bing.com") and parsed.path.startswith("/ck/a"):
        qs = parse_qs(parsed.query)
        for key in ("u", "url"):
            if qs.get(key):
                candidate = qs[key][0]
                if candidate.startswith("a1"):
                    candidate = candidate[2:]
                try:
                    return unquote(candidate)
                except Exception:
                    return candidate
    if "duckduckgo.com" in parsed.netloc and parsed.path.startswith("/l/"):
        qs = parse_qs(parsed.query)
        if qs.get("uddg"):
            return unquote(qs["uddg"][0])
    if "search.yahoo.com" in parsed.netloc and "/RU=" in parsed.path:
        match = re.search(r"/RU=([^/]+)", parsed.path)
        if match:
            return unquote(match.group(1))
    return text


def normalize_url(url, base=""):
    text = unwrap_redirect_url(norm(url))
    if not text:
        return ""
    if base and text.startswith("/"):
        text = urljoin(base, text)
    if not re.match(r"^https?://", text, re.I):
        return ""
    return text


def dedupe_results(results, limit):
    seen = set()
    rows = []
    for item in results:
        title = clean_text(item.get("title"))
        url = normalize_url(item.get("url"))
        snippet = clean_text(item.get("snippet"))
        if not title or not url:
            continue
        key = re.sub(r"[#?].*$", "", url).lower()
        if key in seen:
            continue
        seen.add(key)
        rows.append({
            "title": title,
            "url": url,
            "snippet": snippet,
            "sourceEngines": item.get("sourceEngines") or ["python_search"],
        })
        if len(rows) >= limit:
            break
    return rows


def request_text(url, timeout):
    response = requests.get(
        url,
        timeout=timeout,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
            "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.5",
        },
    )
    return response.status_code, response.text


def search_searxng(query, limit, timeout, base_url):
    base = normalize_base_url(base_url)
    if not base:
        return []
    response = requests.get(
        f"{base}/search",
        timeout=timeout,
        params={
            "q": query,
            "format": "json",
            "language": "auto",
            "safesearch": "0",
            "pageno": "1",
        },
        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
    )
    response.raise_for_status()
    payload = response.json()
    rows = []
    for item in payload.get("results") or []:
        rows.append({
            "title": item.get("title") or item.get("pretty_url") or item.get("url"),
            "url": item.get("url"),
            "snippet": item.get("content") or item.get("snippet") or item.get("description") or "",
            "sourceEngines": item.get("engines") or [item.get("engine") or "searxng"],
        })
    return dedupe_results(rows, limit)


def search_firecrawl(query, limit, timeout, base_url, api_key="", enable_cloud=False):
    base = normalize_base_url(base_url)
    if not base and enable_cloud and api_key:
        base = "https://api.firecrawl.dev"
    if not base:
        return []
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json", "Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    response = requests.post(
        f"{base}/v1/search",
        timeout=timeout,
        headers=headers,
        json={"query": query, "limit": limit},
    )
    response.raise_for_status()
    payload = response.json()
    source_rows = payload.get("data") if isinstance(payload.get("data"), list) else payload.get("results") or []
    rows = []
    for item in source_rows:
        metadata = item.get("metadata") or {}
        markdown = clean_text(item.get("markdown") or item.get("content") or item.get("text"))
        rows.append({
            "title": item.get("title") or metadata.get("title") or item.get("url") or item.get("link"),
            "url": item.get("url") or item.get("link"),
            "snippet": item.get("description") or item.get("snippet") or metadata.get("description") or markdown[:500],
            "sourceEngines": ["firecrawl"],
        })
    return dedupe_results(rows, limit)


def search_bing(query, limit, timeout):
    status, html = request_text(f"https://www.bing.com/search?q={quote_plus(query)}", timeout)
    if status >= 400:
        raise RuntimeError(f"HTTP {status}")
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    for block in soup.select("li.b_algo"):
        link = block.select_one("h2 a")
        if not link:
            continue
        snippet = ""
        caption = block.select_one(".b_caption p") or block.select_one("p")
        if caption:
            snippet = caption.get_text(" ", strip=True)
        rows.append({
            "title": link.get_text(" ", strip=True),
            "url": link.get("href"),
            "snippet": snippet,
            "sourceEngines": ["bing_html_python"],
        })
    return dedupe_results(rows, limit)


def search_duckduckgo_lite(query, limit, timeout):
    status, html = request_text(f"https://lite.duckduckgo.com/lite/?q={quote_plus(query)}", timeout)
    if status >= 400:
        raise RuntimeError(f"HTTP {status}")
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    for link in soup.select("a.result-link, a[href]"):
        title = link.get_text(" ", strip=True)
        href = normalize_url(link.get("href"), "https://lite.duckduckgo.com")
        if not title or not href or "duckduckgo.com" in urlparse(href).netloc:
            continue
        snippet = ""
        row = link.find_parent("tr")
        if row:
            next_row = row.find_next_sibling("tr")
            if next_row:
                snippet = next_row.get_text(" ", strip=True)
        rows.append({
            "title": title,
            "url": href,
            "snippet": snippet,
            "sourceEngines": ["duckduckgo_lite_python"],
        })
    return dedupe_results(rows, limit)


def search_yahoo(query, limit, timeout):
    status, html = request_text(f"https://search.yahoo.com/search?p={quote_plus(query)}", timeout)
    if status >= 400:
        raise RuntimeError(f"HTTP {status}")
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    for block in soup.select("div.algo, div.dd"):
        link = block.select_one("h3 a, a")
        if not link:
            continue
        href = normalize_url(link.get("href"))
        host = urlparse(href).netloc.lower()
        if not href or host.endswith("yahoo.com") or host.endswith("search.yahoo.com"):
            continue
        snippet_node = block.select_one(".compText, p")
        rows.append({
            "title": link.get_text(" ", strip=True),
            "url": href,
            "snippet": snippet_node.get_text(" ", strip=True) if snippet_node else "",
            "sourceEngines": ["yahoo_html_python"],
        })
    return dedupe_results(rows, limit)


def main():
    raw_payload = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read() or "{}"
    payload = json.loads(raw_payload.lstrip("\ufeff"))
    query = clean_text(payload.get("query"))
    limit = max(1, min(int(payload.get("maxResults") or payload.get("limit") or 8), 12))
    timeout = max(3.0, min(float(payload.get("timeoutSeconds") or 8), 30.0))
    if not query:
        print(json.dumps({"ok": False, "errorCode": "missing_query", "error": "query is required"}))
        return 2

    searxng_url = normalize_base_url(payload.get("searxngUrl") or os.environ.get("AILIS_SEARXNG_URL") or os.environ.get("SEARXNG_URL"))
    firecrawl_url = normalize_base_url(payload.get("firecrawlUrl") or os.environ.get("AILIS_FIRECRAWL_URL") or os.environ.get("FIRECRAWL_BASE_URL"))
    firecrawl_key = norm(os.environ.get("FIRECRAWL_API_KEY"))
    firecrawl_cloud = norm(payload.get("allowFirecrawlCloud") or os.environ.get("AILIS_ENABLE_FIRECRAWL_CLOUD")).lower() in {"1", "true", "yes", "on"}

    providers = []
    if searxng_url:
        providers.append(("searxng_json_python", True, lambda: search_searxng(query, limit, timeout, searxng_url)))
    if firecrawl_url or (firecrawl_cloud and firecrawl_key):
        providers.append(("firecrawl_search_python", True, lambda: search_firecrawl(query, limit, timeout, firecrawl_url, firecrawl_key, firecrawl_cloud)))
    providers.extend([
        ("bing_html_python", False, lambda: search_bing(query, limit, timeout)),
        ("yahoo_html_python", False, lambda: search_yahoo(query, limit, timeout)),
        ("duckduckgo_lite_python", False, lambda: search_duckduckgo_lite(query, limit, timeout)),
    ])

    attempts = []
    merged = []
    started = time.time()
    for name, configured_provider, fn in providers:
        try:
            rows = fn()
            attempts.append({"backend": name, "ok": bool(rows), "count": len(rows)})
            merged.extend(rows)
            merged = dedupe_results(merged, limit * 2)
            if rows:
                break
        except Exception as exc:
            attempts.append({"backend": name, "ok": False, "errorCode": exc.__class__.__name__, "error": str(exc)[:1000]})

    results = dedupe_results(merged, limit)
    print(json.dumps({
        "ok": bool(results),
        "backend": "python_search",
        "durationMs": int((time.time() - started) * 1000),
        "attempts": attempts,
        "results": results,
        "errorCode": "" if results else "no_results",
        "error": "" if results else "Python search worker found no results",
    }, ensure_ascii=False))
    return 0 if results else 1


if __name__ == "__main__":
    raise SystemExit(main())
