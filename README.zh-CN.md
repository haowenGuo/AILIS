<picture>
  <img width="100%" alt="普通人如何使用 AILIS" src="docs/assets/ailis-zhihu/ailis-user-flow-image2.png">
</picture>

<div align="center">
  <h1>AILIS</h1>
  <p><strong>能看、能听、能记住，也能真正把事情做完的开源桌面 AI 伙伴。</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.0-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>在线体验</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases/latest"><strong>下载桌面版</strong></a> ·
    <a href="docs/getting-started.zh-CN.md">快速开始</a> ·
    <a href="docs/README.md">文档</a>
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

## 不只是聊天窗口

AILIS 希望成为真正生活在桌面上的个人 AI。她有可见的 3D 角色、声音、表情和长期记忆，也有能够搜索资料、阅读文件、编写代码、整理内容和操作电脑的 Agent Runtime。

你可以像和伙伴说话一样自然地表达需求。需要做事时，AILIS 会理解屏幕与文件上下文，选择工具执行任务，并在下一次见面时记得真正重要的偏好。

## 核心体验

<table>
  <tr>
    <td width="33%" valign="top"><h3>有形象</h3>VRM 桌面角色、表情、动作、口型同步和对话气泡，让 AI 不再只是空白输入框。</td>
    <td width="33%" valign="top"><h3>能交流</h3>支持语音输入与自然语音输出，也保留安静、快速的文字交互。</td>
    <td width="33%" valign="top"><h3>懂现场</h3>在获得许可后理解屏幕、窗口、区域截图和本地文件，不必让你反复解释上下文。</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>会做事</h3>搜索、代码、文件、网页、邮件与电脑操作统一进入可审计的工具执行链。</td>
    <td width="33%" valign="top"><h3>记得你</h3>长期记忆保存偏好、项目背景和关系状态，让后续协作更自然、更准确。</td>
    <td width="33%" valign="top"><h3>属于你</h3>支持 AILIS Cloud、OpenAI 兼容 API、Ollama 与 vLLM；记忆和工具执行优先留在本机。</td>
  </tr>
</table>

## 一个角色，一套完整 Agent Runtime

<picture>
  <img width="100%" alt="AILIS 桌面 AI 角色运行架构" src="docs/assets/ailis-zhihu/ailis-architecture-image2.png">
</picture>

AILIS 将角色体验、Agent 执行、工具与记忆、模型供应商分成清晰的层次。上层可以持续变得更自然，底层仍保持可替换、可审批、可恢复和可审计。

## 已验证的任务执行能力

AILIS 不只展示功能，也持续用完整端到端任务检验 Agent Harness。在相同 Luna 模型下，AILIS 与 Codex 已处于同一能力区间。

| Benchmark | AILIS | Codex，同模型 |
| :--- | ---: | ---: |
| **GAIA public validation · 165 题** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 题** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center">
  <a href="docs/ailis-evaluation-master-scorecard-20260817.md"><strong>查看完整评测、效率指标与可复现证据</strong></a>
</p>

## 现在可以做什么

- [x] 在 Windows 桌面常驻运行 VRM 角色、聊天窗口与控制面板
- [x] 使用文字、语音、表情和动作进行实时互动
- [x] 在许可范围内读取屏幕、窗口、文件与代码上下文
- [x] 调用搜索、网页、代码、文件、邮件和电脑操作工具
- [x] 保存长期记忆、用户偏好、项目上下文和关系状态
- [x] 切换托管模型、OpenAI 兼容服务、Ollama 或 vLLM
- [x] 对有影响的工具动作进行审批、记录与恢复
- [ ] 进一步提升长程任务的稳定性、缓存效率和错误恢复
- [ ] 让实时语音、跨设备体验和插件生态更加完整

## 快速开始

### 直接使用

从 [Releases](https://github.com/haowenGuo/AILIS/releases/latest) 下载桌面版，或先打开 [Web 体验](https://101.133.239.56/Test/) 认识 AILIS。

### 本地开发

```bash
pnpm install
pnpm desktop:dev
```

构建、模型供应商、本地语音、可选后端和打包说明统一放在 [快速开始文档](docs/getting-started.zh-CN.md)。

## 项目方向

AILIS 的目标不是做一个只会扮演角色的聊天应用，也不是把终端包上一层头像。我们希望把两种体验真正合在一起：

1. **有存在感的数字伙伴**：自然对话、声音、表情、关系与长期记忆。
2. **可靠的个人 Agent**：理解上下文，调用通用工具，完成长程任务。
3. **用户拥有的运行时**：模型可替换、数据可掌控、动作可审批、系统可扩展。

## 文档

| 开始使用 | 深入了解 |
| :--- | :--- |
| [安装与配置](docs/getting-started.zh-CN.md) | [具身 Agent 架构](docs/ailis-embodied-agent-architecture.md) |
| [完整文档导航](docs/README.md) | [TaskAgent 架构](docs/ailis-system-taskagent-architecture.md) |
| [版本与发布](docs/ailis-version-registry.md) | [记忆系统](docs/ailis-memory-architecture-v2.md) |
| [完整评测成绩](docs/ailis-evaluation-master-scorecard-20260817.md) | [工具生态](docs/tool-ecosystem-driver-guide.md) |

## 隐私与控制

AILIS 面向个人桌面使用。视觉上下文需要用户许可；会影响文件、应用、账号或外部服务的动作进入审批流程；本地记忆与运行状态默认保存在用户机器上。你可以使用托管模型，也可以切换到自己的 API 或完全本地的模型服务。

## License

AILIS 源代码采用 [MIT License](LICENSE) 开源。部分第三方模型、动作、语音和角色资源可能使用各自的许可协议。
