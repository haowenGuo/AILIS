const { validateToolContract } = require('./humanclaw-tool-contracts.cjs');
const {
    AIGL_RUNTIME_TOOL_DEFINITIONS,
    AIGL_RUNTIME_TOOL_IDS,
    AIGL_TOOL_EXPOSURE,
    createAiglFunctionToolSpec
} = require('./aigl-tool-specs.cjs');
const {
    makeAiglToolError,
    makeAiglToolResult,
    normalizeAiglToolOutput
} = require('./aigl-tool-result.cjs');
const {
    createAiglDirectMcpToolSpec,
    normalizeAiglMcpCallArgs,
    parseAiglDirectMcpToolId
} = require('./aigl-mcp-adapter.cjs');

const TOOL_EXPOSURE = AIGL_TOOL_EXPOSURE;
const CORE_RUNTIME_TOOL_DEFINITIONS = AIGL_RUNTIME_TOOL_DEFINITIONS;
const CORE_RUNTIME_TOOL_IDS = AIGL_RUNTIME_TOOL_IDS;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value, fallback = '') {
    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

const parseDirectMcpToolId = parseAiglDirectMcpToolId;

function makeTextResult({ status = 'completed', text = '', details = {}, isError = false } = {}) {
    return makeAiglToolResult({ status, text, details, isError });
}

function normalizeToolOutput(result = {}, { toolId = '' } = {}) {
    return normalizeAiglToolOutput(result, { toolId });
}

function createToolSpec(definition = {}) {
    return createAiglFunctionToolSpec(definition);
}

class HumanClawRuntimeTool {
    constructor({ definition, handle }) {
        this.definition = Object.freeze({ ...definition });
        this.id = this.definition.id;
        this.exposure = this.definition.exposure || TOOL_EXPOSURE.DIRECT;
        this.handle = handle;
    }

    spec() {
        return createToolSpec(this.definition);
    }

    searchInfo() {
        return {
            id: this.id,
            exposure: this.exposure,
            text: [
                this.definition.id,
                this.definition.label,
                this.definition.description,
                this.definition.sectionId
            ].filter(Boolean).join(' ')
        };
    }

    validate(args = {}) {
        return validateToolContract(this.id, args);
    }

    async dispatch(args = {}, context = {}) {
        const validation = this.validate(args);
        if (!validation.ok) {
            return makeAiglToolError({
                status: validation.status || 'invalid_tool_args',
                errorCode: validation.status || 'invalid_tool_args',
                message: `tool arguments failed contract validation: ${(validation.errors || []).join('; ')}`,
                details: {
                    tool: this.id,
                    errors: validation.errors || [],
                    contract: validation.contract || null
                }
            });
        }
        return normalizeToolOutput(await this.handle(validation.args || args, context), { toolId: this.id });
    }
}

class HumanClawToolRuntimeRegistry {
    constructor({ runtime }) {
        this.runtime = runtime;
        this.tools = new Map();
    }

    register(tool) {
        if (!tool?.id) {
            throw new Error('tool runtime requires id');
        }
        if (this.tools.has(tool.id)) {
            throw new Error(`duplicate tool runtime: ${tool.id}`);
        }
        this.tools.set(tool.id, tool);
        return tool;
    }

    has(toolId) {
        return this.tools.has(toolId) || Boolean(parseDirectMcpToolId(toolId));
    }

    toolIds() {
        return [...this.tools.keys()];
    }

    definition(toolId) {
        const tool = this.tools.get(toolId);
        return tool ? { ...tool.definition, spec: tool.spec() } : null;
    }

    listDefinitions() {
        return [...this.tools.values()].map((tool) => ({
            ...tool.definition,
            spec: tool.spec()
        }));
    }

    modelVisibleSpecs({ includeDeferred = false } = {}) {
        return [...this.tools.values()]
            .filter((tool) => includeDeferred || tool.exposure === TOOL_EXPOSURE.DIRECT)
            .map((tool) => tool.spec());
    }

    search(query = '', limit = 8) {
        const terms = normalizeString(query).toLowerCase().split(/\s+/).filter(Boolean);
        const entries = [...this.tools.values()].map((tool) => ({
            ...tool.searchInfo(),
            spec: tool.spec()
        }));
        const scored = entries.map((entry) => {
            const text = normalizeString(entry.text).toLowerCase();
            const score = terms.length
                ? terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0)
                : 1;
            return { entry, score };
        });
        return scored
            .filter(({ score }) => score > 0)
            .sort((left, right) => right.score - left.score || left.entry.id.localeCompare(right.entry.id))
            .slice(0, Math.max(1, Math.min(Number(limit || 8), 50)))
            .map(({ entry }) => entry);
    }

    async dispatch(toolId, args = {}, context = {}) {
        const directMcp = parseDirectMcpToolId(toolId);
        if (directMcp) {
            return await this.dispatchDirectMcpTool(directMcp, args, context);
        }
        const tool = this.tools.get(toolId);
        if (!tool) {
            return makeTextResult({
                status: 'not_materialized',
                isError: true,
                details: {
                    tool: toolId
                }
            });
        }
        return await tool.dispatch(args, context);
    }

    async dispatchDirectMcpTool(directMcp, args = {}, context = {}) {
        const { toolArgs, meta } = normalizeAiglMcpCallArgs(args);
        const output = await this.runtime.executeMcpBridge(
            {
                action: 'call_tool',
                server: directMcp.server,
                tool: directMcp.tool,
                args: toolArgs,
                ...(meta !== undefined ? { meta } : {})
            },
            context
        );
        return normalizeToolOutput(output, { toolId: directMcp.id });
    }
}

async function executeToolSearch(registry, args = {}) {
    const query = normalizeString(args.query || args.q);
    const limit = Math.max(1, Math.min(Number(args.limit || 8), 50));
    const includeMcp = args.includeMcp !== false;
    const local = registry.search(query, limit).map((entry) => ({
        id: entry.id,
        type: 'runtime_tool',
        exposure: entry.exposure,
        spec: entry.spec
    }));
    let mcp = [];
    if (includeMcp && registry.runtime?.mcpManager?.searchToolSpecs) {
        try {
            mcp = (await registry.runtime.mcpManager.searchToolSpecs({
                query,
                limit,
                timeoutMs: args.timeoutMs
            })).map((spec) => createAiglDirectMcpToolSpec(spec));
        } catch (error) {
            mcp = [{
                type: 'mcp_tool_search_error',
                error: error?.message || String(error)
            }];
        }
    }
    const tools = [...local, ...mcp].slice(0, limit);
    return makeTextResult({
        status: 'completed',
        text: JSON.stringify({ status: 'completed', query, tools }, null, 2),
        details: {
            query,
            tools
        }
    });
}

function createHumanClawToolRuntimeRegistry(runtime) {
    const registry = new HumanClawToolRuntimeRegistry({ runtime });
    const definitionById = Object.fromEntries(CORE_RUNTIME_TOOL_DEFINITIONS.map((definition) => [definition.id, definition]));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.update_plan,
        handle: async (args, context) => runtime.updatePlan({
            runId: context.runId || args.runId,
            sessionId: context.sessionId || context.sessionKey || args.sessionId || 'main',
            plan: args.plan || args.items || args.steps || args.todos || [],
            explanation: args.explanation || args.summary || ''
        })
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.tool_search,
        handle: async (args) => executeToolSearch(registry, args)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.request_permissions,
        handle: async (args, context) => runtime.requestPermissions(args, context)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.subagents,
        handle: async (args, context) => runtime.executeSubagentRelay(args, context)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.mcp_bridge,
        handle: async (args, context) => runtime.executeMcpBridge(args, context)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.tool_doctor,
        handle: async (args, context) => runtime.toolDoctor.execute(args, context)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.capability_manager,
        handle: async (args, context) => runtime.capabilityManager.execute(args, context)
    }));
    registry.register(new HumanClawRuntimeTool({
        definition: definitionById.self_debugger,
        handle: async (args, context) => runtime.selfDebugger.execute(args, context)
    }));
    return registry;
}

module.exports = {
    TOOL_EXPOSURE,
    CORE_RUNTIME_TOOL_DEFINITIONS,
    CORE_RUNTIME_TOOL_IDS,
    HumanClawRuntimeTool,
    HumanClawToolRuntimeRegistry,
    createHumanClawToolRuntimeRegistry,
    parseDirectMcpToolId,
    normalizeToolOutput
};
