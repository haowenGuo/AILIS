import argparse
import json
import os
import time
import uuid
from pathlib import Path
from typing import Dict, Iterable, List
from urllib.parse import urlparse

import requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prefetch OSWorld task assets into OSWorld's setup cache.")
    parser.add_argument("--osworld-dir", default="/mnt/f/AIGril/build-cache/OSWorld")
    parser.add_argument("--test-all-meta-path", default="evaluation_examples/test_small.json")
    parser.add_argument("--test-config-base-dir", default="evaluation_examples")
    parser.add_argument("--cache-dir", default="cache")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--retries", type=int, default=1)
    return parser.parse_args()


def cache_name(url: str, target_path: str) -> str:
    return f"{uuid.uuid5(uuid.NAMESPACE_URL, url)}_{os.path.basename(target_path)}"


def mirror_urls(url: str) -> List[str]:
    if "https://huggingface.co/" in url:
        return [url.replace("https://huggingface.co/", "https://hf-mirror.com/"), url]
    return [url]


def iter_examples(osworld_dir: Path, meta_path: Path, base_dir: Path, limit: int) -> Iterable[Dict]:
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    count = 0
    for domain, ids in meta.items():
        for example_id in ids:
            example_path = osworld_dir / base_dir / "examples" / domain / f"{example_id}.json"
            yield json.loads(example_path.read_text(encoding="utf-8"))
            count += 1
            if limit and count >= limit:
                return


def collect_downloads(example: Dict) -> List[Dict[str, str]]:
    downloads: List[Dict[str, str]] = []
    for step in example.get("config") or []:
        if step.get("type") != "download":
            continue
        for item in (step.get("parameters") or {}).get("files") or []:
            url = item.get("url")
            path = item.get("path")
            if url and path:
                downloads.append({"url": url, "path": path, "example_id": example.get("id", "")})
    return downloads


def download_one(url: str, target: Path, timeout: int, retries: int) -> bool:
    target.parent.mkdir(parents=True, exist_ok=True)
    temp = target.with_suffix(target.suffix + ".part")
    for candidate in mirror_urls(url):
        for attempt in range(max(1, retries)):
            try:
                with requests.get(candidate, stream=True, timeout=(10, timeout)) as response:
                    response.raise_for_status()
                    with temp.open("wb") as handle:
                        for chunk in response.iter_content(chunk_size=1024 * 1024):
                            if chunk:
                                handle.write(chunk)
                temp.replace(target)
                return True
            except Exception as error:
                if temp.exists():
                    temp.unlink()
                if attempt + 1 >= max(1, retries):
                    print(f"download failed: {candidate} :: {error}", flush=True)
                else:
                    time.sleep(1.5 * (attempt + 1))
    return False


def main() -> int:
    args = parse_args()
    osworld_dir = Path(args.osworld_dir)
    meta_path = Path(args.test_all_meta_path)
    if not meta_path.is_absolute():
        meta_path = osworld_dir / meta_path
    base_dir = Path(args.test_config_base_dir)
    cache_dir = Path(args.cache_dir)
    if not cache_dir.is_absolute():
        cache_dir = osworld_dir / cache_dir

    downloads: Dict[str, Dict[str, str]] = {}
    for example in iter_examples(osworld_dir, meta_path, base_dir, args.limit):
        for item in collect_downloads(example):
            downloads[item["url"]] = item

    print(f"osworld asset prefetch: {len(downloads)} files", flush=True)
    ok = 0
    skipped = 0
    failed = 0
    for item in downloads.values():
        target = cache_dir / item["example_id"] / cache_name(item["url"], item["path"])
        if target.exists() and target.stat().st_size > 0:
            skipped += 1
            print(f"cached {item['example_id']}: {target.name}", flush=True)
            continue
        print(f"prefetch {item['example_id']}: {urlparse(item['url']).path.rsplit('/', 1)[-1]}", flush=True)
        if download_one(item["url"], target, args.timeout, args.retries):
            ok += 1
        else:
            failed += 1

    print(json.dumps({"ok": ok, "skipped": skipped, "failed": failed, "cache_dir": str(cache_dir)}, ensure_ascii=False), flush=True)
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
