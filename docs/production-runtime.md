# 生产代码提取与精简

2026-09-06，独立工作树 `F:\AILIS\code-consolidation-20260904`。本轮基线为 `f6b89ad32a47ab3434352b046a221fe9edef925a`，没有部署、替换已安装应用或写入主仓。

## 已落地的边界

生产范围以 `runtime/production-entrypoints.json` 为准，不再把所有脚本、测试页面都当成桌面入口。

| 产品边界 | 内容 | 处理 |
| --- | --- | --- |
| desktop | 主进程、preload、聊天、控制台、角色、区域选择、Agent Lab | 正式桌面构建/提取/打包 |
| hosted | 独立托管服务 | 代码保留，单独审计，不混入桌面包 |
| website | 官网入口 | 普通 web 构建保留，桌面构建排除 |
| demo | Test 页面和浏览器语音实验 | `build:demo` 显式构建，不混入正常产品 |
| 工程资产 | 测试、评测、发布工具、文档 | 保留于开发仓，不进入生产源码子集 |

当前桌面闭包 **168 个文件**，含资源；其中第一方源码 **148 个文件 / 145,272 行**，另有第三方 Python 源码 **1,266 行**。相比上轮含测试/脚本/其他产品的第一方 **244,673 行**，约 40.6% 不属于桌面依赖闭包。**这是范围拆分，不是删除了约十万行死代码，也不是总仓库净减量。** 本轮新增了开发期审计工具，不能把它们藏在统计外再声称仓库变小。

生成的模块计数见 [运行清单](generated/desktop-runtime.md)。完整逐文件台账在 `tmp/production-audit/desktop.json`，记录类别、保留原因、上游节点和 SHA-256。

## 判定方法

1. 从产品入口建立 JS import/require/require.resolve、HTML 资源与保守文件字面量依赖图。
2. 显式登记进程/worker、Python importlib、技能目录、prompt、词表、安装器资源边界；未知动态模块加载、缺少本地依赖时失败退出。
3. Knip production 模式独立检查候选；dependency-cruiser 检查产品不得导入测试/评测链路。
4. Node V8 采集测试和打包烟测的正向证据。未收集到命中不等于未执行，更不等于无用；权限隔离的 worker 可能无法输出覆盖文件。
5. 生成不含开发脚本的独立目录；两种安装配置共用同一生产 allowlist，拒绝混入旧 demo/官网构建。打包后验证源码哈希，禁止 Node 模块回退到源码仓库或仓库的 node_modules。

静态图不是任意动态语言程序的完整执行证明。仍要人工复核运行时构造的路径、配置选择、外部工具与低频功能；不能自动删除图外文件或 Knip 报出的所有导出。

## 本轮实际变更

- 新增可复跑的入口清单、闭包台账、生成文档、Knip 与 dependency-cruiser 配置、V8 汇总、独立包验证脚本和防漏测试。
- 桌面打包不再使用 `electron/**/*` 全收集，而是根据生产依赖闭包保留文件；排除 hosted、人设评测模块和旧 Kokoro worker。它们在其他入口仍有用途，开发仓保留。
- 补上旧打包清单遗漏的 `scripts/ailis-stockfish-engine.cjs`、表格导入 Python worker、实际动态加载的四个 RAGFlow vendor 文件及许可证。
- 修正表格导入在 ASAR 中启动 Python 的路径：worker、cwd、相对 vendor 依赖都使用真实解包目录；普通源码路径不变。
- `desktop:start`、桌面打包与发布编排使用 `build:desktop`；Agent Lab 没有被误当成测试页移除。

## 可复跑命令

在本独立工作树执行：

```powershell
pnpm audit:production
pnpm audit:dependencies
pnpm audit:knip
pnpm test:production
pnpm build:desktop
node scripts/production-closure.cjs --extract tmp/production-audit/my-new-desktop-source
```

提取目标必须不存在，脚本拒绝覆盖；提取目录包含运行源码与构建资源、精简 package.json、证据清单，**尚未安装 npm 依赖，不等于可双击安装包**。没有到旧源码的链接。

本轮另生成了可运行的未签名 Windows 解包目录：`tmp/production-audit/package/win-unpacked`。这是本地验证产物，不是已部署的新版本。只为验证跳过了 exe 图标修改钩子，未更改正常发行配置的图标钩子。

```powershell
pnpm test:production-package tmp/production-audit/package/win-unpacked tmp/production-audit/desktop.json
# 要同时执行 Python 表格烟测，先给测试进程设置 AILIS_RAGFLOW_PYTHON。
```

该烟测使用临时工作区、假模型和 packaged Electron 的 Node 模式，不启动用户桌面、不读真实会话、不调用真实 provider。Python 解释器及三方依赖由测试环境提供，不声称随包内置。

## 验证结果与剩余工作

- 原 42 组回归：496 项，477 通过、15 个既有失败、4 跳过；失败名称与上轮一致。既有失败位于 llm-planner（14）和 self-debugger（1），没有隐藏或修复它们。
- 生产/发布/路径测试 11/11；真实表格导入与存储集成 2/2。合计 509 项：490 通过、15 既有失败、4 跳过。
- dependency-cruiser：153 模块、418 依赖，无配置规则违反。
- Knip：3 个桌面未引用文件、442 个导出、50 项依赖候选和 1 个外部 OpenClaw 未声明依赖提示。不是 496 个可以直接删除的对象；公开 API、内部仍调用的函数、传递依赖和可选 SDK 要分别核对。没有启用自动修复或压掉报告。
- 打包烟测：119 个源码/资源哈希一致，696 个模块解析留在包内；exec、shell、临时文件读写、原样最终输出、下一轮上下文续接通过。Stockfish 真正运行成功；Python 表格 worker 从包内加载四个 vendor 模块并成功产出数据。真实模型调用为 0。
- V8 正向证据：最终 58 个覆盖记录，138 个候选 JS 文件中 116 个收集到执行命中。不是行覆盖率；未覆盖实际桌面 UI、麦克风、语音模型、所有 Python 分支或所有插件场景。
- 桌面构建 JS 合计 1,287,735 字节，比前轮混合入口构建的 1,309,011 字节少 21,276 字节；资源输出口径不同，不比较总构建目录大小。
- 两个 OpenClaw 动态 SDK 边界仍依赖单独安装的运行时；完整 renderer/UI 场景矩阵、低频外部能力验证、442 个导出的逐项处置和更深的重复实现合并尚未完成。没有宣称“全部代码都确实执行过”或“已最小化”。
- 主仓只读核验发现此前保护快照中的 4 个文件已有变化：control.html、electron/ailis-gateway.cjs、electron/store.cjs、src/control-panel-app.js。本轮未写主仓，也未自动吸收这些变化。

本地详细日志和 `verification.json`、`coverage.json` 位于 `tmp/production-audit/`；原始测试/Knip/V8 文件位于 `tmp/code-consolidation-20260904/round4-*`。恢复点和前三轮实际删除记录见 [精简记录](code-consolidation.md)。
