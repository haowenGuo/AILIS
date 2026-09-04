# AILIS System Architecture

[Documentation](README.md) · [简体中文](architecture.zh-CN.md) · [TaskAgent](taskagent.md) · [Tools](tools.md)

AILIS combines a visible desktop companion with a general Agent runtime. The character, conversation, memory, and task execution are one product, but they are separated into explicit runtime lanes so that personality does not weaken execution and tool internals do not leak into the user experience.

## Runtime Layers

| Layer | Responsibility | Primary code |
| --- | --- | --- |
| Desktop experience | VRM rendering, chat, control panel, voice, expressions, motion, and user approvals | `src/`, `electron/main.cjs`, `electron/preload.cjs` |
| Gateway | Sessions, model access, tool registry, policy, events, audit, and platform adapters | `electron/ailis-gateway.cjs` |
| Persona runtime | Natural conversation, relationship context, and user-facing presentation | `electron/agent-loop/runner.cjs`, character and persona renderers |
| TaskAgent Harness | Persistent Thread/Turn state, steering, goals, checkpoints, and compact task results | `electron/ailis-task-agent-harness.cjs` |
| Agent Loop | Context projection, model decisions, tool calls, observations, recovery, and completion | `electron/agent-loop/` |
| Context and protocol | Canonical ResponseItems, token budgets, compaction, call/result pairing, and checkpoints | `electron/ailis-context-manager.cjs`, `electron/ailis-model-input-builder.cjs` |
| Tool runtime | Contracts, discovery, validation, execution, approvals, and normalized outputs | `electron/ailis-tool-contracts.cjs`, `electron/ailis-tool-executor.cjs` |
| Memory runtime | Persona blocks, events, project context, relationship state, retrieval, and prompt projection | `electron/ailis-memory-store.cjs`, `electron/ailis-context-compiler.cjs` |

## One User Request

```text
User input
  -> Desktop forwards the current Session and approved context
  -> Gateway opens or steers a Turn
  -> Persona handles conversation or delegates the exact task
  -> TaskAgent restores the Thread checkpoint
  -> Agent Loop builds canonical model input
  -> Model responds, calls tools, or completes
  -> Tool results return through the same call_id-linked history
  -> TaskAgent persists the new checkpoint and returns a compact result
  -> Persona presents the result with voice, expression, and motion
```

The Persona does not execute a hidden second version of the request. The TaskAgent receives an immutable task envelope and returns evidence, artifacts, status, and a result packet to the same outer conversation.

## State Model

- **Session** is the long-lived relationship and conversation boundary.
- **Thread** is the persistent TaskAgent execution history inside a Session.
- **Turn** is one user request or one explicit continuation of active work.
- **Goal** is optional durable work that can span Turns; it is not the first prompt and can be replaced or completed.
- **Checkpoint** is a replayable execution snapshot, not a goal or an approval.
- **Approval** is attached to a concrete tool action and Turn.

This separation prevents a completed task from locking future messages to its original objective.

## Context Model

AILIS stores model-visible history as canonical response items: role messages, function calls, function outputs, tool-search events, images, and compacted history items. Old items keep their order and call pairing. Context compaction is budget-driven and occurs near the effective model limit; it is not a separate forced-final-answer prompt.

The v1.4.1 runtime builds on stable append-only history, separate Persona context, and governed code-mode tools; attachment envelopes survive fallback compaction. See the [current release notes](releases/v1.4.1.md). The [A7 Context Baseline](ailis-a7-taskagent-context-baseline.md) documents the historical, scored mechanism, not a new evaluation of this release.

## Model And Local Execution

The current public release connects to the model through AILIS Cloud. The desktop still owns Persona orchestration, TaskAgent state, local memory, approvals, and computer, file, code, and artifact execution. Only model-visible context needed for the active request is relayed to the model service.

## Reliability Boundaries

- Consequential tools pass through explicit policy and approval checks.
- Tool calls and results are normalized and linked by call ID.
- TaskAgent checkpoints preserve replayable history across recovery.
- Progress, tool events, and outcomes are emitted through the Gateway event stream.
- Benchmark runners and product runtime share the Agent implementation, while adapters only provide environment-specific transport.

Continue with [TaskAgent Runtime](taskagent.md), [Memory System](memory.md), or [Tool Runtime](tools.md).
