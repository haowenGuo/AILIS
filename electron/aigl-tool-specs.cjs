const { getToolContract } = require('./humanclaw-tool-contracts.cjs');
const {
    compactToolSchema,
    truncateMiddleText
} = require('./aigl-runtime-budget.cjs');

const AIGL_TOOL_EXPOSURE = Object.freeze({
    DIRECT: 'direct',
    DEFERRED: 'deferred',
    HIDDEN: 'hidden'
});

const AIGL_TOOL_KIND = Object.freeze({
    FUNCTION: 'function',
    HOSTED: 'hosted',
    MCP: 'mcp',
    FREEFORM: 'freeform'
});

const AIGL_RUNTIME_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'update_plan',
        label: 'update_plan',
        description: 'Update the visible agent plan as a first-class runtime tool.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AIGL_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'tool_search',
        label: 'tool_search',
        description: 'Search deferred runtime tools and MCP tool specs, then return loadable tool specifications for the next Agent step.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false,
        exposure: AIGL_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'request_permissions',
        label: 'request_permissions',
        description: 'Request additional network or file-system permissions as a first-class runtime protocol before retrying gated tools.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['grant']),
        exposure: AIGL_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'subagents',
        label: 'subagents',
        description: 'Spawn, wait, cancel, and inspect child Agent runs through the AIGL runtime transcript.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['spawn', 'create', 'send', 'close']),
        exposure: AIGL_TOOL_EXPOSURE.DIRECT
    }),
    Object.freeze({
        id: 'mcp_bridge',
        label: 'mcp_bridge',
        description: 'Manage configured MCP servers and execute tools/resources/prompts through stdio or HTTP MCP sessions.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['tool_call']),
        exposure: AIGL_TOOL_EXPOSURE.DEFERRED
    }),
    Object.freeze({
        id: 'tool_doctor',
        label: 'tool_doctor',
        description: 'Run tool health checks, discover MCP candidates, maintain scorecards, and propose gated self-repair plans.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([]),
        exposure: AIGL_TOOL_EXPOSURE.DEFERRED
    }),
    Object.freeze({
        id: 'capability_manager',
        label: 'capability_manager',
        description: 'Registry, install, validate, skill-author, rollback, and repair capabilities for AIGL self-iteration.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['install_capability', 'author_skill', 'rollback', 'execute_repair', 'smoke_mcp_candidate']),
        exposure: AIGL_TOOL_EXPOSURE.DEFERRED
    }),
    Object.freeze({
        id: 'self_debugger',
        label: 'self_debugger',
        description: 'Open self-debug cases, collect evidence, diagnose AIGL bugs, and route validated repairs through Capability Manager.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['apply_patch']),
        exposure: AIGL_TOOL_EXPOSURE.DEFERRED
    })
]);

const AIGL_RUNTIME_TOOL_IDS = new Set(AIGL_RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id));

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
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
    return schema;
}

function createAiglFunctionToolSpec(definition = {}) {
    const contract = getToolContract(definition.id);
    const deferred = definition.exposure === AIGL_TOOL_EXPOSURE.DEFERRED;
    const outputSchema = !deferred && contract?.returns ? compactToolSchema(contract.returns) : undefined;
    return {
        type: AIGL_TOOL_KIND.FUNCTION,
        name: definition.id,
        description: truncateMiddleText(definition.description || definition.label || definition.id, 900),
        strict: false,
        defer_loading: deferred ? true : undefined,
        parameters: createModelFacingParameters(definition, contract),
        output_schema: outputSchema
    };
}

module.exports = {
    AIGL_RUNTIME_TOOL_DEFINITIONS,
    AIGL_RUNTIME_TOOL_IDS,
    AIGL_TOOL_EXPOSURE,
    AIGL_TOOL_KIND,
    createAiglFunctionToolSpec
};
