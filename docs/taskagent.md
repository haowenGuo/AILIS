# Unified Agent runtime

[Index](README.md) · [中文](taskagent.zh-CN.md) · [Architecture](architecture.md)

The filename is a legacy link. The main conversation no longer uses a Persona-to-TaskAgent-to-Persona pipeline.

## Lifecycle

1. Resolve the Session and acquire its exclusive writer.
2. Restore its canonical checkpoint; migrate one legacy history only if none exists.
3. Run the model and tools through [AgentRunner](../electron/agent-loop/runner.cjs).
4. Record paired calls/results in the same history. Save checkpoints before model decisions and at finalization.
5. Apply the final output gate and return the model's answer without a second actor rewriting it.
6. Release Session ownership.

Text submitted during a running turn can steer its input queue. Attachments, approval packets and inputs that cannot safely enter that queue wait for the writer. An accepted steer can return `deferAssistantCommit`; this is not the former background Persona answer pipeline.

## Tools

Normal direct exposure is `exec` / `exec_wait`; nested tool definitions are carried in the code-mode profile. Some protocol tools, such as enabled `task_verify`, remain direct. A missing top-level `read` function therefore does not mean file reading was removed.

Permissions, action validation, tool output references and call/result pairing remain enforced. A tool error, missing evidence or an unresolved in-flight call is not proof of successful work.

## Checkpoints and compatibility

[SessionContextStore](../electron/ailis-session-context-store.cjs) uses atomic checkpoint replacement and exclusive locks. First-use migration prefers the legacy execution checkpoint, then Persona history; it never concatenates the two. The main path does not write new turns back to both old stores.

Explicit TaskAgent APIs still retain Thread/Turn/Goal semantics. They are compatibility or explicit job interfaces, not an automatic second actor for every chat.

## Verification

[Unified tests](../tests/ailis-unified-agent.test.mjs) cover recovery, steering, gates, migration and tool execution against a local fake model. [Hosted tests](../tests/ailis-hosted-runtime.test.mjs) verify direct delivery, restart memory and shared Session history. [Consolidation tests](../tests/ailis-code-consolidation.test.mjs) guard against reintroducing the removed scheduler and losing the address-direction policy.

Budget and compaction components exist, but the unified semantic-compaction trigger is an open audit item. Cache hit rate and end-to-end latency require real traces after an explicitly deployed build.
