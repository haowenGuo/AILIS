"""Minimal stdio MCP adapter for the official BrowseComp-Plus Lucene BM25 index.

Requires Java 21 and pyserini. The adapter makes no model decisions: it only
exposes deterministic search/get_document lifecycle contracts to AILIS.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any


PROTOCOL_VERSION = "2025-06-18"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve a BrowseComp-Plus Pyserini BM25 index over stdio MCP.")
    parser.add_argument("--index-path", required=True)
    parser.add_argument("--default-k", type=int, default=5)
    parser.add_argument("--snippet-tokens", type=int, default=512)
    return parser.parse_args()


def decode_document(raw: str, fallback_docid: str) -> dict[str, str]:
    try:
        parsed = json.loads(raw)
    except (TypeError, json.JSONDecodeError):
        parsed = {"text": raw or ""}
    text = parsed.get("contents") or parsed.get("text") or parsed.get("body") or ""
    title = parsed.get("title") or ""
    docid = parsed.get("id") or parsed.get("docid") or fallback_docid
    return {"docid": str(docid), "title": str(title), "text": str(text)}


def snippet(text: str, token_limit: int) -> str:
    # The benchmark constrains snippets to 512 tokens. This deterministic adapter
    # uses whitespace tokens; record this adapter name when comparing results.
    return " ".join(str(text).split()[: max(1, token_limit)])


class Server:
    def __init__(self, args: argparse.Namespace) -> None:
        try:
            from pyserini.search.lucene import LuceneSearcher
        except ImportError as error:
            raise RuntimeError("pyserini is required; install the official BrowseComp-Plus environment first") from error
        self.searcher = LuceneSearcher(args.index_path)
        self.default_k = max(1, min(args.default_k, 100))
        self.snippet_tokens = max(1, args.snippet_tokens)

    @property
    def tools(self) -> list[dict[str, Any]]:
        return [
            {
                "name": "search",
                "description": "Search the fixed BrowseComp-Plus BM25 corpus and return docid, score, and snippet.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The query string for the search."},
                        "k": {"type": "integer", "minimum": 1, "maximum": 100},
                    },
                    "required": ["query"],
                    "additionalProperties": False,
                },
            },
            {
                "name": "get_document",
                "description": "Get a complete fixed-corpus document by docid.",
                "inputSchema": {
                    "type": "object",
                    "properties": {"docid": {"type": "string"}},
                    "required": ["docid"],
                    "additionalProperties": False,
                },
            },
        ]

    def search(self, query: str, k: int | None) -> list[dict[str, Any]]:
        limit = max(1, min(int(k or self.default_k), 100))
        output: list[dict[str, Any]] = []
        for hit in self.searcher.search(query, k=limit):
            stored = self.searcher.doc(hit.docid)
            document = decode_document(stored.raw() if stored else "", hit.docid)
            output.append(
                {
                    "docid": str(hit.docid),
                    "score": float(hit.score),
                    "snippet": snippet(document["text"], self.snippet_tokens),
                }
            )
        return output

    def get_document(self, docid: str) -> dict[str, Any]:
        stored = self.searcher.doc(str(docid))
        if not stored:
            return {"error": "document_not_found", "docid": str(docid)}
        return decode_document(stored.raw(), str(docid))


def tool_result(value: Any, is_error: bool = False) -> dict[str, Any]:
    return {
        "content": [{"type": "text", "text": json.dumps(value, ensure_ascii=False)}],
        "structuredContent": value,
        "isError": is_error,
    }


def handle(server: Server, request: dict[str, Any]) -> dict[str, Any] | None:
    method = request.get("method")
    request_id = request.get("id")
    if method == "initialize":
        return {
            "id": request_id,
            "result": {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "browsecomp_plus_pyserini_bm25", "version": "1.0.0"},
            },
        }
    if method == "tools/list":
        return {"id": request_id, "result": {"tools": server.tools}}
    if method == "tools/call":
        params = request.get("params") or {}
        arguments = params.get("arguments") or {}
        if params.get("name") == "search":
            return {"id": request_id, "result": tool_result(server.search(str(arguments.get("query", "")), arguments.get("k")))}
        if params.get("name") == "get_document":
            result = server.get_document(str(arguments.get("docid", "")))
            return {"id": request_id, "result": tool_result(result, "error" in result)}
        return {"id": request_id, "error": {"code": -32602, "message": "Unknown tool"}}
    if request_id is None:
        return None
    return {"id": request_id, "error": {"code": -32601, "message": f"Unknown method: {method}"}}


def main() -> None:
    server = Server(parse_args())
    for line in sys.stdin:
        try:
            request = json.loads(line)
            response = handle(server, request)
            if response is not None:
                print(json.dumps({"jsonrpc": "2.0", **response}, ensure_ascii=False), flush=True)
        except Exception as error:  # Keep the server alive and return a protocol error.
            request_id = request.get("id") if isinstance(locals().get("request"), dict) else None
            if request_id is not None:
                print(
                    json.dumps(
                        {"jsonrpc": "2.0", "id": request_id, "error": {"code": -32603, "message": str(error)}},
                        ensure_ascii=False,
                    ),
                    flush=True,
                )


if __name__ == "__main__":
    main()
