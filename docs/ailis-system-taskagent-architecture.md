# AILIS System TaskAgent Architecture

## 长程任务优化

AILIS 是唯一面向用户的 Persona，TaskAgent 是唯一的任务执行 Agent。长程任务优化保留 A6 的执行循环，将原先的“一个 Session 等于一个固定 Task”替换为 Codex-style 持久 Thread、多 Turn 和可选 Goal。

核心边界：

- 模型负责理解当前请求和 Goal 语义。
- Harness 只负责持久化、Turn 调度、结构校验、并发保护和审批绑定。
- 不使用正则、关键词、相似度阈值或 task-type 分支判定新旧任务。
- Checkpoint 是历史恢复基点，不是 Goal，也不是 Thread 身份。

## Durable State

```text
Persistent TaskAgent Thread
├─ canonical Turns[]
│  └─ inputs / result boundary / refs
├─ historyCheckpoint?
├─ activeTurnId?
├─ pendingApproval?
├─ activeGoal?
└─ goalHistory[]
```

```js
{
  threadId: string,
  sessionId: string,
  childSessionId: string,
  turns: [{
    turnId: string,
    runId: string,
    request: string,
    latestRequest: string,
    inputs: Array<{ inputId, message, createdAt }>,
    status: string,
    finalAnswer: string,
    traceRef: string
  }],
  activeTurnId: string,
  activeGoal: null | {
    goalId: string,
    objective: string,
    status: 'active' | 'blocked',
    createdAt: string,
    updatedAt: string
  },
  goalHistory: Goal[],
  historyCheckpoint: object | null,
  pendingApproval: null | {
    approvalId: string,
    turnId: string,
    itemId: string
  }
}
```

## Turn Scheduling

```text
Thread idle + user request
└─ create a new Turn

regular Turn running + follow-up input
└─ steer the same Turn
   └─ validate expected Turn id when supplied

Turn waiting for approval + exact approval id
└─ resume the same Turn

Turn waiting for approval + unrelated input
└─ deliver input without executing the pending action
```

`handoff_task` 仍然是无参数工具。Harness 从当前 Turn Context 获取不可变用户消息，Persona 无法重写任务文本或伪造生命周期指令。

## Optional Goal

Goal 是显式、可选的长程目标，不是第一条用户消息，也不是每个 Turn 的必选状态。

TaskAgent 模型可以调用 `task_goal`：

```text
get | create | replace | complete | block | resume | clear
```

约束：

1. 普通请求和跟进请求只创建 Turn，不自动创建 Goal。
2. 只有模型理解到用户明确的长程目标意图时，才发出结构化 Goal 操作。
3. 活跃 Goal 的修改必须提交 `expected_goal_id`。
4. Harness 同时校验 active Turn id，拒绝旧 Turn 或旧 Goal 回调污染新状态。
5. 意图含糊时由模型询问用户，运行时不猜测。

## Approval Identity

TaskAgent 工具审批的持久身份为：

```text
threadId + turnId + itemId + approvalId
```

`继续` 是普通自然语言输入，不是审批凭证。前端只在用户发出明确的确认/取消命令时，传回当前界面持有的精确 `approvalId`。Harness 拒绝其他 Turn 的审批 id。

## Compatibility Migration

State v1 启动时自动升级为 v2：

- 原 `taskId` 转为稳定 Thread 身份。
- `latestRequest` 转为历史 Turn。
- `checkpoint` 转为 `historyCheckpoint`。
- 证据、输出、候选答案和 unresolved fields 无损保留。
- v1 `originalGoal` 从未经用户/模型显式建立为 Goal，因此只作为历史保留，不迁移为 `activeGoal`。

这条规则保证旧的“哈哈/天气” `originalGoal` 不会继续锁死新请求。

## TaskResult Boundary

TaskResult 保持 `ailis.task_result.v1` 兼容，新增：

```js
{
  optimization: '长程任务优化',
  thread_id: string,
  turn_id: string,
  active_goal: Goal | null,
  approval_id: string,
  approval_item_id: string
}
```

Persona 仍然只获取紧凑 TaskResult，不获取 TaskAgent 原始工具日志、隐藏推理或完整 checkpoint。

## Acceptance Tests

- 空闲请求产生不同 Turn，但保持同一 Thread 和 checkpoint 历史。
- 运行中跟进进入当前 Turn，不启动第二个 TaskAgent。
- 没有结构化 `task_goal` 调用时，`activeGoal` 始终为 null。
- Goal 替换生成新 `goalId`，并保留 goal history。
- 旧 Goal/Turn 的并发写入被拒绝。
- v1 的已完成或未完成 `originalGoal` 都不会获得 active Goal 权限。
- 审批只能恢复它所属的 Turn；错误 id 不会执行工具。
- `继续` 不会触发旧审批。
