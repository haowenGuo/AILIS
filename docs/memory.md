# AILIS Memory System

[Documentation](README.md) · [简体中文](memory.zh-CN.md) · [Architecture](architecture.md) · [Retrieval Baseline](ailis-memory-bm25-mmr-baseline.md)

AILIS memory is a local Persona Memory Runtime, not a transcript dump and not a generic vector database. It keeps stable identity and relationship context, records useful events, retrieves task-relevant history, and projects a bounded memory view into each model request.

## Stored Memory

| Lane | Purpose |
| --- | --- |
| Persona block | Stable AILIS identity and interaction style |
| User block | User preferences and durable personal context |
| Relationship block | Shared interaction context and relationship state |
| Project block | Active project facts, conventions, and persistent work context |
| Memory events | Timestamped observations from conversations and completed work |
| Curated capsules | User profile, relationship profile, project items, and affinity state |
| Secret index | Names and metadata for configured secrets; raw values are excluded from normal prompt memory |

Memory state is scoped under the desktop runtime state directory. TaskAgent execution events are distinguishable from Persona memories so task traces do not automatically become relationship memories.

## Retrieval

The current production retriever is an in-memory lexical BM25 + MMR pipeline. For each request it:

1. builds a query from the active request and relevant context;
2. ranks memory events with lexical relevance;
3. applies session-repeat penalties and MMR diversification;
4. selects a bounded set of relevant and recent events;
5. compiles those events with stable memory blocks into the model context.

The default prompt projection selects up to eight relevant events and six recent events from the active Session. The exact measured parameters and evaluation evidence are recorded in [Memory Retrieval Baseline](ailis-memory-bm25-mmr-baseline.md).

## Prompt Projection

`AILISContextCompiler` gives each memory lane its own character budget. The model receives concise sections and source references rather than the entire memory database. Secret-like tokens, persona-control tags, and tool protocol fragments are removed from ordinary prompt memory.

Persona requests can receive identity, user, relationship, project, affinity, and relevant-event context. TaskAgent requests use a narrower task-oriented projection and do not automatically receive relationship tone or affinity text.

## Persistence And Privacy

- Memory databases and curated capsules remain on the user's machine by default.
- Memory included in an active model request can be sent to the configured model service.
- Raw secret values are not included in normal memory prompts.
- The current legacy secret store labels its protection as `local-file-base64`; it should not be treated as an operating-system credential vault.
- Users can inspect, update, reset, or clear memory through runtime operations.

## Current Limits

BM25/MMR retrieval is fast and strong on direct lexical evidence, but multi-hop answer construction remains weaker when evidence is distributed across several distant memories. The complete LoCoMo and LongMemEval results are reported in [Evaluation](evaluation.md); they are used to improve evidence composition without adding domain-specific routing.

## Main Source Files

| File | Responsibility |
| --- | --- |
| `electron/ailis-memory-store.cjs` | persistence, blocks, events, affinity, secret metadata, prompt view |
| `electron/ailis-memory-lexical-retriever.cjs` | BM25/MMR ranking and selection |
| `electron/ailis-context-compiler.cjs` | bounded model-visible memory projection |
| `electron/ailis-user-profile-curator.cjs` | curated profile and relationship state workflows |

Earlier V1/V2 design studies remain in the repository as history. This page is the current implementation contract.
