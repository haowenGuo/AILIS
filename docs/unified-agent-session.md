# Unified AILIS Session

The desktop main agent now owns conversation, tool execution, and its final reply in one continuous Session. Personality is part of this agent's instructions and local memory, not a second model that routes or rewrites execution results.

## Main path

`AILISDesktopChatService → gateway.runAgent → runUnifiedAgentTurn → AILISAgentRunner`

- Ordinary chat, file/image inputs, companion replies, and cowork replies use `unified_agent` and the same Session ID.
- The task/daily conversation-mode switch is removed from the desktop control panel. Legacy `daily` preferences normalize to the same main-agent path. Standalone browser/demo fallback without a gateway remains a compatibility mode, not an execution agent.
- The main path does not call `task_route`, `handoff_task`, the legacy TaskAgent dispatcher, or a Persona draft/render model.
- Tool calls and final text are native model outputs. Existing permission checks and input/output safety gates remain. Visible final delivery and conversational memory recording happen once, after the output gate.
- Character/VRM/voice surface formatting remains; it is deterministic presentation, not another language model. Explicit optional subagent jobs remain separate jobs, not the main conversation's automatic second actor.
- Unified surface formatting preserves authored answer text and code indentation verbatim; only avatar metadata is derived. See `packaged-tools-fix-20260904.md` for the packaged worker and legacy text-sanitizer corrections and real Electron smoke evidence.
- The proactive opportunity evaluator still decides whether to trigger a proactive turn. It is not a user-facing reply writer. All generated proactive replies use the main Session.

## Context and migration

Canonical checkpoints live under `<auditDir>/session-context/sessions/<sha256(sessionId)>.json`. Each Session has one writer, protected by an in-process turn record and an exclusive filesystem lock. A live owner is never killed or displaced. A proven-dead owner's exact lock can be recovered; malformed ownership information fails closed.

Checkpoints are replaced atomically, not merged. A semantic compaction cannot resurrect the discarded history from a second actor. Checkpoints are saved before each model decision and at finalization. Write failures stop the run instead of continuing with undurable context. A crash can still leave an in-flight tool call unresolved; its execution must not be assumed complete.

On first use only, import the existing TaskAgent checkpoint (preserving tool evidence), or the Persona checkpoint if no execution checkpoint exists. Do not concatenate the two divergent histories. Legacy stores and visible chat history remain intact. Legacy orchestration helpers remain for compatibility and archive tests, but are no longer reached from the desktop main path.

User/relationship/project memory is compiled into explicit developer background sections. Updates and attachment metadata are appended, not inserted into an old prefix. Current user messages remain authoritative. Legacy task-result capsules are not injected as a second current-task state. Proactive trigger context is recorded without inventing another user message.

Text arriving during an active turn uses the runner's input queue. Attachments, proactive packets, approvals, and input-queue overflow wait for the current writer to finish rather than being dropped. Different Sessions retain separate files.

## Cache and verification boundaries

The unified agent removes forced routing/reasoning-mode changes and Persona rewriting from the main chain, and uses a stable Session cache key where supported. This does **not** guarantee a cache-hit percentage: provider policy, tool-schema discovery, model switches, images, and context compaction can still cause misses. Measure `cached_tokens` / input tokens in real traces after deployment; do not infer a percentage from this refactor.

Offline tests in `tests/ailis-unified-agent.test.mjs` cover one-call delivery, restart continuity, compaction replacement, legacy migration, concurrent inputs, live-writer protection, fail-closed checkpoint writes, gates, desktop images, proactive modes, and real runner/tool execution against a local fake model server. They incur no provider charges. No installed app or live user data is migrated until that app actually uses the updated source.

Validation on 2026-09-04: 16 unified-agent tests passed; production Vite build passed in an isolated temporary output directory. Expanded 18-suite run: 246/247 passed. The remaining `ailis-context-budget.test.mjs` assertion expects generic tool-output truncation that concurrent edits to the tool-output modules removed; those unrelated edits were preserved, not reverted. No claim of measured provider-cache improvement or installed-app validation is made by these offline checks.
