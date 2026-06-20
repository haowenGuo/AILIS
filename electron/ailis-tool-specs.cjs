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
    return (
        process.env.AILIS_EXPERIMENTAL_OUTPUT_TOOLS === '1' ||
        process.env.AIGL_EXPERIMENTAL_OUTPUT_TOOLS === '1' ||
        process.env.AILIS_TOOL_SURFACE_MODE === 'codex' ||
        process.env.AIGL_TOOL_SURFACE_MODE === 'codex'
    );
}

const OUTPUT_STORE_TOOL_EXPOSURE = isExperimentalOutputStoreToolsEnabled()
    ? AILIS_TOOL_EXPOSURE.DIRECT
    : AILIS_TOOL_EXPOSURE.DEFERRED;

const AILIS_RUNTIME_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'update_plan',
        label: 'update_plan',
        description: 'Update the visible agent plan as a first-class runtime tool.',
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
        description: 'Tool discovery. Searches over deferred tool metadata with BM25 and exposes matching tools for the next Agent step.',
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
        description: 'Query managed AILIS context artifacts by details.artifactId/contextArtifact.id without dumping large payload files into the model context. Do not pass evidence_refs artifact-* ids here. Use spreadsheet grid/range/search, text_range/text_search/text_tail, or document_search/document_page/document_section instead of raw read on artifact payloads.',
        sectionId: 'context-artifacts',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
    }),
    Object.freeze({
        id: 'artifact_compute',
        label: 'artifact_compute',
        description: 'Run deterministic data-worker computations on managed context artifacts, such as spreadsheet profiling and grid path search, returning compact reasoning-ready evidence instead of raw payloads.',
        sectionId: 'context-artifacts',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'subagents',
        label: 'subagents',
        description: 'Spawn, wait, cancel, and inspect child Agent runs through the AILIS runtime transcript.',
        sectionId: 'runtime',
        route: 'ailis-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['spawn', 'create', 'send', 'close']),
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        exposure: AILIS_TOOL_EXPOSURE.DEFERRED
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
        ensureModelFacingRequired(schema, ['query']);
        if (schema.properties?.query && schema.properties.query.minLength === undefined) {
            schema.properties.query.minLength = 1;
        }
    }
    return schema;
}

function createModelFacingParameters(definition = {}, contract = null) {
    const schema = compactToolSchema(cloneJson(contract?.schema || {
        type: 'object',
        additionalProperties: true,
        properties: {}
    }));
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
    const outputSchema = !deferred && contract?.returns ? compactToolSchema(contract.returns) : undefined;
    return {
        type: AILIS_TOOL_KIND.FUNCTION,
        name: definition.id,
        description: truncateMiddleText(definition.description || definition.label || definition.id, 900),
        strict: false,
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
    createAilisFunctionToolSpec
};
