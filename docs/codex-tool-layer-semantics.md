# Codex Tool Layer Semantics

This document records how the Codex tool layer is actually structured in the local Codex source, and what AIGL should copy from it. The point is not "add more tools"; the point is that every tool has a hard semantic boundary: what the model sees, what the runtime can execute, what the output means, and how failures are represented.

Source root used for this document:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs
```

## 0. The Core Lesson

A Codex-style tool is not just a prompt description. It is a typed contract with three separate parts:

1. Model-visible declaration: `ToolSpec`, `ResponsesApiTool`, schema, namespace, exposure.
2. Runtime executor: `ToolExecutor`, `ToolRegistry`, `ToolRouter`, payload validation, hooks, telemetry.
3. Output contract: `ToolOutput`, typed response item, success flag, truncation, code-mode form.

This is the boundary AIGL violated in the PDF failure:

```text
web_fetch said: I return readable text.
web_fetch did: I decoded arbitrary HTTP bytes as text.
runtime/evidence layer then accepted bytes-looking text as evidence.
```

Codex avoids this class of bug by keeping tool declarations and executable behavior tied together, and by separating generic web search, shell execution, MCP tools, MCP resources, dynamic tools, and freeform patch tools.

## 1. Model-Visible Tool Spec

Codex starts with a closed enum of model-visible tool shapes.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_spec.rs:13
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_spec.rs:17
```

Representative Codex code:

```rust
#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(tag = "type")]
pub enum ToolSpec {
    #[serde(rename = "function")]
    Function(ResponsesApiTool),
    #[serde(rename = "namespace")]
    Namespace(ResponsesApiNamespace),
    #[serde(rename = "tool_search")]
    ToolSearch {
        execution: String,
        description: String,
        parameters: JsonSchema,
    },
    #[serde(rename = "image_generation")]
    ImageGeneration { output_format: String },
    #[serde(rename = "web_search")]
    WebSearch { ... },
    #[serde(rename = "custom")]
    Freeform(FreeformTool),
}
```

Meaning:

`web_search` is not the same thing as an arbitrary downloader.

`Freeform` is not a JSON function.

`Namespace` tools are explicitly grouped.

`tool_search` is its own model-visible mechanism for discovering deferred tools.

For AIGL, this means `web_fetch`, `pdf_extract_text`, `download_file`, `read_mcp_resource`, and `browser_extract_dom` should not all pretend to be the same kind of thing.

## 2. Function Tool Contract

Codex's normal function tool shape is `ResponsesApiTool`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\responses_api.rs:25
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\responses_api.rs:127
```

Representative Codex code:

```rust
pub struct ResponsesApiTool {
    pub name: String,
    pub description: String,
    pub strict: bool,
    pub defer_loading: Option<bool>,
    pub parameters: JsonSchema,
    #[serde(skip)]
    pub output_schema: Option<Value>,
}

pub fn tool_definition_to_responses_api_tool(tool_definition: ToolDefinition) -> ResponsesApiTool {
    ResponsesApiTool {
        name: tool_definition.name,
        description: tool_definition.description,
        strict: false,
        defer_loading: tool_definition.defer_loading.then_some(true),
        parameters: tool_definition.input_schema,
        output_schema: tool_definition.output_schema,
    }
}
```

The important part is `parameters` plus `output_schema`. Codex has a place to say what input the model must provide and what output shape the tool returns. Even when `strict` is false, the contract is still represented structurally.

The lower-level metadata is `ToolDefinition`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_definition.rs:4
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_definition.rs:21
```

Representative Codex code:

```rust
pub struct ToolDefinition {
    pub name: String,
    pub description: String,
    pub input_schema: JsonSchema,
    pub output_schema: Option<JsonValue>,
    pub defer_loading: bool,
}

pub fn into_deferred(mut self) -> Self {
    self.output_schema = None;
    self.defer_loading = true;
    self
}
```

Meaning for AIGL:

If a tool returns "readable text", the output contract should make that explicit. If the HTTP response is `application/pdf`, a text fetch tool should return `unsupported_content_type`, not a fake success.

## 3. Runtime Executor Boundary

The central Codex boundary is `ToolExecutor`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_executor.rs:6
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_executor.rs:35
```

Representative Codex code:

```rust
pub enum ToolExposure {
    Direct,
    Deferred,
    DirectModelOnly,
    Hidden,
}

#[async_trait::async_trait]
pub trait ToolExecutor<Invocation>: Send + Sync {
    fn tool_name(&self) -> ToolName;
    fn spec(&self) -> ToolSpec;

    fn exposure(&self) -> ToolExposure {
        ToolExposure::Direct
    }

    fn supports_parallel_tool_calls(&self) -> bool {
        false
    }

    async fn handle(
        &self,
        invocation: Invocation,
    ) -> Result<Box<dyn ToolOutput>, FunctionCallError>;
}
```

This is the key design: model-visible spec and executable runtime are tied together. A tool cannot merely be a prompt fragment. It must provide:

```text
tool_name -> identity
spec -> schema and model-visible description
exposure -> whether it is visible now or discoverable later
handle -> actual execution
```

AIGL should mirror this boundary. Each AIGL tool should have one owner object/module that owns both the schema and the execution behavior.

## 4. Router and Payload Boundary

Codex converts model output into a typed `ToolCall` before dispatching.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:27
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:89
```

Representative Codex code:

```rust
pub struct ToolCall {
    pub tool_name: ToolName,
    pub call_id: String,
    pub payload: ToolPayload,
}

pub fn build_tool_call(item: ResponseItem) -> Result<Option<ToolCall>, FunctionCallError> {
    match item {
        ResponseItem::FunctionCall { name, namespace, arguments, call_id, .. } => {
            let tool_name = ToolName::new(namespace, name);
            Ok(Some(ToolCall {
                tool_name,
                call_id,
                payload: ToolPayload::Function { arguments },
            }))
        }
        ResponseItem::ToolSearchCall { call_id: Some(call_id), execution, arguments, .. }
            if execution == "client" => { ... }
        ResponseItem::CustomToolCall { name, input, call_id, .. } => { ... }
        _ => Ok(None),
    }
}
```

Meaning:

The model does not directly call arbitrary JavaScript. It emits a tool-call item, and Codex maps that item into one of a few payload types. This gives the runtime a chance to reject an incompatible payload before execution.

## 5. Registry Dispatch Boundary

Codex dispatches through `ToolRegistry`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:42
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:249
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:326
```

Representative Codex code:

```rust
pub(crate) trait CoreToolRuntime: ToolExecutor<ToolInvocation> {
    fn search_info(&self) -> Option<ToolSearchInfo> {
        None
    }

    fn matches_kind(&self, payload: &ToolPayload) -> bool {
        matches!(
            payload,
            ToolPayload::Function { .. } | ToolPayload::ToolSearch { .. }
        )
    }
}

pub struct ToolRegistry {
    tools: HashMap<ToolName, Arc<dyn CoreToolRuntime>>,
}
```

Dispatch checks the tool exists and the payload kind matches.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:362
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:396
```

Representative Codex code:

```rust
let tool = match self.tool(&tool_name) {
    Some(tool) => tool,
    None => {
        let message = unsupported_tool_call_message(&invocation.payload, &tool_name);
        return Err(FunctionCallError::RespondToModel(message));
    }
};

if !tool.matches_kind(&invocation.payload) {
    let message = format!("tool {tool_name} invoked with incompatible payload");
    return Err(FunctionCallError::Fatal(message));
}
```

Meaning for AIGL:

Validation should happen before execution, and errors should be tool errors, not vague Agent uncertainty. If `pdf_extract_text` receives an HTML URL, it can reject it. If `web_fetch_text` receives a PDF content type, it can reject it.

## 6. Tool Planning and Visibility

Codex does not dump every possible tool into every turn. It builds a planned tool set, then chooses which specs become model-visible.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:153
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:183
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:499
```

Representative Codex code:

```rust
fn build_tool_specs_and_registry(
    turn_context: &TurnContext,
    params: ToolRouterParams<'_>,
) -> (Vec<ToolSpec>, ToolRegistry) {
    ...
    add_tool_sources(&context, &mut planned_tools);
    append_tool_search_executor(&context, &mut planned_tools);
    prepend_code_mode_executors(&context, &mut planned_tools);
    build_model_visible_specs_and_registry(turn_context, planned_tools)
}

fn add_tool_sources(context: &CoreToolPlanContext<'_>, planned_tools: &mut PlannedTools) {
    add_shell_tools(context, planned_tools);
    add_mcp_resource_tools(context, planned_tools);
    add_core_utility_tools(context, planned_tools);
    add_collaboration_tools(context, planned_tools);
    add_mcp_runtime_tools(context, planned_tools);
    add_dynamic_tools(context, planned_tools);
    add_extension_tools(context, planned_tools);
    for spec in hosted_model_tool_specs(context.turn_context) {
        planned_tools.add_hosted_spec(spec);
    }
}
```

Direct tools enter the model-visible list.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:191
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:198
```

Representative Codex code:

```rust
for runtime in &runtimes {
    let exposure = runtime.exposure();
    if exposure.is_direct() && !is_hidden_by_code_mode_only(turn_context, &tool_name, exposure) {
        let spec = runtime.spec();
        specs.push(spec_for_model_request(turn_context, exposure, spec));
    }
}

let registry = ToolRegistry::from_tools(runtimes);
```

Important detail:

All runtimes are registered, but only direct tools are initially visible. Deferred tools can still be discovered through `tool_search`.

## 7. Deferred Tool Search

Codex has a formal tool discovery mechanism, not a giant prompt.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:762
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:19
```

Representative Codex code:

```rust
fn append_tool_search_executor(
    context: &CoreToolPlanContext<'_>,
    planned_tools: &mut PlannedTools,
) {
    if !(search_tool_enabled(turn_context) && namespace_tools_enabled(turn_context)) {
        return;
    }

    let search_infos = planned_tools
        .runtimes()
        .iter()
        .filter(|executor| executor.exposure() == ToolExposure::Deferred)
        .filter_map(|executor| executor.search_info())
        .collect::<Vec<_>>();

    planned_tools.add(ToolSearchHandler::new(search_infos));
}
```

Tool search indexes text but returns real loadable tool specs.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:39
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:103
```

Representative Codex code:

```rust
let documents: Vec<Document<usize>> = entries
    .iter()
    .map(|entry| entry.search_text.clone())
    .enumerate()
    .map(|(idx, search_text)| Document::new(idx, search_text))
    .collect();

let tools = self.search(query, limit)?;
Ok(boxed_tool_output(ToolSearchOutput { tools }))
```

Deferred specs deliberately remove `output_schema`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:25
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:35
```

Representative Codex code:

```rust
ToolSpec::Function(mut tool) => {
    tool.defer_loading = Some(true);
    tool.output_schema = None;
    LoadableToolSpec::Function(tool)
}

ToolSpec::Namespace(mut namespace) => {
    for tool in &mut namespace.tools {
        let ResponsesApiNamespaceTool::Function(tool) = tool;
        tool.defer_loading = Some(true);
        tool.output_schema = None;
    }
    LoadableToolSpec::Namespace(namespace)
}
```

Meaning for AIGL:

Capability catalog should not dump every contract into the first prompt. It should expose a small direct set plus a searchable deferred catalog. The model can ask for relevant tools when needed.

## 8. MCP Tool Boundary

Codex treats MCP as a real external protocol layer, not just a bridge string.

`ToolInfo` keeps raw MCP identity and model-visible identity separately.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:28
F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:139
```

Representative Codex code:

```rust
pub struct ToolInfo {
    pub server_name: String,
    pub supports_parallel_tool_calls: bool,
    pub server_origin: Option<String>,
    pub callable_name: String,
    pub callable_namespace: String,
    pub namespace_description: Option<String>,
    pub tool: Tool,
    pub connector_id: Option<String>,
    pub connector_name: Option<String>,
    pub plugin_display_names: Vec<String>,
}

pub(crate) fn normalize_tools_for_model<I>(tools: I) -> Vec<ToolInfo>
```

The comments in Codex are exactly the rule AIGL should copy:

```rust
//! Raw MCP tool identities must be preserved for protocol calls, while
//! model-visible tool names must be sanitized, deduplicated, and kept within API
//! limits.
```

MCP input schema can be shaped before exposing to the model.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:114
```

Representative Codex code:

```rust
pub(crate) fn tool_with_model_visible_input_schema(tool: &Tool) -> Tool {
    let file_params = declared_openai_file_input_param_names(tool.meta.as_deref());
    if file_params.is_empty() {
        return tool.clone();
    }

    let mut tool = tool.clone();
    let mut input_schema = JsonValue::Object(tool.input_schema.as_ref().clone());
    mask_input_schema_for_file_path_params(&mut input_schema, &file_params);
    ...
    tool
}
```

Meaning:

The MCP server owns the raw protocol schema. Codex can adapt the model-visible schema without corrupting the raw execution identity.

## 9. MCP Tool Output Schema

Codex does not flatten MCP results into arbitrary text by default. It wraps MCP result shape.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\mcp_tool.rs:6
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\mcp_tool.rs:39
```

Representative Codex code:

```rust
pub fn parse_mcp_tool(tool: &rmcp::model::Tool) -> Result<ToolDefinition, serde_json::Error> {
    ...
    Ok(ToolDefinition {
        name: tool.name.to_string(),
        description: tool.description.clone().map(Into::into).unwrap_or_default(),
        input_schema,
        output_schema: Some(mcp_call_tool_result_output_schema(
            structured_content_schema,
        )),
        defer_loading: false,
    })
}

pub fn mcp_call_tool_result_output_schema(structured_content_schema: JsonValue) -> JsonValue {
    json!({
        "type": "object",
        "properties": {
            "content": { "type": "array", "items": { "type": "object" } },
            "structuredContent": structured_content_schema,
            "isError": { "type": "boolean" },
            "_meta": { "type": "object" }
        },
        "required": ["content"],
        "additionalProperties": false
    })
}
```

Meaning for the PDF bug:

An MCP `web_fetch` tool should return something like:

```json
{
  "content": [{ "type": "text", "text": "unsupported content type: application/pdf" }],
  "structuredContent": {
    "ok": false,
    "error_code": "unsupported_content_type",
    "content_type": "application/pdf",
    "suggested_tool": "pdf_extract_text"
  },
  "isError": true
}
```

It should not return `%PDF-1.5...` as if it were readable paper text.

## 10. MCP Handler and Real Transport

Codex wraps each MCP tool in an `McpHandler`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:55
```

Representative Codex code:

```rust
pub struct McpHandler {
    tool_info: ToolInfo,
    spec: ToolSpec,
}

async fn handle(
    &self,
    invocation: ToolInvocation,
) -> Result<Box<dyn ToolOutput>, FunctionCallError> {
    let payload = match payload {
        ToolPayload::Function { arguments } => arguments,
        _ => {
            return Err(FunctionCallError::RespondToModel(
                "mcp handler received unsupported payload".to_string(),
            ));
        }
    };

    let result = handle_mcp_tool_call(
        Arc::clone(&session),
        &turn,
        call_id.clone(),
        self.tool_info.server_name.clone(),
        self.tool_info.tool.name.to_string(),
        self.tool_name().to_string(),
        payload,
    )
    .await;
}
```

The actual transport call goes through `McpConnectionManager`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_call.rs:547
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_call.rs:571
F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:589
```

Representative Codex code:

```rust
let result = sess
    .call_tool(
        &invocation.server,
        &invocation.tool,
        rewritten_arguments,
        request_meta,
    )
    .await
    .map_err(|e| format!("tool call error: {e:?}"))?;
```

And in the MCP manager:

```rust
pub async fn call_tool(
    &self,
    server: &str,
    tool: &str,
    arguments: Option<serde_json::Value>,
    meta: Option<serde_json::Value>,
) -> Result<CallToolResult> {
    let client = self.client_by_name(server).await?;
    if !client.tool_filter.allows(tool) {
        return Err(anyhow!(
            "tool '{tool}' is disabled for MCP server '{server}'"
        ));
    }

    let result: rmcp::model::CallToolResult = client
        .client
        .call_tool(tool.to_string(), arguments, meta, client.tool_timeout)
        .await
        .with_context(|| format!("tool call failed for `{server}/{tool}`"))?;
}
```

Meaning:

Codex MCP is a real client manager with server startup, tool filters, timeouts, and actual `tools/call`. AIGL should not treat MCP as a passive registry plus manual wrappers.

## 11. MCP Resources Are Not MCP Tools

Codex separates `call_tool` from `read_resource`.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource_spec.rs:6
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource_spec.rs:62
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource\read_mcp_resource.rs:27
F:\AIGril\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:669
```

Representative Codex code:

```rust
pub fn create_list_mcp_resources_tool() -> ToolSpec { ... }
pub fn create_list_mcp_resource_templates_tool() -> ToolSpec { ... }
pub fn create_read_mcp_resource_tool() -> ToolSpec { ... }
```

And the read handler:

```rust
pub struct ReadMcpResourceHandler;

async fn handle(
    &self,
    invocation: ToolInvocation,
) -> Result<Box<dyn ToolOutput>, FunctionCallError> {
    ...
    let result = session
        .read_resource(
            &server,
            ReadResourceRequestParams {
                meta: None,
                uri: uri.clone(),
            },
        )
        .await
        .map_err(|err| {
            FunctionCallError::RespondToModel(format!("resources/read failed: {err:#}"))
        })?;
}
```

Meaning for AIGL:

Do not merge "tools" and "resources" into one vague MCP bridge. A database schema, a file-like resource, and an executable GitHub action are different surfaces.

## 12. Hosted Web Search Is Not Web Fetch

Codex models hosted web search as a `ToolSpec::WebSearch`, not as a generic function tool.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\hosted_spec.rs:20
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:241
```

Representative Codex code:

```rust
pub fn create_web_search_tool(options: WebSearchToolOptions<'_>) -> Option<ToolSpec> {
    let external_web_access = match options.web_search_mode {
        Some(WebSearchMode::Cached) => Some(false),
        Some(WebSearchMode::Live) => Some(true),
        Some(WebSearchMode::Disabled) | None => None,
    }?;

    Some(ToolSpec::WebSearch {
        external_web_access: Some(external_web_access),
        filters: ...,
        user_location: ...,
        search_context_size: ...,
        search_content_types,
    })
}
```

Meaning:

Search is not fetch. Fetch is not parse. Parse is not summarize. AIGL should split these:

```text
web_search: find sources
web_fetch_text/html: retrieve readable HTML/text only
download_file: download bytes to a file
pdf_extract_text: parse PDF to readable text
paper_fetch: task-level composition that may call search/fetch/pdf/html tools
```

The last one can be a skill or higher-level tool, but the lower tools must keep hard boundaries.

## 13. Shell Tool Has Explicit Output Schema

Codex's shell tool is a concrete function with explicit input parameters and an output schema.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:19
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:247
```

Representative Codex code:

```rust
ToolSpec::Function(ResponsesApiTool {
    name: "exec_command".to_string(),
    description: "...".to_string(),
    strict: false,
    defer_loading: None,
    parameters: JsonSchema::object(
        properties,
        Some(vec!["cmd".to_string()]),
        Some(false.into()),
    ),
    output_schema: Some(unified_exec_output_schema()),
})
```

The output schema includes:

```json
{
  "wall_time_seconds": "number",
  "exit_code": "number",
  "session_id": "number",
  "original_token_count": "number",
  "output": "string"
}
```

Meaning:

Command execution has a real lifecycle. If still running, return a `session_id`. If output is truncated, return `original_token_count`. AIGL's tool layer should follow this pattern for long-running browser, repo, PDF, and benchmark tasks.

## 14. Apply Patch Is Freeform Grammar

Codex does not model file patching as arbitrary shell text. It uses a grammar-bound freeform tool.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:5
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:9
```

Representative Codex code:

```rust
const APPLY_PATCH_LARK_GRAMMAR: &str = include_str!("apply_patch.lark");

pub fn create_apply_patch_freeform_tool(include_environment_id: bool) -> ToolSpec {
    ToolSpec::Freeform(FreeformTool {
        name: "apply_patch".to_string(),
        description: "Use the `apply_patch` tool to edit files. This is a FREEFORM tool, so do not wrap the patch in JSON.".to_string(),
        format: FreeformToolFormat {
            r#type: "grammar".to_string(),
            syntax: "lark".to_string(),
            definition,
        },
    })
}
```

Meaning:

Some tools should not be JSON functions. For AIGL, this matters if we later add structured patching, region screenshots, or UI action scripts. If the payload has a domain grammar, expose it as a grammar or strict schema, not loose prose.

## 15. Dynamic Tools

Codex supports tools contributed by the current thread/session as dynamic tools.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:32
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:39
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:129
```

Representative Codex code:

```rust
pub struct DynamicToolHandler {
    tool_name: ToolName,
    spec: ToolSpec,
    exposure: ToolExposure,
    search_text: String,
}

pub fn new(tool: &DynamicToolSpec) -> Option<Self> {
    ...
    exposure: if tool.defer_loading {
        ToolExposure::Deferred
    } else {
        ToolExposure::Direct
    },
}

impl CoreToolRuntime for DynamicToolHandler {
    fn search_info(&self) -> Option<ToolSearchInfo> {
        ToolSearchInfo::from_spec(
            self.search_text.clone(),
            self.spec(),
            Some(ToolSearchSourceInfo {
                name: "Dynamic tools".to_string(),
                description: Some("Tools provided by the current Codex thread.".to_string()),
            }),
        )
    }
}
```

Meaning:

AIGL's `Capability Registry` and `Skill Auto-Authoring` should map nicely to this. Newly installed capabilities can become dynamic tools with `defer_loading` instead of permanently bloating the first prompt.

## 16. Output Contract

Codex makes tool output responsible for how it re-enters the model context.

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_output.rs:15
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\context.rs:65
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\context.rs:110
```

Representative Codex code:

```rust
pub trait ToolOutput: Send {
    fn log_preview(&self) -> String;
    fn success_for_logging(&self) -> bool;
    fn to_response_item(&self, call_id: &str, payload: &ToolPayload) -> ResponseInputItem;
    fn code_mode_result(&self, payload: &ToolPayload) -> JsonValue { ... }
}
```

MCP output has a dedicated wrapper:

```rust
pub struct McpToolOutput {
    pub result: CallToolResult,
    pub tool_input: JsonValue,
    pub wall_time: Duration,
    pub original_image_detail_supported: bool,
    pub truncation_policy: TruncationPolicy,
}

fn response_payload(&self) -> FunctionCallOutputPayload {
    let mut payload = self.result.as_function_call_output_payload();
    ...
    truncate_function_output_payload(&payload, self.truncation_policy * 1.2)
}
```

Important comment from Codex:

```rust
// This is the context-injection form, so keep it aligned with the
// function-call output truncation that conversation history already
// applies. Code-mode consumers still get the raw `CallToolResult`.
```

Meaning:

Codex distinguishes:

```text
raw result for programmatic consumers
truncated model-context result
telemetry preview
post-tool hook payload
```

AIGL should not use one giant text blob for all four purposes.

## 17. What Codex Would Do Differently For The PDF Case

The Codex-aligned flow for `https://arxiv.org/abs/1706.03762` should be:

1. Use search or fetch on the `abs` HTML page.
2. Parse HTML as HTML/text.
3. If PDF is needed, either use a dedicated `download_file` tool or a dedicated `pdf_extract_text` tool.
4. If a text-fetch tool sees `application/pdf`, return a typed unsupported content result.
5. Let the model choose fallback based on explicit tool result, not on a fake success.

Expected AIGL-style tool result for wrong tool:

```json
{
  "ok": false,
  "error_code": "unsupported_content_type",
  "url": "https://arxiv.org/pdf/1706.03762.pdf",
  "content_type": "application/pdf",
  "message": "web_fetch_text only returns readable HTML or text. Use pdf_extract_text or download_file.",
  "suggested_tools": ["pdf_extract_text", "download_file"]
}
```

This keeps the Agent intelligent. It does not hardcode "if arxiv then PDF parser". It simply makes the tool honest.

## 18. Codex-to-AIGL Mapping

| Codex concept | Codex source | AIGL target |
| --- | --- | --- |
| `ToolSpec` enum | `tools/src/tool_spec.rs:17` | AIGL tool specs should have distinct kinds: function, namespace, hosted/search, freeform, MCP |
| `ResponsesApiTool` | `tools/src/responses_api.rs:25` | Every tool has name, description, input schema, output schema, defer flag |
| `ToolExecutor` | `tools/src/tool_executor.rs:41` | Every tool implementation owns both spec and `handle()` |
| `ToolExposure` | `tools/src/tool_executor.rs:8` | Direct vs deferred vs hidden tools; avoid first-prompt bloat |
| `ToolRouter` | `core/src/tools/router.rs:34` | Convert model output into typed calls before execution |
| `ToolRegistry` | `core/src/tools/registry.rs:249` | Single dispatch path, payload-kind check, hooks, telemetry |
| `ToolSearchHandler` | `core/src/tools/handlers/tool_search.rs:23` | Searchable capability catalog instead of giant prompt |
| `McpConnectionManager` | `codex-mcp/src/connection_manager.rs:70` | Real MCP session manager, not passive bridge |
| `McpHandler` | `core/src/tools/handlers/mcp.rs:29` | One MCP tool -> one runtime wrapper |
| `ReadMcpResourceHandler` | `core/src/tools/handlers/mcp_resource/read_mcp_resource.rs:27` | Resources separate from tools |
| `McpToolOutput` | `core/src/tools/context.rs:65` | Raw result, context result, telemetry preview separated |
| `apply_patch` freeform | `core/src/tools/handlers/apply_patch_spec.rs:9` | Domain grammar for patch-like operations |
| hosted `web_search` | `core/src/tools/hosted_spec.rs:20` | Search is not fetch; fetch is not parse |

## 19. Practical AIGL Rules From Codex

Rule 1: Tool names must not overpromise.

`web_fetch_text` should not return binary PDF bytes. `pdf_extract_text` should not claim to browse HTML pages.

Rule 2: Runtime result must match the output schema.

If the schema says `text`, validate that text is readable text. If validation fails, return structured error.

Rule 3: Separate search, fetch, download, parse, and summarize.

The Agent can compose them. The tool layer should not blur them.

Rule 4: Tool visibility should be staged.

Use direct tools for core primitives and `tool_search` for specialized tools.

Rule 5: MCP tool identity must be split.

Preserve raw server/tool names for protocol calls. Sanitize names only for the model-visible surface.

Rule 6: Evidence should not decide semantic success from text length.

A ledger may record tool observations, but it should not declare a PDF parsed just because a string is long.

Rule 7: Final answer should be model/Agent-owned.

Runtime can block impossible or unsafe calls, but should not replace incomplete work with canned "uncertain" templates.

## 20. Refactor Target And Current Status

The least invasive Codex-aligned change was:

1. Introduce a `ToolRuntime` contract parallel to Codex `ToolExecutor`.
2. Move tool schema and handler into the same module for each AIGL tool.
3. Add `ToolExposure` and a searchable deferred catalog.
4. Split `web_fetch` into honest primitives:
   `web_fetch_text`, `web_fetch_html`, `download_file`, `pdf_extract_text`.
5. Change MCP result shape to preserve `content`, `structuredContent`, `isError`, `_meta`.
6. Keep observation records as eval/debug metadata, never as the completion judge.
7. Let the Agent loop decide next step from real tool results.

This is not a large rewrite. It is a boundary correction. The existing AIGL Agent can remain the brain; the tool layer just has to stop lying to it.

Current AIGL status after the Codex-aligned tool runtime pass:

| Target | AIGL status |
| --- | --- |
| `ToolExecutor`-like object | Implemented in `electron/humanclaw-tool-runtime.cjs` as `HumanClawRuntimeTool`. |
| Central `ToolRegistry` | Implemented as `HumanClawToolRuntimeRegistry`; runtime and gateway dispatch through it first. |
| Tool exposure | Implemented as `TOOL_EXPOSURE.DIRECT/DEFERRED/HIDDEN`. |
| Runtime `tool_search` | Implemented as a real callable tool returning loadable specs for runtime, gateway, and MCP tools. |
| Direct MCP tool ids | Implemented as `mcp__server__tool` for the model-facing canonical id, with legacy `mcp:<server>:<tool>` accepted as a compatibility alias; the registry converts either form to MCP `tools/call`. |
| Gateway-local tools | Registered into the gateway registry: `email`, `file_manager`, `computer`, `code`, `artifact_verifier`, `vision.capture_context`, `read`, `write`, `exec`. |
| Tool outputs | Normalized through the registry into `content`, `details`, and `structuredContent`. |
| Deprecated task gates | Removed from the main loop: `TaskSpec`, `TaskGraph`, `EvidenceLedger`, and `RecoveryLoop` are no longer completion gates. |

## 21. Actual Codex Tool Selection Chain

Codex does not have an AIGL-style `TaskSpec`, `TaskGraph`, or `EvidenceLedger` gate in the main turn loop. Tool selection is produced by this chain:

```text
conversation history
  -> build_skills_and_plugins(...)
  -> built_tools(...)
  -> ToolRouter(model_visible_specs + runtime registry)
  -> build_prompt(input, router, turn_context, base_instructions)
  -> model returns ResponseItem
  -> ToolRouter::build_tool_call(ResponseItem)
  -> ToolRegistry::dispatch_any_with_terminal_outcome(...)
  -> ToolOutput::to_response_item(...)
  -> next model request sees the observation
```

Codex source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:117
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:887
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:90
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:326
F:\AIGril\build-cache\codex-runtime\codex-rs\tools\src\tool_output.rs:16
```

Representative Codex code:

```rust
/// Takes a user message as input and runs a loop where, at each sampling request, the model
/// replies with either:
///
/// - requested function calls
/// - an assistant message
///
/// If the model requests a function call, we execute it and send the output
/// back to the model in the next sampling request.
pub(crate) async fn run_turn(...) -> Option<String> { ... }
```

```rust
pub(crate) fn build_prompt(
    input: Vec<ResponseItem>,
    router: &ToolRouter,
    turn_context: &TurnContext,
    base_instructions: BaseInstructions,
) -> Prompt {
    Prompt {
        input,
        tools: router.model_visible_specs(),
        parallel_tool_calls: turn_context.model_info.supports_parallel_tool_calls,
        base_instructions,
        personality: turn_context.personality,
        output_schema: turn_context.final_output_json_schema.clone(),
        output_schema_strict: ...
    }
}
```

Meaning:

Codex gives the model typed tools and prior observations. The model decides the next call. Runtime parses and executes it. Runtime does not pre-classify the task into a narrow action lane.

## 22. Codex Tool Semantics Are Runtime Objects

In Codex, "tool semantics" are not just natural-language prompt text. They are runtime-owned objects with five properties:

| Semantic part | Codex owner | Source |
| --- | --- | --- |
| Callable identity | `ToolName`, `ToolInfo` | `tools/src/tool_executor.rs:41`, `codex-mcp/src/tools.rs:29` |
| Model-visible schema | `ToolSpec`, `ResponsesApiTool` | `tools/src/tool_spec.rs:17`, `tools/src/responses_api.rs:26` |
| Visibility policy | `ToolExposure` | `tools/src/tool_executor.rs:8` |
| Runtime handler | `ToolExecutor::handle` | `tools/src/tool_executor.rs:41` |
| Model-facing result | `ToolOutput::to_response_item` | `tools/src/tool_output.rs:16` |

Representative Codex code:

```rust
#[async_trait::async_trait]
pub trait ToolExecutor<Invocation>: Send + Sync {
    fn tool_name(&self) -> ToolName;
    fn spec(&self) -> ToolSpec;
    fn exposure(&self) -> ToolExposure { ToolExposure::Direct }
    async fn handle(&self, invocation: Invocation) -> Result<Box<dyn ToolOutput>, FunctionCallError>;
}
```

This is the part AIGL should copy most directly. If a tool module owns only prompt text but not executable behavior, it is not Codex-like. If a runtime handler executes something that its schema did not promise, it is also not Codex-like.

## 23. Where AIGL Currently Differs

AIGL is already closer than before, but there are still real differences that explain the research failures.

### 23.1 AIGL still has a JSON planner protocol before tool calls

AIGL asks the model to emit an intermediate JSON decision:

```text
F:\AIGril\electron\humanclaw-agent-runner.cjs:2863
F:\AIGril\electron\humanclaw-agent-runner.cjs:2879
F:\AIGril\electron\humanclaw-agent-runner.cjs:2921
```

AIGL-side shape:

```text
action="load_context|tool|final|blocked"
tool_call={tool,title,args}
capability_request={skills,tools,mcp,reason}
```

Codex does not require the model to satisfy this extra JSON planner layer. It uses the model provider's native response items:

```text
ResponseItem::FunctionCall
ResponseItem::ToolSearchCall
ResponseItem::CustomToolCall
```

Consequence:

For AIGL, the model can fail before it reaches the real tool layer. In the Playwright task, it had to learn `load_context`, then `mcp_bridge`, then MCP inner tool schema, then file-write schema. Codex shortens that path by putting real tool specs directly in `tools`.

### 23.2 AIGL keeps `mcp_bridge`, but normal calls can bypass it

AIGL runtime route:

```text
F:\AIGril\electron\humanclaw-runtime.cjs:1087
F:\AIGril\electron\humanclaw-runtime.cjs:1566
F:\AIGril\electron\humanclaw-runtime.cjs:1789
```

AIGL exposes `mcp_bridge` actions such as:

```text
schema
list_servers
list_tools
list_tool_specs
search_tools
read_resource
call_tool
```

Codex route:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191
```

Codex wraps each MCP tool as a model-visible namespace function:

```rust
Ok(ToolSpec::Namespace(ResponsesApiNamespace {
    name: tool_info.callable_namespace.clone(),
    description,
    tools: vec![ResponsesApiNamespaceTool::Function(tool)],
}))
```

Current consequence:

AIGL keeps `mcp_bridge` for management actions such as server registration, health checks, resource reads, prompts, and schema discovery. Normal MCP tool calls no longer have to go through the bridge: `HumanClawToolRuntimeRegistry.dispatch()` recognizes canonical `mcp__server__tool` ids and also accepts legacy `mcp:<server>:<tool>` aliases, then forwards the original args to MCP `tools/call`.

Remaining gap:

Codex represents MCP tools as provider-native namespace/function specs. AIGL now has equivalent direct ids and specs, but the Agent still uses an AIGL JSON planner protocol instead of provider-native `ResponseItem::FunctionCall`.

### 23.3 AIGL capability loading is similar to Codex tool_search, but not the same

AIGL has a deferred first-turn catalog:

```text
F:\AIGril\electron\humanclaw-agent-runner.cjs:1832
F:\AIGril\electron\humanclaw-agent-runner.cjs:1848
F:\AIGril\electron\humanclaw-agent-runner.cjs:4152
```

This is conceptually aligned with Codex:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:762
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23
```

But Codex `tool_search` returns loadable tool specs, not prose context:

```rust
Ok(boxed_tool_output(ToolSearchOutput { tools }))
```

AIGL `load_context` returns text sections plus compact specs. That helps token budget, but the model still has to translate prose into AIGL's JSON tool-call protocol.

Consequence:

For research tasks, AIGL may stop after reading enough prose to write an answer, even if it has not truly used the intended official-document tool. Codex's native tool output path makes the loaded tool itself part of the model's available callable surface.

### 23.4 AIGL file-write tools still compete

The Playwright task showed:

```text
filesystem_aigl.edit_file failed because the model guessed content instead of edits.
filesystem_aigl.edit_file failed again because it needed oldText.
computer.write failed once because the model guessed target instead of path.
computer.write then succeeded.
```

This is not primarily a weak-model problem. It is a tool surface problem:

```text
too many overlapping write tools
schemas discovered after failure
no single obvious "write file with content" direct tool
```

Codex avoids much of this by exposing clear local primitives:

```text
shell command with explicit output schema
apply_patch as grammar-bound freeform edit tool
MCP/dynamic tools as namespace functions
```

Source:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:19
F:\AIGril\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:9
```

### 23.5 AIGL research tools improved, but the model-visible semantics are still indirect

The research MCP server now correctly rejects PDF bytes for `web_fetch`:

```text
F:\AIGril\scripts\mcp-aigl-research-server.cjs:216
F:\AIGril\scripts\mcp-aigl-research-server.cjs:923
F:\AIGril\tests\mcp-aigl-research-server.test.mjs:31
```

That fixes one concrete bug. The deeper issue is still that the model must discover:

```text
web_search -> web_fetch for HTML/text
pdf_extract_text for PDF
download_file for bytes
artifact_verifier for final file checks
```

Codex's answer is not "hardcode if arxiv then pdf_extract_text". Codex's answer is "make these separate typed tools, make them searchable, and make wrong calls return structured observations".

## 24. Why AIGL Research Fails In Plain Engineering Terms

The common failure chain is:

```text
1. User asks for research or official docs.
2. AIGL first prompt exposes only a broad capability index.
3. Model must decide to load MCP context.
4. Runtime returns MCP prose/spec context.
5. Model must choose either mcp_bridge or a direct MCP tool id such as mcp__server__tool.
6. If it chooses mcp_bridge, it must also choose action/server/tool/args correctly.
7. A tool may fail with schema/content-type/output issues.
8. The failure becomes observation.
9. Model may recover, but it may also final early if the partial text looks enough.
```

So the root is mixed:

| Area | Is it the model? | Is it architecture/tools? | What happens |
| --- | ---: | ---: | --- |
| Choosing official evidence | Partly | Yes | Search snippets look enough, so model may stop early |
| Calling file write | Partly | Yes | Overlapping tools and late schemas cause guessing |
| PDF vs HTML | No | Yes | Tool boundary must reject impossible content |
| MCP parameter schema | Partly | Yes | Bridge indirection adds extra parameters |
| Final too early | Partly | Yes | No native output artifact verification in the tool loop |

The important diagnosis:

This is not solved by adding more prompt rules. Prompt rules may help one benchmark and hurt another. Codex relies more on typed tools, native tool specs, and observation loops.

## 25. Codex-Aligned AIGL Target Architecture

The target should be:

```text
Agent Loop
  -> model sees direct core tools + tool_search-like discovery
  -> model calls native direct tool ids
  -> runtime validates payload shape
  -> runtime executes exact handler
  -> ToolOutput returns structured success/error observation
  -> model continues or final
  -> Persona Surface renders final/progress for AIGL
```

Concrete AIGL mapping:

| Codex module | AIGL module to align | Required shape |
| --- | --- | --- |
| `ToolExecutor` | `humanclaw-tool-runtime.cjs` or equivalent | one object owns `id/spec/exposure/handle/output` |
| `ToolSpec` | `humanclaw-tool-contracts.cjs` | separate model-visible schema from prose skill |
| `ToolExposure` | `capability_catalog` | direct/deferred/hidden instead of all prompt text |
| `ToolSearchHandler` | `capability_manager` or new `tool_search` runtime tool | returns loadable specs, not only prose |
| `McpHandler` | `humanclaw-mcp-session.cjs` + runtime adapter | one MCP tool becomes one direct callable spec |
| `ToolRegistry` | `HumanClawRuntime.executeTool` | central dispatch with payload-kind validation |
| `ToolOutput` | runtime response normalizer | raw result, model context, telemetry, persona text separated |
| `ThreadItem` | `humanclaw-turn-items.cjs` | chronological tool calls/results, no completion gate |

This preserves the user's product direction:

```text
Codex-like underneath: typed tools, searchable capabilities, observations, retries.
AIGL-like above: persona rendering, voice, expression, bubble, warmth.
```

## 26. Implemented Change List, Not A Rewrite

Implemented in this pass:

1. Added a real AIGL `ToolRuntime` registry next to current contracts.
2. Wrapped existing built-ins as runtime objects: runtime tools plus gateway-local `computer`, `code`, `file_manager`, `email`, `artifact_verifier`, and `vision.capture_context`.
3. Promoted MCP-discovered tools into direct runtime call ids: canonical `mcp__server__tool`, with legacy `mcp:<server>:<tool>` kept as a compatibility alias.
4. Kept `mcp_bridge` available, but direct MCP calls and `tool_search` no longer require the model to hand-assemble bridge payloads.
5. Added `tool_search` as a real callable tool that returns specs, not only prose context.
6. Kept `write`/`read`/`exec` as local core compatibility tools, but registered them into the gateway runtime registry rather than routing them through a separate public path.
7. Normalized tool outputs through the registry into `content`, `details`, and `structuredContent`.
8. Kept Persona Surface above tool observations; tool semantics do not render final user-facing personality text.

Still not fully identical to Codex:

1. AIGL still has its own JSON decision protocol. Codex uses provider-native response items and a Rust `ToolRouter`.
2. AIGL has a gateway API compatibility layer that returns `coreTools/runtimeTools/localTools` for existing UI and smoke scripts. Internally this now reads from the registry, but the public shape remains old for compatibility.
3. Some broad tools, especially `computer`, still multiplex many actions under one schema. That is acceptable for the current product, but Codex-style purity would split more actions into narrower executors over time.

## 27. Acceptance Tests

These tests should tell us whether AIGL has actually become more Codex-like, instead of just learning one task.

| Test | Expected behavior |
| --- | --- |
| Playwright official API task | Search or fetch official Playwright docs, write file, read/verify file, final with source clarity |
| arXiv paper task | Fetch abs page, use PDF parser for PDF, write `paper-card.md`, verify required sections |
| GitHub repo task | Use GitHub/browser/MCP evidence, inspect repo state, avoid claiming actions without observation |
| CSV/log/TOML/YAML task | Use structured artifact verifier, not freeform text guessing |
| Email task | Load email capability, call email tool/MCP, avoid exposing secrets or tool logs |
| Wrong tool call test | `web_fetch` on PDF returns `unsupported_content_type` and model retries with `pdf_extract_text` |
| First prompt budget test | First prompt contains only catalog + direct core specs, not full contracts |

The Playwright chain from `F:\AIGril\logs\aigl-browser-wait-chain-2026-06-05T15-07-54-181Z.md` is a useful baseline. It completed, but it should not need multiple schema-guess failures to write a file, and it should collect official-document evidence before final.

## 28. Bottom Line

Codex manages tool selection by giving the model a small, accurate, executable tool surface and then trusting the model to choose the next call from observations.

AIGL currently gives the model a persona-aware JSON agent protocol, a deferred capability catalog, and an MCP bridge. That is workable, but research tasks suffer when the bridge and capability text are too indirect.

The Codex-aligned direction is not to hardcode task routes. It is to make the executable tool surface honest and discoverable:

```text
clear direct tools
deferred searchable specs
real runtime validation
structured observations
no fake evidence
persona rendering only at the user surface
```
