# AIGL Codex-Aligned Skill and MCP Reference

Last updated: 2026-06-05

This document is the working reference for aligning AIGL's Skill and MCP layers with the local Codex implementation. It is intentionally source-backed: every architectural claim below points to local Codex source files under `F:\AIGril\build-cache\codex-runtime`, with short code excerpts and AIGL-side mapping notes.

The goal is not to copy Codex line-for-line. The goal is to copy the engineering shape:

- Skills are progressive instruction packages, not always-on prompt piles.
- MCP servers are Host-managed tool providers, not model-driven magic bridges.
- Tool schemas are discovered, cached, exposed, searched, validated, and called by Runtime.
- The model chooses intent and next action, while Runtime owns connection, schema, validation, approval, execution, and recovery observations.

## 1. Layer Model

Codex separates the system into these layers:

| Layer | Codex role | Executes work | AIGL target |
|---|---|---:|---|
| Skill | File-based workflow instructions in `SKILL.md` | No | Persona-aware capability instructions |
| Plugin | Bundle of skills, MCP configs, apps, hooks | No direct task execution | Installable capability bundle |
| MCP Server | External tool provider over stdio/HTTP | Yes | Local/remote tool service |
| MCP Client/Manager | Host-owned connection and session manager | Yes | Stable `McpConnectionManager` equivalent |
| ToolSpec | Model-visible callable function/schema | No, contract only | Direct tool exposure instead of one giant bridge |
| Tool Search | Deferred discovery over hidden tool metadata | Yes, discovery only | Avoid first-turn prompt bloat |
| Runtime Tool Handler | Deterministic validation and dispatch | Yes | Validate before calling MCP/tool |

Codex's core pattern:

```text
User task
 -> Codex turn builder
 -> skill/plugin injection
 -> MCP connection manager lists tools
 -> MCP tools become ToolSpec
 -> too many tools become deferred search entries
 -> model calls visible tool
 -> runtime validates and dispatches
 -> observation returns to model
```

AIGL should keep the same engineering pattern, then add the embodied/persona surface above the final user-facing output.

## 2. Skill Design

### 2.1 Codex Skill is a `SKILL.md` package

Codex treats a skill as local instructions stored in a `SKILL.md` file. The user-facing skill system in this Codex session is generated from the same pattern.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs`

Short source excerpts:

```rust
const SKILLS_FILENAME: &str = "SKILL.md";
```

```rust
pub async fn load_skills_from_roots<I>(roots: I) -> SkillLoadOutcome
```

Actual Codex behavior:

- A skill is discovered from filesystem roots.
- The skill list shown to the model contains name, description, and path.
- The full skill body is not the whole system prompt by default.
- The model opens the skill body only when it decides the skill applies.

AIGL current mapping:

- AIGL already has file-based skills in `F:\AIGril\electron\skills\<skill_id>\SKILL.md`.
- AIGL loader is in `F:\AIGril\electron\humanclaw-skills.cjs`.
- Current skill IDs include `vision`, `computer`, `email`, `file_manager`, `code`, `mcp_bridge`, `capability_manager`, `self_debugger`.

AIGL adjustment rule:

- Keep the folder shape.
- Do not put all skill bodies into first-turn context.
- First-turn context should contain skill catalog only: `id`, short description, path, available capability tags.
- Full `SKILL.md` should be injected only after model mention, task match, or tool-search-like discovery.

### 2.2 Codex uses progressive disclosure

Codex explicitly tells the model to open only what it needs.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:31`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:33`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:34`

Short source excerpts:

```text
open its `SKILL.md`
```

```text
load only the specific files needed
```

```text
prefer running or patching them
```

Actual Codex behavior:

- The model sees a small skill catalog.
- If it needs a skill, it opens `SKILL.md`.
- If `SKILL.md` points to `references/`, it reads only the needed reference.
- If `scripts/` exist, the model should use scripts rather than reinventing fragile logic.

AIGL adjustment rule:

- AIGL skills should become packages:

```text
electron/skills/research/
  SKILL.md
  scripts/
  references/
  assets/
```

- `SKILL.md` should describe when to use the skill, available tools, evidence boundaries, and failure recovery.
- Repeated fragile procedures should become scripts or MCP tools.
- Do not turn skills into route regex or hardcoded task classifiers.

### 2.3 Codex skill loader supports metadata and fail-open behavior

Codex parses optional metadata but does not let optional metadata break `SKILL.md` loading.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:704`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:705`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:760`

Short source excerpts:

```rust
return LoadedSkillMetadata::default();
```

```rust
LoadedSkillMetadata {
```

Actual Codex behavior:

- Metadata is useful but optional.
- Bad optional metadata does not block the skill body.
- Skill identity includes resolved path and plugin provenance.

AIGL adjustment rule:

- Add optional `agents/openai.yaml` or equivalent metadata later, but keep `SKILL.md` as the durable source.
- Skill load errors should be warnings unless the core skill itself is unreadable.
- Skill catalog should carry provenance: builtin, user-installed, plugin-installed, generated-by-capability-installer.

## 3. MCP Server Model

### 3.1 Codex supports stdio and streamable HTTP MCP transports

MCP Server is a tool service. It can be a local process or a remote HTTP service.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:425`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:438`

Short source excerpts:

```rust
Stdio {
```

```rust
StreamableHttp {
```

Actual Codex behavior:

- A stdio MCP server is launched with command/args/env/cwd.
- An HTTP MCP server is configured with URL and auth/header options.
- The config parser rejects invalid mixed transport fields.

AIGL current mapping:

- AIGL already has stdio and HTTP MCP support through `mcp_bridge`.
- AIGL's local research server is `F:\AIGril\scripts\mcp-aigl-research-server.cjs`.

AIGL adjustment rule:

- Treat MCP as a Host-owned connection registry.
- Store transport config in an AIGL-local config directory under the app root, not scattered ad hoc.
- Validate transport config deterministically before the model sees the server.

### 3.2 Codex owns the MCP connection manager

Codex does not ask the model to manually run MCP protocol commands. Runtime owns clients and sessions.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:171`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:372`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:590`

Short source excerpts:

```rust
pub async fn new(
```

```rust
pub async fn list_all_tools(&self)
```

```rust
pub async fn call_tool(
```

Actual Codex behavior:

- On startup/turn setup, Codex creates or holds MCP clients.
- It aggregates tools from all clients.
- It calls a selected MCP tool by server/tool pair.
- It tracks startup failures and server metadata.

AIGL current mapping:

- AIGL has `executeMcpBridge` in `F:\AIGril\electron\humanclaw-runtime.cjs`.
- It exposes actions like `list_servers`, `list_tools`, `read_resource`, `call_tool`.
- Current issue: the model often sees one indirect `mcp_bridge` tool and must discover server/tool/schema itself.

AIGL adjustment rule:

- Keep `mcp_bridge` for diagnostics/admin.
- For normal task execution, generate direct model-visible tool specs from MCP tools.
- Example target: expose `mcp__aigl_research__web_fetch(url)` as the canonical model-facing id, while still accepting legacy `mcp:aigl_research:web_fetch` as a compatibility alias, instead of asking the model to call `mcp_bridge.call_tool(server, tool, args)`.

## 4. MCP Tool Exposure

### 4.1 Codex converts MCP tools into model-visible ToolSpecs

Codex wraps each MCP `ToolInfo` in a handler and creates a model-visible tool spec.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:36`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191`

Short source excerpts:

```rust
pub struct McpHandler {
```

```rust
let spec = create_tool_spec(&tool_info)?;
```

```rust
fn create_tool_spec(tool_info: &ToolInfo)
```

Actual Codex behavior:

- MCP tool schema becomes a callable tool schema.
- The model can call the tool directly.
- Runtime still knows which MCP server/tool the call maps to.

AIGL adjustment rule:

- Build `McpToolSpecRegistry`.
- Each discovered MCP tool should get:

```json
{
  "id": "mcp__aigl_research__web_fetch",
  "legacy_id": "mcp:aigl_research:web_fetch",
  "name": "mcp__aigl_research__web_fetch",
  "server": "aigl_research",
  "tool": "web_fetch",
  "inputSchema": {},
  "description": "",
  "risk": "low",
  "provenance": "mcp"
}
```

- Model should not need to invent `server`, `tool`, and nested `args` for common MCP calls.

### 4.2 Codex has direct and deferred MCP tools

Codex does not always expose every MCP tool in the first turn.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:10`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:13`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:14`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:36`

Short source excerpts:

```rust
DIRECT_MCP_TOOL_EXPOSURE_THRESHOLD: usize = 100;
```

```rust
direct_tools: Vec<McpToolInfo>,
```

```rust
deferred_tools: Option<Vec<McpToolInfo>>,
```

Actual Codex behavior:

- If MCP tool count is manageable, tools can be directly exposed.
- If too many tools or feature flag requires it, tools become deferred.
- Deferred tools are not lost; they are available through tool search.

AIGL adjustment rule:

- Do not put the entire `tool_contracts` and all MCP schemas into the first prompt.
- First-turn visible set should be small:

```text
computer/read/write/edit/apply_patch/exec as core
tool_search or capability_search
maybe current-task obvious tools
```

- Everything else should be discoverable by search.

### 4.3 Codex tool search discovers deferred tools

Codex uses `tool_search` over deferred metadata. This is a key solution to prompt bloat.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search_spec.rs:50`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:112`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:225`

Short source excerpts:

```rust
pub struct ToolSearchHandler {
```

```rust
fn search(
```

```rust
fn build_mcp_search_text(info: &ToolInfo)
```

Actual Codex behavior:

- Deferred tool metadata is indexed.
- The model calls `tool_search` with a query.
- Matching tools become available in the next model call.
- MCP search text includes tool name, description, and schema property names.

AIGL adjustment rule:

- Add `capability_search` or reuse `tool_search` concept.
- Search entries should include:

```text
tool name
server/plugin/source
description
schema property names
risk/approval summary
related skill id
```

- A paper task should let the model search `paper pdf arxiv fetch text`, exposing `web_fetch`, `pdf_extract_text`, `web_extract_links`, not a hardcoded arXiv route.

## 5. Turn Construction

### 5.1 Codex builds skill/plugin injections before tool router

Codex turn setup collects skill/plugin context and MCP tool exposure as part of turn construction.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:170`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:457`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:1059`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:1121`

Short source excerpts:

```rust
build_skills_and_plugins(
```

```rust
list_all_tools()
```

```rust
build_mcp_tool_exposure(
```

Actual Codex behavior:

- Skill/plugin injection is separate from MCP tool listing.
- Tool exposure is decided at turn build time.
- `direct_tools` and `deferred_tools` are passed into the router.

AIGL current mapping:

- AIGL has `AGENT_SKILL_CATALOG` and `AGENT_TOOL_CATALOG` in `humanclaw-agent-runner.cjs`.
- AIGL can build skill context with `buildHumanClawSkillContextText`.
- AIGL currently appends tool contracts inside skill context:

Source:

- `F:\AIGril\electron\humanclaw-skills.cjs:217`

Short AIGL excerpt:

```js
sections.push(buildToolContractsPrompt(tools));
```

AIGL adjustment rule:

- Separate skill body from tool contract injection.
- Skill says "which tool family is relevant".
- Runtime/tool router decides which concrete schemas to expose.
- Tool schemas should be direct/deferred, not glued into every loaded skill.

## 6. Plugin as Bundle

### 6.1 Codex plugin can bundle skills and MCP servers

Codex plugin manifests include paths to skills and MCP server configs.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:26`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:28`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:48`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:50`

Short source excerpts:

```rust
skills: Option<String>,
```

```rust
mcp_servers: Option<String>,
```

```rust
pub mcp_servers: Option<AbsolutePathBuf>,
```

Actual Codex behavior:

- A plugin can contribute skill folders.
- A plugin can contribute MCP configs.
- A plugin can contribute app connectors/hooks.
- Plugin provenance is carried into loaded skills and MCP servers.

AIGL adjustment rule:

- AIGL capability installer should install bundles, not just random tools:

```text
capability/
  plugin.json
  skills/
  mcpServers/.mcp.json
  scripts/
  tests/
```

- Installing GitHub capability should install:

```text
GitHub MCP server config
GitHub SKILL.md
health check recipe
eval smoke task
rollback metadata
```

### 6.2 Codex plugin loader normalizes MCP config and skill roots

Codex loader resolves plugin skill roots and MCP server config files.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:47`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:49`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:567`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:580`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:996`

Short source excerpts:

```rust
DEFAULT_SKILLS_DIR_NAME: &str = "skills";
```

```rust
DEFAULT_MCP_CONFIG_FILE: &str = ".mcp.json";
```

```rust
load_mcp_servers_from_file(
```

Actual Codex behavior:

- Default skill folder is `skills`.
- Default MCP config file is `.mcp.json`.
- Plugin loader resolves config paths relative to plugin root.
- Duplicate MCP server names are detected/warned.

AIGL adjustment rule:

- Make AIGL capabilities installable in the same structure.
- Do not require future skills/MCP servers to be manually wired in code.
- Capability registry should be built from installed bundle metadata plus live health checks.

## 7. Schema and Validation

### 7.1 Codex schema is deterministic runtime data, not model judgment

Codex converts MCP input schema into tool specs. Validation is handled by tool calling/runtime, not by asking the model to decide if args are valid.

Codex source:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:229`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191`

Short source excerpts:

```rust
.input_schema
```

```rust
create_tool_spec(tool_info)
```

AIGL current mapping:

- AIGL has deterministic contract validation in `F:\AIGril\electron\humanclaw-tool-contracts.cjs`.
- Validation function:

Source:

- `F:\AIGril\electron\humanclaw-tool-contracts.cjs:1036`
- `F:\AIGril\electron\humanclaw-tool-contracts.cjs:1206`

Short AIGL excerpts:

```js
function validateAgainstSchema(value, schema = {}, path = '$') {
```

```js
function validateToolContract(toolId, args = {}) {
```

Current AIGL problem:

- `mcp_bridge` validates its own wrapper args.
- It does not make each MCP tool schema first-class before the model calls it.
- That caused the Pro smoke failure where the model passed `targets` to `web_fetch`, while `web_fetch` required `url`.

AIGL adjustment rule:

- Import MCP `inputSchema` into AIGL's tool registry.
- Validate against the actual MCP tool schema before dispatch.
- If validation fails, return a concise observation:

```json
{
  "status": "invalid_tool_args",
  "tool": "aigl_research.web_fetch",
  "errors": ["$.url is required"],
  "expected_schema": {"required": ["url"]}
}
```

- Let the model repair the next action. Do not terminate the task purely because one tool call had invalid args.

## 8. AIGL Current State vs Codex Reference

| Area | AIGL today | Codex reference | Alignment target |
|---|---|---|---|
| Skill files | `electron/skills/*/SKILL.md` exists | `core-skills` loads `SKILL.md` roots | Keep, add progressive disclosure |
| Skill context | Skill can append full tool contracts | Skill catalog first, body on demand | Split skill body and schema injection |
| MCP entry | `mcp_bridge` general-purpose wrapper | MCP tools become ToolSpecs | Generate direct MCP tool specs |
| MCP discovery | Model often calls `list_servers/list_tools` | Runtime lists all tools | Runtime owns discovery/cache |
| Tool exposure | Many tool contracts can enter prompt | direct/deferred exposure | Add deferred tool search |
| Plugin bundle | Capability manager exists but not Codex-shaped | plugin manifest can bundle skills/MCP | Installable capability bundle |
| Schema validation | Local schema validator exists | schema converted to ToolSpec | Validate actual MCP tool schema |
| Error recovery | Some failures surface as generic uncertainty | observation lets model repair | Return actionable observation and continue |

## 9. Concrete AIGL Refactor Plan

This is the minimal, non-rewrite path.

### Step 1: Add `McpToolSpecRegistry`

Purpose:

- Connect existing MCP servers.
- Call `tools/list`.
- Cache `server/tool/inputSchema/description`.
- Normalize each into AIGL internal tool spec.

Codex anchor:

- `connection_manager.rs:list_all_tools`
- `mcp.rs:create_tool_spec`

AIGL target files:

- `F:\AIGril\electron\humanclaw-runtime.cjs`
- new optional file: `F:\AIGril\electron\humanclaw-mcp-tool-registry.cjs`

### Step 2: Expose direct MCP tools for normal execution

Purpose:

- Model sees `aigl_research.web_fetch(url)` or equivalent.
- `mcp_bridge` remains for admin/debug.

Codex anchor:

- `mcp_tool_exposure.rs`
- `turn.rs:build_mcp_tool_exposure`

AIGL target files:

- `F:\AIGril\electron\humanclaw-agent-runner.cjs`
- `F:\AIGril\electron\humanclaw-tool-contracts.cjs`

### Step 3: Add deferred `tool_search`

Purpose:

- Keep first prompt small.
- Let the model discover relevant tools by semantic query.

Codex anchor:

- `tool_search.rs`
- `tool_search_spec.rs`
- `mcp.rs:build_mcp_search_text`

AIGL target:

- `tool_search` runtime tool or `capability_search` extension.
- Search index over tool names, descriptions, schema keys, skill tags.

### Step 4: Split skill context from tool schema context

Purpose:

- Skill explains workflow.
- Tool registry exposes schema.
- Avoid repeating heavy contracts inside skill text.

Codex anchor:

- `render.rs` progressive disclosure rules.

AIGL target file:

- `F:\AIGril\electron\humanclaw-skills.cjs`

Specific adjustment:

- `buildHumanClawSkillContextText(skillId)` should return skill body only.
- A separate `buildRelevantToolSchemaContext(toolIds)` should handle schemas.

### Step 5: Convert capabilities into plugin-like bundles

Purpose:

- Installing a capability installs MCP config, skill docs, health checks, eval cases, and rollback metadata together.

Codex anchor:

- `core-plugins/src/manifest.rs`
- `core-plugins/src/loader.rs`

AIGL target:

- `capability_manager`
- `Capability Registry`
- `Capability Installer`

## 10. Design Rules for Future AIGL Changes

These rules should gate future Skill/MCP edits.

1. Do not add hardcoded task routes when a skill/tool description can teach the model.
2. Do not put every schema in the first prompt.
3. Do not ask the model to manually discover MCP servers unless the user is debugging MCP.
4. Do not make `mcp_bridge` the primary task-execution interface.
5. Do not let one invalid tool call end a complex task.
6. Do not treat HTTP success as evidence quality success.
7. Do expose MCP tools as first-class callable specs when useful.
8. Do keep skill bodies small and procedural.
9. Do move fragile repeated operations into scripts or MCP tools.
10. Do preserve AIGL's persona surface above the engineering runtime.

## 11. Paper Task Failure Reinterpreted with This Reference

The arXiv paper task exposed exactly the Codex-alignment gap.

Observed AIGL chain:

- Model first called `mcp_bridge.call_tool` without `server`.
- Runtime reported multiple servers configured.
- Model recovered and listed servers.
- Model then called `aigl_research.web_fetch` with `targets`, but schema required `url`.
- Model recovered and fetched the abstract page.
- Model fetched PDF URL with `web_fetch`, which returned raw PDF bytes.
- Model wrote a file anyway.

Codex-aligned interpretation:

- `web_fetch` should have been directly visible as `web_fetch(url)`, or found through `tool_search`.
- PDF should have had a separate `pdf_extract_text(url|path)` tool spec.
- `web_fetch` should reject `application/pdf` with a structured error like `unsupported_pdf_use_pdf_extract_text`.
- Runtime should return repairable observations, not generic "evidence missing" prose.

This is mainly a Host/tool-exposure/tool-boundary issue, not a reason to add a hardcoded arXiv route.

## 12. Source Index

Codex Skill sources:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\model.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\injection.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-skills\src\manager.rs`

Codex MCP sources:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\mcp\mod.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search_spec.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs`

Codex Plugin sources:

- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs`
- `F:\AIGril\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs`

AIGL comparison sources:

- `F:\AIGril\electron\humanclaw-skills.cjs`
- `F:\AIGril\electron\humanclaw-runtime.cjs`
- `F:\AIGril\electron\humanclaw-tool-contracts.cjs`
- `F:\AIGril\electron\skills\mcp_bridge\SKILL.md`
- `F:\AIGril\scripts\mcp-aigl-research-server.cjs`
