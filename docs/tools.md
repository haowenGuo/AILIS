# 工具、MCP 和工件契约

[手册索引与源码基线](README.md) · [Agent 与 Session](agent-session.md)

## 三个层次

| 层次 | 代码 | 作用 |
| --- | --- | --- |
| 模型可见说明／参数 | [ailis-tool-specs.cjs](../electron/ailis-tool-specs.cjs)、[Gateway](../electron/ailis-gateway.cjs) | 定义工具 schema、暴露方式和模型协议映射 |
| 注册与分派 | [ailis-tool-runtime.cjs](../electron/ailis-tool-runtime.cjs)、[ailis-runtime.cjs](../electron/ailis-runtime.cjs) | 查找实现、验证输入、执行、规范化结果 |
| 能力实现与适配 | 独立工具文件、[MCP Session](../electron/ailis-mcp-session.cjs)、[桌面适配器](../electron/ailis-desktop-platform-adapter.cjs) | 文件、进程、网络、系统、第三方服务和资源 |

工具在注册表里存在，不等于每轮都直接发给模型，也不等于本机依赖和权限已满足。provider 协议、主／子 Agent 模式和配置会改变可见工具集合，应以本轮实际发送的 schema 为准。

## 发现与权限

`direct` 工具可直接暴露；`deferred` 工具通过 `tool_search` 查找并为后续步骤载入；`hidden` 默认不进入普通发现。`tool_search` 是元数据检索，不执行用户任务，不替代模型判断。

注册表把 `artifact_tools`、`artifact_query`、MCP 管理、自检和能力管理等扩展能力设为 deferred。`artifact_compute` 与内部子 Agent 协议保留为 hidden 兼容面。输出回读工具默认 deferred；`AILIS_EXPERIMENTAL_OUTPUT_TOOLS=1` 或指定工具表面模式可改变这一点。不要靠修改提示词假装工具已经装好。

schema 验证、权限检查、审批和 EMBER 门控是不同机制。安装扩展、发邮件、操作电脑、写文件及执行命令都可能产生外部副作用；需要结合当前运行策略核实，不能笼统宣称“有沙箱，所以一切安全”。[工程约束](../AGENTS.md)要求确定性防护报告事实，不能用关键词替模型编造计划。

## 常用能力及真实入口

| 能力 | 实现／边界 | 注意事项 |
| --- | --- | --- |
| 文件读写、补丁、命令与会话输入 | [Gateway](../electron/ailis-gateway.cjs)、[code tool](../electron/ailis-code-tool.cjs) | 以工作目录、退出码和产物核验，不以文字“完成”核验 |
| Code mode 编排 | [runtime](../electron/ailis-code-mode-runtime.cjs)、[worker](../electron/ailis-code-mode-worker.cjs) | `exec` 是 JS 编排单元；不要把它一概等同于 shell 命令 |
| 网页检索和抓取 | [内置 research MCP](../scripts/mcp-ailis-research-server.cjs) | 网络、搜索后端及部分 Python worker 是独立依赖 |
| 附件／Office／表格／PDF／图片 | [artifact-tools-runtime](../electron/ailis-artifact-tools-runtime.cjs)、[adapters](../electron/ailis-artifact-tools-adapters.cjs) | 不同格式支持的操作不同，以返回能力和 schema 为准 |
| 电脑操作和屏幕观察 | [computer tool](../electron/ailis-computer-tool.cjs)、[vision tool](../electron/ailis-vision-tool.cjs) | 读屏与点击输入不是同一授权；依赖宿主能力和视觉配置 |
| 邮件 | [email tool](../electron/ailis-email-tool.cjs) | 账户设置、网络和 IMAP/SMTP 能力独立；发送／移动／删除有副作用 |
| 文件整理 | [file-manager tool](../electron/ailis-file-manager-tool.cjs) | 先检查计划与隔离目标，不对用户目录宽泛删除 |
| 额外能力安装／检查／修复 | [Gateway](../electron/ailis-gateway.cjs)、[运行注册表](../electron/ailis-tool-runtime.cjs) | 自检不等于修复授权；扩展代码和第三方依赖也有信任边界 |

## Code mode 和长命令

[codex-code-mode-protocol.cjs](../electron/codex-code-mode-protocol.cjs) 定义编排协议。worker 在独立进程运行，使用 Node permission 参数和 IPC 调用宿主暴露的工具；Electron 包内通过 `ELECTRON_RUN_AS_NODE` 启动。worker 路径和 cwd 必须是物理 `app.asar.unpacked` 路径。

yield 后应以返回的 cell／进程会话标识继续等待，而不是重新执行原命令。`write EPIPE` 表示传输管道失效，不能直接解释成“模型拒绝操作”或“文件不存在”。排错同时检查 worker 启动、权限、stderr、IPC 生命周期及包内资源；见 [排错](troubleshooting.md)。

## 大输出不是完整塞入上下文

[output-store](../electron/ailis-output-store.cjs) 与 [运行时预算](../electron/ailis-runtime-budget.cjs)把完整内容和模型可见摘要分开。模型视图可能有预览、截断提示和 `outputId`；需要细节时再用 `output_read`、`output_tail` 或 `output_search` 回读。

保留 outputId 只能说明有一个引用，不能推导出本轮上下文仍包含全部正文，也不能据它猜字节数或 token。若工件不存在或超出可读范围，应报告缺失，不把空结果当作任务能力失败。

## 两类 artifact 不可串用

| 所有者 | 标识／入口 | 正确操作 |
| --- | --- | --- |
| `context_artifact_store` | `ctx-*` 或对应 `artifactHandle` | `artifact_query` 查询运行期管理的上下文工件 |
| `artifact_tools` | `open_session` 返回的 handle、sessionId、`art_*` | 后续继续使用 `artifact_tools`，不传给 `artifact_query` |

规范化结果可以同时含 `details`／`structuredContent` 与更小的 `modelView`／`observation`。完整内部结果不是再向模型重复倾倒一遍的理由。附件导入、查询、物化、编辑、导出与验证应保留来源和输出引用；读到一段表格摘要不等于已核验整个工作簿。

旧 RAGFlow table import 仍被注册，依赖 [导入工具](../electron/ailis-artifact-import-tool.cjs)、[Python worker](../scripts/ailis-ragflow-lite-worker.py) 和保留出处的 [vendor/ragflow-lite](../vendor/ragflow-lite/README.md)。这是仍可达的兼容路径，不是完整 RAGFlow 产品，也不是默认桌面必须包含所有上游代码。

## MCP、Skill、OpenClaw

- MCP Session 管理配置的 stdio／HTTP 服务、工具、资源和 prompt；服务器的发现、启动、连接和调用失败需分层记录。
- Skill 是带正文的运行输入。`electron/skills/` 会动态枚举，不能作为“旧说明文档”删除。查看并加载 Skill 不意味着其中每个外部工具都可用。
- 可选 OpenClaw SDK 通过外部运行时路径动态加载，保留在生产依赖审计的外部边界中；不能声称桌面源码子集已把它完全封装隔离。

## 验证顺序

先跑对应契约和实现测试，再在隔离目录用受控模型测试执行链，最后经授权验证真实外部服务。示例：

```powershell
pnpm test:ailis-tool-contracts
pnpm test:ailis-artifact-tools
node --test tests/ailis-code-mode-packaging.test.mjs
```

一些 artifact 测试需要额外 Python 库，不能把解释器缺依赖算成模型能力零分。真实网页、邮件、电脑和能力安装的 smoke 可能联网或改变状态，不作为文档检查的一部分自动执行。
