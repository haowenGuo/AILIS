# TaskAgent Runtime

[Documentation](README.md) · [简体中文](taskagent.zh-CN.md) · [Architecture](architecture.md) · [A7 Baseline](ailis-a7-taskagent-context-baseline.md)

TaskAgent is AILIS's task-execution lane. It shares the product Session with the Persona, but owns its own persistent Thread, canonical model history, tool calls, checkpoints, and optional long-running Goal.

## Why It Is Separate

The Persona is responsible for natural conversation and presentation. TaskAgent is responsible for doing the work. This boundary keeps task execution focused while allowing AILIS to report progress and results in a consistent character voice.

TaskAgent is not a new disposable Agent for every message. One product Session keeps one persistent TaskAgent Thread; each request creates a new Turn or steers the active Turn.

## Lifecycle

```text
Session
  -> persistent TaskAgent Thread
       -> Turn A: user task
       -> Turn B: follow-up or a different task
       -> Turn C: continuation of an active Goal
```

The Harness follows these rules:

1. If the Thread is idle, a new user request creates a new Turn.
2. If a Turn is active, new input is queued and steers that exact Turn.
3. A completed Turn stays in canonical history but does not remain the active goal.
4. An optional Goal can span Turns and can be updated, blocked, completed, or cleared.
5. Tool approvals are linked to the exact Turn and action; natural-language input does not silently approve an unrelated command.

## One Agent Iteration

The production loop is implemented in [`electron/agent-loop/core-loop.cjs`](../electron/agent-loop/core-loop.cjs). Each iteration performs the same five-stage flow:

```text
Context
  -> Model decision
  -> Action or completion
  -> Tool execution
  -> Observation recorded into canonical history
```

The model can emit multiple function calls. The runtime preserves every call, executes calls according to tool safety metadata, and records outputs with their original `call_id` before the next model request.

## Canonical Context

`ContextManager` owns ordered model-visible items instead of regenerating a bespoke transcript format on every step. It stores:

- developer and user messages;
- assistant response items;
- function, custom-tool, and tool-search calls;
- call-linked outputs;
- user-approved images;
- semantic compaction checkpoints;
- token usage and context-budget metadata.

The historical A7 baseline keeps bounded tool output in canonical history and starts semantic compaction only when the effective context budget reaches hard pressure. It does not replace the final Turn with a separate four-step summary prompt. The v1.4.1 context/tool-runtime changes and their claim boundaries are described in the [release notes](releases/v1.4.1.md); fallback compaction now preserves both developer-role and legacy user-role attachment context envelopes.

## Checkpoint And Recovery

At Turn completion, the Harness stores the next `ContextManager` checkpoint on the persistent Thread. Recovery restores the same item order, call pairing, reference context, and token metadata. A checkpoint records execution state; it does not decide what the user wants next.

Transport failures may retry from the latest canonical state. Tool or model failures are recorded as observations so the model can change strategy without losing completed work.

## Completion

TaskAgent ends naturally when the model returns a final response with no pending tool calls or inputs. The runtime still has a configurable step budget and loop protection for safety, but there is no extra finalization conversation that discards prior history.

The result packet returned to Persona contains the task status, answer, evidence and artifact references, verification state, progress summary, and the current Thread/Turn identity. Persona uses that packet to produce the user-facing response.

## Main Source Files

| File | Responsibility |
| --- | --- |
| `electron/ailis-task-agent-harness.cjs` | Thread, Turn, Goal, steering, checkpoints, result packet |
| `electron/agent-loop/core-loop.cjs` | minimal production loop control |
| `electron/agent-loop/runner.cjs` | context, model calls, tools, observations, recovery, results |
| `electron/ailis-context-manager.cjs` | canonical history, budgets, compaction, checkpoint format |
| `electron/ailis-model-input-builder.cjs` | canonical items and provider-facing request projection |
| `electron/ailis-response-model.cjs` | response item constructors and normalization |

For measured context behavior and frozen regression evidence, see [TaskAgent A7 Context Baseline](ailis-a7-taskagent-context-baseline.md).
