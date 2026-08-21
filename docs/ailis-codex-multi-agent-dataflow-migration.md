# AILIS Codex Multi-Agent Data-Flow Migration

> **Historical migration record.** The maintained product flow is documented in [System Architecture](architecture.md) and [TaskAgent Runtime](taskagent.md).

Date: 2026-07-11

## Source Baseline

The design below is derived from the local Codex checkout rather than remembered behavior:

- Repository: `F:/CODEX/openai-codex-reference`
- Commit: `3b5ad9c0b99cdad1febc085e6eed59a86b808804`
- Multi-agent version: `MultiAgentV2`

Primary source evidence:

- `codex-rs/core/src/tools/handlers/multi_agents_spec.rs`
- `codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs`
- `codex-rs/core/src/tools/handlers/multi_agents_v2/followup_task.rs`
- `codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs`
- `codex-rs/core/src/tools/handlers/multi_agents_v2/message_tool.rs`
- `codex-rs/core/src/agent/control.rs`
- `codex-rs/core/src/session/input_queue.rs`
- `codex-rs/core/src/session/mod.rs`
- `codex-rs/core/src/context/subagent_notification.rs`
- `codex-rs/protocol/src/protocol.rs`

## Replacement Status

The former AILIS implementation modeled a TaskAgent as a synchronous compatibility tool:

```text
Persona -> subagents(action=spawn, wait=true) -> plain answer text -> Persona
```

Codex models a sub-agent as a persistent thread:

```text
root Agent
  -> spawn_agent(task_name, message, fork_turns)
  -> AgentControl.spawn_agent_with_metadata()
  -> persistent AgentPath + child thread
  -> child completion
  -> InterAgentCommunication
  -> InputQueue mailbox
  -> SubagentNotification in parent model input
  -> followup_task(target, message) when more work is needed
  -> same child thread and history continue
```

That implementation has now been removed. `AgentControl` owns a session-scoped `AgentRegistry`, persistent `AgentPath` records, child execution promises, input handlers, cancellation, and mailbox delivery. `AILISRuntime` no longer owns global `subagents`, run, controller, or input-handler maps and no longer exposes `executeSubagentRelay`.

The replacement deliberately reuses the existing TaskAgent model loop as the child thread executor. It does not preserve the old relay lifecycle around that executor.

## Codex-Named Object Model

### `AgentStatus`

Model-visible serialization must match Codex:

```text
"pending_init"
"running"
"interrupted"
"shutdown"
"not_found"
{"completed": "final assistant message"}
{"errored": "error message"}
```

No programmatic `complete/partial evidence` classifier is added. A completed child may receive another `followup_task` when the parent model decides more work is useful.

### `InterAgentCommunication`

```json
{
  "author": "/root/mavuika_guide",
  "recipient": "/root",
  "other_recipients": [],
  "content": "<subagent_notification>...</subagent_notification>",
  "trigger_turn": false
}
```

### `SubagentNotification`

```xml
<subagent_notification>
{"agent_path":"/root/mavuika_guide","status":{"completed":"..."}}
</subagent_notification>
```

### `InputQueue`

The parent session owns:

```text
mailbox_pending_mails
mailbox_waiters
idle_pending_input
```

Required methods keep Codex naming:

```text
subscribe_mailbox()
enqueue_mailbox_communication()
drain_mailbox_input_items()
get_pending_input()
```

### Model-Visible Tools

The Persona tool surface must use Codex MultiAgentV2 names and field names:

```text
spawn_agent(task_name, message, fork_turns?, agent_type?, model?, reasoning_effort?, service_tier?)
followup_task(target, message)
wait_agent(timeout_ms?)
list_agents(path_prefix?)
close_agent(target)
```

The old `subagents(action=...)`, `sessions_spawn`, and `sessions_yield` tools are deleted rather than hidden. No compatibility route remains in contracts, tool specs, tool runtime registration, Gateway session tools, or model capability text.

## Codex Call Stack and Pseudocode

### 1. Spawn

Source evidence:

- `create_spawn_agent_tool_v2()`
- `handle_spawn_agent()`
- `AgentControl.spawn_agent_with_metadata()`
- `AgentControl.spawn_agent_internal()`
- `AgentControl.spawn_forked_thread()`
- `keep_forked_rollout_item()`

```text
function spawn_agent(task_name, message, fork_turns = "all"):
    parent_path = current_turn.session_source.agent_path or "/root"
    child_path = parent_path.join(task_name)
    reject duplicate live child_path

    fork_mode = parse("none" | "all" | positive integer)
    child_config = build_agent_spawn_config(parent_turn)

    if fork_mode != none:
        parent.flush_rollout()
        history = parent.read_stored_history()
        history = truncate_to_last_n_turns(history, fork_mode)
        history = history.filter(keep_forked_rollout_item)
        child = fork_thread_with_source(history, child_path)
    else:
        child = spawn_new_thread_with_source(child_path)

    AgentControl.send_input(child.id, message)
    return {task_name: child_path, nickname: child.nickname}
```

`keep_forked_rollout_item()` rules copied semantically from Codex:

```text
keep system/developer/user messages
keep assistant messages only when phase == final_answer
drop reasoning
drop function_call/function_call_output
drop tool_search_call/tool_search_output
drop web_search_call
drop shell calls
drop process commentary
preserve compacted history and reference context when valid
```

For AILIS, Persona system instructions are not part of the fork checkpoint. The child receives TaskAgent base instructions plus sanitized task-relevant ResponseItems, so relationship memory, expression rules, TTS rules, and Persona-only prompts remain isolated.

### 2. Completion Delivery

Source evidence:

- `Session.forward_child_completion_to_parent()`
- `format_subagent_notification_message()`
- `SubagentNotification.render()`
- `AgentControl.send_inter_agent_communication()`
- `InputQueue.enqueue_mailbox_communication()`

```text
function forward_child_completion_to_parent(child, status):
    notification = SubagentNotification(child.agent_path, status).render()
    communication = InterAgentCommunication(
        author = child.agent_path,
        recipient = child.agent_path.parent,
        other_recipients = [],
        content = notification,
        trigger_turn = false
    )
    AgentControl.send_inter_agent_communication(parent, communication)
```

The completion body does not travel through `wait_agent` and is not flattened into the `spawn_agent` tool output.

### 3. Parent Mailbox Injection

Source evidence:

- `InputQueue.get_pending_input()`
- `InputQueue.drain_mailbox_input_items()`

```text
before each parent model decision:
    pending_user_input = parent_input_queue.pending_input
    mailbox_items = parent_input_queue.drain_mailbox_input_items()
    context_manager.record_items(pending_user_input + mailbox_items)
```

`InterAgentCommunication.to_response_input_item()` is an assistant commentary `ResponseItem` containing the structured communication JSON. It keeps author and recipient identity available to the model without presenting internal orchestration to the user.

### 4. Follow-Up on the Same Agent

Source evidence:

- `create_followup_task_tool()`
- `handle_message_string_tool(... TriggerTurn ...)`
- `AgentControl.send_inter_agent_communication()`

```text
function followup_task(target, message):
    child = resolve_agent_target(target)
    communication = InterAgentCommunication(
        author = current_agent_path,
        recipient = child.agent_path,
        content = message,
        trigger_turn = true
    )
    child.input_queue.enqueue_mailbox_communication(communication)
    child.start_next_turn_from_existing_context()
```

The same TaskAgent keeps its ContextManager, Evidence Manifest, output references, tool observations, and compressed checkpoint. The parent sends only the new instruction.

### 5. Wait

Source evidence:

- `create_wait_agent_tool_v2()`
- `wait_for_mailbox_change()`

```text
function wait_agent(timeout_ms):
    changed = await parent.input_queue.subscribe_mailbox(timeout_ms)
    return {
        message: changed ? "Wait completed." : "Wait timed out.",
        timed_out: !changed
    }
```

The next model round drains the completion notification from the mailbox. Returning child content from `wait_agent` would create two competing data channels and must not be done.

## AILIS Function-Level Migration Matrix

| Codex name | AILIS target | Required change |
| --- | --- | --- |
| `AgentStatus` | `electron/ailis-agent-control.cjs` | Add Codex-compatible tagged status serialization. |
| `InterAgentCommunication` | `electron/ailis-agent-control.cjs` | Add exact fields and `to_response_input_item()`. |
| `SubagentNotification` | `electron/ailis-agent-control.cjs` | Add exact `agent_path/status` envelope. |
| `InputQueue` | `electron/ailis-agent-control.cjs` | Add parent mailbox, waiters, drain and pending-input APIs. |
| `AgentControl` | `electron/ailis-agent-control.cjs` | Own stable paths, spawn/follow-up/wait/list/close and completion forwarding. |
| `spawn_agent` | tool contracts/specs/runtime | Replace Persona `subagents(action=spawn)` surface. Return handle immediately. |
| `followup_task` | tool contracts/specs/runtime | Require explicit `target`; continue the same TaskAgent. |
| `wait_agent` | tool contracts/specs/runtime | Wait only for mailbox state; do not return result content. |
| `list_agents` | tool contracts/specs/runtime | Return `agent_name`, `agent_status`, `last_task_message`. |
| `close_agent` | tool contracts/specs/runtime | Close the target and return `previous_status`. |
| `keep_forked_rollout_item` | `electron/ailis-agent-runner.cjs` | Build sanitized parent ContextManager checkpoint. |
| `drain_mailbox_input_items` | `electron/ailis-agent-runner.cjs` | Inject completion ResponseItems before each parent decision. |
| legacy `subagents` | removed | Delete contract, spec, runtime dispatch, global maps, relay methods, prompts, OpenClaw surface entries, and evaluation settlement workarounds. |

## Implemented Runtime Invariants

- One `AgentRegistry` tree is owned per root session; `list_agents` and target resolution cannot cross session boundaries.
- One direct child may be live under the same parent path. A second spawn returns `agent_thread_limit_reached` with the existing target instead of creating duplicate semantic work.
- `followup_task` enters the live child input handler or resumes the same stable Agent record from its semantic checkpoint.
- Mailbox storage is session-scoped, so a child completion is not lost when the parent HTTP run id changes.
- Before Persona safety finalization, the Harness waits for live direct children and injects completed mailbox items into the final model request.
- Forked history follows Codex rollout filtering and structurally removes Persona relationship memory, capability catalog, and external tool exposure while retaining runtime environment and attachments.
- Unknown terminal provider statuses normalize to `Errored`, never `NotFound`.
- Invalid native tool observations preserve provider `reasoning_content` for DeepSeek/Qwen chat round trips.

## Acceptance Tests

### Contract tests

- Persona tools contain Codex names and exact snake_case fields.
- Persona tools do not contain `subagents`.
- Runtime source contains no legacy relay/global-map symbols.
- All schemas reject unknown fields.

### History fork test

Parent history contains user messages, final assistant output, commentary, reasoning, tool calls, and tool outputs. Child fork must retain only user messages and final assistant output plus its TaskAgent instructions.

### Mailbox test

Child completion must enqueue exactly one `InterAgentCommunication`. `wait_agent` returns only wait status. The next parent model request contains exactly one completion notification.

### Isolation and lifecycle tests

- Two sessions may use the same canonical task name without seeing each other's Agent records.
- A delayed child completion remains available to a later parent run in the same session.
- A second live direct child is rejected without starting another model call.
- Provider failure is delivered as `{"errored":"..."}` and retains a resumable handoff package.

### Continuation test

```text
spawn_agent(task_name="mavuika_guide")
child completes
followup_task(target="mavuika_guide")
```

Assertions:

- only one stable `agent_path` exists;
- no second TaskAgent record is created;
- child run id advances but TaskAgent identity remains the same;
- previous ContextManager checkpoint and tool observations remain available;
- parent receives the second completion through the same mailbox path.

### Live guide regression

Expected healthy chain:

```text
Persona round 1: spawn_agent
Persona round 2: wait_agent
TaskAgent: at most 3 work rounds + 1 finalization round
Persona round 3: final answer
```

If the parent decides more evidence is needed:

```text
Persona: followup_task(target=existing task_name)
Persona: wait_agent
same TaskAgent: continue from checkpoint
Persona: final answer
```

The number of TaskAgent identities for one guide task must remain one unless the model explicitly creates a genuinely independent task name.
