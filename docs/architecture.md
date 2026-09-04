# AILIS architecture: one main Agent

[Index](README.md) · [中文](architecture.zh-CN.md)

Scope: the unreleased unified worktree, not the earlier public 1.4.1 tag.

## Execution and ownership

```text
Desktop chat / hosted tenant
    -> Gateway.runAgent
    -> runUnifiedAgentTurn: acquire Session writer, restore checkpoint
    -> AgentRunner: context -> model -> tools -> observations
    -> final gate -> one visible answer and memory recording
    -> save Session checkpoint, release writer
```

The model decides meaning, tool use and final content. The harness enforces schema, permissions, budgets, lifecycle and evidence preservation. Avatar, speech and expression handling are presentation, not a second language-model rewrite.

| Boundary | Implementation |
| --- | --- |
| Desktop chat | [ailis-chat-service.js](../src/ailis-chat-service.js) |
| Tenant isolation | [ailis-hosted-runtime.cjs](../electron/ailis-hosted-runtime.cjs) |
| Main scheduling and gates | [ailis-gateway.cjs](../electron/ailis-gateway.cjs) |
| Execution loop | [agent-loop/](../electron/agent-loop/) |
| Durable Session owner | [ailis-session-context-store.cjs](../electron/ailis-session-context-store.cjs) |
| Context and memory projection | [context manager](../electron/ailis-context-manager.cjs), [compiler](../electron/ailis-context-compiler.cjs) |
| Tool dispatch and code-mode worker | [tool runtime](../electron/ailis-tool-runtime.cjs), [code-mode runtime](../electron/ailis-code-mode-runtime.cjs) |

## Compatibility is not the main chain

The main path does not automatically call `task_route`, `handoff_task` or a Persona draft/render model. Explicit compatibility handoffs, task harness APIs and legacy checkpoint readers still exist. Their consumers must be migrated before deleting those modules. Browser/demo fallback without a Gateway is not equivalent to the full execution Agent.

The obsolete `runTaskAgentControlledPersonaTurn` scheduler and private draft helper were removed. Unconnected Kokoro/VITS JavaScript adapters and the unused character-lab prototype were also removed; active ElevenLabs/CosyVoice3 and character modules remain.

## Limits

Offline regression tests do not measure answer quality, provider caching or installed-app behavior. The current unified context mode still needs a separate audit of the semantic-compaction trigger; do not assume old A7 compaction results apply here. Legacy scripts and adapters may have independent entry points outside this main flow.
