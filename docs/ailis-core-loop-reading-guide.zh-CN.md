# AILIS 核心 Loop 与渲染系统快速阅读指南

本文只解释真正控制程序运转的主链，先跳过评测、安装器、离线运行包、兼容层和大量工具实现。

本文对应独立精简工作树中的未发布统一 Agent 代码，不代表旧版 1.4.1 标签。

## 先记住三个入口

- 最小生产 Agent Loop：`electron/agent-loop/core-loop.cjs`
- Agent 公共入口：`electron/agent-loop/index.cjs`
- 渲染：`src/rendering/index.js`

旧转发文件已删除，运行时和测试直接使用上述公共入口。

## Agent 请求执行流

```text
聊天 UI
  src/ailis-chat-service.js: fetchAssistantTurn()
        ↓ window.ailisDesktop.runAgent
Electron preload
  electron/preload.cjs
        ↓ IPC: ailis:gateway-agent-run
Electron main
  electron/main.cjs
        ↓
Gateway
  electron/ailis-gateway.cjs: runAgent()
        ↓ 主对话
  runUnifiedAgentTurn()
        ↓ 同一个持久 Session
  AILISAgentRunner.runMessage()
                              ↓
                    runLlmAgentLoop()
                              ↓
                    runCoreAgentLoop()
                              ↓
              Decision → Tool → Observation
                    ↑                 │
                    └─────────────────┘
                              ↓
                      final / blocked
```

主对话由同一个 Agent 理解请求、调用工具并输出最终回答；人格是配置，不再有主对话的 Persona 草稿、TaskAgent 接力和二次改写。显式任务 API、旧会话迁移仍保留。`core-loop.cjs` 是公共循环内核，Gateway、会话记忆、安全检查、工具和渲染仍各有职责。

### `runMessage()` 做什么

`electron/agent-loop/runner.cjs` 中的 `runMessage()` 是一次 Agent 请求的生命周期入口，主要负责：

1. 合并请求上下文和权限设置，生成 `runId`、`sessionId`。
2. 检查是否在恢复调试断点、待审批工具调用或待确认计划。
3. 建立 active run，发送 `agent.run.started` 事件。
4. 当前产品路径进入 `runLlmAgentLoop()`。
5. 对旧 rule-agent 路径保留兼容处理；理解主链时先跳过它。

### `runLlmAgentLoop()` 做什么

`runLlmAgentLoop()` 会把“一整轮业务”定义为 `runIteration()`，再交给 `core-loop.cjs` 控制轮次。每轮可以按六步理解：

1. **组装上下文**：把用户消息、会话、附件、Persona、任务状态、历史 Observation、工具规格和 token 预算编译成模型输入。
2. **请求模型决策**：`callLlmAgentDirectToolDecision()` 调用模型。模型负责决定结束、阻塞、加载更多上下文或调用工具。
3. **验证决策**：只做 schema、工具契约、循环保护、权限和预算检查，不替模型发明任务。
4. **执行工具**：通过 ToolRouter 和 `executeToolStep()` 进入实际工具运行时；需要审批时持久化 pending state 并暂停。
5. **回填 Observation**：工具结果既写入 runtime transcript，也转换为下一轮模型能读懂的 response item。
6. **决定是否继续**：`final` 返回用户结果，`blocked` 返回阻塞信息，工具结果则进入下一轮。

核心心智模型只有一句话：

```text
模型产生语义决策 → Harness 验证并执行 → 结果作为 Observation 原样回给模型
```

### Loop 周围最重要的模块

| 模块 | 作用 |
| --- | --- |
| `ailis-context-compiler.cjs` | 按预算编译模型上下文。 |
| `ailis-model-input-builder.cjs` | 维护 message、function_call、function_call_output 等模型输入项。 |
| `desktop-llm-provider.cjs` | 真正调用配置的大模型 Provider。 |
| `ailis-tool-router.cjs` | 将模型可见工具 ID 路由到执行端。 |
| `ailis-tool-contracts.cjs` | 工具参数 schema 和契约验证。 |
| `ailis-tool-executor.cjs` | 统一执行工具步骤并形成结果。 |
| `ailis-runtime.cjs` | run/item/transcript 生命周期、事件记录和恢复。 |
| `ailis-turn-items.cjs` | 将工具失败和 Observation 整理成模型输入。 |
| `ailis-persona-renderer.cjs` | 把最终 Agent 结果转换为 Persona 展示状态。 |

## 渲染系统执行流

```text
src/pet-app.js / Test/app.js
        ↓ 从 rendering/index.js 导入
new VRMModelSystem()
        ↓
初始化 Three.js scene / camera / renderer / lights
        ↓
加载 VRM、动画和 MToon 渲染配置
        ↓
requestAnimationFrame: animate()
        ├─ CharacterRuntime 更新状态机与动作调度
        ├─ AnimationMixer 更新骨骼动画
        ├─ EmoteController 更新表情、眨眼和口型
        ├─ VRM.update()
        └─ WebGLRenderer.render(scene, camera)
```

### 渲染模块边界

| 模块 | 作用 |
| --- | --- |
| `src/rendering/index.js` | 页面使用的渲染公共 API。 |
| `src/rendering/vrm-model-system.js` | 场景总控、模型加载、相机灯光、动作播放和每帧渲染。 |
| `src/character/character-runtime.js` | 每帧角色行为总控。 |
| `src/character/character-state-machine.js` | Persona/任务状态到角色状态的转换。 |
| `src/character/behavior-scheduler.js` | 动作和行为的逐帧调度。 |
| `src/character/emote-controller.js` | 表情、眨眼、注视和口型。 |
| `src/character/motion-library.js` | 动作定义和动作选择。 |
| `src/character/mtoon-render-profile-controller.js` | VRM MToon 材质参数应用。 |
| `src/character/render-profiles.js` | 渲染风格配置数据。 |
| `src/avatar-dialogue-bubble.js` | 角色气泡 UI。 |
| `src/pet-mouse-hit-test.js` | 桌宠命中区域和交互辅助。 |

## 最短阅读顺序

建议按下面顺序读，不要从 `main.cjs` 第一行开始：

1. 完整阅读 `electron/agent-loop/core-loop.cjs`；它很小，而且直接参与生产运行。
2. 在 `runner.cjs` 搜索 `const runIteration = async`，只顺着 `Round 1/5` 到 `Round 5/5` 阅读。
3. 先只追踪 `decision.action` 的四类结果：`final`、`blocked`、`load_context`、tool call。
4. 阅读 `runMessage()`，看新请求或恢复请求如何进入这个 Loop。
5. 阅读 `callLlmAgentDirectToolDecision()`，看模型请求和决策解析。
6. 阅读 `ailis-tool-router.cjs` → `ailis-tool-executor.cjs`，看工具怎样落地。
7. 阅读 `ailis-model-input-builder.cjs`，看 Observation 怎样进入下一轮。
8. 再读 `ailis-gateway.cjs: runAgent()` 和 `runUnifiedAgentTurn()`，补齐外层安全检查、Session 持久化和统一主对话入口。
9. 渲染从 `src/rendering/vrm-model-system.js` 的构造函数和 `animate()` 开始，再进入 `character-runtime.js`。

第一遍可以暂时不读：benchmark/evals、安装脚本、release、OpenClaw/Codex build cache、每个具体 MCP 工具、旧 rule-agent 分支。

## 启动与最小验证

```powershell
pnpm install
pnpm desktop:dev
```

只验证 Agent Loop：

```powershell
node --test tests/ailis-core-loop.test.mjs
pnpm test:ailis-agent
pnpm test:ailis-agent-execution-flow
pnpm test:ailis-llm-planner
```

只验证渲染核心：

```powershell
pnpm test:ailis-character-runtime
pnpm test:ailis-web-vrm
pnpm build
```
