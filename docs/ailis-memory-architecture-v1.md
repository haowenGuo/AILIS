# AILIS Memory Architecture V1

## Goal

AILIS 的记忆系统不是工具数据库，而是人物理解层。它要让 AILIS 随着使用时间变长，更了解用户、更懂项目、更自然地调整语气，同时保留工程级可恢复、可审计、可删除的稳定性。

V1 采用混合架构：

- Codex / Claude Code 风格：项目记忆、会话记录、上下文压缩、可恢复状态。
- Letta / MemGPT 风格：核心记忆块，长期保存用户、人物、关系、项目状态。
- Generative Agents 风格：事件流、重要性评分、轻量反思，持续沉淀对用户的理解。
- OpenClaw 风格：Markdown 长期记忆、每日短期记忆、后台 dreaming/promote 思路。

## Reference Mapping

| Reference | What to Borrow | AILIS Adaptation |
| --- | --- | --- |
| Codex memories pipeline | 两阶段记忆：单会话提取，然后全局整合；后台运行；有 lease/limit/summary | `MemoryEventWriter` 写事件，`ReflectionEngine` 后台整合成记忆块 |
| Codex read path | 只把 memory summary 注入上下文，必要时再查详细文件 | `ContextCompiler` 注入小型 persona/user/project/relationship capsule |
| Claude Code memory | 项目级 `CLAUDE.md`/上下文文件，适合工程决策和仓库习惯 | `project.md` 记录 AILISCLAW 架构、模块、用户确认过的方向 |
| Letta / MemGPT | core memory blocks + archival memory | `user/persona/relationship/project` 四个核心块 + 可检索事件库 |
| Generative Agents | memory stream、importance、recency/relevance、reflection | `memory_events` + 重要性评分 + 周期性反思 |
| OpenClaw memory | `MEMORY.md`、daily notes、dreaming、promotion threshold | `daily/*.md` + `DREAMS.md` + 高分候选晋升长期记忆 |

## Local Layout

记忆默认放在 AILIS 本地状态目录下：

```text
F:\AILIS\.ailis-state\memory\
  memory.sqlite
  capsules\
    user.md
    persona.md
    project.md
    relationship.md
    secrets.md
  daily\
    2026-05-28.md
  dreams\
    DREAMS.md
    2026-05-28-reflections.jsonl
  attachments\
    vision\
    audio\
```

V1 推荐 SQLite + Markdown capsule 混合：

- SQLite 保存结构化事件、检索索引、证据、好感度轨迹、敏感数据元信息。
- Markdown capsule 保存模型每次最容易读懂的稳定记忆摘要。
- daily notes 保存当天短期事实，后续通过反思晋升。

## Memory Types

| Type | Meaning | Example |
| --- | --- | --- |
| `working_memory` | 当前会话短期上下文 | 用户正在调试视觉截图功能 |
| `episodic_memory` | 发生过的具体事件 | 用户否定了“文本自动触发截图”的设计 |
| `semantic_memory` | 稳定事实 | Kokoro 是低延迟语音路线，CosyVoice 是质量路线 |
| `user_preference` | 用户偏好 | 用户喜欢大白话解释复杂架构 |
| `persona_memory` | AILIS 人设与表达边界 | 温和、自然、有陪伴感，不要过度卖萌 |
| `project_memory` | 项目长期决策 | 视觉能力是人物感知层，不做屏幕操作 Agent |
| `relationship_memory` | 相处关系和语气状态 | 用户接受轻微拟人，但讨厌工具日志感 |
| `secret_memory` | 本地私人数据 | API Key、账号配置、私密偏好 |
| `affinity_event` | 好感度变化证据 | 用户表扬版本不错，或强烈否定随意发挥 |

## Database Schema

```sql
memory_events
- id
- session_id
- turn_id
- source              -- chat | voice | vision | tool | system
- role                -- user | assistant | tool | system
- content
- summary
- importance          -- 0.0 - 1.0
- emotional_weight    -- -1.0 - 1.0
- privacy_level       -- public | private | secret
- created_at
- expires_at
- evidence_ref

memory_items
- id
- type                -- user_preference | project_fact | relationship | persona | secret | boundary
- scope               -- global | project | session
- content
- confidence          -- 0.0 - 1.0
- importance          -- 0.0 - 1.0
- sensitivity         -- normal | private | secret
- evidence_event_ids
- created_at
- updated_at
- last_used_at
- status              -- active | archived | forgotten

memory_blocks
- key                 -- user | persona | project | relationship | secrets
- content
- version
- updated_at

affinity_state
- id
- score               -- 0 - 100, default 50
- familiarity         -- 0 - 100
- trust               -- 0 - 100
- warmth              -- 0 - 100
- playfulness         -- 0 - 100
- boundary_respect    -- 0 - 100
- summary
- updated_at

affinity_events
- id
- delta
- reason
- evidence_event_id
- created_at
```

## Secret And Privacy Design

因为 AILIS 是私人助手，V1 允许存储密钥和隐私，但必须和普通记忆分层。

原则：

- 普通偏好可以进入 `user.md`。
- 私人事实进入 `private` 级 memory item。
- API Key、token、密码进入 `secret_memory`，不进入普通上下文。
- 需要使用密钥时，通过 `SecretVault.get(name)` 注入工具调用，不把明文放进模型长期 prompt。
- 控制面板提供“本地保存私人信息/密钥”的开关和查看/删除入口。

存储策略：

- 第一版可先用本地文件 + Electron `safeStorage` 或 Windows DPAPI 加密。
- 如果加密能力不可用，必须在控制面板标明“以本机文件保存”。
- 记忆导出时默认不导出 secret。
- 删除用户记忆时，secret vault 和普通记忆分别删除，避免误删/漏删。

## Affinity System

好感度是关系记忆的一部分，采用内部 0-100 分：

- 初始：50
- 0：明显疏远/讨厌
- 50：普通熟悉度
- 100：非常亲近/喜欢

好感度影响：

- 称呼和语气亲密度。
- 是否更主动提出帮助。
- 是否更自然地引用共同经历。
- 是否更愿意用轻松、玩笑、陪伴式表达。
- 表情、动作、语音情绪参数。

好感度不影响：

- 基础功能可用性。
- 安全规则。
- 是否帮用户完成正当任务。
- 是否如实说明不确定性。

建议行为档位：

| Score | Behavior |
| --- | --- |
| 0-20 | 更克制、礼貌、少玩笑，但仍可靠帮助 |
| 21-40 | 偏正式，少主动情绪表达 |
| 40-60 | 温和、熟悉但不过分亲密 |
| 61-79 | 更熟悉、更自然、更有陪伴感，会引用共同项目记忆和用户偏好 |
| 80-100 | 允许明显亲密、主动、轻微撒娇、更多默契表达，但不影响专业判断 |

更新规则要慢，不要一句话剧烈跳动：

```text
强正向反馈：+2 到 +5
普通正向反馈：+0.5 到 +1.5
用户明确不满：-1 到 -4
用户纠正架构方向：-0.5 到 -2，同时写入偏好记忆
长时间稳定互动：每天最多 +1
尊重用户边界：提升 boundary_respect，不直接刷 affinity
```

为了防止数值操控感，默认不在主界面显示“好感度条”。控制面板高级页可以显示“关系状态”，用拟人化文案表达，比如“熟悉”“亲近”“信任”，同时允许开发调试查看 0-100 数值。

## Write Pipeline

每轮 Agent Loop 结束后执行轻量写入：

```text
Turn transcript
  -> MemoryEventWriter
  -> ImportanceScorer
  -> PrivacyClassifier
  -> MemoryCurator
  -> SQLite event/item
  -> Daily note
```

写入规则：

- 不把所有聊天都升级成长记忆。
- 用户明确表达偏好、否定、确认设计方向时，高优先级保存。
- 工具结果、截图理解、语音反馈可以作为证据保存。
- 临时闲聊默认只进 daily note，除非反复出现。
- 密钥/隐私允许保存，但要标记 sensitivity，走 vault/secret 分层。

## Reflection Pipeline

反思借鉴 Generative Agents 和 Codex Phase 2，不实时阻塞对话。

触发条件：

- 重要事件累计超过阈值。
- 当前会话结束或空闲 3-5 分钟。
- 用户强烈纠正/表扬/否定。
- 每日固定后台整理。

流程：

```text
Recent important events
  -> ReflectionEngine
  -> Proposed updates
  -> ConflictDetector
  -> MemoryBlockUpdater
  -> AffinityUpdater
  -> DREAMS.md review note
```

反思输出示例：

```json
{
  "insight": "用户希望底层能力工程化，但表层体验要拟人，不能工具日志感太强。",
  "target_blocks": ["user", "project", "relationship"],
  "confidence": 0.92,
  "evidence": ["event_vision_design_rejection", "event_memory_architecture_preference"],
  "affinity_delta": 1,
  "reason": "用户明确表达产品理念并继续推进设计"
}
```

## Read Pipeline / Context Compiler

每次回复前，`ContextCompiler` 组装小型上下文包：

```text
Current user input
Recent chat turns
Active task state
Relevant memory items
Capsules:
  - user.md
  - persona.md
  - project.md
  - relationship.md
Affinity state summary
Tool/vision/voice state
```

注入模型的不是数据库结果，而是人物可以自然使用的理解：

```text
你对用户的稳定理解：
- 用户喜欢大白话解释复杂工程。
- 用户强调 AILIS 要拟人，能力可以工程化但不能工具感太强。
- 用户正在做 AILISCLAW，关注视觉、语音、Agent Loop、记忆架构。

当前关系状态：
- affinity: 62/100
- 语气：温和自然，技术解释先结论后细节，可以轻微陪伴感。
```

## Controls

控制面板建议名称：

- AILIS 记得的事
- 项目笔记
- 相处偏好
- 私人信息与密钥
- 关系状态
- 让 AILIS 忘掉这件事

用户可操作：

- 开/关长期记忆。
- 开/关私人信息保存。
- 查看、编辑、删除记忆。
- 查看关系状态。
- 重置好感度为 50。
- 导出普通记忆，不默认导出 secret。

## V1 Implementation Modules

```text
electron/
  ailis-memory-store.cjs
  ailis-memory-curator.cjs
  ailis-memory-reflection.cjs
  ailis-context-compiler.cjs
  ailis-secret-vault.cjs
  ailis-affinity.cjs
```

职责：

- `MemoryStore`：SQLite/JSONL/Markdown 读写，事件、项目、用户、关系、secret 分区。
- `MemoryCurator`：抽取候选记忆、评分、去重、合并、归档。
- `ReflectionEngine`：后台反思，更新 capsules 和 affinity。
- `ContextCompiler`：回复前选择并压缩记忆。
- `SecretVault`：本地密钥/隐私存储，不直接混入普通 prompt。
- `AffinityManager`：0-100 分、事件 delta、语气档位、动作/表情参数。

## First Milestone

第一版建议只做这些：

1. 本地 memory 目录和 SQLite 初始化。
2. 四个 capsule：user/persona/project/relationship。
3. 每轮对话保存重要事件。
4. 简单重要性评分和去重。
5. 关系好感度 50 初始分，慢速更新。
6. ContextCompiler 注入记忆摘要。
7. 控制面板查看/删除/重置。

暂缓：

- 大规模向量检索。
- 复杂知识图谱。
- 多角色社交模拟。
- 强情绪模型。
- 把好感度做成主界面刺激性数值。

V1 的目标是让用户明显感觉 AILIS 更记得、更熟悉、更自然，而不是追求一开始就做成完整人格模拟系统。
