# 建议阅读顺序

顺序从“产品入口”逐步下钻到“Agent、Memory、Tool、Hosted Runtime 和测试”。每完成一个文件，沿讲解中的依赖与符号继续追踪。

## 1. `README.zh-CN.md`

AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。

- [源文件](../source/README.zh-CN.md)
- [逐行讲解](./line-by-line/README.zh-CN.md.md)
- 行数：290

## 2. `package.json`

Node 项目清单：声明脚本、依赖、版本和构建入口。

- [源文件](../source/package.json)
- [逐行讲解](./line-by-line/package.json.md)
- 行数：216

## 3. `electron/main.cjs`

Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。

- [源文件](../source/electron/main.cjs)
- [逐行讲解](./line-by-line/electron/main.cjs.md)
- 行数：5701

## 4. `electron/preload.cjs`

Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。

- [源文件](../source/electron/preload.cjs)
- [逐行讲解](./line-by-line/electron/preload.cjs.md)
- 行数：276

## 5. `src/pet-app.js`

桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。

- [源文件](../source/src/pet-app.js)
- [逐行讲解](./line-by-line/src/pet-app.js.md)
- 行数：286

## 6. `src/vrm-model-system.js`

VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。

- [源文件](../source/src/vrm-model-system.js)
- [逐行讲解](./line-by-line/src/vrm-model-system.js.md)
- 行数：1245

## 7. `src/chat-tts-system.js`

聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。

- [源文件](../source/src/chat-tts-system.js)
- [逐行讲解](./line-by-line/src/chat-tts-system.js.md)
- 行数：1221

## 8. `src/ailis-chat-service.js`

聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。

- [源文件](../source/src/ailis-chat-service.js)
- [逐行讲解](./line-by-line/src/ailis-chat-service.js.md)
- 行数：1163

## 9. `electron/ailis-runtime.cjs`

AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。

- [源文件](../source/electron/ailis-runtime.cjs)
- [逐行讲解](./line-by-line/electron/ailis-runtime.cjs.md)
- 行数：2238

## 10. `electron/ailis-gateway.cjs`

Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。

- [源文件](../source/electron/ailis-gateway.cjs)
- [逐行讲解](./line-by-line/electron/ailis-gateway.cjs.md)
- 行数：5885

## 11. `electron/ailis-agent-runner.cjs`

TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。

- [源文件](../source/electron/ailis-agent-runner.cjs)
- [逐行讲解](./line-by-line/electron/ailis-agent-runner.cjs.md)
- 行数：14028

## 12. `electron/ailis-task-agent-harness.cjs`

System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。

- [源文件](../source/electron/ailis-task-agent-harness.cjs)
- [逐行讲解](./line-by-line/electron/ailis-task-agent-harness.cjs.md)
- 行数：438

## 13. `electron/ailis-model-input-builder.cjs`

模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。

- [源文件](../source/electron/ailis-model-input-builder.cjs)
- [逐行讲解](./line-by-line/electron/ailis-model-input-builder.cjs.md)
- 行数：479

## 14. `electron/ailis-persona-renderer.cjs`

Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。

- [源文件](../source/electron/ailis-persona-renderer.cjs)
- [逐行讲解](./line-by-line/electron/ailis-persona-renderer.cjs.md)
- 行数：943

## 15. `electron/ailis-context-manager.cjs`

上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。

- [源文件](../source/electron/ailis-context-manager.cjs)
- [逐行讲解](./line-by-line/electron/ailis-context-manager.cjs.md)
- 行数：785

## 16. `electron/ailis-memory-store.cjs`

Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。

- [源文件](../source/electron/ailis-memory-store.cjs)
- [逐行讲解](./line-by-line/electron/ailis-memory-store.cjs.md)
- 行数：1153

## 17. `electron/ailis-raw-memory-ledger.cjs`

原始记忆账本：以追加式记录保留可审计的记忆来源和处理状态。

- [源文件](../source/electron/ailis-raw-memory-ledger.cjs)
- [逐行讲解](./line-by-line/electron/ailis-raw-memory-ledger.cjs.md)
- 行数：389

## 18. `electron/ailis-tool-contracts.cjs`

工具契约层：定义 schema、风险、审批、错误与执行约束。

- [源文件](../source/electron/ailis-tool-contracts.cjs)
- [逐行讲解](./line-by-line/electron/ailis-tool-contracts.cjs.md)
- 行数：2736

## 19. `electron/ailis-tool-runtime.cjs`

工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。

- [源文件](../source/electron/ailis-tool-runtime.cjs)
- [逐行讲解](./line-by-line/electron/ailis-tool-runtime.cjs.md)
- 行数：618

## 20. `electron/ailis-platform-adapter.cjs`

平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。

- [源文件](../source/electron/ailis-platform-adapter.cjs)
- [逐行讲解](./line-by-line/electron/ailis-platform-adapter.cjs.md)
- 行数：1158

## 21. `scripts/start-ailis-hosted-runtime.cjs`

Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。

- [源文件](../source/scripts/start-ailis-hosted-runtime.cjs)
- [逐行讲解](./line-by-line/scripts/start-ailis-hosted-runtime.cjs.md)
- 行数：188

## 22. `tests/ailis-agent-runner.test.mjs`

TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。

- [源文件](../source/tests/ailis-agent-runner.test.mjs)
- [逐行讲解](./line-by-line/tests/ailis-agent-runner.test.mjs.md)
- 行数：1695

## 23. `tests/ailis-memory-store.test.mjs`

Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。

- [源文件](../source/tests/ailis-memory-store.test.mjs)
- [逐行讲解](./line-by-line/tests/ailis-memory-store.test.mjs.md)
- 行数：466

## 24. `tests/ailis-gateway.test.mjs`

Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。

- [源文件](../source/tests/ailis-gateway.test.mjs)
- [逐行讲解](./line-by-line/tests/ailis-gateway.test.mjs.md)
- 行数：2354
