<div align="center">
  <img width="220" alt="AILIS 向你挥手" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>能看、能听、能记住，也能真正把事情做完的开源桌面 AI 伙伴。</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.1-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>在线体验</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases"><strong>下载桌面版</strong></a> ·
    <a href="docs/guide/desktop.md">快速开始</a> ·
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
    <td width="33%" valign="top"><h3>可控制</h3>重要工具动作进入审批与记录流程，用户始终知道系统准备做什么、已经做了什么。</td>
  </tr>
</table>

## AILIS 如何工作

| 1. 说出需求 | 2. 理解现场 | 3. 调用工具 | 4. 记住重点 |
| :---: | :---: | :---: | :---: |
| 用自然语言描述目标 | 读取获准的屏幕与文件 | 搜索、代码、文件与电脑操作 | 保存有价值的偏好与项目背景 |

## 已验证的任务执行能力

AILIS 不只展示功能，也持续用完整端到端任务检验 Agent Harness。以下于 **2026-09-07** 更新自已审计的冻结运行，不自动代表当前源码分支或 v1.4.1 安装包的认证成绩。源码归属、计分口径与比较边界见[完整评测报告](docs/evaluation.zh-CN.md)。

| Benchmark | AILIS | Codex 对照 |
| :--- | ---: | ---: |
| **GAIA public validation · 相同的 122 道已完成题** | **94 / 122 · 77.05%** | 82 / 122 · 67.21% |
| **Terminal-Bench 2.1 · 计划 89 题** | **65 / 87 · 74.71%** | 337 / 445 · 75.73% ± 1.32% |

GAIA 计划 165 题，仍有 **43 题基础设施中断未决**。94 题为保存答案经人工复核后的明确匹配；纯自动匹配为 76 / 122。AILIS 使用 Luna Max / 3000s，同题原生 Codex 对照使用 Luna Medium / 600s，**不是等预算比较，也不是完整 165 题成绩**。

Terminal-Bench 仍有 **2 题基础设施未决**，不计入 87 道有效结果；全 89 题的已确认通过比例为 65 / 89 = 73.03%。双方均为 Luna Max，但 Codex 官方存档聚合每题五次，AILIS 的时限和基础设施恢复条件不同。加权输入缓存率：**AILIS 95.79%**，**Codex 存档 97.17%**。

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

以上记忆与有状态任务成绩为历史基线，本批没有重新评测。

<p align="center">
  <a href="docs/evaluation.zh-CN.md"><strong>查看评测成绩、效率指标、比较口径与审计证据</strong></a>
</p>

## 现在可以做什么

- [x] 在 Windows 桌面常驻运行 VRM 角色、聊天窗口与控制面板
- [x] 使用文字、语音、表情和动作进行实时互动
- [x] 在许可范围内读取屏幕、窗口、文件与代码上下文
- [x] 调用搜索、网页、代码、文件、邮件和电脑操作工具
- [x] 保存长期记忆、用户偏好、项目上下文和关系状态
- [x] 对有影响的工具动作进行审批、记录与恢复
- [ ] 进一步提升长程任务的稳定性、缓存效率和错误恢复
- [ ] 让实时语音、跨设备体验和插件生态更加完整

## 快速开始

### v1.4.1 更新

本版整合稳定的追加式上下文、受审批与审计约束的 code-mode 工具运行时、辅助视觉路由，并修复压缩时附件上下文丢失和韩语语音配置兼容问题。升级方式与边界见[版本说明](https://github.com/haowenGuo/AILIS/blob/659bf61f2b340d2313b3bae386704265c8d2bba2/docs/releases/v1.4.1.md)。缓存命中率与费用取决于服务商和实际任务，不承诺固定降幅。

### 直接使用

从 [Releases](https://github.com/haowenGuo/AILIS/releases) 下载桌面版，或先打开 [Web 体验](https://101.133.239.56/Test/) 认识 AILIS。

### 本地开发

```bash
pnpm install
pnpm desktop:dev
```

桌面构建、语音、验证、可选后端和打包说明统一放在 [快速开始文档](docs/guide/desktop.md)。

## 项目方向

AILIS 的目标不是做一个只会扮演角色的聊天应用，也不是把终端包上一层头像。我们希望把两种体验真正合在一起：

1. **有存在感的数字伙伴**：自然对话、声音、表情、关系与长期记忆。
2. **可靠的个人 Agent**：理解上下文，调用通用工具，完成长程任务。
3. **可理解、可控制的执行系统**：工具动作可审批，过程可追踪，失败可以恢复。

## 继续了解

<p align="center">
  <a href="docs/guide/desktop.md"><strong>安装与配置</strong></a> ·
  <a href="docs/README.md"><strong>中文文档中心</strong></a> ·
  <a href="docs/evaluation.zh-CN.md"><strong>完整评测成绩</strong></a>
</p>

## 参与项目

如果 AILIS 对你有帮助，可以 Star 仓库关注后续进展。欢迎通过 [Issues](https://github.com/haowenGuo/AILIS/issues) 提交 Bug、真实工作流和功能建议，代码贡献说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 隐私与控制

AILIS 面向个人桌面使用。视觉上下文需要用户许可；会影响文件、应用、账号或外部服务的动作进入审批流程；本地记忆与运行状态默认保存在用户机器上。发送给模型服务的内容以完成当前请求所需的上下文为限。

## License

AILIS 源代码采用 [MIT License](LICENSE) 开源。部分第三方模型、动作、语音和角色资源可能使用各自的许可协议。
