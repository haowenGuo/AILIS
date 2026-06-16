const CONTRACT_INTAKE_VERSION = 1;
const DEFAULT_MIN_SCORE = 75;

const CONTRACT_SOURCE_PROFILES = Object.freeze([
    Object.freeze({
        id: 'mcp_registry',
        label: 'MCP Registry',
        sourceType: 'mcp_tool',
        trust: 'schema_source',
        importShape: 'MCP tools/list item: { name, description, inputSchema, outputSchema }',
        strengths: [
            'Standard protocol shape',
            'Broad ecosystem coverage',
            'Works with AILIS mcp__server__tool direct specs'
        ],
        caveats: [
            'Tool descriptions vary in quality',
            'Registry metadata alone is not enough; smoke test the server and listed tools'
        ]
    }),
    Object.freeze({
        id: 'composio',
        label: 'Composio',
        sourceType: 'composio_tool',
        trust: 'integration_catalog',
        importShape: 'Composio action/tool item with app, name, description, parameters/input_schema',
        strengths: [
            'Large application/action catalog',
            'Useful for Gmail, Slack, GitHub, Notion, calendar, and SaaS tools'
        ],
        caveats: [
            'Auth/OAuth state and side effects must be represented in AILIS permissions',
            'Low-level API actions often need higher-level tool cards'
        ]
    }),
    Object.freeze({
        id: 'openapi',
        label: 'OpenAPI / Swagger',
        sourceType: 'openapi_operation',
        trust: 'official_api_schema',
        importShape: 'OpenAPI operation: { operationId, method, path, parameters, requestBody, responses }',
        strengths: [
            'Best source for official web APIs such as Gmail, Microsoft Graph, GitHub, and Jira',
            'Strong parameter typing and response schemas'
        ],
        caveats: [
            'Raw endpoints are usually too low-level for an Agent',
            'Need auth, rate-limit, mutation, and workflow-level wrappers'
        ]
    }),
    Object.freeze({
        id: 'langchain_pydantic',
        label: 'LangChain / Pydantic',
        sourceType: 'pydantic_tool',
        trust: 'typed_local_tool',
        importShape: 'Typed local tool: { name, description, schema/args_schema/model_json_schema }',
        strengths: [
            'Good for local Python/JS tools generated from typed models',
            'Usually easy to keep examples close to implementation'
        ],
        caveats: [
            'Docstrings still need when-to-use and recovery guidance',
            'Validation is only as good as the underlying type model'
        ]
    }),
    Object.freeze({
        id: 'codex_openhands',
        label: 'Codex / OpenHands style core tools',
        sourceType: 'codex_tool',
        trust: 'agent_runtime_pattern',
        importShape: 'Core runtime tool spec: { name, description, parameters, output_schema }',
        strengths: [
            'Best reference for file, command, patch, session, and code execution tools',
            'Matches AILIS computer/code runtime goals'
        ],
        caveats: [
            'Must adapt permissions, sandbox, approval, and persona surface to AILIS'
        ]
    })
]);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value.filter((entry) => entry !== undefined && entry !== null) : [value];
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

function safeSegment(value, fallback = 'contract') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._:@/-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 140) || fallback;
}

function firstPresent(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
        if (value !== undefined && value !== null && typeof value !== 'string') {
            return value;
        }
    }
    return '';
}

function toSentenceList(value) {
    const direct = normalizeArray(value)
        .map((entry) => normalizeString(entry))
        .filter(Boolean);
    if (direct.length) {
        return direct;
    }
    const text = normalizeString(value);
    if (!text) {
        return [];
    }
    return text
        .split(/(?:\r?\n|;\s+|\.\s+)/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .slice(0, 8);
}

function normalizeSchema(schema = {}) {
    if (!isPlainObject(schema)) {
        return {
            type: 'object',
            properties: {},
            additionalProperties: false
        };
    }
    const clone = cloneJson(schema);
    if (!clone.type && clone.properties) {
        clone.type = 'object';
    }
    if (clone.type === 'object') {
        clone.properties = isPlainObject(clone.properties) ? clone.properties : {};
        clone.required = Array.isArray(clone.required) ? clone.required : [];
        if (clone.additionalProperties === undefined) {
            clone.additionalProperties = false;
        }
    }
    return clone;
}

function pickInputSchema(raw = {}, sourceType = '') {
    if (sourceType === 'openapi_operation') {
        return openApiOperationToInputSchema(raw);
    }
    const schema = firstPresent(
        raw.inputSchema,
        raw.input_schema,
        raw.parameters,
        raw.argsSchema,
        raw.args_schema,
        raw.schema,
        raw.jsonSchema,
        raw.model_json_schema
    );
    return normalizeSchema(isPlainObject(schema) ? schema : {});
}

function pickOutputSchema(raw = {}, sourceType = '') {
    if (sourceType === 'openapi_operation') {
        const responses = raw.responses || {};
        const okResponse = responses['200'] || responses['201'] || responses.default || {};
        const media = okResponse.content?.['application/json'] || okResponse.content?.['application/problem+json'];
        return normalizeSchema(media?.schema || raw.outputSchema || raw.output_schema || {});
    }
    return normalizeSchema(raw.outputSchema || raw.output_schema || raw.returns || raw.returnSchema || {});
}

function openApiOperationToInputSchema(operation = {}) {
    const properties = {};
    const required = [];
    for (const parameter of normalizeArray(operation.parameters)) {
        const name = normalizeString(parameter?.name);
        if (!name) {
            continue;
        }
        properties[name] = {
            ...(isPlainObject(parameter.schema) ? cloneJson(parameter.schema) : { type: 'string' }),
            description: normalizeString(parameter.description || parameter.summary)
        };
        if (parameter.required === true) {
            required.push(name);
        }
    }
    const jsonBody = operation.requestBody?.content?.['application/json']?.schema;
    if (isPlainObject(jsonBody)) {
        if (jsonBody.type === 'object' || jsonBody.properties) {
            Object.assign(properties, cloneJson(jsonBody.properties || {}));
            required.push(...normalizeArray(jsonBody.required).map(String));
        } else {
            properties.body = cloneJson(jsonBody);
            if (operation.requestBody.required) {
                required.push('body');
            }
        }
    }
    return normalizeSchema({
        type: 'object',
        required: [...new Set(required)],
        properties,
        additionalProperties: false
    });
}

function inferSourceType(raw = {}, options = {}) {
    const explicit = normalizeString(options.sourceType || raw.sourceType || raw.source_type || raw.kind);
    if (explicit) {
        return explicit;
    }
    if (raw.operationId || raw.requestBody || raw.responses || raw.method && raw.path) {
        return 'openapi_operation';
    }
    if (raw.app || raw.appName || raw.integration || raw.toolkit) {
        return 'composio_tool';
    }
    if (raw.server || raw.serverName || raw.inputSchema || raw.input_schema) {
        return 'mcp_tool';
    }
    if (raw.parameters || raw.output_schema) {
        return 'codex_tool';
    }
    if (raw.args_schema || raw.model_json_schema) {
        return 'pydantic_tool';
    }
    return 'generic_tool';
}

function sourceDefaults(sourceType = '') {
    if (sourceType === 'mcp_tool') {
        return {
            whenToUse: ['Use after the MCP server has passed initialize/tools-list/direct-spec smoke checks.'],
            whenNotToUse: ['Do not expose or call this tool if its MCP server failed smoke tests.'],
            smokeChecks: ['mcp_initialize', 'mcp_tools_list', 'mcp_direct_tool_specs']
        };
    }
    if (sourceType === 'openapi_operation') {
        return {
            whenToUse: ['Use when the official API endpoint is the right source of truth and required auth is configured.'],
            whenNotToUse: ['Do not use raw API operations for broad workflow goals until wrapped into a higher-level skill.'],
            smokeChecks: ['static_schema', 'auth_config_present']
        };
    }
    if (sourceType === 'composio_tool') {
        return {
            whenToUse: ['Use when the matching external application account/action is configured and the task asks for that app.'],
            whenNotToUse: ['Do not use for unrelated apps or destructive account actions without approval.'],
            smokeChecks: ['static_schema', 'auth_config_present', 'dry_run_if_available']
        };
    }
    if (sourceType === 'pydantic_tool' || sourceType === 'langchain_tool') {
        return {
            whenToUse: ['Use when the local typed tool exactly matches the task and its Python/JS dependencies are installed.'],
            whenNotToUse: ['Do not call if required local files, models, or dependencies are missing.'],
            smokeChecks: ['static_schema', 'valid_example']
        };
    }
    return {
        whenToUse: ['Use when the task matches the purpose and all preconditions are satisfied.'],
        whenNotToUse: ['Do not use when required parameters, permissions, or external configuration are missing.'],
        smokeChecks: ['static_schema']
    };
}

function buildSmokeProfile(contract = {}) {
    const checks = normalizeArray(contract.smokeProfile?.checks);
    if (checks.length) {
        return cloneJson(contract.smokeProfile);
    }
    const defaults = sourceDefaults(contract.source?.type || contract.sourceType).smokeChecks || ['static_schema'];
    return {
        id: `contract-smoke:${safeSegment(contract.id)}`,
        target: contract.id,
        exposePolicy: 'only_expose_after_contract_lint_and_smoke_pass',
        checks: defaults.map((id) => ({
            id,
            type: id,
            required: true
        }))
    };
}

function exampleValueForSchema(schema = {}, key = 'value') {
    if (!isPlainObject(schema)) {
        return `<${key}>`;
    }
    if (Array.isArray(schema.enum) && schema.enum.length) {
        return schema.enum[0];
    }
    if (schema.type === 'number' || schema.type === 'integer') {
        return schema.minimum ?? 1;
    }
    if (schema.type === 'boolean') {
        return true;
    }
    if (schema.type === 'array') {
        return [exampleValueForSchema(schema.items || {}, key)];
    }
    if (schema.type === 'object') {
        const out = {};
        for (const [childKey, childSchema] of Object.entries(schema.properties || {}).slice(0, 4)) {
            out[childKey] = exampleValueForSchema(childSchema, childKey);
        }
        return out;
    }
    if (/path|file/i.test(key)) {
        return `F:/path/to/${key}.txt`;
    }
    if (/url/i.test(key)) {
        return 'https://example.com/resource';
    }
    if (/query|search/i.test(key)) {
        return 'specific search query';
    }
    return `<${key}>`;
}

function generateExampleFromSchema(inputSchema = {}) {
    const properties = inputSchema.properties || {};
    const required = normalizeArray(inputSchema.required).map(String);
    const keys = required.length ? required : Object.keys(properties).slice(0, 4);
    const args = {};
    for (const key of keys) {
        args[key] = exampleValueForSchema(properties[key] || {}, key);
    }
    return keys.length ? [args] : [];
}

function applyKnownEnhancements(contract = {}) {
    const idText = `${contract.id} ${contract.name} ${contract.title}`.toLowerCase();
    if (/run[_-]?python[_-]?file|python.*file/.test(idText)) {
        const schema = normalizeSchema(contract.inputSchema);
        const properties = schema.properties || {};
        schema.properties = {
            path: {
                type: 'string',
                description: 'Existing local .py file path. This tool does not accept inline Python code.'
            },
            timeoutMs: properties.timeoutMs || {
                type: 'number',
                description: 'Execution timeout in milliseconds.'
            }
        };
        schema.required = ['path'];
        schema.additionalProperties = false;
        contract.inputSchema = schema;
        contract.preconditions = [
            ...new Set([
                ...normalizeArray(contract.preconditions),
                'path must point to an existing local .py file before the call.'
            ])
        ];
        contract.whenNotToUse = [
            ...new Set([
                ...normalizeArray(contract.whenNotToUse),
                'Do not pass inline Python code to this tool.',
                'Do not call before creating the .py file.'
            ])
        ];
        contract.examples = normalizeArray(contract.examples);
        if (!contract.examples.length) {
            contract.examples.push({
                path: 'F:/AILIS/tmp/solve.py',
                timeoutMs: 120000
            });
        }
        contract.badExamples = normalizeArray(contract.badExamples);
        if (!contract.badExamples.length) {
            contract.badExamples.push({
                code: 'print(1 + 1)'
            });
        }
        contract.alternatives = [
            ...new Set([
                ...normalizeArray(contract.alternatives),
                'If you only have inline code, use computer.exec with python -c.',
                'If you need a script file, first use computer.write to create it, then call this tool.'
            ])
        ];
        contract.errors = {
            ...(isPlainObject(contract.errors) ? contract.errors : {}),
            missing_existing_path: {
                recoverable: true,
                message: 'path must point to an existing local .py file',
                nextActions: ['create the .py file first', 'or use computer.exec python -c']
            }
        };
    }
    return contract;
}

function compileAilisContract(raw = {}, options = {}) {
    const sourceType = inferSourceType(raw, options);
    const defaults = sourceDefaults(sourceType);
    const name = normalizeString(
        options.name ||
            raw.name ||
            raw.id ||
            raw.operationId ||
            raw.action ||
            raw.tool ||
            raw.title,
        'unnamed_tool'
    );
    const server = normalizeString(options.server || raw.server || raw.serverName || raw.mcpServerName);
    const id = normalizeString(
        options.id ||
            raw.id ||
            (sourceType === 'mcp_tool' && server ? `mcp__${server}__${name}` : '') ||
            name,
        name
    );
    const description = normalizeString(
        options.description ||
            raw.description ||
            raw.summary ||
            raw.title ||
            raw.label ||
            ''
    );
    const inputSchema = pickInputSchema(raw, sourceType);
    const generatedExamples = generateExampleFromSchema(inputSchema);
    const contract = {
        schemaVersion: CONTRACT_INTAKE_VERSION,
        id: safeSegment(id.replace(/\s+/g, '_'), name),
        name,
        title: normalizeString(raw.title || raw.label || options.title, name),
        source: {
            type: sourceType,
            name: normalizeString(options.sourceName || raw.sourceName || raw.source || server || sourceType),
            url: normalizeString(options.sourceUrl || raw.sourceUrl || raw.url || raw.repositoryUrl || raw.docsUrl),
            rawToolName: normalizeString(raw.name || raw.tool || raw.operationId || name)
        },
        purpose: normalizeString(options.purpose || raw.purpose || description, description),
        description,
        whenToUse: [
            ...toSentenceList(raw.whenToUse || raw.when_to_use),
            ...defaults.whenToUse
        ].filter(Boolean),
        whenNotToUse: [
            ...toSentenceList(raw.whenNotToUse || raw.when_not_to_use),
            ...defaults.whenNotToUse
        ].filter(Boolean),
        preconditions: toSentenceList(raw.preconditions || raw.precondition),
        inputSchema,
        outputSchema: pickOutputSchema(raw, sourceType),
        examples: normalizeArray(raw.examples || raw.inputExamples || raw.input_examples),
        generatedExamples,
        badExamples: normalizeArray(raw.badExamples || raw.antiExamples || raw.bad_examples),
        alternatives: normalizeArray(raw.alternatives || raw.alternativeTools || raw.recoveryTools).map(String),
        errors: isPlainObject(raw.errors || raw.errorRecovery || raw.error_recovery)
            ? cloneJson(raw.errors || raw.errorRecovery || raw.error_recovery)
            : {},
        permissions: normalizeArray(raw.permissions || raw.permissionScopes || raw.scopes).map(String),
        risk: normalizeString(options.risk || raw.risk, 'medium'),
        readOnlyHint: raw.readOnlyHint === true,
        mutates: raw.mutates === true || raw.readOnlyHint === false || (raw.readOnlyHint !== true && /post|put|patch|delete/i.test(raw.method || '')),
        approval: normalizeString(options.approval || raw.approval, 'policy'),
        provenance: {
            importedAt: new Date().toISOString(),
            compiler: 'ailis_contract_compiler_v1',
            generatedExampleCount: generatedExamples.length
        }
    };
    const enhanced = applyKnownEnhancements(contract);
    enhanced.smokeProfile = buildSmokeProfile(enhanced);
    return enhanced;
}

function lintAilisContract(contract = {}, options = {}) {
    const minScore = Number(options.minScore || DEFAULT_MIN_SCORE);
    let score = 100;
    const issues = [];
    const fatal = [];
    const warnings = [];
    function penalize(points, code, message, severity = 'warning') {
        score -= points;
        const issue = { code, severity, points, message };
        issues.push(issue);
        if (severity === 'fatal') {
            fatal.push(issue);
        } else {
            warnings.push(issue);
        }
    }
    const schema = contract.inputSchema || {};
    const properties = schema.properties || {};
    const propertyKeys = Object.keys(properties);
    const required = normalizeArray(schema.required).map(String);
    if (!normalizeString(contract.id)) {
        penalize(35, 'missing_id', 'Contract id is required.', 'fatal');
    }
    if (!normalizeString(contract.purpose || contract.description)) {
        penalize(18, 'missing_purpose', 'Purpose/description is required.', 'fatal');
    } else if (normalizeString(contract.purpose || contract.description).length < 24) {
        penalize(8, 'thin_purpose', 'Purpose is too short for reliable model routing.');
    }
    if (!isPlainObject(schema) || schema.type !== 'object') {
        penalize(25, 'bad_input_schema', 'Input schema must be an object JSON Schema.', 'fatal');
    }
    if (!propertyKeys.length) {
        penalize(8, 'empty_properties', 'Input schema has no properties; verify this is really a no-argument tool.');
    }
    if (propertyKeys.length && !required.length) {
        penalize(15, 'missing_required', 'Input schema has properties but no required fields.');
    }
    if (schema.additionalProperties !== false) {
        penalize(8, 'loose_additional_properties', 'Set additionalProperties:false for model-facing strictness.');
    }
    const undocumented = propertyKeys.filter((key) => !normalizeString(properties[key]?.description));
    if (undocumented.length) {
        penalize(Math.min(10, undocumented.length * 2), 'undocumented_properties', `Properties missing descriptions: ${undocumented.join(', ')}`);
    }
    if (!normalizeArray(contract.whenToUse).length) {
        penalize(10, 'missing_when_to_use', 'Add whenToUse guidance.');
    }
    if (!normalizeArray(contract.whenNotToUse).length) {
        penalize(10, 'missing_when_not_to_use', 'Add whenNotToUse guidance.');
    }
    if (!normalizeArray(contract.preconditions).length && required.length) {
        penalize(8, 'missing_preconditions', 'Add preconditions for required parameters and external state.');
    }
    if (!normalizeArray(contract.examples).length && !normalizeArray(contract.generatedExamples).length) {
        penalize(10, 'missing_examples', 'Add at least one valid example.');
    } else if (!normalizeArray(contract.examples).length) {
        penalize(4, 'generated_examples_only', 'Only generated placeholder examples are present.');
    }
    if (!normalizeArray(contract.badExamples).length) {
        penalize(6, 'missing_bad_examples', 'Add bad examples for common misuse.');
    }
    if (!isPlainObject(contract.errors) || !Object.keys(contract.errors).length) {
        penalize(12, 'missing_error_recovery', 'Add structured error recovery guidance.');
    }
    if (!normalizeArray(contract.alternatives).length) {
        penalize(6, 'missing_alternatives', 'Add alternative tools or fallback route.');
    }
    if (!contract.smokeProfile?.checks?.length) {
        penalize(8, 'missing_smoke_profile', 'Add smoke checks before exposing the tool.');
    }
    if (!normalizeArray(contract.permissions).length) {
        penalize(4, 'missing_permissions', 'Declare permission/scope expectations.');
    }
    score = Math.max(0, Math.min(100, Math.round(score)));
    return {
        status: fatal.length || score < minScore ? 'rejected' : 'approved',
        score,
        minScore,
        approved: fatal.length === 0 && score >= minScore,
        issues,
        fatal,
        warnings
    };
}

function buildContractPromptCard(contract = {}, lint = null) {
    const quality = lint || lintAilisContract(contract);
    return [
        `AILIS TOOL CONTRACT ${contract.id}`,
        `source=${contract.source?.type || 'unknown'}; risk=${contract.risk || 'medium'}; mutates=${contract.mutates ? 'true' : 'false'}; quality=${quality.score}/${quality.minScore}; gate=${quality.status}`,
        `purpose=${normalizeString(contract.purpose || contract.description)}`,
        `when_to_use=${JSON.stringify(normalizeArray(contract.whenToUse).slice(0, 4))}`,
        `when_not_to_use=${JSON.stringify(normalizeArray(contract.whenNotToUse).slice(0, 4))}`,
        `preconditions=${JSON.stringify(normalizeArray(contract.preconditions).slice(0, 4))}`,
        `input_schema=${JSON.stringify(contract.inputSchema || {})}`,
        `examples=${JSON.stringify((normalizeArray(contract.examples).length ? contract.examples : contract.generatedExamples || []).slice(0, 2))}`,
        `bad_examples=${JSON.stringify(normalizeArray(contract.badExamples).slice(0, 2))}`,
        `alternatives=${JSON.stringify(normalizeArray(contract.alternatives).slice(0, 4))}`,
        `error_recovery=${JSON.stringify(contract.errors || {})}`
    ].join('\n');
}

function compileAndLintAilisContract(raw = {}, options = {}) {
    const contract = compileAilisContract(raw, options);
    const lint = lintAilisContract(contract, options);
    return {
        status: 'completed',
        contract,
        lint,
        promptCard: buildContractPromptCard(contract, lint)
    };
}

module.exports = {
    CONTRACT_INTAKE_VERSION,
    CONTRACT_SOURCE_PROFILES,
    DEFAULT_MIN_SCORE,
    compileAilisContract,
    lintAilisContract,
    compileAndLintAilisContract,
    buildContractPromptCard
};
