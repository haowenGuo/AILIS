# AILIS AgentBench FC

This integration replaces the legacy AgentBench v0.2 evaluator with the current
function-calling benchmark from THUDM AgentBench.

## Contract

- The benchmark checkout is pinned by `benchmark-manifest.json` and verified by
  revision plus SHA-256 hashes before any environment or model call.
- Only the five FC environments are accepted: DB, OS, KG, ALFWorld, and WebShop.
- Official `messages`, `tools`, assistant `tool_calls`, environment observations,
  termination, and reward pass through without Persona or TaskAgent text rendering.
- Infrastructure failures are excluded from model accuracy and fail the stage gate.
- Runs are durable JSONL streams. Reusing a run ID resumes completed indices rather
  than charging the model twice.

## Stages

```powershell
pnpm bench:agentbench:fc:stage -- --stage smoke --task dbbench-std
pnpm bench:agentbench:fc:stage -- --stage pilot --task dbbench-std
pnpm bench:agentbench:fc:stage -- --stage full --task dbbench-std --approve-large-stage
```

Smoke runs exactly 3 samples, Pilot runs exactly 10, and Full requires explicit
approval. Run only one task per invocation. KG additionally requires the official
Freebase `virtuoso.db`; the integrity gate fails closed when it is absent.

If the WSL Docker CLI has no Compose plugin, the controller uses an equivalent
plain-Docker orchestration with the same official Dockerfiles, network settings,
mounts, and worker arguments. `AILIS_DOCKER_MIRROR` may name a registry mirror for
images that are not already present locally.

The bridge reads the desktop model configuration. CI or isolated runs may override
it with `AILIS_AGENTBENCH_PROVIDER`, `AILIS_AGENTBENCH_BASE_URL`,
`AILIS_AGENTBENCH_MODEL`, and `AILIS_AGENTBENCH_API_KEY`.
