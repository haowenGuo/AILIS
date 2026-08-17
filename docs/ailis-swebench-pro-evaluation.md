# AILIS SWE-Bench Pro 接入

## 接入边界

SWE-Bench Pro 用于评估智能体处理长程软件工程任务的能力。AILIS 的接入分为两个相互隔离的部分：

1. **任务与补丁生成层**：从 `ScaleAI/SWE-bench_Pro` 准备任务，交给 AILIS TaskAgent 生成 Git patch。
2. **官方评分层**：不自行解释测试结果，直接调用 `scaleapi/SWE-bench_Pro-os` 的 `swe_bench_pro_eval.py` 和官方 Docker 镜像评分。

当前仓库已经完成数据、TaskAgent 补丁生成协议、隔离 Git 工作区、WSL Docker 环境诊断和官方评分桥。不得用旧 SWE-Bench Lite 执行器替代官方 Pro 评分。

## 数据隔离

```text
Hugging Face SWE-bench Pro
  -> source sample（含 gold patch/test patch，仅供官方评分）
  -> leaderboard.official.jsonl（官方 evaluator 输入，排行榜兼容 730 题）
  -> *.tasks.jsonl（TaskAgent 输入，不含 patch/test_patch/F2P/P2P）
  -> AILIS TaskAgent（每题独立上下文，最多 250 次模型决策）
  -> predictions.json（AILIS 生成的 patch）
  -> ScaleAI official evaluator
  -> eval_results.json
```

`prepare-swebench-pro.mjs` 会把下载内容写入已忽略的 `build-cache/benchmarks/swebench-pro/data`。`tasks.jsonl` 只包含问题、仓库、基线提交、接口和需求等公开任务信息；金标 patch、隐藏 test patch、F2P 和 P2P 不进入 TaskAgent 上下文。

公开数据共 731 题，当前官方排行榜口径为 730 题。准备脚本会同时生成完整 731 题文件、排行榜兼容 730 题文件，以及每仓库等距固定抽样的 `smoke-11`、`calibration-44` 和 `scale-110`。默认官方评分使用 730 题文件。

SWE-bench Pro 的 F2P/P2P 是 Python list literal，不保证是严格 JSON。AILIS 会原样保存这些字段，并在准备和 Doctor 阶段拒绝 F2P 或测试文件清单被清空的数据。不得先用 `JSON.parse` 转换后再交给官方 evaluator。

默认版本由 `evals/engineering/swebench-pro-source-lock.json` 固定。数据集 revision 发生变化时，准备命令会停止，要求先审查上游变化；官方 Harness 同样默认检出锁定 commit，而不是静默跟随 `main`。

## 常用命令

```powershell
# 准备 3 条任务；可追加 -- --limit 1 做最小样例
pnpm bench:swebench-pro:prepare

# 分页准备全部 731 条任务
pnpm bench:swebench-pro:prepare:full

# 下载或更新 ScaleAI 官方评测仓库
pnpm bench:swebench-pro:install

# 检查 Harness、Python、Docker/Modal 和磁盘空间
pnpm bench:swebench-pro:doctor

# 查看 11 题 TaskAgent 计划，不调用模型
pnpm bench:swebench-pro:agent:plan

# 检查 11 个隔离仓库是否已经准备好
pnpm bench:swebench-pro:agent:preflight

# 从公开仓库精确 checkout base_commit，准备干净任务工作区
pnpm bench:swebench-pro:agent:provision

# 使用控制面板当前模型运行 11 题并生成 predictions.json
pnpm bench:swebench-pro:agent:smoke

# 只输出将要执行的官方命令，不运行容器
pnpm bench:swebench-pro:plan

# 使用官方 evaluator 评分
pnpm bench:swebench-pro:evaluate

# Windows 主程序复用 WSL Docker 评分
pnpm bench:swebench-pro:doctor:wsl
pnpm bench:swebench-pro:evaluate:wsl -- --patch-path <predictions.json> --raw-sample-path <official.jsonl> --output-dir <results>

# 运行接入层回归测试
pnpm test:swebench-pro
```

可通过参数覆盖默认路径：

```powershell
node scripts/swebench-pro-runtime.mjs evaluate `
  --raw-sample-path <sample.official.jsonl> `
  --patch-path <predictions.json> `
  --output-dir <result-directory> `
  --workers 1
```

补丁生成阶段默认从公开 GitHub 仓库按任务的精确 `base_commit` 做隔离 checkout，不需要先下载完整评分镜像。需要复刻镜像内 `/app` 时可显式传入 `--workspace-source image`；该路径使用 `auto` 容器后端，先检查 Windows 原生 Docker，缺失时复用 `Ubuntu-22.04` WSL Docker。最终得分始终由官方 Docker evaluator 给出。官方评分默认并发为 1，避免同时拉取多个大镜像。云端 Modal 模式可显式传入 `--mode modal`，但需要用户自己完成 Modal 凭据配置。

GitHub 网络不稳定时可通过 `AILIS_SWEBENCH_PRO_GIT_PROXY` 或 `--git-proxy` 提供代理。准备器使用单提交浅层 fetch、最多三次有界重试，并可从自己创建的半成品 `.git` 工作区继续，不会自动删除用户目录。

TaskAgent 运行器默认读取 AILIS 控制面板中已经保存的模型配置。第一阶段建议使用当前 `deepseek-v4-flash` 跑 `smoke-11`；管线稳定后，在同一固定 44 题上使用下面的方式运行 V4 Pro：

```powershell
node scripts/run-ailis-swebench-pro.mjs `
  --tasks build-cache/benchmarks/swebench-pro/data/swebench-pro.test.sample.calibration-44.tasks.jsonl `
  --model deepseek-v4-pro `
  --max-turns 250
```

每个任务使用独立 TaskAgent Session，`messageHistory=[]`、`memoryPolicy=disabled`，不注入 Persona、关系画像、长期记忆或其他任务轨迹。250 次限制按模型决策轮次计数，达到限制后通过标准 interrupt 保留 TaskAgent 的中断快照和当前工作区补丁。

## 首个正式基线

2026-08-11 使用 `deepseek-v4-flash` 对 `smoke-11` 的首个 NodeBB 实例执行 Pass@1。TaskAgent 在 1,003,731 ms 内完成 232 次模型决策并生成 8,290 字符 patch；官方 ScaleAI evaluator 正常运行，结果为 `0/1 resolved`。所选测试 300 个中 297 个通过、3 个失败：两项因 Agent 在数据库适配器实现了 `mget` 却漏掉公共导出层，另一项因 `canSendValidation` 时间基线计算错误。

该题累计 prompt token 为 10,744,802，其中 cached token 为 9,643,264；completion token 为 84,635。这个结果证明端到端评测管线可用，也表明 V4 Flash 在该长程修复题上探索轮次和上下文开销过高。剩余 smoke 题不应直接无差别续跑，应先与更强 coding 模型做同题对照，或降低旧 observation 重复输入。

## 补丁文件协议

官方评分输入是 JSON 数组：

```json
[
  {
    "instance_id": "instance_...",
    "patch": "diff --git ...",
    "prefix": "ailis-run-name"
  }
]
```

运行评分前，AILIS 会检查数组结构、`instance_id`、patch 类型和重复实例。空 patch 可以进入评分，但会明确警告并按未解决任务处理。

## 完成标准

接入层完成不等于获得 SWE-Bench Pro 分数。首次真实评测需同时满足：

- 官方 Harness 完整且能记录 commit；
- Python 依赖就绪；
- Docker daemon 或 Modal 凭据可用；
- AILIS 为任务生成了不含金标泄漏的 patch；
- TaskAgent 运行使用固定模型设置、Pass@1 且没有模型级重试；
- 官方 evaluator 产出 `eval_results.json`；
- 结果记录模型、AILIS commit、Harness commit、任务 ID、耗时和成本。

官方仓库目前仍提示排行榜和部分测试在持续修订，因此每次正式报告都必须固定数据版本和 Harness commit，不能只记录一个裸分数。

## 官方来源

- 数据集：<https://huggingface.co/datasets/ScaleAI/SWE-bench_Pro>
- 官方 Harness：<https://github.com/scaleapi/SWE-bench_Pro-os>
- 官方镜像：<https://hub.docker.com/r/jefzda/sweap-images>
