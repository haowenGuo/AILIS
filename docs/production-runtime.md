# 构建、运行子集和安装包

[手册索引与源码基线](README.md) · [生成的桌面清单](generated/desktop-runtime.md)

## 三个范围分别报告

源仓包含桌面、Hosted、网站、演示、后端、测试与工具链。桌面闭包只保留该产品可能需要的文件。安装包还需要构建后的前端、Electron、生产 npm 依赖、原生二进制以及可选外部运行时。

“不进入桌面包”不等于“代码已删除”，也不等于“其他产品不需要”。依赖闭包是保守保留集合，不证明文件中每一行都会执行。

## 当前依赖生成机制

[production-entrypoints.json](../runtime/production-entrypoints.json)声明产品入口、页面、动态边、运行资源和外部加载边界。[production-closure.cjs](../scripts/production-closure.cjs)分析 JS 的 import／require 和 HTML 引用，合并显式 worker、Python、prompt、Skill、词库和资源边。

未知动态模块加载或缺失的本地文件会使审计失败。按文件保存保留原因、上游引用和 SHA-256，而不凭一个“未用到”的搜索结果删代码。可选 OpenClaw SDK、Python 依赖和模型权重等仍是外部条件。

```powershell
pnpm audit:production
pnpm test:production
pnpm audit:dependencies
pnpm audit:knip
```

产物：`tmp/production-audit/desktop.json` 和自动生成的本页邻接清单。Knip 的候选或非零退出码需要人工判断，不直接转成删除清单。其他 profile 可单独审计，例如：

```powershell
node scripts/production-closure.cjs --profile hosted --output tmp/production-audit/hosted.json
```

## 前端构建与共享 allowlist

`pnpm build:desktop` 只产出五个正式桌面页面。`pnpm build` 加网站首页；`pnpm build:demo` 再包含独立 Test 演示。所有模式共用 `dist/`，不能并发写同一产物目录。

[electron-builder.runtime.cjs](../electron-builder.runtime.cjs)提供两份桌面 YAML 共同使用的精确源码 allowlist。`beforePack` 检查五个页面完整，并拒绝混有 `dist/Test` 或 `dist/index.html` 的产物。不能用默认网站构建代替桌面打包前置步骤。

## 抽取一份可审计运行源码

先构建 desktop，再选一个**尚不存在**的目标目录：

```powershell
pnpm build:desktop
node scripts/production-closure.cjs --extract tmp/desktop-source-new
```

抽取目前只支持 desktop；保留运行资源、构建前端、最小 package.json 和 `production-evidence.json`。目标存在时拒绝覆盖。抽取器不安装 npm 依赖、解释器、模型或 MCP，也不是“一份立即离线运行的单文件程序”。

## 发布配置

[发布脚本](../scripts/build-ailis-release.mjs)读取 [profiles](../installer/ailis-release-profiles.json) 与 [组件清单](../installer/ailis-runtime-components.json)。

| profile | 产物意图 |
| --- | --- |
| `core` | 桌面核心安装／便携产物，不附完整可选模型资源 |
| `runtime-packs` | Python、CosyVoice3、ASR、Web 等可选资源包 |
| `with-packs` | 桌面与所选 sidecar 资源包 |
| `voice-debug` | 含语音资源的调试目录产物，不是默认 core 发布 |

清单默认输出根为 `F:/AILIS/Build/AILIS`，是可能被多个工作树共享的路径。隔离构建必须明确覆盖：

```powershell
node scripts/build-ailis-release.mjs --profile core --output-root tmp/release-doc-example --dry-run --json
```

该 `--dry-run` 只输出计划。确认计划、空间、依赖和权限后才去掉 dry-run 进行真实构建。产物 manifest 记录源码 commit、dirty 状态、文件、字节数与校验值；不要只根据文件名中的版本判断是否新包。

`desktop:package:*` 和 release 命令会构建或写产物，部分会准备大资源。Windows 图标 hook 也会改 exe；检查 [fix-windows-exe-icon.cjs](../scripts/fix-windows-exe-icon.cjs) 的实际目标，尤其不要无参数独立执行其共享路径 fallback。

## 包内执行验证

已有解包目录后，用它对应的源审计报告执行两个位置参数：

```powershell
node scripts/verify-production-package.cjs tmp/production-audit/package/win-unpacked tmp/production-audit/desktop.json
```

[探针](../scripts/verify-production-package.cjs)以 Electron Node 模式启动，不开启正常用户桌面；检查源码资源哈希、包内模块解析不得回退源仓、禁止混入的非桌面文件、Stockfish 运行，以及受控 Agent 工具流程。

设置 `AILIS_RAGFLOW_PYTHON` 指向已有兼容解释器时，还验证包内 CSV 导入 worker 和四个保留 vendor 模块；未设置则明确报告该项未请求，而不是声称通过。Python 依赖须另行准备。

成功的包内探针仍不等于全量 UI、麦克风、语音、模型账户、外部插件、操作系统分支和资源授权都已通过。不要由打包成功推导出回答质量、缓存率或所有功能无回归。

## 发布前清单

核对 source identity 与实际包一致；资源 hash 与依赖完整；无密钥／个人数据／评测答案泄漏；所带资源许可允许分发；真实 UI／语音／工具矩阵验收；旧包与数据恢复路径明确。发布、推送、部署、安装替换各自需要明确范围，不由一次构建自动授权。
