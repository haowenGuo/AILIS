# AILIS Harbor ACP candidate 0.1.0

Independent cloud integration candidate. Not a desktop release and not Latest.

- Official ACP SDK boundary around the immutable `512k-codex-exec-20261029` runtime.
- Preserves prompts, context code, tool code and Codex exec-server binary.
- Environment-injected API credentials; no local Codex login file is uploaded.
- Persistent sessions, cancellation, error propagation and usage reporting.
- Data-only runtime wheel for installation before task network isolation.

Local protocol tests and actual frozen-runtime/tool tests are included. Model
responses in deterministic integration tests are fixtures, not benchmark scores.
Production Responses endpoint and Hosted Harbor dry-run remain separate checks.
No paid jobs have been launched.

Runtime archive SHA256:
`9e224d1a3f33dc8fea97358ebbd6069b4a078502b673dfb7667bd11cc60a5729`.
