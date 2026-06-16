# OpenClaw 工具对齐清单

日期：2026-05-22

目标：把我们当前整理的工具基座，和 OpenClaw 真实使用的工具面做一次对齐。如果目标是做一个自己的 Claw，而不是做一套全新命名体系，那么最稳的路线就是：

- 先抄 OpenClaw 的工具命名、分组、策略层次。
- 再按我们自己的 Gateway、前端、运行时，替换底层实现。

## 结论先说

建议不要自己重新发明一套 `fs.read_text / browser.open / gmail.list_threads` 这种点式命名作为第一版主接口。

第一版更稳的是直接采用 OpenClaw 这套风格：

- `read`
- `write`
- `edit`
- `apply_patch`
- `exec`
- `process`
- `web_search`
- `web_fetch`
- `sessions_list`
- `sessions_history`
- `sessions_send`
- `sessions_spawn`
- `sessions_yield`
- `subagents`
- `session_status`
- `message`
- `cron`
- `gateway`
- `nodes`
- `agents_list`
- `update_plan`
- `image`
- `image_generate`
- `music_generate`
- `video_generate`
- `tts`
- `heartbeat_respond`

这不是“照搬得很懒”，而是工程上更聪明：

- 更容易复用 OpenClaw 的 prompt、policy、tool profile 思路。
- 更容易兼容 OpenClaw 的 MCP / CLI / embedded runtime 经验。
- 以后你想抄它的 agent prompt、tool policy、subagent 逻辑时，不会卡在接口命名不一致。

## OpenClaw 真实工具面

最关键的来源是：

- [tool-catalog.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-catalog.ts:1)
- [pi-tools.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/pi-tools.ts:620)
- [openclaw-tools.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/openclaw-tools.ts:1)
- [tool-policy-pipeline.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-policy-pipeline.ts:1)

OpenClaw 不是一个“工具注册表 + 一堆散工具”这么简单，它是分层装配的：

```text
base coding tools
  + shell tools
  + channel tools
  + openclaw core tools
  + plugin tools
  + tool-search controls
  -> tool policy pipeline
  -> before_tool_call hook
```

也就是说，真正值得抄的不是单个工具实现，而是：

1. 工具名
2. 工具分组
3. 工具 profile
4. 工具 policy pipeline
5. 工具装配顺序

## OpenClaw 核心工具清单

### 1. 文件与运行时

来自 [tool-catalog.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-catalog.ts:55)：

- `read`
- `write`
- `edit`
- `apply_patch`
- `exec`
- `process`
- `code_execution`

这里有个很重要的设计判断：

- OpenClaw 没把文件工具切成很多小名字。
- 它偏向少数几个强工具，再用 schema 参数和 policy 控制行为。

这意味着我们之前文档里写的：

- `fs.read_text`
- `fs.read_json`
- `fs.list_dir`
- `fs.glob`
- `fs.stat`
- `fs.write_file`

更像内部 driver，而不应该是第一版对模型暴露的 tool surface。

更稳的做法是：

- 对模型暴露 `read / write / edit / apply_patch`
- 在 Gateway 内部再拆成更细的文件系统驱动函数

### 2. Web 与搜索

来自 [tool-catalog.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-catalog.ts:104) 和 [web-search.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/web-search.ts:1)：

- `web_search`
- `web_fetch`
- `x_search`

建议：

- 第一版至少抄 `web_search` 和 `web_fetch`
- `x_search` 先作为可选插件工具

不要一开始做成：

- `browser.search`
- `http.fetch_page`

OpenClaw 的命名更适合作为 agent 的通用工具语义。

### 3. 会话与子 Agent

来自 [openclaw-tools.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/openclaw-tools.ts:320) 和这些具体文件：

- [sessions-list-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/sessions-list-tool.ts:73)
- [sessions-history-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/sessions-history-tool.ts:188)
- [sessions-send-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/sessions-send-tool.ts:193)
- [sessions-spawn-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/sessions-spawn-tool.ts:269)
- [sessions-yield-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/sessions-yield-tool.ts:15)
- [subagents-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/subagents-tool.ts:36)
- [session-status-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/session-status-tool.ts:336)

核心工具：

- `sessions_list`
- `sessions_history`
- `sessions_send`
- `sessions_spawn`
- `sessions_yield`
- `subagents`
- `session_status`

这是我们前一版基座文档里最缺的部分之一。

对你自己的 Claw 来说，这一组应该是第一批一等公民，不是后补功能。因为你的产品方向本来就很像：

- 桌宠前端
- Agent 编排
- 多会话 / 多子任务
- Gateway 中转

所以这组接口建议直接抄名字。

### 4. 消息、自动化、控制

对应来源：

- [message-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/message-tool.ts:945)
- [cron-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/cron-tool.ts:493)
- [gateway-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/gateway-tool.ts:371)
- [heartbeat-response-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/heartbeat-response-tool.ts:41)
- [update-plan-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/update-plan-tool.ts:79)
- [agents-list-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/agents-list-tool.ts:36)

核心工具：

- `message`
- `cron`
- `gateway`
- `heartbeat_respond`
- `update_plan`
- `agents_list`

这里的关键不是单个工具有多复杂，而是 OpenClaw 把这些“编排动作”也看作工具，而不是私有 runtime API。

这件事非常值得照抄。

为什么：

- 这样模型能显式表达“我要发消息”“我要更新计划”“我要创建定时任务”
- 这样审批、审计、回放、重试都能统一走 tool transcript

### 5. 设备 / 节点

来源：

- [nodes-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/nodes-tool.ts:137)

工具名：

- `nodes`

OpenClaw 这里不是拆成十几个 `camera.snap / location.get / notifications.list` 工具，而是用一个多动作的 `nodes` 工具承载：

- `status`
- `describe`
- `pending`
- `approve`
- `reject`
- `notify`
- `camera_snap`
- `camera_list`
- `camera_clip`
- `photos_latest`
- `screen_record`
- `location_get`
- `notifications_list`
- `notifications_action`
- `device_status`
- `device_info`
- `device_permissions`
- `device_health`
- `invoke`

这也说明一个方向：

- 对模型暴露的工具面，不一定要无限拆小
- 很多“同一域里的动作”，可以收进一个 umbrella tool

对你自己的 Claw，这很适合：

- 桌宠 / 电脑 / 节点 / 手机 / 外设能力
- 都可以先挂进一个 `nodes` 统一入口

### 6. 媒体

来源：

- [image-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/image-tool.ts:508)
- [image-generate-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/image-generate-tool.ts:792)
- [music-generate-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/music-generate-tool.ts:599)
- [video-generate-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/video-generate-tool.ts:943)
- [pdf-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/pdf-tool.ts:323)
- [tts-tool.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tools/tts-tool.ts:62)

核心工具：

- `image`
- `image_generate`
- `music_generate`
- `video_generate`
- `pdf`
- `tts`

这组名字建议直接抄，尤其是：

- `image`
- `image_generate`
- `tts`

因为它们很容易成为你视觉前端和桌宠形象系统的一部分。

## OpenClaw 的工具 profile 和 group

这是最值得直接抄的一层。

来源：

- [tool-catalog.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-catalog.ts:321)

它内建这些 profile：

- `minimal`
- `coding`
- `messaging`
- `full`

还内建这些 group：

- `group:openclaw`
- `group:fs`
- `group:runtime`
- `group:web`
- `group:memory`
- `group:sessions`
- `group:ui`
- `group:messaging`
- `group:automation`
- `group:nodes`
- `group:agents`
- `group:media`

这个设计很值钱，因为它直接解决了“怎么按场景裁工具”的问题。

对你自己的 Claw，我建议直接抄：

```ts
type ToolProfileId = "minimal" | "coding" | "messaging" | "full";
```

然后也做一份 `CORE_TOOL_GROUPS`。

这样你以后就可以直接做：

- 桌宠闲聊人格：`minimal`
- 编程人格：`coding`
- 聊天渠道人格：`messaging`
- 管理员模式：`full`

## OpenClaw 的运行时装配方式

来源：

- [pi-tools.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/pi-tools.ts:634)

OpenClaw 并不是永远把所有工具都做出来，而是先算 construction plan：

- `includeBaseCodingTools`
- `includeShellTools`
- `includeChannelTools`
- `includeOpenClawTools`
- `includePluginTools`

然后再装配：

1. `base coding tools`
2. `apply_patch`
3. `exec`
4. `process`
5. `channel tools`
6. `openclaw core tools`
7. `plugin tools`
8. `tool search tools`

这意味着我们自己的实现也最好有：

```ts
type ToolConstructionPlan = {
  includeBaseCodingTools: boolean;
  includeShellTools: boolean;
  includeChannelTools: boolean;
  includeOpenClawTools: boolean;
  includePluginTools: boolean;
};
```

不要一开始就写成一个固定的大数组。

## OpenClaw 的策略层次

来源：

- [tool-policy-pipeline.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/tool-policy-pipeline.ts:1)
- [pi-tools.policy.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/agents/pi-tools.policy.ts:1)

它的 policy 不是单层 allowlist，而是多层叠加：

1. `profilePolicy`
2. `providerProfilePolicy`
3. `globalPolicy`
4. `globalProviderPolicy`
5. `agentPolicy`
6. `agentProviderPolicy`
7. `groupPolicy`
8. `senderPolicy`
9. `sandboxToolPolicy`
10. `subagentPolicy`
11. `inheritedToolPolicy`

这点也值得直接抄。

尤其是这几个概念：

- `groupPolicy`
- `senderPolicy`
- `subagentPolicy`
- `inheritedToolPolicy`

它们对你这种“桌宠 + 多渠道 + 多子 Agent + Gateway”的系统特别有用。

## 我们当前基座和 OpenClaw 的差异

### 1. 我们现在太“REST 风”

我们之前的文档更像：

- `fs.read_text`
- `fs.write_file`
- `browser.open`
- `gmail.list_threads`

而 OpenClaw 更像：

- `read`
- `write`
- `message`
- `nodes`
- `sessions_spawn`

建议：

- 对模型暴露层先对齐 OpenClaw 的扁平工具名
- 内部再保留你喜欢的模块化 driver

### 2. 我们把浏览器想得太细了

我们之前建议了：

- `browser.open`
- `browser.click`
- `browser.type`
- `browser.snapshot`

OpenClaw 实际更偏：

- `browser` 作为总工具
- 或直接作为 plugin / MCP 能力

建议：

- 第一版不要急着把浏览器工具面定死
- 先把 `browser` 保留成 OpenClaw 兼容占位
- 底层可以继续用 Playwright MCP 或 Playwright CLI

### 3. 我们低估了会话工具的重要性

OpenClaw 把 `sessions_*` 和 `subagents` 放得很中心。

这说明对你自己的 Claw：

- 会话系统不是底层细节
- 它就是模型可见能力

### 4. 我们没把 `nodes` 当成一等公民

OpenClaw 的 `nodes` 很适合电脑、手机、设备、外设、通知、摄像头这些能力。

你的 Claw 如果要做成一个真“桌宠操作系统”，`nodes` 很值得直接照抄。

## 直接照抄的建议

### 第一批：建议原样抄名字

- `read`
- `write`
- `edit`
- `apply_patch`
- `exec`
- `process`
- `web_search`
- `web_fetch`
- `sessions_list`
- `sessions_history`
- `sessions_send`
- `sessions_spawn`
- `sessions_yield`
- `subagents`
- `session_status`
- `message`
- `cron`
- `gateway`
- `nodes`
- `agents_list`
- `update_plan`
- `image`
- `image_generate`
- `music_generate`
- `video_generate`
- `tts`
- `heartbeat_respond`

### 第二批：建议保留兼容占位

- `browser`
- `canvas`
- `code_execution`
- `x_search`
- `memory_search`
- `memory_get`
- `pdf`

这些可以先不做满，但工具名建议提前预留。

### 第三批：OpenClaw MCP Bridge 也很值得抄

来源：

- [channel-tools.ts](/F:/AILIS/AILISClaw/.refs/openclaw-main/src/mcp/channel-tools.ts:14)

它暴露了这批 MCP 工具：

- `conversations_list`
- `conversation_get`
- `messages_read`
- `attachments_fetch`
- `events_poll`
- `events_wait`
- `messages_send`
- `permissions_list_open`
- `permissions_respond`

如果你以后要把自己的 Gateway 也暴露成 MCP server，这一组可以直接拿来当第一版 MCP surface。

## 最终建议

如果目标是“做一个自己的 OpenClaw 风格 Claw”，我的建议非常明确：

1. 抄 OpenClaw 的工具名。
2. 抄 OpenClaw 的 tool group 和 tool profile。
3. 抄 OpenClaw 的 tool policy pipeline。
4. 底层实现用你自己整理的这批 GitHub SDK 和 MCP server。
5. 前端表现和视觉系统做成你自己的。

也就是说：

- `接口层` 尽量向 OpenClaw 对齐
- `实现层` 用我们调研过的标准件重做
- `UI/体验层` 完全做你自己的东西

这条路线比“另起一套工具命名体系”稳很多。
