# ACP candidate verification - 2026-11-04

## Result

The adapter is ready for Hosted Harbor source/manifest validation. This is not
an assertion that a hosted job or a real model inference has succeeded.

| Check | Result |
| --- | --- |
| Windows Python 3.12, locked install | Passed |
| Windows tests | 24 passed; 3 Linux-only integration tests skipped |
| Fresh Linux Python 3.12 environment, `uv sync --frozen` | Passed; 14 locked packages installed |
| Linux tests, fresh runtime extraction cache | 27 passed in 20.76s |
| Official Harbor 0.24.0 `acp_runner.py` | Passed without editing the runner |
| Actual frozen Gateway and Codex exec-server | Tool creates a file; output reaches the next model request |
| ACP session continuity | Next user prompt retains the first prompt and tool feedback |
| ACP cancellation | Long-running real command stopped; no live test child remains |
| Python source distribution and wheel | Built successfully |
| Real production Responses request | Not validated by these tests |
| Hosted account dry-run / task execution | Not run |

Integration model replies are deterministic fixtures. Their synthetic token
counts test accounting only and are not resource measurements or scores.

## Unchanged runtime

The data wheel embeds the original archive byte-for-byte. No prompts, schemas,
tool code, context manager, compactor, verifier or benchmark environment were
modified. The ACP wrapper and API credential/provider boundary are new; API
serialization is not claimed to match the old OAuth transport byte-for-byte.

| Artifact | SHA256 |
| --- | --- |
| Original runtime archive | `9e224d1a3f33dc8fea97358ebbd6069b4a078502b673dfb7667bd11cc60a5729` |
| Published data wheel | `b4791a0e25593789bf2410af8153c6a8f36fc1c299aa87b6bd901364080c956f` |
| Gateway | `19b05929ef1f04ad31eb409e79834ef5b1688bf56f3f464d1bf936863f2e2c7b` |
| Context manager | `ae9f4e6f1f627121c2138f3a5f8c6e852ea805af2b918d951515517376a6e692` |
| Codex exec runtime adapter | `024d68608148be340d2885338027910571e7eae6f65c3464105377de71309a70` |
| Codex 0.159.0 execution binary | `d2752c52353401f7f6efbfcea68796f4f7a3d3e4769f5d1da53fa49d4856b72f` |

The archive inventory contains 16,011 members; the credential scan examined
78,984,914 text bytes. Its three flagged entries were two npm documentation
examples containing placeholder private keys and an empty npmrc. Their exact
hashes are allowlisted in `verify_runtime.py`; no real credential was found by
this scan. This is a scan result, not a formal guarantee about arbitrary secrets.

## Publication and next checks

- Source is confined to `evals/terminal-bench-4.0/official/cloud` on
  `codex/harbor-acp-20261104`; main is not merged or deployed.
- Runtime is a prerelease asset, not the Latest desktop release.
- Runtime installation uses the locked public wheel during setup; no runtime
  download or npm install is performed during a task.
- The last production relay check supported Chat Completions but not Responses.
  This adapter defaults to Responses and does not silently switch protocols.
- Before a paid run: validate the selected production endpoint with real tool
  and image feedback; validate the pinned source with Hosted `dry_run: true`;
  then obtain approval for a small hosted trial.

No cloud job, benchmark retry, main deployment or paid rollout was started.
