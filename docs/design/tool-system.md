# 工具系统

工具将模型决策连接到文件、进程、文档、网络和系统。一个工具同时需要可见的调用定义、可执行的实现以及满足要求的运行环境。

## 定义、注册与调用

tool-specs 保存工具说明和参数定义；tool-runtime 注册工具并分派调用；tool-contracts 验证约定的输入和输出。Gateway 提供调用入口并连接宿主能力。

工具有三种暴露方式：

| 方式 | 模型如何获得工具 |
| --- | --- |
| direct | 进入当前直接工具集合 |
| deferred | 通过 tool_search 检索并加载 |
| hidden | 供特定内部调用路径使用 |

暴露集合受运行模式、provider 和配置影响。工具注册成功、模型能够看到、依赖可用、当前调用被授权，是四个需要分别满足的条件。

## 能力实现

| 类别 | 主要实现 |
| --- | --- |
| 文件、命令与执行会话 | Gateway、ailis-code-tool |
| JavaScript 编排 | code-mode-runtime 与隔离 worker |
| 网页研究 | research MCP 与 Python worker |
| Office、PDF、CSV、图片 | artifact-tools-runtime 与 adapters |
| 电脑和截图 | computer-tool、vision-tool、desktop-platform-adapter |
| 邮件 | email-tool |
| 文件整理 | file-manager-tool |
| 外部工具连接 | MCP manager 与 adapter |

schema、审批、运行权限和阶段门控各自执行检查。工具返回失败状态及诊断信息，交给调用方处理。支持某一类文件不代表每种编辑或渲染操作都已具备，具体操作由适配器能力决定。

## Code mode

模型提交 JavaScript 编排单元，worker 调用宿主允许的工具，收集返回内容。worker 使用独立进程和 Node permission 参数，桌面包中以 Electron Node 模式启动。

较长单元可以 yield，返回 cell_id；wait 继续等待该单元。命令工具也可返回进程会话标识，后续操作应使用对应标识。两种等待对象各有协议。

包内 worker 需要物理文件路径及可用的 cwd，构建将其放在 app.asar.unpacked。IPC 错误应保留启动和退出原因；传输中断不能作为重新执行有副作用操作的依据。

## 文档与工件

artifact_tools 使用打开文件后的会话和 handle，支持由适配器提供的 inspect、search、query、materialize、edit、render、validate、export 等操作。

运行期上下文工件由另一套 context_artifact_store 管理，通过 artifact_query 查询。Handle 中的 owner 和 tool 指示正确入口；不同所有者的 ID 不能互换。

工具完整结果可带 details、structuredContent，同时提供较小的 modelView。模型视图保留状态、范围、引用和下一步所需信息，完整数据通过工件访问。这一分层使大表格和长输出不必反复全部进入模型输入。

## MCP 与 Skill

MCP manager 管理 stdio 和 HTTP 服务，发现工具并转发调用。stdio 配置包含 command、args、cwd；HTTP 配置包含 URL 和认证相关字段。服务连接、工具发现、调用完成分别有自己的生命周期和错误。

Skill 加载器从运行资源中发现说明和配套资源，将其作为任务背景。新增 Skill 应同时核对它依赖的实际工具和资源。

## 扩展一种能力

1. 定义能力的参数、返回状态和错误。
2. 注册 schema 与 handler，选择暴露方式。
3. 实现权限、依赖和资源生命周期处理。
4. 为完整结果、模型视图和工件引用建立契约。
5. 增加成功、无权限、缺依赖、超时及大输出测试。
6. 若新增 worker 或资源，更新生产入口清单并做包内验证。

源码：[工具定义](../../electron/ailis-tool-specs.cjs)、[注册运行](../../electron/ailis-tool-runtime.cjs)、[契约](../../electron/ailis-tool-contracts.cjs)、[Code mode](../../electron/ailis-code-mode-runtime.cjs)、[MCP](../../electron/ailis-mcp-session.cjs)、[附件](../../electron/ailis-artifact-tools-runtime.cjs)、[上下文工件](../../electron/ailis-context-artifact-store.cjs)。
