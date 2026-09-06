# 构建与发布

AILIS 的前端页面、桌面代码和可选运行组件分别构建。发布时先选择产品入口，再确定需要随包提供的依赖和资源。

## 前端目标

| 命令 | 包含的页面 |
| --- | --- |
| pnpm build:desktop | 桌宠、聊天、控制面板、Agent Lab、区域选择 |
| pnpm build | 桌面页面与网站首页 |
| pnpm build:demo | 桌面页面、网站首页与 Test 演示 |
| pnpm preview | 服务已有 dist，不执行构建 |

构建由 Vite 配置读取产品清单，并执行资源处理。各模式写入同一 dist 目录。桌面打包前应重新执行 build:desktop，以确保页面集合正确。

## 桌面源码集合

production-entrypoints.json 声明程序入口、页面与动态边。production-closure.cjs 分析 import、require、HTML 引用，并合并声明的 worker、Python、prompt、Skill 和其他资源。

```powershell
pnpm audit:production
```

审计生成逐文件的保留原因、上游引用和 SHA-256。汇总见[生成清单](../generated/desktop-runtime.md)。这是一份产品依赖集合；文件内部还可能包含条件分支和多个功能。

需要抽取可审计的桌面源码集合时，选择一个尚不存在的目标：

```powershell
pnpm build:desktop
node scripts/production-closure.cjs --extract tmp/desktop-source-example
```

抽取包括源码、运行资源、构建前端、最小 package.json 和证据清单。运行依赖、Python 解释器、模型权重和外部服务仍需按使用场景提供。

## 构建安装包

| Profile | 内容 |
| --- | --- |
| core | Windows 核心安装器与便携包 |
| runtime-packs | 可选 Python、ASR、CosyVoice3、Web 组件 |
| with-packs | 核心桌面产物及旁置组件包 |
| voice-debug | 本地语音调试目录产物 |

先查看计划并显式指定输出目录：

```powershell
node scripts/build-ailis-release.mjs --profile core --output-root tmp/release-example --dry-run --json
```

核对目录、依赖、空间和目标后，去掉 --dry-run 进行真实构建。该脚本默认输出根来自发布清单；多工作树应覆盖它。

两份桌面 builder 配置使用同一源码 allowlist。打包前检查会要求五个桌面页面齐全，并拒绝混入网站或 Test 页面。发布脚本记录 commit、dirty 状态和产物校验信息。

## 验证产物

以实际解包目录和对应源审计文件执行：

```powershell
node scripts/verify-production-package.cjs <win-unpacked目录> <desktop.json路径>
```

命令中的两个路径需要替换。探针检查包内文件哈希、模块解析、受控工具执行和相关二进制；模块不能回退源仓补齐依赖。设置 AILIS_RAGFLOW_PYTHON 时还可验证包内表格导入 worker。

完成结构验证后，再检查实际窗口、文件任务、媒体设备和需要发布的外部能力。最后核对许可证、隐私数据、安装升级与恢复方式。

## 网站与服务

静态页面部署与桌面发布是不同流程。网站、Test 演示、Python API 和 Hosted Node 各有自己的入口；参见[服务部署](services.md)及[部署脚本说明](../../deploy/README.md)。

源码：[Vite](../../vite.config.js)、[入口清单](../../runtime/production-entrypoints.json)、[依赖抽取器](../../scripts/production-closure.cjs)、[builder 边界](../../electron-builder.runtime.cjs)、[发布脚本](../../scripts/build-ailis-release.mjs)、[profiles](../../installer/ailis-release-profiles.json)、[包验证](../../scripts/verify-production-package.cjs)。
