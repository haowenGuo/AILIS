# AILIS System TaskAgent Architecture

## Goal

AILIS is the only user-facing persona. TaskAgent is the only task-execution agent. The Harness owns their transport, lifecycle, context budgets, and durable state.

This removes the current topology in which Persona creates, names, waits for, resumes, and closes child agents. Persona makes one semantic choice: answer naturally or hand the exact user request to the system TaskAgent. No regex, keyword router, or task-type branch substitutes for that model decision.

## Runtime Boundaries

| Lane | Owner | Model visibility | Durable form |
| --- | --- | --- | --- |
| Persona identity, relationship, preferences | AILIS | Persona only | Memory/profile store |
| Visible conversation | Desktop chat | Persona; compact excerpts only when needed elsewhere | Chat history |
| Current user task request | Harness | Persona and TaskAgent | Task record |
| Task working context | TaskAgent | TaskAgent only | Context-manager checkpoint |
| Tool observations | TaskAgent | TaskAgent budgeted view | Transcript/output store |
| Evidence and sources | TaskAgent | TaskAgent; compact result packet to Persona | Evidence Manifest/source refs |
| Generated artifacts | TaskAgent | References to Persona | Output refs/artifact store |
| Final presentation | AILIS | User-visible | Persona surface/chat record |

## Call Flow

```text
user message
    -> AILIS Persona turn
        -> ordinary conversation: assistant message -> Persona surface -> user
        -> task execution: handoff_task({ message: exact user text, continuation })
            -> SystemTaskAgentHarness
                -> resolve lifecycle from durable task state
                -> run or resume the single system TaskAgent
                -> compact full execution into TaskResultPacket
            -> handoff_task result observation
        -> AILIS renders TaskResultPacket -> Persona surface -> user
```

The handoff call blocks until the current TaskAgent turn reaches a result boundary. Persona does not call `wait_agent`, read a mailbox, create another agent, or decide how to resume a checkpoint.

## Contracts

### PersonaToTaskAgentHandoff

```js
{
  message: string,                  // exact current user request; required
  continuation?: 'auto' | 'continue' | 'new'
}
```

`continuation` is a semantic hint from the model, not a regex-derived decision. `auto` continues only an unfinished task; `continue` may resume the most recent checkpoint; `new` starts clean. The Harness validates this enum but never rewrites `message`.

### TaskRecord

```js
{
  taskId: string,
  sessionId: string,
  originalGoal: string,
  latestRequest: string,
  status: 'running' | 'completed' | 'incomplete' | 'failed' | 'interrupted',
  childSessionId: string,
  latestRunId: string,
  checkpoint: object | null,
  evidenceRefs: string[],
  outputRefs: string[],
  sourceRefs: SourceRef[],
  unresolvedFields: string[],
  createdAt: string,
  updatedAt: string
}
```

### TaskResultPacket

```js
{
  schema: 'ailis.task_result.v1',
  task_id: string,
  status: string,
  original_goal: string,
  current_request: string,
  final_answer: string,
  partial_answer: string,
  source_refs: SourceRef[],
  evidence_refs: string[],
  output_refs: string[],
  unresolved_fields: string[],
  trace_ref: string,
  checkpoint_available: boolean
}
```

Only this compact packet returns to Persona. `steps`, raw tool outputs, hidden reasoning, full checkpoints, and internal mailbox state remain outside Persona context.

## Harness Pseudocode

```js
async function handoffTask(input, turnContext) {
  assertStrictSchema(input)
  const request = input.message // preserve verbatim
  const session = loadSessionTaskState(turnContext.sessionId)

  if (session.inFlight) {
    enqueueIntoTaskAgentInput(session.taskId, request)
    return await session.inFlight
  }

  const prior = selectPriorTaskByLifecycleHint(session, input.continuation)
  const task = prior ? resumeTaskRecord(prior, request) : createTaskRecord(request)
  persist(task)

  const fullResult = await executeTaskAgent({
    stableTaskId: task.taskId,
    originalUserGoal: task.originalGoal,
    message: request,
    inheritanceMode: prior?.checkpoint ? 'checkpoint' : 'clean',
    checkpoint: prior?.checkpoint,
    maxAgentSteps: 4
  })

  const packet = buildTaskResultPacket(fullResult, task)
  persistTaskCheckpointAndRefs(task, fullResult)
  savePublicResultCapsule(packet)
  return packet
}
```

`selectPriorTaskByLifecycleHint` is lifecycle logic only. It does not inspect task text. Semantic continuity comes from the model-provided enum; `auto` uses deterministic status (`unfinished` versus `completed`) rather than keyword matching.

## Persona Prompt Invariants

1. Keep ordinary conversation direct and natural.
2. For concrete task execution, call `handoff_task` once with the user's actual request.
3. Do not invent a broader task, stricter evidence requirement, task name, or subtask plan in the handoff.
4. Treat `TaskResultPacket` as the factual boundary. Rephrase tone, but never add unsupported names, numbers, quotes, links, or conclusions.
5. Never expose TaskAgent, Harness, tool protocol, checkpoint, trace, or internal status markup to the user.
6. Dynamic facts without fresh evidence go through TaskAgent instead of being guessed from pretrained memory.

## TaskAgent Prompt Invariants

1. `original_user_goal` remains authoritative across resumed turns.
2. `delegated_task` is the exact current user request and may refine but not erase the original goal.
3. Use tools and evidence naturally; the model decides whether evidence is sufficient.
4. Stop with the best supported result when the evidence is reasonable; safety budgets are fuses, not semantic completion rules.
5. Return a result boundary with answer, unresolved fields, Evidence Manifest, Output Refs, source refs, and checkpoint.

## Migration Steps

1. Add `SystemTaskAgentHarness` and a strict `handoff_task` tool.
2. Change Persona's direct tool surface to only `handoff_task`.
3. Hide legacy `spawn_agent`, `followup_task`, `wait_agent`, `list_agents`, and `close_agent` from all model-visible surfaces.
4. Keep legacy classes temporarily loadable for transcript compatibility, but remove them from the active execution path.
5. Cap Persona's loop as a safety fuse; keep TaskAgent's four-round budget unchanged.
6. Replace old spawn/mailbox tests with handoff, continuation, result-boundary, and context-isolation tests.

## Acceptance Tests

- Ordinary chat produces no TaskAgent run.
- One task request produces exactly one Harness handoff and one TaskAgent run.
- Persona cannot call legacy collaboration tools because they are absent from its tool array.
- TaskAgent cannot call Persona handoff or legacy collaboration tools.
- The exact current user request and original goal arrive unchanged in TaskAgent context.
- A completed result returns to Persona without raw steps, tool logs, or checkpoint payload.
- An unfinished follow-up resumes the saved checkpoint; `new` starts clean.
- Concurrent follow-up input is queued into the existing TaskAgent turn instead of spawning another TaskAgent.
- Persona output contains no DSML, tool-call markup, internal JSON, or unsupported factual additions.
