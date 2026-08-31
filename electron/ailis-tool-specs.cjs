const { getToolContract } = require('./ailis-tool-contracts.cjs');
const {
    compactToolSchema,
    truncateMiddleText
} = require('./ailis-runtime-budget.cjs');

const AILIS_TOOL_EXPOSURE = Object.freeze({
    DIRECT: 'direct',
    DEFERRED: 'deferred',
    HIDDEN: 'hidden'
});

const AILIS_TOOL_KIND = Object.freeze({
    FUNCTION: 'function',
    HOSTED: 'hosted',
    MCP: 'mcp',
    FREEFORM: 'freeform'
});

function isExperimentalOutputStoreToolsEnabled() {
    const surfaceMode = String(process.env.AILIS_TOOL_SURFACE_MODE || '').toLowerCase();
    return (
        process.env.AILIS_EXPERIMENTAL_OUTPUT_TOOLS === '1' ||
        surfaceMode === 'responses' ||
        surfaceMode === 'full'
    );
}

function normalizeToolSurfaceMode() {
    return String(process.env.AILIS_TOOL_SURFACE_MODE || 'codex')
        .trim()
        .toLowerCase();
}

function isExtendedAilisToolSurfaceEnabled() {
    const mode = normalizeToolSurfaceMode();
    return (
        process.env.AILIS_ENABLE_EXTENDED_TOOLS === '1' ||
        ['ailis', 'extended', 'full', 'legacy'].includes(mode)
    );
}

const OUTPUT_STORE_TOOL_EXPOSURE = isExperimentalOutputStoreToolsEnabled()
    ? AILIS_TOOL_EXPOSURE.DIRECT
    : AILIS_TOOL_EXPOSURE.DEFERRED;
// Keep the first-turn surface small while allowing tool_search to discover
// extended runtime capabilities from the Registry on demand.
const EXTENDED_RUNTIME_TOOL_EXPOSURE = AILIS_TOOL_EXPOSURE.DEFERRED;

const AILIS_RUNTIME_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'update_plan',
        label: 'update_plan',
        description: [
            'Update only the user-visible progress checklist.',
            'This is a UI/progress bookkeeping tool: it does not inspect files, retrieve data, execute actions, or compute answers.',
            'Use sparingly after meaningful progress; if the next step requires real work, call the real tool such as read, exec, apply_patch, or search instead.'
        ].join(' '),
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'tool_search',
        label: 'tool_search',
        description: 'Tool discovery. Searches deferred tool metadata and exposes matching tools for the next Agent step. Use it as soon as the visible direct tools are a poor semantic fit or would require manually reconstructing structured facts, cross-record ordering, entity resolution, document parsing, transcripts, APIs, or artifact data.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'artifact_query',
        label: 'artifact_query',
        description: 'Query managed AILIS context artifacts using an owner=context_artifact_store artifactHandle or ctx-* context artifactId without dumping payload files into model context. Do not pass artifact_tools art_* ids here.',
        sectionId: 'context-artifacts',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'artifact_tools',
        label: 'artifact_tools',
        description: 'Canonical AILIS Artifact Tools runtime for local files and attachments. After open_session, continue with the returned owner=artifact_tools artifactHandle (or its sessionId); never send its art_* artifactId to artifact_query. Supports index/search/query/materialize/aggregate/inspect/render/trace/recalculate/edit/export/roundtrip across Office, PDF, table, and image adapters.',
        sectionId: 'context-artifacts',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'artifact_compute',
        label: 'artifact_compute',
        description: 'Internal compatibility surface for legacy managed context artifact computations. Hidden from model-facing tool discovery; artifact-style file tasks should use artifact_tools.',
        sectionId: 'context-artifacts',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'output_read',
        label: 'output_read',
        description: 'Top-level direct tool, not a computer action. Read a byte range from a stored exec output artifact by outputId instead of rerunning the command.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: OUTPUT_STORE_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'output_tail',
        label: 'output_tail',
        description: 'Top-level direct tool, not a computer action. Read the tail of a stored exec output artifact by outputId, optionally limited by bytes or lines.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: OUTPUT_STORE_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'output_search',
        label: 'output_search',
        description: 'Top-level direct tool, not a computer action. Search a stored exec output artifact by outputId without loading the full output into model context.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: OUTPUT_STORE_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'request_permissions',
        label: 'request_permissions',
        description: 'Request additional network or file-system permissions as a first-class runtime protocol before retrying gated tools.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['grant']),
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'spawn_agent',
        label: 'spawn_agent',
        description: 'Spawns one persistent agent to own the current user task. The spawned agent receives a canonical task name, inherits sanitized parent turns according to fork_turns, and sends its final answer back through the parent mailbox. Returns task_name and nickname; it does not wait for completion. Continue the same subtask only with followup_task and the returned task_name. A duplicate spawn request is normalized into a followup of the existing agent instead of creating another agent.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'followup_task',
        label: 'followup_task',
        description: 'Send a message to an existing non-root target agent and trigger a turn in that target. If the target is currently mid-turn, the message is queued and used for its next turn.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'wait_agent',
        label: 'wait_agent',
        description: 'Wait for a mailbox update from any live agent. Does not return the child content; the completion notification is delivered through the parent mailbox.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'list_agents',
        label: 'list_agents',
        description: 'List live agents in the current root thread tree. Optionally filter by task-path prefix.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'close_agent',
        label: 'close_agent',
        description: 'Close an agent when it is no longer needed and return the previous AgentStatus.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.HIDDEN
    }),
    Object.freeze({
        id: 'mcp_bridge',
        label: 'mcp_bridge',
        description: 'Manage configured MCP servers and execute tools/resources/prompts through stdio or HTTP MCP sessions.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['tool_call']),
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'tool_doctor',
        label: 'tool_doctor',
        description: 'Run tool health checks, discover MCP candidates, maintain scorecards, and propose gated self-repair plans.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([]),
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'capability_manager',
        label: 'capability_manager',
        description: 'Registry, install, validate, skill-author, rollback, and repair capabilities for AILIS self-iteration.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['install_capability', 'author_skill', 'rollback', 'execute_repair', 'smoke_mcp_candidate']),
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'self_debugger',
        label: 'self_debugger',
        description: 'Open self-debug cases, collect evidence, diagnose AILIS bugs, and route validated repairs through Capability Manager.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['apply_patch']),
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    }),
    Object.freeze({
        id: 'self_evolution',
        label: 'self_evolution',
        description: 'Analyze AILIS usage, preferences, tool bottlenecks, and capability gaps; create gated self-improvement proposals that can be reviewed and applied from the agent loop.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['apply_proposal']),
        exposure: EXTENDED_RUNTIME_TOOL_EXPOSURE
    })
]);

const AILIS_RUNTIME_TOOL_IDS = new Set(AILIS_RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id));

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function closeModelFacingObjectSchemas(schema = {}) {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return schema;
    }
    const isObjectSchema = schema.type === 'object' || Boolean(schema.properties);
    if (isObjectSchema) {
        schema.type = 'object';
        if (!schema.properties || typeof schema.properties !== 'object' || Array.isArray(schema.properties)) {
            schema.properties = {};
        }
        if (typeof schema.additionalProperties !== 'boolean') {
            schema.additionalProperties = Object.keys(schema.properties).length ? false : true;
        } else if (schema.additionalProperties === true && Object.keys(schema.properties).length) {
            schema.additionalProperties = false;
        }
        schema.required = Array.isArray(schema.required)
            ? [...new Set(schema.required.filter((entry) => typeof entry === 'string' && entry))]
            : [];
        for (const child of Object.values(schema.properties)) {
            closeModelFacingObjectSchemas(child);
        }
    }
    if (schema.items) {
        closeModelFacingObjectSchemas(schema.items);
    }
    if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(closeModelFacingObjectSchemas);
    }
    return schema;
}

function ensureModelFacingRequired(schema = {}, fields = []) {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return;
    }
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);
    for (const field of fields) {
        if (typeof field === 'string' && field) {
            required.add(field);
        }
    }
    schema.required = [...required];
}

function applyModelFacingSchemaOverrides(toolId = '', schema = {}) {
    if (toolId === 'tool_search') {
        const query = schema.properties?.query || {
            type: 'string',
            minLength: 1,
            description: 'Search query for deferred tools.'
        };
        const limit = schema.properties?.limit || {
            type: 'number',
            minimum: 1,
            maximum: 50,
            description: 'Maximum number of tools to return.'
        };
        schema.properties = { query, limit };
        ensureModelFacingRequired(schema, ['query']);
        if (schema.properties?.query && schema.properties.query.minLength === undefined) {
            schema.properties.query.minLength = 1;
        }
        schema.additionalProperties = false;
    }
    return schema;
}

function createModelFacingParameters(definition = {}, contract = null) {
    const sourceSchema = cloneJson(contract?.schema || {
        type: 'object',
        additionalProperties: true,
        properties: {}
    });
    const schema = definition.parseToolInputSchemaWithoutCompaction === true
        ? sourceSchema
        : compactToolSchema(sourceSchema);
    if (definition.id === 'mcp_bridge') {
        const action = schema?.properties?.action;
        if (Array.isArray(action?.enum)) {
            action.enum = action.enum.filter((entry) => !['call_tool', 'tool_call'].includes(entry));
        }
        schema.description = [
            schema.description || '',
            'Model-facing use is management/discovery only. Do not use mcp_bridge to execute MCP tools; call mcp__server__tool direct ids instead.'
        ].filter(Boolean).join(' ');
    }
    return closeModelFacingObjectSchemas(applyModelFacingSchemaOverrides(definition.id, schema));
}

function createAilisFunctionToolSpec(definition = {}) {
    const contract = getToolContract(definition.id);
    const deferred = definition.exposure === AILIS_TOOL_EXPOSURE.DEFERRED;
    const outputSchema = definition.id !== 'followup_task' && !deferred && contract?.returns
        ? compactToolSchema(contract.returns)
        : undefined;
    return {
        type: AILIS_TOOL_KIND.FUNCTION,
        name: definition.id,
        description: truncateMiddleText(
            definition.description || definition.label || definition.id,
            Math.max(900, Number(definition.modelDescriptionChars || 900))
        ),
        strict: definition.strict !== false,
        defer_loading: deferred ? true : undefined,
        parameters: createModelFacingParameters(definition, contract),
        output_schema: outputSchema
    };
}

module.exports = {
    AILIS_RUNTIME_TOOL_DEFINITIONS,
    AILIS_RUNTIME_TOOL_IDS,
    AILIS_TOOL_EXPOSURE,
    AILIS_TOOL_KIND,
    createAilisFunctionToolSpec,
    isExtendedAilisToolSurfaceEnabled,
    normalizeToolSurfaceMode
};
