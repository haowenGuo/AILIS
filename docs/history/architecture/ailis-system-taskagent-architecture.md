# AILIS System TaskAgent Architecture

> Archived historical design/implementation; not the current runtime contract. See the [current documentation](../../README.md). Original location: `docs/ailis-system-taskagent-architecture.md`.


> **Historical implementation snapshot.** Read [TaskAgent Runtime](../../taskagent.md) for the maintained Thread/Turn, context, checkpoint, and completion contract.

Last verified against: `fbf2454dbf32562d995b221386ce95d996b9fcb9`

State schema: `TASK_HARNESS_STATE_VERSION = 3`

## Goal

AILIS is the only user-facing persona. TaskAgent is the only task-execution
agent. The Harness owns routing, Thread/Turn lifecycle, checkpoints, steering,
Goal state, and the compact result boundary.

The Persona makes one semantic choice: answer as conversation or dispatch the
exact user input to TaskAgent. A regex, keyword router, benchmark branch, or
rewritten hidden task must not replace that model decision.

## Runtime Boundaries

| Lane | Owner | Model visibility | Durable form |
| --- | --- | --- | --- |
| Persona identity and relationship | Persona runtime | Persona only | Memory/profile store |
| Visible conversation | Gateway/Desktop | Persona; TaskAgent receives a bounded immutable envelope | Chat history and Turn envelope |
| Current user input | Harness | Persona and TaskAgent | Turn input item |
| Current execution | TaskAgent Runner | TaskAgent only | Active Turn and ContextManager history |
| Optional long-term Goal | Harness, mutated by active TaskAgent Turn | TaskAgent | `activeGoal` plus `goalHistory` |
| Tool calls and observations | ContextManager/Runner | TaskAgent budgeted view | Canonical ResponseItems plus output store |
| Evidence and artifacts | TaskAgent | TaskAgent; compact refs returned to Persona | Source/output/artifact refs |
| Final presentation | Persona/Gateway | User-visible | Chat record |

## Current Call Flow

```text
user message
  -> Gateway opens or steers a product turn
  -> Persona chooses chat or execute
     -> chat: Persona result reaches the user
     -> execute: SystemTaskAgentHarness.dispatchTurn()
        -> if a TaskAgent Turn is already running:
             verify expectedTurnId
             enqueue the exact input into that Runner
             append user.steer to the Thread ledger
        -> otherwise:
             load or create the persistent Thread for the product Session
             create a new Turn for the exact input
             restore the Thread ContextManager checkpoint when present
             run the private TaskAgent
        -> convert Runner output to TaskResultPacket
        -> append Turn completion to canonical checkpoint
        -> clear activeTurnId and persist Thread
  -> Persona renders the compact result
```

The persistent object is the TaskAgent Thread, not the first task. Each idle
user input creates a new Turn in the same Thread. A message received while a
Turn is running steers that exact Turn; it does not create a second TaskAgent.

## Durable Contracts

### Thread

```js
{
  threadId: string,
  sessionId: string,
  childSessionId: string,
  turns: Turn[],
  activeTurnId: string,
  activeGoal: Goal | null,
  goalHistory: Goal[],
  ledger: LedgerEntry[],
  contextCheckpoint: ContextManagerCheckpoint | null,
  outputRefs: string[],
  sourceRefs: SourceRef[],
  unresolvedFields: string[],
  traceRef: string,
  createdAt: string,
  updatedAt: string
}
```

### Turn

```js
{
  turnId: string,
  sessionId: string,
  runId: string,
  request: string,
  latestRequest: string,
  inputs: [{ inputId, message, createdAt }],
  envelope: {
    sessionId,
    turnId,
    userMessage,
    attachments,
    visibleHistory,
    createdAt
  },
  status: 'running' | 'completed' | 'failed' | 'interrupted',
  resultStatus: string,
  finalAnswer: string,
  traceRef: string,
  createdAt: string,
  updatedAt: string,
  completedAt: string
}
```

`request` is the input that created the Turn. `latestRequest` and `inputs`
record steering without changing the identity of the active Turn.

### Goal

```js
{
  goalId: string,
  objective: string,
  status: 'active' | 'blocked' | 'completed' | 'replaced' | 'cancelled',
  reason: string,
  createdAt: string,
  updatedAt: string,
  completedAt: string
}
```

Goal mutation is accepted only from the active `turnId`. `expected_goal_id`
provides compare-and-swap conflict protection. Replacing, completing, or
clearing a Goal moves the prior value to `goalHistory`.

Important current boundary: Goal state is durable but scheduler-passive. The
baseline does not automatically create another Turn after the current Turn
ends. A future Goal Engine must be implemented separately and must prioritize
queued user input over automatic continuation.

### TaskResultPacket

```js
{
  schema: 'ailis.task_result.v1',
  thread_id: string,
  turn_id: string,
  task_id: string,
  status: string,
  original_goal: string,
  active_goal: Goal | null,
  current_request: string,
  final_answer: string,
  display_text: string,
  partial_answer: string,
  source_refs: SourceRef[],
  output_refs: string[],
  unresolved_fields: string[],
  trace_ref: string,
  checkpoint_available: boolean
}
```

Only this compact result crosses back to Persona. Raw tool output, hidden
reasoning, the full checkpoint, and internal ledger state stay in TaskAgent.

## Context and Checkpoint Semantics

1. A clean Thread starts with no ContextManager checkpoint.
2. After each Turn, the Runner checkpoint is sanitized and stored on the
   Thread.
3. Turn completion is appended to that checkpoint as canonical user/assistant
   history.
4. Legacy task checkpoints are migrated to Session history and stripped of
   active authority such as old `originalGoal` or `currentRequest` fields.
5. On the next Turn, the latest input and current active Goal are authoritative;
   completed commands and stale errors are historical observations.
6. A7 keeps tool-layer-bounded outputs in canonical history and waits until the
   absolute Luna hard threshold before semantic replacement.

## Steering Semantics

Gateway binds a user follow-up to `expectedTaskAgentTurnId`. The Harness rejects
a mismatch instead of guessing which execution to steer. If the Runner's input
handler is ready, the message is delivered immediately; otherwise it is queued
and flushed when the handler registers.

Natural language such as “continue” is ordinary user input. It is not an
approval event and does not identify a stale command. Approvals require their
own structured identity and policy path.

## Termination and Budget

The TaskAgent model ends a Turn naturally by returning an assistant result with
no further tool continuation. The baseline Runner has a default 30-step safety
fuse and model/transport deadlines, but A7 does not create a synthetic final
prompt that discards canonical history.

The safety fuse is not a semantic completion policy. If it triggers, the system
must preserve checkpoint and unresolved state rather than fabricate completion.

## Prompt Invariants

### Persona

1. Keep ordinary conversation direct and natural.
2. Dispatch the exact current input when execution is needed.
3. Do not invent a broader task, stricter evidence rule, or hidden subtask.
4. Treat TaskResultPacket as the factual boundary.
5. Do not expose TaskAgent protocol, checkpoint, trace, or raw tool logs.

### TaskAgent

1. The latest Turn input is authoritative for the current action.
2. An active Goal is optional durable context, not an immutable first prompt.
3. The model owns planning, evidence sufficiency, tool choice, and natural
   ending.
4. The runtime owns environment truth, permissions, tool execution, budgets,
   persistence, and replay.
5. Return the best supported result plus unresolved fields and durable refs.

## Acceptance Tests

- Ordinary chat produces no TaskAgent Turn.
- A new idle request creates a new Turn in the same Thread.
- A running request can be steered only with the active `turnId`.
- Concurrent input is queued into the active Turn and does not spawn a second
  TaskAgent.
- A completed first request cannot remain an immutable goal for later requests.
- Goal changes from stale Turns are rejected.
- Legacy checkpoints cannot regain active task authority after migration.
- The exact current user input reaches TaskAgent without keyword rewriting.
- Completed results return without raw checkpoint or tool payload leakage.
- Restart marks an interrupted active Turn and keeps the Thread recoverable.
- A7 checkpoint replay preserves the configured full-history tool-output mode.

For the source-level audit, performance evidence, and next architecture phases,
see [Harness Architecture Audit and Roadmap](../../ailis-harness-architecture-audit-roadmap.md).
