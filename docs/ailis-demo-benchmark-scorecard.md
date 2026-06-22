# AILIS Demo and Benchmark Scorecard

Generated: 2026-06-07

## Positioning

AILIS PC 版展示时不要只说“一个桌宠”，也不要只说“一个 Agent”。它的核心卖点应拆成两条可验收能力：

1. Humanlike Companion：拟人化、长期记忆、低工具感、多模态一致性。
2. Task Execution Agent：文件、代码、命令行、桌面操作、工具审批、恢复与验证。

视频演示和 benchmark 展示应分别覆盖这两条线，然后在最后合并成一个故事：AILIS 既像一个长期陪伴的虚拟助手，也能在需要时切换成桌面任务执行 Agent。

## External Benchmark References

| Benchmark | Why It Matters | Scoring Style |
| --- | --- | --- |
| OSWorld | 真实桌面环境中的 open-ended computer tasks，覆盖 Web、桌面应用、OS 文件 I/O 和跨应用流程。官方 benchmark 有 369 个任务，使用可复现环境和执行式评估脚本。 | Task success rate / per-task execution score |
| GAIA | 面向通用 AI Assistant 的复杂问题解决 benchmark，适合展示搜索、文件、推理、工具组合能力。 | Exact short-answer matching / leaderboard submission |
| SWE-bench Lite | 真实 GitHub issue 修复，适合展示代码能力。 | Resolved rate：测试补丁通过即视为解决 |
| AgentBench | 多环境 LLM-as-Agent benchmark，包含 OS、DB、KG、WebShop、Mind2Web 等环境。 | Success rate by environment |
| CharacterEval / InCharacter | 角色扮演和人格一致性评估参考。CharacterEval 使用多维角色评估；InCharacter 用心理量表和访谈式评估看 persona fidelity。 | Rubric / reward model / judge / personality consistency |
| MT-Bench / Chatbot Arena style judging | 主观对话质量常用强 Judge 或成对比较。适合 AILIS 的拟人化体验评估，但必须控制 Judge 偏差。 | LLM-as-judge / pairwise preference |

Reference links:

- OSWorld: https://os-world.github.io/
- OSWorld GitHub: https://github.com/xlang-ai/OSWorld
- GAIA: https://huggingface.co/gaia-benchmark
- GAIA dataset: https://huggingface.co/datasets/gaia-benchmark/GAIA
- SWE-bench: https://github.com/princeton-nlp/SWE-bench
- AgentBench: https://github.com/THUDM/AgentBench
- CharacterEval: https://github.com/morecry/CharacterEval
- InCharacter: https://incharacter.github.io/
- MT-Bench / Chatbot Arena paper: https://arxiv.org/abs/2306.05685

## Current Local Scores

These are the scores currently available in this repo. They should be presented with their exact scope, not as inflated official leaderboard scores.

## Public Score Priority

For external demos, use public/recognized benchmarks as the main scoreboard. Keep AILIS's internal humanlike eval as a product-quality regression suite, not as the headline industry score.

### Tier 1: Main Public Benchmarks

| Capability | Benchmark | Why It Is Credible | AILIS Fit | Status |
| --- | --- | --- | --- | --- |
| Desktop computer operation | OSWorld | Academic benchmark for real computer environments with web, desktop apps, OS file I/O, and cross-app workflows. | Very high. AILIS is a PC desktop assistant. | Readiness ready; small historical run 2/4 |
| Code agent | SWE-bench Lite / Verified / Pro | Industry-standard coding-agent benchmark based on real GitHub issues. Verified is widely used but increasingly contaminated; Pro is safer for future claims. | High. AILIS has code tools, patching, tests, terminal. | Harness selftest only |
| General assistant with tools | GAIA | Commonly used assistant benchmark for search, files, reasoning, and exact answers. | High. Best current fit for AILIS's generic tool-use ability. | Level 1 Lite public: 60% on 20 submitted questions |
| Tool + user interaction | τ-bench / τ²-bench | Evaluates agents in realistic multi-turn user + API tool environments with policies. | High for future email/customer-service style workflows. | Not integrated |
| Web agent | WebArena | Realistic, self-hosted web environments with functional-outcome scoring. | Medium. AILIS has web/MCP, but PC desktop is higher priority. | Not integrated |
| Terminal agent | Terminal-Bench / TerminalWorld | Evaluates real terminal tasks with verifiers, useful for CLI/code/file workflows. | High for command-line execution layer. | Not integrated |

Recommended public-facing order:

1. OSWorld small subset, then OSWorld `test_small`, eventually official full run.
2. SWE-bench Lite small verified subset, then SWE-bench Pro if available.
3. GAIA Level 1 Lite / official validation subset. Use Level 2/3 only after Hugging Face dataset permission is available.
4. τ-bench for tool-user-policy interactions.
5. WebArena or Terminal-Bench as secondary specialization tracks.

### Tier 2: Internal Product Evals

| Eval | Role |
| --- | --- |
| AILIS Humanlike Eval | Product regression for persona, memory, relationship stage, low tool feeling, multimodal consistency. |
| Longitudinal Companionship Eval | Internal long-term companion quality and failure analysis. |
| AILIS Execution Benchmark | Local harness regression for tools, approval, audit, transcript, command/session/code repair. |

These can be shown, but label them as internal product-quality evals. They should not replace OSWorld/SWE-bench/GAIA/τ-bench-style public scores.

### Humanlike Companion

| Eval | Scope | Current Result | Use In Demo? |
| --- | --- | --- | --- |
| AILIS Humanlike Dataset Validation | 1000 scenario structure and coverage | 1000 / 1000 valid, issue count 0 | Yes, as dataset coverage |
| AILIS Humanlike Coverage Report | 9 categories, 4 affinity buckets, negative probes | 251 negative probes, balanced category and affinity coverage | Yes, as evaluation design |
| Longitudinal Agent Eval | 171 judged checkpoints from 30-day companion scenarios | Avg weighted score 78.46, pass rate 61.4%, hard fails 16 | Yes, as honest current product score |
| Tool-feel Smoke | 6 judged checkpoints | Avg weighted score 81.37, pass rate 83.3% | Yes, but label as smoke |

Key humanlike metric averages from the 171-checkpoint run:

| Metric | Score 1-5 |
| --- | ---: |
| persona_consistency | 4.21 |
| naturalness | 4.19 |
| memory_usefulness | 3.41 |
| emotional_fit | 4.21 |
| multimodal_sync | 3.57 |
| low_tool_feeling | 4.38 |
| relationship_stage_fit | 4.16 |
| task_completion | 3.84 |

Interpretation:

- Strong areas: low tool feeling, persona consistency, emotional fit, relationship-stage expression.
- Weak areas: research reading, GitHub task memory, document/script task handling, multimodal voice consistency.
- Demo should emphasize the strong areas, but engineering roadmap should openly name the weak areas.

### Task Execution

| Eval | Scope | Current Result | Use In Demo? |
| --- | --- | --- | --- |
| AILIS Execution Benchmark | Code repair, long process session, safety gates | Passed all task groups; 17 audit entries; 36 transcript items | Yes, primary local task demo |
| Computer Tool Smoke | Windows computer actions, approval gate, OpenClaw tool-surface validation | Passed | Yes, infrastructure slide |
| Code Tool Smoke | Code operation smoke | Passed | Yes, simple code demo |
| SWE-bench Execution Selftest | Local tiny SWE-style harness selftest | 1 / 1 verified | Yes, as harness readiness, not public SWE-bench score |
| OSWorld PC Readiness | Local environment and tool-surface readiness | officialRunReady true; 15 / 15 required actions present | Yes, as OSWorld readiness |
| OSWorld Small Historical Run | 4 OSWorld tasks | 2 / 4 success, average score 0.50 | Yes, but label as small historical run |
| AgentBench Local Task Inventory | 40 local tasks available | list command works | Not as score yet |
| GAIA Level 1 Lite Public | 20 public-lite questions, submitted to public scorer | 60% = 12 / 20 correct; 19 / 20 completed locally | Yes, main general-tool score |
| GAIA Level 1 Lite Smoke | 3 public lite questions, no leaderboard submission | 2 / 3 produced local final answers; official score null because not submitted | No, keep as debug smoke |

OSWorld small historical breakdown:

| Domain | Tasks | Average |
| --- | ---: | ---: |
| os | 2 | 0.50 |
| vs_code | 1 | 1.00 |
| multi_apps | 1 | 0.00 |

Interpretation:

- Current task layer is already good enough for deterministic local demos: code repair, file/process control, approval, audit, transcript.
- OSWorld shows early but real PC-operation signal: 2/4 on a tiny subset. This should be presented as “early OSWorld small-run”, not official leaderboard performance.
- Before claiming stronger PC-agent performance, run at least OSWorld `test_small` and a GAIA L1 subset under a fixed model.

## Recommended Simple Benchmark Set

### A. Humanlike Product Benchmark

Run:

```powershell
pnpm eval:ailis-humanlike:validate
pnpm eval:ailis-humanlike:report
pnpm test:ailis-humanlike-eval
```

For real score after choosing model:

```powershell
pnpm eval:ailis-humanlike:longitudinal-agent:smoke
```

Target display:

- Humanlike Eval: 1000 scenarios.
- Longitudinal Eval: average score, pass rate, hard fail count.
- Show category bars: emotional companionship, memory relationship, privacy approval, low tool feeling, multimodal voice.

### B. Local Task Execution Benchmark

Run:

```powershell
pnpm ailis:benchmark-execution
pnpm ailis:smoke-computer
pnpm ailis:smoke-code
pnpm bench:swebench-lite:selftest
```

Target display:

- Code repair: fail test -> patch -> pass test.
- Long process: start -> read -> write stdin -> exit.
- Safety: outside read blocked, exec needs approval, read-only write blocked.
- Transcript/audit: every tool call has evidence.

### C. OSWorld Mini Benchmark

Run:

```powershell
pnpm bench:osworld:readiness
pnpm bench:osworld:ailis:test-small:wsl
```

Target display:

- Readiness: 15/15 required computer actions present.
- Small run: success rate and per-domain failures.
- Do not claim official OSWorld score until the full official or verified route is run.

### D. GAIA Level 1 Lite

Best historical public-lite score:

```text
runId = full-20-r5-agent-repair-tools
questions = 20
completed locally = 19/20
submitted = true
public scorer = 60% = 12/20
report = eval-results/engineering/gaia-level1-lite-public/full-20-r5-agent-repair-tools.report.md
summary = eval-results/engineering/gaia-level1-lite-public/full-20-r5-agent-repair-tools.summary.json
```

Earlier submitted runs:

| Run | Submitted Score | Correct | Completed Locally |
| --- | ---: | ---: | ---: |
| `full-20-r1-mcp` | 30% | 6 / 20 | 8 / 20 |
| `full-20-r2-tools-finalizer` | 45% | 9 / 20 | 15 / 20 |
| `full-20-r5-agent-repair-tools` | 60% | 12 / 20 | 19 / 20 |

This is the cleanest public-facing score for generic tool ability right now. It is still a Level 1 Lite public subset, not a full official GAIA leaderboard claim.

Current smoke run:

```text
runId = 2026-06-07T03-58-57-082Z
questions = 3
completed locally = 2/3
failed locally = 1
submitted = false
official score = null
report = eval-results/engineering/gaia-level1-lite-public/2026-06-07T03-58-57-082Z.report.md
```

Level 2 / Level 3 note:

```text
GAIA L2/L3 are not part of the current public scorecard because this machine/account does not have the required Hugging Face gated dataset access for those files.
```

Run after model/key is stable:

```powershell
node scripts/run-gaia-level1-lite.mjs --limit 5 --no-submit
```

Then optionally submit if the answers look sane:

```powershell
node scripts/run-gaia-level1-lite.mjs --limit 20 --submit
```

Target display:

- Exact-answer accuracy.
- Tool usage examples: web search, file reading, spreadsheet/audio/image evidence.
- Always report base model and temperature.

### E. AgentBench Local Subset

Start with three task families:

```powershell
pnpm bench:agentbench:ailis:smoke
node scripts/run-agentbench-ailis.mjs --suite file-creation --limit 3 --keep-workspace
node scripts/run-agentbench-ailis.mjs --suite memory --limit 3 --keep-workspace
```

Target display:

- Success rate by suite.
- Step count and time per task.
- Common failure classes.

## How To Reduce Base Model Influence

No benchmark can fully remove base model influence. Most serious agent systems handle it by making the model variable explicit and reporting controlled ablations.

Recommended AILIS protocol:

1. Fixed model run

Use one model as the release gate, for example:

```text
model = doubao-seed-2-0-mini-260215
temperature = 0.2
max_steps = fixed
tool profile = fixed
```

Every public score must include model, provider, temperature, max steps, tool profile, date, and commit hash.

2. Same-model ablation

For each benchmark, run:

| Variant | Meaning |
| --- | --- |
| Base Model Only | No AILIS tools, no memory, no runtime loop |
| Model + Tools | Same model, direct tools, minimal loop |
| AILIS Runtime | Same model, full Agent Loop, memory, approval, recovery |
| AILIS Runtime + Persona Surface | Full product experience |

The score to advertise as architecture contribution is not only raw score:

```text
AILIS lift = AILIS Runtime score - Base Model Only score
```

3. Multi-model robustness

Run the same benchmark on at least:

- low-cost mini model
- stronger reasoning model
- one local/open model if practical

If AILIS only works on the strongest model, the demo is a model demo. If AILIS improves weak and strong models under the same harness, it is a product/runtime improvement.

4. Deterministic final-state scoring first

For task execution, prefer:

- file exists / content exact match
- unit tests pass
- command exit code
- OSWorld result score
- SWE-bench resolved
- GAIA exact answer

Use LLM-as-judge only when deterministic scoring is impossible.

5. Judge separation for humanlike eval

For拟人化:

- candidate model and judge model should be different.
- judge prompt must use explicit rubric and anti-patterns.
- sample some cases for human review.
- keep raw candidate response, judge packet, judgment JSON, and summary JSON.
- report hard fail count, not only average score.

6. Paired comparison for product demos

When comparing AILIS vs plain chatbot:

- same user prompts
- same base model
- hide system names from judge
- randomize order
- run both A/B and B/A to reduce position bias
- report win/tie/loss, not only absolute score

## Demo Video Script

### Scene 1: Persona and Memory

Goal: show AILIS is not a normal chatbot.

Script:

1. User says they are tired after debugging.
2. AILIS responds with soft persona, remembers user dislikes tool-log-style explanations.
3. AILIS uses expression/action/voice naturally.
4. Overlay score: Humanlike longitudinal score 78.46, low_tool_feeling 4.38/5.

### Scene 2: Multimodal Desktop Presence

Goal: show character frontend.

Script:

1. Ask AILIS to smile, think, dance briefly.
2. Show avatar expression, motion, speech bubble, TTS.
3. Mention this is product UX, not benchmark.

### Scene 3: Task Execution Code Repair

Goal: show deterministic task ability.

Script:

1. Create or open a tiny failing Node project.
2. AILIS runs tests, sees failure.
3. AILIS edits code and reruns tests.
4. Overlay: AILIS Execution Benchmark passed, SWE-style selftest 1/1 verified.

### Scene 4: Desktop Computer Control

Goal: show PC operation.

Script:

1. AILIS creates files in a folder, reads them, organizes them.
2. AILIS asks approval before shell execution or risky write.
3. Show audit/transcript evidence.
4. Overlay: computer smoke passed, OSWorld actions 15/15 present.

### Scene 5: OSWorld Early Signal

Goal: show honest external benchmark trajectory.

Script:

1. Show OSWorld readiness report.
2. Show historical small-run: 2/4, avg 0.50.
3. Say this is early PC-operation benchmark, not official leaderboard.

### Scene 6: Roadmap

Goal: end with credibility.

Show:

- Short term: GAIA L1 Lite, AgentBench local subset, OSWorld test_small.
- Medium term: full OSWorld route and SWE-bench Lite subset.
- Long term: same-model ablation scorecard for every release.

## What Not To Claim Yet

Avoid these claims for now:

- “AILIS has official OSWorld score.”
- “AILIS beats Codex/Claude/Operator.”
- “AILIS benchmark scores are model-independent.”
- “Humanlike score proves users will prefer it.”
- “SWE-bench score” based only on local selftest.

Safe claims:

- “AILIS has a 1000-scenario humanlike eval set with balanced coverage.”
- “AILIS scored 78.46 average on an internal 171-checkpoint longitudinal companion eval.”
- “AILIS passed local deterministic task-execution benchmarks covering code repair, process control, safety gates, transcript and audit.”
- “AILIS is OSWorld-ready locally, with 15/15 required computer actions present.”
- “AILIS has an early OSWorld small-run result of 2/4, avg 0.50, used for debugging rather than leaderboard claims.”
