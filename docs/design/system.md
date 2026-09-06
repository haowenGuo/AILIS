# 系统组成

AILIS 是一个具备工具执行能力的桌面交互应用。界面呈现用户输入和模型输出；运行层管理请求、上下文和工具；存储层保存连续执行所需的数据。语音、角色和服务端入口复用其中的部分能力。

## 部署单元

| 单元 | 启动入口 | 主要职责 |
| --- | --- | --- |
| Electron 桌面 | electron/main.cjs | 窗口、桌面 IPC、配置、本地 Gateway、系统资源 |
| 浏览器渲染层 | 各 HTML 的 module script | 聊天、控制面板、角色、媒体与调试界面 |
| Hosted Node | scripts/start-ailis-hosted-runtime.cjs | HTTP／事件流接口、租户运行管理 |
| Python 服务 | backend/main.py | API、数据库业务、Web 会话及服务代理 |
| 静态网站与演示 | index.html、Test/index.html | 网站内容与独立浏览器界面 |

桌面可直接调用已配置的模型服务。Hosted 和 Python 是可独立部署的进程，不需要为了每次桌面文本对话全部启动。

## 桌面分层

渲染页面使用 preload 暴露的 window.ailisDesktop 接口访问桌面能力。主进程处理 IPC，建立 Gateway 并注入模型配置。Gateway 将请求交给 Agent Runner，Runner 通过模型适配器和工具运行时执行任务。

```text
桌面页面
  → preload / IPC
  → Electron 主进程
  → Gateway
      → Session 存储
      → Agent Runner
          → 上下文与模型适配器
          → 工具注册表 → 本地实现 / MCP / worker
      → 运行事件与最终结果
  → 页面显示 / 语音播放 / 角色呈现
```

这张图描述普通 Agent 请求。聊天服务还包含可直接处理的本地角色命令入口；它们可以提前生成呈现结果，不需要一次模型循环。

## 模块职责

Gateway 是运行协调层：接收请求、合并上下文、进行阶段检查、管理主 Session 和结果交付。Runner 是模型执行层：准备输入、接收决策、执行工具、纳入观察并决定是否继续循环。

模型负责解释请求和选择行动。确定性运行层负责协议校验、预算、权限、资源生命周期和记录。工具适配器负责实际能力，例如命令执行、文件解析或外部服务调用。

上下文、输出、记忆和模型协议分别有独立模块。角色与语音消费呈现数据；人物偏好在需要时进入模型背景。

## 通信方式

桌面内部以 IPC 请求和事件连接页面与主进程；Gateway 使用带 Session／run ID 的事件表达进展。外部模型使用对应 provider 的请求协议。MCP 能力通过独立进程或 HTTP 连接提供，Code mode 和部分 Python 能力通过 worker 执行。

这些边界也是故障定位边界：页面交互、IPC、Gateway、模型响应、工具执行和媒体播放分别记录和验证。

## 代码组织

- electron：桌面宿主、Agent 和能力实现。
- src：渲染页面逻辑、聊天客户端、角色与媒体。
- backend：Python API 与业务。
- scripts：构建、审计、运行服务、worker 和实验驱动。
- runtime、installer：产品入口、动态依赖和发布清单。
- tests：受控验证。
- Resources、public、sample-asset-packs：呈现资源和资产包。

产品边界由[入口清单](../../runtime/production-entrypoints.json)描述。构建如何选择这些入口，见[发布流程](../engineering/distribution.md)。

继续阅读：[Agent 运行](agent-runtime.md)、[数据模型](data.md)、[工具系统](tool-system.md)、[媒体](media.md)。
