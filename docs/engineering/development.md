# 开发工作流

开发工作以可定位的入口、明确的数据契约和可复现的验证为单位。先确定功能属于桌面、Hosted、Python 服务还是浏览器页面，再沿调用关系修改。

## 建立工作环境

使用 package.json 指定的 pnpm，安装锁文件中的依赖。JavaScript 渲染层使用 ES module；Electron 主进程与多数运行模块使用 CommonJS；Python worker 和后端使用单独的解释器环境。

记录工作目录、Git commit 与未提交改动。涉及较大重构时，在尚不存在的目录建立工作树：

```powershell
git worktree add ../ailis-feature -b codex/ailis-feature HEAD
```

测试状态、发布输出和端口也应独立安排。

## 选择修改入口

| 目标 | 首先查看 |
| --- | --- |
| 页面交互 | 对应 HTML 与 src 中的入口脚本 |
| 桌面接口 | electron/preload.cjs、electron/main.cjs |
| Agent 生命周期 | Gateway、agent-loop |
| 模型输入 | ContextManager、ContextCompiler、provider |
| 工具 | specs、contracts、runtime 与具体 handler |
| 持久数据 | 对应 store 与迁移、恢复测试 |
| 打包资源 | production-entrypoints、builder 配置 |
| 服务接口 | Node 启动器或 backend/api |

修改公共契约时，同时检查生产调用者、测试夹具和外部适配器。状态格式变化需要定义读取旧数据和失败恢复策略。

## 验证层级

```powershell
node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs
pnpm test:ailis-tool-contracts
pnpm test:production
```

这组命令覆盖核心循环、主 Session、部分工具契约和依赖边界。按改动补充模块测试，例如 Code mode 的包内路径测试、记忆编译测试或媒体配置测试。

前端改动需要 build:desktop 和页面检查；进程资源改动需要独立包验证。真实模型、邮件、电脑操作与媒体设备的测试需要受控账户、输入和输出目录。

每次报告分别列出通过、失败、跳过及未测范围。测试通过说明对应场景满足断言，不自动扩展到全部产品能力。

## 分析依赖

```powershell
pnpm audit:production
pnpm audit:dependencies
pnpm audit:knip
```

production 审计从产品入口计算运行依赖；dependency-cruiser 检查模块规则；Knip 提供未使用候选。它们回答不同问题，应结合动态注册、worker、资源清单和产品入口复核。

Coverage 用于发现测试缺口。要删除代码，还应证明没有需要保留的入口或契约，并以功能矩阵和独立产物验证删除后的行为。

## 提交

保持改动范围集中，给行为变化增加测试，并同步对应手册。提交说明包含动机、入口、验证结果和数据影响。用户状态、密钥、下载模型与构建产物不作为源码提交。

完整工程约束见 [AGENTS.md](../../AGENTS.md)；发布步骤见[构建与发布](distribution.md)。
