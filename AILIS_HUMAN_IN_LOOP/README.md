# AILIS HUMAN IN LOOP 学习副本

这里不是另一套分叉实现，而是 AILIS 在提交
`a1f34b0c24bbf5fce436670e26ced97da3cb72c7` 上的可核验学习镜像。

## 你在这里能得到什么

- `source/`：813 个 Git 受跟踪文件的原样副本，可独立逐目录阅读；没有混入浏览器缓存、截图、日志、临时压缩包或密钥。
- `generated/manifest.json`：每个原文件的路径、类型、字节数、行数、职责、SHA-256 和逐行讲解路径。
- `generated/line-by-line/`：663 个文本文件、317,120 行源码/配置/文档的逐行中文对照。
- `generated/MODULE_CATALOG.md`：全文件目录和职责导航。
- `generated/BINARY_ASSETS.md`：150 个不可逐行解释的 VRM、动作、图片、音频、Office/PDF 等二进制资产目录。
- `docs/`：人工整理的架构、生命周期、Memory/Prompt/TaskAgent、工具权限、部署、测试和术语书。

总字节数为 87,860,229。副本用 SHA-256 对照原仓库：文本先规范成 UTF-8/LF，
保证 Windows、Linux 克隆后仍可复验；二进制按原始字节计算。

## 从哪里开始

1. 阅读 [总览与阅读地图](docs/00-总览与阅读地图.md)。
2. 阅读 [代码架构书](docs/01-代码架构书.md)，先建立分层和进程边界。
3. 沿 [建议阅读顺序](generated/READING_ORDER.md) 打开原文件与逐行讲解。
4. 重点研读 [Memory、Prompt 与 TaskAgent 专册](docs/03-Memory-Prompt-TaskAgent专册.md)。
5. 修改前先看 [测试、调试与修改方法](docs/06-测试调试与修改方法.md)。

## 两类材料怎样配合

逐行讲解是“代码地图”：它保证每一行都有行号、原文和解释，适合定位变量、
分支、异步、权限、记忆、工具和 I/O。人工架构书是“系统地图”：它说明一行代码
为什么存在、由谁调用、状态归谁、错误如何回流。理解一个关键函数时必须同时：

1. 看该文件顶部的职责、依赖和主要符号。
2. 沿调用方与被调用方至少追踪一层。
3. 找相应测试，确认真实契约而非只凭命名猜测。
4. 对异步、模型输出、工具结果、审批和持久化路径检查失败分支。

自动说明不会伪装成作者逐字写下的设计意图；无法从静态语法确定的业务语义，
应以人工专册、调用链和测试为准。二进制资产没有“代码行”，因此只做哈希、大小和
用途目录，不生成虚假注释。

## 重新生成与校验

在仓库根目录执行：

```powershell
pnpm ailis:human-loop:build
pnpm ailis:human-loop:verify
```

生成器只会重建 `source/` 与 `generated/`，不会删除 `docs/`。它以
`git ls-files` 为唯一来源，并排除 `AILIS_HUMAN_IN_LOOP/` 本身，避免递归复制。
校验器会逐文件对比原件、快照和 manifest 的 SHA-256，并确认每个文本文件存在
非空逐行讲解。

## 学习副本的边界

- `source/` 是固定提交的副本，不要直接在其中开发正式功能。
- 正式修改应在仓库原路径完成，测试后重新运行生成器。
- manifest 中的 `snapshotCommit` 是源快照基线；最终文档提交会自然晚于它。
- 真实用户记忆、API Key、Cookie、邮箱凭据和运行日志不属于源码副本。
- `vendor/` 是第三方或参考实现，应和 AILIS 自有业务逻辑分开阅读。

## 文档目录

- [00 总览与阅读地图](docs/00-总览与阅读地图.md)
- [01 代码架构书](docs/01-代码架构书.md)
- [02 运行链路与生命周期](docs/02-运行链路与生命周期.md)
- [03 Memory、Prompt、TaskAgent 专册](docs/03-Memory-Prompt-TaskAgent专册.md)
- [04 工具、权限、证据与 Human-in-the-Loop](docs/04-工具权限证据与Human-in-the-Loop.md)
- [05 网页、桌面、Hosted 部署手册](docs/05-网页桌面Hosted部署手册.md)
- [06 测试、调试与修改方法](docs/06-测试调试与修改方法.md)
- [07 术语表与索引](docs/07-术语表与索引.md)
