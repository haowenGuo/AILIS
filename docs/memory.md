# AILIS memory and Session history

[Index](README.md) · [中文](memory.zh-CN.md)

## Two different kinds of state

| State | Owner and purpose |
| --- | --- |
| Canonical Session history | [SessionContextStore](../electron/ailis-session-context-store.cjs): ordered messages, tool calls/results, checkpoints and recovery |
| Long-term memory | [MemoryStore](../electron/ailis-memory-store.cjs): identity, user, relationship, project blocks and remembered events |
| Model projection | [ContextCompiler](../electron/ailis-context-compiler.cjs): bounded sections supplied to the active Agent |
| Visible chat | Presentation/history; not a second authoritative execution checkpoint |
| Legacy Persona/TaskAgent stores | First-use migration sources and explicit compatibility APIs |

Personality is configuration within the main Agent's context. It is not a second model with a parallel main-conversation history.

## Retrieval and projection

The [lexical retriever](../electron/ailis-memory-lexical-retriever.cjs) ranks events using BM25 and MMR diversification. The compiler projects selected memory blocks and events with budgets. The unified context can include identity, relationship and project information alongside execution history; it does not automatically switch to the old relationship-free TaskAgent projection.

Current user messages are authoritative. A user calling AILIS a pet name does not establish a reciprocal name for that user. Uncertain forms of address should be omitted.

## Persistence, migration and privacy

Canonical checkpoints live under `<auditDir>/session-context/sessions/<sha256(sessionId)>.json`. Locks prevent competing writers. Checkpoints replace previous state rather than merging a discarded history back in. On first use, import one legacy execution or Persona checkpoint; preserve the original stores.

Long-term memory is stored locally, but anything projected into a model request can reach the configured model service. Secret values are not ordinary memory. Existing `local-file-base64` secret storage is not an OS credential vault.

## Limits

Checkpoint recovery tests do not prove semantic compression quality, accurate remembered facts, provider cache hits or good multi-hop answers. Old [memory benchmark results](ailis-memory-bm25-mmr-baseline.md) remain historical evidence, not a new evaluation of this worktree. This cleanup does not delete or migrate live user data.
