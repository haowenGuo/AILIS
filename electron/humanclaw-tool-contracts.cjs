const CONTRACT_VERSION = 1;

const STANDARD_TOOL_RETURN_SCHEMA = Object.freeze({
    type: 'object',
    required: ['content'],
    properties: {
        content: arraySchema(makeObjectSchema({
            required: ['type'],
            properties: {
                type: stringSchema({ enum: ['text', 'image', 'resource', 'json'] }),
                text: stringSchema(),
                uri: stringSchema(),
                mimeType: stringSchema()
            },
            additionalProperties: true
        })),
        isError: booleanSchema(),
        details: objectSchema()
    },
    additionalProperties: true
});

const STANDARD_TOOL_ERROR_CODES = Object.freeze([
    'missing_tool',
    'invalid_tool_args',
    'blocked',
    'needs_approval',
    'timeout',
    'not_materialized',
    'tool_error'
]);

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

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function makeObjectSchema({ required = [], properties = {}, additionalProperties = true } = {}) {
    return {
        type: 'object',
        required,
        properties,
        additionalProperties
    };
}

function stringSchema(options = {}) {
    return {
        type: 'string',
        ...options
    };
}

function numberSchema(options = {}) {
    return {
        type: 'number',
        ...options
    };
}

function booleanSchema(options = {}) {
    return {
        type: 'boolean',
        ...options
    };
}

function objectSchema(options = {}) {
    return makeObjectSchema(options);
}

function arraySchema(items = {}, options = {}) {
    return {
        type: 'array',
        items,
        ...options
    };
}

function actionSchema(actions, extraProperties = {}, required = []) {
    return makeObjectSchema({
        required: ['action', ...required],
        properties: {
            action: stringSchema({ enum: actions }),
            operation: stringSchema(),
            intent: stringSchema(),
            timeoutMs: numberSchema({ minimum: 1000, maximum: 180000 }),
            ...extraProperties
        },
        additionalProperties: true
    });
}

const EMAIL_ACTIONS = Object.freeze([
    'providers',
    'schema',
    'list',
    'search',
    'inbox',
    'read',
    'get',
    'draft',
    'compose',
    'send',
    'mark_read',
    'mark_unread',
    'move',
    'delete',
    'oauth_authorize_url',
    'oauth_url',
    'oauth_exchange_code',
    'oauth_token',
    'oauth_refresh',
    'refresh_token',
    'gmail_list_labels',
    'gmail_list_threads',
    'gmail_get_thread',
    'outlook_graph_messages',
    'outlook_graph_message',
    'outlook_graph_folders'
]);

const FILE_MANAGER_ACTIONS = Object.freeze([
    'schema',
    'profiles',
    'scan',
    'plan_clean',
    'clean',
    'plan_organize',
    'organize',
    'quarantine',
    'restore'
]);

const COMPUTER_ACTIONS = Object.freeze([
    'schema',
    'list',
    'ls',
    'tree',
    'stat',
    'read',
    'read_binary',
    'write',
    'write_binary',
    'append',
    'mkdir',
    'copy',
    'move',
    'rename',
    'delete',
    'trash',
    'search',
    'find',
    'hash',
    'du',
    'exec',
    'run',
    'session_start',
    'process_list',
    'process_read',
    'process_write',
    'process_kill',
    'pty_status',
    'pty_start',
    'pty_read',
    'pty_write',
    'pty_resize',
    'pty_kill',
    'watch_start',
    'watch_poll',
    'watch_list',
    'watch_stop',
    'rollback_list',
    'rollback_restore',
    'acl_get',
    'acl_set'
]);

const CODE_ACTIONS = Object.freeze([
    'schema',
    'search',
    'symbols',
    'semantic_index',
    'diagnostics',
    'lsp_diagnostics',
    'refactor_rename',
    'rename_symbol',
    'test',
    'git_status',
    'git_diff',
    'git_log',
    'git_commit',
    'pr_create',
    'ci_status'
]);

const MCP_ACTIONS = Object.freeze([
    'schema',
    'list_servers',
    'register_server',
    'add_server',
    'unregister_server',
    'remove_server',
    'health_check',
    'list_tools',
    'list_resources',
    'read_resource',
    'list_prompts',
    'get_prompt',
    'call_tool',
    'tool_call',
    'shutdown_server'
]);

function defaultReturns() {
    return cloneJson(STANDARD_TOOL_RETURN_SCHEMA);
}

function defaultErrors(extra = []) {
    return [...STANDARD_TOOL_ERROR_CODES, ...extra];
}

const TOOL_CONTRACTS = Object.freeze({
    read: Object.freeze({
        id: 'read',
        version: CONTRACT_VERSION,
        mutates: false,
        risk: 'low',
        approval: 'never',
        returns: defaultReturns(),
        errors: defaultErrors(['file_not_found', 'path_outside_workspace']),
        schema: makeObjectSchema({
            required: ['path'],
            properties: {
                path: stringSchema({ minLength: 1 }),
                encoding: stringSchema(),
                maxBytes: numberSchema({ minimum: 1, maximum: 5 * 1024 * 1024 })
            },
            additionalProperties: true
        })
    }),
    write: Object.freeze({
        id: 'write',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['path_outside_workspace', 'write_failed']),
        schema: makeObjectSchema({
            required: ['path'],
            properties: {
                path: stringSchema({ minLength: 1 }),
                content: stringSchema(),
                encoding: stringSchema()
            },
            additionalProperties: true
        })
    }),
    edit: Object.freeze({
        id: 'edit',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['path_outside_workspace', 'edit_target_not_found']),
        schema: makeObjectSchema({
            required: ['path'],
            properties: {
                path: stringSchema({ minLength: 1 }),
                oldString: stringSchema(),
                newString: stringSchema(),
                input: stringSchema()
            },
            additionalProperties: true
        })
    }),
    apply_patch: Object.freeze({
        id: 'apply_patch',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['patch_rejected', 'path_outside_workspace']),
        schema: makeObjectSchema({
            required: ['input'],
            properties: {
                input: stringSchema({ minLength: 1 })
            },
            additionalProperties: true
        })
    }),
    exec: Object.freeze({
        id: 'exec',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'high',
        approval: 'required',
        returns: defaultReturns(),
        errors: defaultErrors(['exec_blocked', 'exec_failed', 'shell_access_disabled']),
        schema: makeObjectSchema({
            properties: {
                command: stringSchema({ minLength: 1 }),
                cmd: stringSchema({ minLength: 1 }),
                workdir: stringSchema(),
                timeoutMs: numberSchema({ minimum: 1000, maximum: 24 * 60 * 60 * 1000 }),
                timeout: numberSchema({ minimum: 1 }),
                maxOutputBytes: numberSchema({ minimum: 1 }),
                env: objectSchema()
            },
            additionalProperties: true
        }),
        customValidate(args = {}) {
            if (!normalizeString(args.command || args.cmd)) {
                return ['exec requires command or cmd'];
            }
            return [];
        }
    }),
    update_plan: Object.freeze({
        id: 'update_plan',
        version: CONTRACT_VERSION,
        mutates: false,
        risk: 'low',
        approval: 'never',
        returns: defaultReturns(),
        errors: defaultErrors(['invalid_plan']),
        schema: makeObjectSchema({
            required: ['plan'],
            properties: {
                explanation: stringSchema(),
                plan: arraySchema(makeObjectSchema({
                    required: ['step', 'status'],
                    properties: {
                        id: stringSchema(),
                        step: stringSchema({ minLength: 1 }),
                        status: stringSchema({ enum: ['pending', 'in_progress', 'completed'] })
                    },
                    additionalProperties: true
                }), { minItems: 1 })
            },
            additionalProperties: true
        })
    }),
    subagents: Object.freeze({
        id: 'subagents',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['subagent_not_found', 'subagent_timeout', 'subagent_cancelled']),
        schema: actionSchema(
            ['list', 'spawn', 'create', 'status', 'info', 'wait', 'log', 'send', 'steer', 'close', 'cancel', 'kill'],
            {
                subagentId: stringSchema(),
                id: stringSchema(),
                task: stringSchema(),
                message: stringSchema(),
                prompt: stringSchema(),
                wait: booleanSchema(),
                waitTimeoutMs: numberSchema({ minimum: 1000, maximum: 24 * 60 * 60 * 1000 }),
                maxAgentSteps: numberSchema({ minimum: 1, maximum: 20 })
            }
        )
    }),
    mcp_bridge: Object.freeze({
        id: 'mcp_bridge',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors([
            'mcp_server_not_configured',
            'mcp_transport_error',
            'invalid_mcp_tool_args',
            'mcp_resource_not_found'
        ]),
        schema: actionSchema(MCP_ACTIONS, {
            server: stringSchema(),
            serverId: stringSchema(),
            tool: stringSchema(),
            name: stringSchema(),
            uri: stringSchema(),
            resourceUri: stringSchema(),
            resource: stringSchema(),
            prompt: stringSchema(),
            promptName: stringSchema(),
            args: objectSchema(),
            arguments: objectSchema(),
            serverConfig: objectSchema(),
            config: objectSchema(),
            servers: objectSchema(),
            persist: booleanSchema(),
            timeoutMs: numberSchema({ minimum: 1000, maximum: 180000 })
        }),
        customValidate(args = {}) {
            const action = normalizeAction(args.action || args.operation || args.intent, 'list_servers');
            if (action === 'read_resource' && !normalizeString(args.uri || args.resourceUri || args.resource)) {
                return ['mcp_bridge.read_resource requires uri/resourceUri/resource'];
            }
            if (['call_tool', 'tool_call'].includes(action) && !normalizeString(args.tool || args.name)) {
                return ['mcp_bridge.call_tool requires tool/name'];
            }
            if (action === 'get_prompt' && !normalizeString(args.prompt || args.promptName || args.name)) {
                return ['mcp_bridge.get_prompt requires prompt/promptName/name'];
            }
            return [];
        }
    }),
    email: Object.freeze({
        id: 'email',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['email_provider_not_configured', 'email_auth_failed', 'email_send_failed']),
        schema: actionSchema(EMAIL_ACTIONS, {
            provider: stringSchema(),
            account: stringSchema(),
            filter: stringSchema(),
            query: stringSchema(),
            limit: numberSchema({ minimum: 1, maximum: 100 }),
            uid: stringSchema(),
            messageId: stringSchema(),
            to: stringSchema(),
            subject: stringSchema(),
            text: stringSchema(),
            body: stringSchema(),
            dryRun: booleanSchema()
        })
    }),
    file_manager: Object.freeze({
        id: 'file_manager',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['scan_failed', 'quarantine_failed', 'restore_failed']),
        schema: actionSchema(FILE_MANAGER_ACTIONS, {
            path: stringSchema(),
            target: stringSchema(),
            profile: stringSchema(),
            dryRun: booleanSchema(),
            quarantine: booleanSchema()
        })
    }),
    computer: Object.freeze({
        id: 'computer',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'high',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['path_outside_workspace', 'computer_exec_failed', 'session_not_found']),
        schema: actionSchema(COMPUTER_ACTIONS, {
            path: stringSchema(),
            target: stringSchema(),
            source: stringSchema(),
            destination: stringSchema(),
            content: stringSchema(),
            command: stringSchema(),
            cmd: stringSchema(),
            workdir: stringSchema(),
            sessionId: stringSchema(),
            timeoutMs: numberSchema({ minimum: 1000, maximum: 24 * 60 * 60 * 1000 })
        })
    }),
    code: Object.freeze({
        id: 'code',
        version: CONTRACT_VERSION,
        mutates: true,
        risk: 'medium',
        approval: 'policy',
        returns: defaultReturns(),
        errors: defaultErrors(['diagnostics_failed', 'test_failed', 'git_failed', 'refactor_failed']),
        schema: actionSchema(CODE_ACTIONS, {
            path: stringSchema(),
            query: stringSchema(),
            from: stringSchema(),
            to: stringSchema(),
            command: stringSchema(),
            cwd: stringSchema(),
            includeSymbols: booleanSchema()
        })
    }),
    'vision.capture_context': Object.freeze({
        id: 'vision.capture_context',
        version: CONTRACT_VERSION,
        mutates: false,
        risk: 'low',
        approval: 'vision-policy',
        returns: defaultReturns(),
        errors: defaultErrors(['vision_permission_required', 'capture_failed', 'vision_model_failed']),
        schema: actionSchema(['schema', 'capture_context'], {
            target: stringSchema({ enum: ['screen', 'chat-window', 'active-window', 'region', 'pet-window', 'control-window'] }),
            source: stringSchema(),
            reason: stringSchema(),
            question: stringSchema()
        })
    })
});

function validatePrimitiveType(value, expectedType) {
    if (expectedType === 'array') {
        return Array.isArray(value);
    }
    if (expectedType === 'object') {
        return isPlainObject(value);
    }
    if (expectedType === 'number') {
        return typeof value === 'number' && Number.isFinite(value);
    }
    if (expectedType === 'integer') {
        return Number.isInteger(value);
    }
    if (expectedType === 'boolean') {
        return typeof value === 'boolean';
    }
    if (expectedType === 'string') {
        return typeof value === 'string';
    }
    return true;
}

function validateAgainstSchema(value, schema = {}, path = '$') {
    const errors = [];
    if (!schema || typeof schema !== 'object') {
        return errors;
    }
    if (Array.isArray(schema.anyOf)) {
        const variants = schema.anyOf.map((variant) => validateAgainstSchema(value, variant, path));
        if (!variants.some((variantErrors) => variantErrors.length === 0)) {
            errors.push(`${path} must match at least one schema variant`);
        }
        return errors;
    }
    if (schema.type && !validatePrimitiveType(value, schema.type)) {
        errors.push(`${path} must be ${schema.type}`);
        return errors;
    }
    if (schema.enum && !schema.enum.includes(value)) {
        errors.push(`${path} must be one of: ${schema.enum.join(', ')}`);
    }
    if (typeof value === 'string') {
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push(`${path} must have length >= ${schema.minLength}`);
        }
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            errors.push(`${path} must have length <= ${schema.maxLength}`);
        }
    }
    if (typeof value === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum) {
            errors.push(`${path} must be >= ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
            errors.push(`${path} must be <= ${schema.maximum}`);
        }
    }
    if (Array.isArray(value)) {
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push(`${path} must contain at least ${schema.minItems} item(s)`);
        }
        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            errors.push(`${path} must contain at most ${schema.maxItems} item(s)`);
        }
        if (schema.items) {
            value.forEach((entry, index) => {
                errors.push(...validateAgainstSchema(entry, schema.items, `${path}[${index}]`));
            });
        }
    }
    if (isPlainObject(value)) {
        for (const key of schema.required || []) {
            if (value[key] === undefined) {
                errors.push(`${path}.${key} is required`);
            }
        }
        for (const [key, propertySchema] of Object.entries(schema.properties || {})) {
            if (value[key] !== undefined) {
                errors.push(...validateAgainstSchema(value[key], propertySchema, `${path}.${key}`));
            }
        }
        if (schema.additionalProperties === false) {
            const allowed = new Set(Object.keys(schema.properties || {}));
            for (const key of Object.keys(value)) {
                if (!allowed.has(key)) {
                    errors.push(`${path}.${key} is not allowed`);
                }
            }
        }
    }
    return errors;
}

function normalizeArgsForContract(toolId, args = {}) {
    if (!isPlainObject(args)) {
        return {};
    }
    const normalized = { ...args };
    if (['email', 'file_manager', 'computer', 'code', 'mcp_bridge', 'subagents', 'vision.capture_context'].includes(toolId)) {
        normalized.action = normalizeAction(
            args.action || args.operation || args.intent,
            toolId === 'vision.capture_context' ? 'capture_context' : 'schema'
        );
    }
    return normalized;
}

function getToolContract(toolId) {
    return TOOL_CONTRACTS[toolId] || null;
}

function listToolContracts() {
    return Object.values(TOOL_CONTRACTS).map((contract) => ({
        id: contract.id,
        version: contract.version,
        mutates: contract.mutates,
        risk: contract.risk,
        approval: contract.approval,
        schema: cloneJson(contract.schema),
        returns: cloneJson(contract.returns || STANDARD_TOOL_RETURN_SCHEMA),
        errors: [...(contract.errors || STANDARD_TOOL_ERROR_CODES)]
    }));
}

function compactSchemaForPrompt(schema = {}) {
    const clone = cloneJson(schema);
    return JSON.stringify(clone, null, 2);
}

function getToolContractPromptText(toolId) {
    const contract = getToolContract(toolId);
    if (!contract) {
        return '';
    }
    const actions = contract.schema?.properties?.action?.enum || [];
    const lines = [
        `TOOL CONTRACT ${contract.id}@v${contract.version}`,
        `risk=${contract.risk}; mutates=${contract.mutates ? 'true' : 'false'}; approval=${contract.approval}`,
        actions.length ? `actions=${actions.join(', ')}` : '',
        'input_schema:',
        compactSchemaForPrompt(contract.schema),
        'return_schema:',
        compactSchemaForPrompt(contract.returns || STANDARD_TOOL_RETURN_SCHEMA),
        `error_codes=${(contract.errors || STANDARD_TOOL_ERROR_CODES).join(', ')}`
    ];
    return lines.filter(Boolean).join('\n');
}

function buildToolContractsPrompt(toolIds = []) {
    const ids = Array.isArray(toolIds) && toolIds.length
        ? toolIds
        : Object.keys(TOOL_CONTRACTS);
    return ids
        .map((id) => getToolContractPromptText(id))
        .filter(Boolean)
        .join('\n\n');
}

function listToolContractSummaries(toolIds = []) {
    const ids = Array.isArray(toolIds) && toolIds.length
        ? toolIds
        : Object.keys(TOOL_CONTRACTS);
    return ids
        .map((id) => getToolContract(id))
        .filter(Boolean)
        .map((contract) => ({
            id: contract.id,
            version: contract.version,
            risk: contract.risk,
            mutates: contract.mutates,
            approval: contract.approval,
            actions: contract.schema?.properties?.action?.enum || [],
            errors: [...(contract.errors || STANDARD_TOOL_ERROR_CODES)]
        }));
}

function validateToolContract(toolId, args = {}) {
    const contract = getToolContract(toolId);
    if (!contract) {
        return {
            ok: true,
            status: 'no_contract',
            contract: null,
            args
        };
    }
    const normalizedArgs = normalizeArgsForContract(toolId, args);
    const errors = validateAgainstSchema(normalizedArgs, contract.schema);
    if (typeof contract.customValidate === 'function') {
        errors.push(...contract.customValidate(normalizedArgs));
    }
    return {
        ok: errors.length === 0,
        status: errors.length ? 'invalid_tool_args' : 'validated',
        errors,
        contract: {
            id: contract.id,
            version: contract.version,
            mutates: contract.mutates,
            risk: contract.risk,
            approval: contract.approval
        },
        args: normalizedArgs
    };
}

module.exports = {
    CONTRACT_VERSION,
    TOOL_CONTRACTS,
    getToolContract,
    listToolContracts,
    listToolContractSummaries,
    getToolContractPromptText,
    buildToolContractsPrompt,
    validateAgainstSchema,
    validateToolContract
};
