# AILIS BrowseComp-Plus Evaluation

## Status

AILIS now has a fixed-corpus BrowseComp-Plus integration with four separate layers:

1. Pinned official dataset decryption and qrel generation.
2. A `search` / `get_document` MCP retriever contract.
3. A memory-isolated AILIS TaskAgent runner using the authors' original query template.
4. Official-compatible per-query run JSON plus AILIS tool, latency, token, and fixed-corpus audits.

The local fixture smoke is synthetic and tests only transport, schemas, and audit behavior. It is not a BrowseComp-Plus score. No 830-query run has been executed in this repository yet.

## What the benchmark measures

BrowseComp-Plus turns the live-web BrowseComp task into a reproducible fixed-corpus evaluation. The official release contains 830 reasoning-intensive queries and a curated corpus of roughly 100,000 documents. The fixed corpus separates retriever quality from agent quality and supports:

- end-to-end answer accuracy with a Qwen3-32B semantic judge;
- evidence retrieval recall;
- citation precision and recall;
- confidence calibration;
- search/tool-call counts;
- retriever-only Recall@5/100/1000 and nDCG@10.

Primary sources:

- [Official repository](https://github.com/texttron/BrowseComp-Plus)
- [Official query dataset](https://huggingface.co/datasets/Tevatron/browsecomp-plus)
- [Official corpus](https://huggingface.co/datasets/Tevatron/browsecomp-plus-corpus)
- [Official indexes](https://huggingface.co/datasets/Tevatron/browsecomp-plus-indexes)
- [ACL 2026 paper](https://aclanthology.org/2026.acl-long.1023/)
- [Original prompt templates](https://github.com/texttron/BrowseComp-Plus/blob/main/search_agent/prompts.py)
- [Official evaluator](https://github.com/texttron/BrowseComp-Plus/blob/main/scripts_evaluation/evaluate_run.py)

## Frozen AILIS protocol

| Field | AILIS setting |
|---|---|
| Dataset | `Tevatron/browsecomp-plus`, test split, 830 queries |
| Query revision | `144cff8e35b5eaef7e526346aa60774a9deb941f` |
| Corpus revision | `b27b02bc3e45511b8b82a13e6f90ce761df726f6` |
| Index revision | `b3f37f70c33829eb09d04784a54277a31871fd63` |
| Prompt | Upstream `QUERY_TEMPLATE`, or explicitly recorded search-only variant |
| Search return count | Retriever default 5 unless the agent supplies `k` |
| Snippet budget | 512 tokens in the official protocol |
| Memory | Disabled for every query |
| Workspace | New isolated directory per attempt |
| Allowed evidence source | `browsecomp_plus` fixed-corpus MCP only |
| Formal judge | Upstream Qwen/Qwen3-32B evaluator |

AILIS disables its built-in research MCP for this runner. Every executed tool call is audited. `web_run`, shell, file, computer, or any non-benchmark tool makes that query fixed-corpus-invalid, so it cannot silently become a comparable benchmark success. `tool_search`, `update_plan`, and MCP management calls are lifecycle operations and are not counted as official search calls.

The bundled Pyserini adapter uses the official Lucene BM25 index and Top-5 default, but implements the 512-token snippet cap with deterministic whitespace tokens. Record it as `ailis-pyserini-bm25-mcp-whitespace512`, not as a bit-for-bit reproduction of the authors' API client. Leaderboard-level comparison requires verifying the same truncation/tokenization behavior or using a validated upstream-compatible retriever service.

The runner never places `answer`, evidence text, gold document IDs, or qrels in the model prompt. Ground truth is used only by the scorer.

## Local readiness checked on 2026-08-11

| Requirement | Status |
|---|---|
| AILIS MCP stdio transport | Ready; fixture list/call test included |
| AILIS MCP Streamable HTTP transport | Ready |
| Python | 3.12.7 available |
| `datasets` / `huggingface_hub` | Installed |
| Java 21 | Missing |
| Pyserini | Missing |
| FAISS | Missing |
| Official query/qrel assets | Ready: 830/830, pinned revision, six source shards verified |
| Qwen3-Embedding-8B index | Ready: 4/4 files, 1,642,386,509 bytes, exact SHA-256 verified |
| Official corpus | Partial: 4/7 verified, one resumable partial shard |
| Local Qwen3-Embedding-8B runtime | Not viable on this host: 6 GiB GPU, PyTorch CUDA unavailable |
| Authenticated NetMind retriever | Not configured |
| Qwen3-32B judge runtime | Not provisioned |

The prepared data and selected retrieval assets live on D:. The query release is about 2.8 GB, corpus about 1.8 GB, and BM25 index about 2.2 GB before cache/decompression overhead. Put `HF_HOME` and `--output-dir` on a larger drive; do not download all embedding indexes by default. The formal 8B protocol requires a GPU-capable retriever host or the authors' authenticated NetMind service; the runner must not silently substitute a smaller embedding model.

## Commands

Fast local checks, with no model call and no official data download:

```powershell
pnpm test:browsecomp-plus
pnpm bench:browsecomp-plus:plan
pnpm bench:browsecomp-plus:preflight
```

Prepare compact official ground truth, queries, and qrels on a larger drive:

```powershell
$env:HF_HOME = 'D:\RelocatedCaches\huggingface'
python scripts\browsecomp-plus\prepare_dataset.py `
  --compact `
  --output-dir D:\Benchmarks\BrowseComp-Plus\data
```

The preparation script pins all repository revisions and never prints or stores a Hugging Face token. `--download-corpus` and `--download-indexes` are deliberately opt-in. Omit `--compact` only when the complete decrypted upstream records are needed.

Install the official BM25 runtime and download its index before using the included Pyserini MCP adapter. The official project specifies Java 21. Then run a small AILIS canary:

```powershell
node scripts\run-ailis-browsecomp-plus.mjs `
  --dataset D:\Benchmarks\BrowseComp-Plus\data\browsecomp_plus_decrypted.jsonl `
  --retriever ailis-pyserini-bm25-mcp-whitespace512 `
  --mcp-command python `
  --mcp-arg scripts\browsecomp-plus\pyserini_bm25_mcp.py `
  --mcp-arg '--index-path' `
  --mcp-arg D:\Benchmarks\BrowseComp-Plus\indexes\bm25 `
  --limit 5 `
  --codex-model gpt-5.6-luna `
  --codex-reasoning-effort medium
```

PowerShell users should pass the `--mcp-arg` token and its value as separate arguments. The runner accepts repeated `--mcp-arg VALUE` pairs:

```powershell
--mcp-arg '--index-path' --mcp-arg 'D:\Benchmarks\BrowseComp-Plus\indexes\bm25'
```

For a Streamable HTTP MCP retriever:

```powershell
$env:BROWSECOMP_TOKEN = 'set-outside-the-repository'
node scripts\run-ailis-browsecomp-plus.mjs `
  --dataset D:\Benchmarks\BrowseComp-Plus\data\browsecomp_plus_decrypted.jsonl `
  --retriever qwen3-embedding-8b `
  --mcp-url https://retriever.example/mcp `
  --mcp-bearer-env BROWSECOMP_TOKEN
```

The upstream NetMind example currently documents a legacy `/sse/` MCP endpoint. AILIS's HTTP client uses Streamable HTTP POST, so that endpoint must be compatibility-tested or placed behind a bridge before a formal run; it is not treated as verified merely because an URL is accepted.

Run all 830 queries only after the canary passes:

```powershell
node scripts\run-ailis-browsecomp-plus.mjs `
  --dataset D:\Benchmarks\BrowseComp-Plus\data\browsecomp_plus_decrypted.jsonl `
  --retriever ailis-pyserini-bm25-mcp-whitespace512 `
  --mcp-command python `
  --mcp-arg scripts\browsecomp-plus\pyserini_bm25_mcp.py `
  --mcp-arg '--index-path' `
  --mcp-arg D:\Benchmarks\BrowseComp-Plus\indexes\bm25 `
  --run-id ailis-luna-bm25-full830-v1
```

The runner resumes from existing per-query JSON files by default. Use `--no-resume` only when intentionally replacing a run.

Before authorizing the full run, freeze and run a deterministic Random-100 pilot. Selection ranks each `query_id` by SHA-256 of the recorded seed and ID, takes exactly 100, then restores dataset order. The manifest records both the seed and selected-query hash, so resume cannot silently change the cohort:

```powershell
node scripts\run-ailis-browsecomp-plus.mjs `
  --dataset D:\Benchmarks\BrowseComp-Plus\data\browsecomp_plus_decrypted.jsonl `
  --retriever qwen3-embedding-8b `
  --mcp-url https://retriever.example/mcp `
  --sample-size 100 `
  --sample-seed ailis-browsecomp-plus-random100-v1 `
  --run-id ailis-luna-qwen3-embedding-random100-v1
```

`--sample-size` cannot be combined with `--query-id`, `--offset`, or `--limit`; this prevents an accidentally shifted pilot from being reported as the frozen cohort.

## Official scoring

The generated `runs/*.json` files contain the minimum upstream schema:

- `query_id`
- `tool_call_counts`
- `status`
- `retrieved_docids`
- final `result[{type: "output_text", output: ...}]`

Extra `metadata`, `usage`, and `ailis_audit` fields are ignored by the upstream scorer. Clone the official repository in a separate benchmark environment, then run its evaluator against this run directory:

```powershell
python scripts_evaluation\evaluate_run.py `
  --input_dir F:\AILIS\main\eval-results\browsecomp-plus\ailis\ailis-luna-bm25-full830-v1\runs `
  --ground_truth D:\Benchmarks\BrowseComp-Plus\data\browsecomp_plus_decrypted.jsonl `
  --qrel_evidence D:\Benchmarks\BrowseComp-Plus\data\qrel_evidence.txt `
  --model Qwen/Qwen3-32B
```

Do not compare a local exact-string diagnostic, GPT judge, different snippet budget, live-web run, or partial query set directly to the official leaderboard. A formal AILIS result must report model, reasoning effort, retriever, dataset/index revisions, prompt variant, query count, completion failures, fixed-corpus violations, search calls, latency, tokens, judge model, accuracy, recall, citation metrics, and calibration error.
