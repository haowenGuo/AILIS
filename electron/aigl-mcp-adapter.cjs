const {
    compactToolSchema,
    truncateMiddleText
} = require('./aigl-runtime-budget.cjs');

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function appendDescription(target, text) {
    if (!target || typeof target !== 'object' || !text) {
        return;
    }
    const current = normalizeString(target.description);
    if (current.includes(text)) {
        return;
    }
    const separator = current && /[.!?。！？]$/.test(current) ? ' ' : '. ';
    target.description = current ? `${current}${separator}${text}` : text;
}

function buildAiglMcpToolDescriptionAddendum({ tool = '', inputSchema = {} } = {}) {
    const normalizedTool = normalizeString(tool).toLowerCase();
    const properties = inputSchema && typeof inputSchema === 'object' ? inputSchema.properties || {} : {};
    if (normalizedTool === 'edit_file' && properties.edits) {
        return [
            'Use for editing existing text only.',
            'Arguments must include edits: [{ oldText, newText }].',
            'oldText must exactly match existing file text.',
            'Do not use this tool to create or overwrite a whole file with { path, content }, replace_all, or edits[].content.',
            'For new Markdown/reports or whole-file output, use the local write tool: { path, content }.'
        ];
    }
    return [];
}

function enhanceAiglMcpToolSchema({ tool = '', inputSchema = {} } = {}) {
    const schema = cloneJson(inputSchema || {});
    if (!schema || typeof schema !== 'object') {
        return {};
    }
    const normalizedTool = normalizeString(tool).toLowerCase();
    const properties = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};
    if (normalizedTool === 'edit_file' && properties.edits) {
        appendDescription(schema, 'This edits existing text ranges. It is not a create-file or overwrite-file API.');
        appendDescription(properties.path, 'Path of an existing file to edit.');
        appendDescription(properties.edits, 'Required array of exact text replacements. Use [{ oldText, newText }], not { content }, replace_all, or edits[].content.');
        const itemProperties = properties.edits?.items?.properties || {};
        appendDescription(itemProperties.oldText, 'Exact existing text to search for. It must match the file contents exactly.');
        appendDescription(itemProperties.newText, 'Replacement text to insert in place of oldText.');
        appendDescription(properties.dryRun, 'Set true only to preview the diff without applying changes.');
    }
    return compactToolSchema(schema);
}

function buildAiglMcpToolCallArgs({ tool = '', schemaProperties = [], inputSchema = {} } = {}) {
    const normalizedTool = normalizeString(tool).toLowerCase();
    const properties = inputSchema && typeof inputSchema === 'object' ? inputSchema.properties || {} : {};
    if (normalizedTool === 'edit_file' && properties.edits) {
        return {
            path: '<existing file path>',
            edits: [
                {
                    oldText: '<exact existing text>',
                    newText: '<replacement text>'
                }
            ]
        };
    }
    return Object.fromEntries((schemaProperties || []).map((key) => [key, `<${key}>`]));
}

function sanitizeCodexMcpNamePart(value, fallback = '') {
    const raw = normalizeString(value, fallback);
    const sanitized = raw
        .replace(/[^A-Za-z0-9_-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
    return sanitized || fallback;
}

function codexMcpNamespaceForServer(server = '') {
    const normalizedServer = sanitizeCodexMcpNamePart(server, 'server');
    return `mcp__${normalizedServer}__`;
}

function codexMcpToolId({ server = '', tool = '' } = {}) {
    const namespace = codexMcpNamespaceForServer(server);
    const normalizedTool = sanitizeCodexMcpNamePart(tool, 'tool');
    return `${namespace}${normalizedTool}`;
}

function parseAiglDirectMcpToolId(value) {
    const toolId = normalizeString(value);
    if (!toolId) {
        return null;
    }
    let match = toolId.match(/^mcp__([^_].*?)__(.+)$/);
    if (match) {
        const server = normalizeString(match[1]);
        const tool = normalizeString(match[2]);
        return {
            id: codexMcpToolId({ server, tool }),
            legacyId: `mcp:${server}:${tool}`,
            namespace: codexMcpNamespaceForServer(server),
            callableName: sanitizeCodexMcpNamePart(tool, 'tool'),
            server,
            tool
        };
    }
    match = toolId.match(/^mcp:([^:]+):(.+)$/);
    if (match) {
        const server = normalizeString(match[1]);
        const tool = normalizeString(match[2]);
        return {
            id: codexMcpToolId({ server, tool }),
            legacyId: `mcp:${server}:${tool}`,
            namespace: codexMcpNamespaceForServer(server),
            callableName: sanitizeCodexMcpNamePart(tool, 'tool'),
            server,
            tool
        };
    }
    match = toolId.match(/^mcp\.([^.]+)\.(.+)$/);
    if (match) {
        const server = normalizeString(match[1]);
        const tool = normalizeString(match[2]);
        return {
            id: codexMcpToolId({ server, tool }),
            legacyId: `mcp:${server}:${tool}`,
            namespace: codexMcpNamespaceForServer(server),
            callableName: sanitizeCodexMcpNamePart(tool, 'tool'),
            server,
            tool
        };
    }
    return null;
}

function createAiglDirectMcpToolSpec({ id, server, tool, name, title, description, inputSchema, schemaProperties, callPattern, descriptionAddendum } = {}) {
    const normalizedServer = normalizeString(server);
    const normalizedTool = normalizeString(tool || name);
    const normalizedId = normalizeString(id) || codexMcpToolId({ server: normalizedServer, tool: normalizedTool });
    const parsedId = parseAiglDirectMcpToolId(normalizedId);
    const modelId = parsedId?.id || codexMcpToolId({ server: normalizedServer, tool: normalizedTool });
    const legacyId = parsedId?.legacyId || `mcp:${normalizedServer}:${normalizedTool}`;
    const namespace = parsedId?.namespace || codexMcpNamespaceForServer(normalizedServer);
    const callableName = parsedId?.callableName || sanitizeCodexMcpNamePart(normalizedTool, 'tool');
    const enhancedSchema = enhanceAiglMcpToolSchema({
        tool: normalizedTool,
        inputSchema: inputSchema || {}
    });
    const addendum = Array.isArray(descriptionAddendum) && descriptionAddendum.length
        ? [...descriptionAddendum]
        : buildAiglMcpToolDescriptionAddendum({ tool: normalizedTool, inputSchema: enhancedSchema });
    const properties = Array.isArray(schemaProperties) ? [...schemaProperties] : [];
    return {
        id: modelId,
        legacy_id: legacyId,
        type: 'mcp_tool',
        namespace,
        callable_name: callableName,
        server: normalizedServer,
        tool: normalizedTool,
        title: normalizeString(title),
        name: `${namespace}${callableName}`,
        display_name: normalizeString(name || tool) || `${normalizedServer}.${normalizedTool}`,
        description: truncateMiddleText([normalizeString(description), ...addendum].filter(Boolean).join(' '), 1200),
        input_schema: enhancedSchema,
        schema_properties: properties,
        call_pattern: {
            tool: modelId,
            args: callPattern?.args || buildAiglMcpToolCallArgs({
                tool: normalizedTool,
                schemaProperties: properties,
                inputSchema: enhancedSchema
            })
        }
    };
}

function normalizeAiglMcpCallArgs(args = {}) {
    const toolArgs = args && typeof args === 'object' && !Array.isArray(args)
        ? { ...args }
        : {};
    const meta = toolArgs._meta || toolArgs.meta;
    delete toolArgs._meta;
    delete toolArgs.meta;
    return { toolArgs, meta };
}

module.exports = {
    buildAiglMcpToolCallArgs,
    buildAiglMcpToolDescriptionAddendum,
    codexMcpNamespaceForServer,
    codexMcpToolId,
    createAiglDirectMcpToolSpec,
    enhanceAiglMcpToolSchema,
    normalizeAiglMcpCallArgs,
    parseAiglDirectMcpToolId,
    sanitizeCodexMcpNamePart
};
