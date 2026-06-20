# AILIS GAIA Auto Optimizer Acceptance

The framework is considered operational when:

- It can create or resume a durable job under `longrun/jobs/ailis-gaia-auto-optimizer`.
- It can select one GAIA/GIAI task per iteration from practice or official sources.
- It records append-only events, progress, state, chain extraction, verdicts, and repair tickets.
- It classifies failures into Tools/MCP, web retrieval MCP, Agent architecture, Harness/finalization, environment, or model reasoning.
- It treats successful tasks as efficiency targets and records loop-count/performance issues.
- It avoids writing task-specific hacks and names the generalized capability to repair.
- It can run in dry-run/smoke mode without external LLM calls.
- It can run a real iteration when local LLM settings and GAIA files are available.

Full completion means all queued GAIA/GIAI tasks have a passing verdict, with failures repaired through generalized patches and verified by focused regression tests.
