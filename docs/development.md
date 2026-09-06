# 开发、验证与文档维护

[手册索引与源码基线](README.md) · [贡献约定](../CONTRIBUTING.md) · [工程规则](../AGENTS.md)

## 按入口定位代码

| 目录 | 实际职责 |
| --- | --- |
| `electron/` | Electron 主进程及 Agent、模型、工具、记忆、系统能力 |
| `src/` | 桌面／浏览器渲染侧 UI、角色、语音和客户端 |
| `scripts/` | 构建、审计、测试驱动、评测和部分实际被进程加载的 worker／MCP 服务 |
| `tests/` | 自动测试，不是默认安装包业务代码 |
| `backend/` | 独立 Python API、服务、模板、静态内容与博客资料 |
| `runtime/`、`installer/` | 产品入口、动态边界、发布配置与可选组件契约 |
| `Resources/`、`public/`、`sample-asset-packs/` | 模型／动作／静态资源及示例；许可按资源分别核验 |
| `vendor/` | 保留来源和许可证的第三方子集，不混入第一方代码统计 |

`scripts/` 不全是开发工具，`docs/` 不包含运行 prompt，测试未覆盖也不代表代码不可达。查清调用入口后再谈删除。

## 安全修改顺序

1. 用 `git status --short`、`git rev-parse HEAD` 和实际路径确认基线。已有改动不擅自还原。
2. 在独立 worktree 操作，保留本地恢复 commit；不要让包输出落到另一个任务的公共目录。
3. 先读受影响模块的生产调用点、动态路径和测试，再改变行为。
4. 运行最小相关测试；比较基线失败与新增失败，不能把失败测试直接删掉当成修复。
5. 触及动态加载、worker、资源或入口时更新入口清单，重做依赖审计与包内验证。
6. 同步更新唯一对应手册页，再提交。推送、发布、安装与真实外部评测是另外的动作。

可自行创建新工作树，例如先确认目标目录不存在，再执行：

```powershell
git worktree add ../ailis-change -b codex/ailis-change HEAD
```

这只隔离源码，不隔离用户数据、系统进程、模型额度或共享服务。不要把其他工作树的未提交改动自动吸收过来。

## 本地验证分层

| 层级 | 命令示例 | 能证明什么 |
| --- | --- | --- |
| 核心受控测试 | `node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs` | 指定循环和 Session 场景 |
| 契约测试 | `pnpm test:ailis-tool-contracts` | 指定工具契约行为 |
| 生产边界 | `pnpm audit:production`、`pnpm test:production` | 显式入口与依赖完整性、已声明边界 |
| 依赖规则 | `pnpm audit:dependencies` | 当前配置下的模块依赖约束 |
| 未使用候选 | `pnpm audit:knip` | 需要人工复核的候选，不是安全删除许可 |
| 桌面产物 | `pnpm build:desktop` | 前端生产构建成功，不代表桌面已完成 E2E |
| 包内执行 | `node scripts/verify-production-package.cjs <win-unpacked目录> <desktop.json路径>` | 包内哈希和受控工具执行，禁止模块回退到源仓 |

包验证使用两个位置参数，见 [verify-production-package.cjs](../scripts/verify-production-package.cjs)；不要把表中的占位目录直接执行。完整流程见 [构建与运行依赖](production-runtime.md)。

广义 `ailis:validate-gateway` 含大量测试、smoke 和环境探测；评测、工具安装与模型诊断可能联网、花费 token 或改文件，运行前读对应脚本。Node/Python 测试可能生成临时夹具，完成后核查 diff；不要把用户文件当测试输出目录。

## 如何统计与精简

- 文件数、物理行数、非空行、注释剔除后的代码行是不同口径。不要把 JSON 数据集当程序源码，也不要把多个 worktree 相加成一份产品代码。
- 桌面依赖闭包是“可能需要的代码”，不是每行都会执行的证明。
- V8 覆盖是“该测试运行观察到了什么”；未命中分支、未写 coverage 的子进程、Python 与 UI 不能据此删除。
- 稳妥删除需要：无产品／动态入口、无保留契约、最小回归通过、独立包不回退源仓、用户能力矩阵未退化。
- 删除重复说明会明显减少文档，但不会减少运行代码或模型实际输入，二者要分别报告。

## 文档维护规则

当前说明统一从 [docs/README.md](README.md) 导航。中文技术手册只维护一套正文，根目录多语言 README 作为简短入口，避免六份架构逐渐分叉。

正文必须区分实现、设计约束、历史结果和未验证能力。每个关键行为给出代码入口；改默认值、状态路径、工具所有者或构建配置时同步修订。生成页只能通过生成器更新，不手写计数。

旧方案／旧版本稿在 Git 中查阅，不重新混入现行手册。运行 prompt／SKILL、许可证、博客与数据集资料有其他用途，不与普通文档一起删改。`CODEX_MEMORY.md` 只给出当前工作树边界和查证入口，不保留过期的部署或评测执行指令。
