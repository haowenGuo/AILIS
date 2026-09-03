'use strict';

const { createHash } = require('node:crypto');

// Apache-2.0 source provenance:
// openai/codex tag rust-v0.145.0
// codex-rs/code-mode-protocol/src/description.rs
// codex-rs/core/src/tools/code_mode/{execute_spec.rs,wait_spec.rs}
// The user-facing exec description and grammar below are copied verbatim.

const PUBLIC_TOOL_NAME = 'exec';
const WAIT_TOOL_NAME = 'exec_wait';
const CODE_MODE_PRAGMA_PREFIX = '// @exec:';
const DEFAULT_EXEC_YIELD_TIME_MS = 10_000;
const DEFAULT_WAIT_YIELD_TIME_MS = 10_000;
const DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL = 10_000;
const MAX_JS_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MAX_CODE_MODE_PROFILES = 128;

const CODE_MODE_FREEFORM_GRAMMAR = String.raw`
start: pragma_source | plain_source
pragma_source: PRAGMA_LINE NEWLINE SOURCE
plain_source: SOURCE
PRAGMA_LINE: /[ \t]*\/\/ @exec:[^\r\n]*/
NEWLINE: /\r?\n/
SOURCE: /[\s\S]+/
`;

const DEFERRED_NESTED_TOOLS_GUIDANCE = 'Some deferred nested tools may be omitted from this description. They are still available on the global `tools` object and listed in `ALL_TOOLS`.\nTo find one, filter `ALL_TOOLS` by `name` and `description`.';

const EXEC_DESCRIPTION_TEMPLATE = `Run JavaScript code to orchestrate/compose tool calls
- Evaluates the provided JavaScript code in a fresh V8 isolate as an async module.
- All nested tools are available on the global \`tools\` object, for example \`await tools.exec_command(...)\`. Tool names are exposed as normalized JavaScript identifiers, for example \`await tools.mcp__ologs__get_profile(...)\`.
- Nested tool methods take either a string or an object as their input argument.
- Nested tools return either an object or a string, based on the description.
- Runs raw JavaScript -- no Node, no file system, no network access, no console.
- Accepts raw JavaScript source text, not JSON, quoted strings, or markdown code fences.
- You may optionally start the tool input with a first-line pragma like \`// @exec: {"yield_time_ms": 10000, "max_output_tokens": 1000}\`.
- \`yield_time_ms\` asks \`exec\` to yield early if the script is still running. Defaults to 10000 ms.
- \`max_output_tokens\` sets the token budget for direct \`exec\` results. Defaults to 10000 tokens.
- When the JS code is fully evaluated, the isolate's lifetime ends and unawaited promises are silently discarded.
- Global helpers:
- \`exit()\`: Immediately ends the current script successfully (like an early return from the top level).
- \`text(value: string | number | boolean | undefined | null)\`: Appends a text item. Non-string values are stringified with \`JSON.stringify(...)\` when possible.
- \`image(imageUrlOrItem: string | { image_url: string; detail?: "auto" | "low" | "high" | "original" | null } | ImageContent, detail?: "auto" | "low" | "high" | "original" | null)\`: Appends an image item. \`image_url\` should be a base64-encoded \`data:\` URL. To forward an MCP tool image, pass an individual \`ImageContent\` block from \`result.content\`, for example \`image(result.content[0])\`. MCP image blocks may request detail with \`_meta: { "codex/imageDetail": "original" }\`.
When provided, the second \`detail\` argument overrides any detail embedded in the first argument.
- \`audio(audioUrlOrItem: string | { audio_url: string } | AudioContent)\`: Appends an audio item. \`audio_url\` should be a base64-encoded \`data:\` URL. To forward an MCP tool audio block, pass an individual \`AudioContent\` block from \`result.content\`, for example \`audio(result.content[0])\`.
- \`generatedImage(result: { image_url: string; output_hint?: string })\`: Appends an image-generation result and its optional output hint. HTTP(S) URLs are not supported.
- \`store(key: string, value: any)\`: stores a serializable value under a string key for later \`exec\` calls in the same session.
- \`load(key: string)\`: returns the stored value for a string key, or \`undefined\` if it is missing.
- \`notify(value: string | number | boolean | undefined | null)\`: immediately injects an extra \`custom_tool_call_output\` for the current \`exec\` call. Values are stringified like \`text(...)\`.
- \`setTimeout(callback: () => void, delayMs?: number)\`: schedules a callback to run later and returns a timeout id. Pending timeouts do not keep \`exec\` alive by themselves; await an explicit promise if you need to wait for one.
- \`clearTimeout(timeoutId?: number)\`: cancels a timeout created by \`setTimeout\`.
- \`ALL_TOOLS\`: metadata for the enabled nested tools as \`{ name, description }\` entries.
- \`yield_control()\`: yields the accumulated output to the model immediately while the script keeps running.`;

const MCP_TYPESCRIPT_PREAMBLE = `type Role = "user" | "assistant";
type MetaObject = Record<string, unknown>;
type Annotations = {
  audience?: Role[];
  priority?: number;
  lastModified?: string;
};
type Icon = {
  src: string;
  mimeType?: string;
  sizes?: string[];
  theme?: "light" | "dark";
};
type TextResourceContents = {
  uri: string;
  mimeType?: string;
  _meta?: MetaObject;
  text: string;
};
type BlobResourceContents = {
  uri: string;
  mimeType?: string;
  _meta?: MetaObject;
  blob: string;
};
type TextContent = {
  type: "text";
  text: string;
  annotations?: Annotations;
  _meta?: MetaObject;
};
type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
  annotations?: Annotations;
  _meta?: MetaObject;
};
type AudioContent = {
  type: "audio";
  data: string;
  mimeType: string;
  annotations?: Annotations;
  _meta?: MetaObject;
};
type ResourceLink = {
  icons?: Icon[];
  name: string;
  title?: string;
  uri: string;
  description?: string;
  mimeType?: string;
  annotations?: Annotations;
  size?: number;
  _meta?: MetaObject;
  type: "resource_link";
};
type EmbeddedResource = {
  type: "resource";
  resource: TextResourceContents | BlobResourceContents;
  annotations?: Annotations;
  _meta?: MetaObject;
};
type ContentBlock =
  | TextContent
  | ImageContent
  | AudioContent
  | ResourceLink
  | EmbeddedResource;
type CallToolResult<TStructured = { [key: string]: unknown }> = {
  _meta?: MetaObject;
  content: ContentBlock[];
  isError?: boolean;
  structuredContent?: TStructured;
  [key: string]: unknown;
};`;

const WAIT_DESCRIPTION_TEMPLATE = `- Use \`exec_wait\` only after \`exec\` returns \`Script running with cell ID ...\`.
- \`cell_id\` identifies the running \`exec\` cell to resume.
- \`yield_time_ms\` controls how long to wait for more output before yielding again. Defaults to 10000 ms.
- \`max_tokens\` limits how much new output this wait call returns. Defaults to 10000 tokens.
- \`terminate: true\` stops the running cell; false or omitted waits for output.
- \`exec_wait\` returns only the new output since the last yield, or the final completion or termination result for that cell.
- If the cell is still running, \`exec_wait\` may yield again with the same \`cell_id\`.
- If the cell has already finished, \`exec_wait\` returns the completed result and closes the cell.`;

// Apache-2.0 source provenance for the nested built-in declarations below:
// openai/codex tag rust-v0.145.0
// codex-rs/core/src/tools/handlers/{shell_spec.rs,apply_patch_spec.rs,plan_spec.rs}
// These overrides are deliberately kept separate from AILIS' internal Gateway
// contracts: the Gateway may retain compatibility fields, while the model-facing
// code-mode ABI remains the same compact ABI that Codex documents.
const CODEX_EXEC_COMMAND_DESCRIPTION = `Runs a command in a PTY, returning output or a session ID for ongoing interaction.

Windows safety rules:
- Do not compose destructive filesystem commands across shells. Do not enumerate paths in PowerShell and then pass them to \`cmd /c\`, batch builtins, or another shell for deletion or moving. Use one shell end-to-end, prefer native PowerShell cmdlets such as \`Remove-Item\` / \`Move-Item\` with \`-LiteralPath\`, and avoid string-built shell commands for file operations.
- Before any recursive delete or move on Windows, verify the resolved absolute target paths stay within the intended workspace or explicitly named target directory. Never issue a recursive delete or move against a computed path if the final target has not been checked.
- When using \`Start-Process\` to launch a background helper or service, pass \`-WindowStyle Hidden\` unless the user explicitly asked for a visible interactive window. Use visible windows only for interactive tools the user needs to see or control.`;

const CODEX_EXEC_RESULT_SCHEMA = Object.freeze({
    type: 'object',
    properties: {
        chunk_id: {
            type: 'string',
            description: 'Chunk identifier included when the response reports one.'
        },
        wall_time_seconds: {
            type: 'number',
            description: 'Elapsed wall time spent waiting for output in seconds.'
        },
        exit_code: {
            type: 'number',
            description: 'Process exit code when the command finished during this call.'
        },
        session_id: {
            type: 'number',
            description: 'Session identifier to pass to write_stdin when the process is still running.'
        },
        original_token_count: {
            type: 'number',
            description: 'Approximate token count before output truncation.'
        },
        output: {
            type: 'string',
            description: 'Command output text, possibly truncated.'
        }
    },
    required: ['wall_time_seconds', 'output'],
    additionalProperties: false
});

const CODEX_EXEC_COMMAND_PARAMETERS = Object.freeze({
    type: 'object',
    properties: {
        cmd: {
            type: 'string',
            description: 'Shell command to execute.'
        },
        justification: {
            type: 'string',
            description: 'User-facing approval question for `require_escalated`; omit otherwise.'
        },
        login: {
            type: 'boolean',
            description: 'True runs the shell with -l/-i semantics; false disables them. Defaults to true.'
        },
        max_output_tokens: {
            type: 'number',
            description: 'Output token budget. Defaults to 10000 tokens; larger requests may be capped by policy.'
        },
        prefix_rule: {
            type: 'array',
            items: { type: 'string' },
            description: 'Reusable approval prefix for `cmd`, only with `sandbox_permissions: "require_escalated"`; for example ["git", "pull"].'
        },
        sandbox_permissions: {
            type: 'string',
            enum: ['use_default', 'require_escalated'],
            description: 'Per-command sandbox override. Defaults to `use_default`; use `require_escalated` for unsandboxed execution.'
        },
        shell: {
            type: 'string',
            description: "Shell binary to launch. Defaults to the user's default shell."
        },
        tty: {
            type: 'boolean',
            description: 'True allocates a PTY for the command; false or omitted uses plain pipes.'
        },
        workdir: {
            type: 'string',
            description: 'Working directory for the command. Defaults to the turn cwd.'
        },
        yield_time_ms: {
            type: 'number',
            description: 'Maximum time to wait before returning a session ID for a still-running command. Commands that finish sooner return immediately. For ordinary commands, omit this parameter to use the 10000 ms default. Effective range on Windows is 10000-30000 ms.'
        }
    },
    required: ['cmd'],
    additionalProperties: false
});

const CODEX_WRITE_STDIN_PARAMETERS = Object.freeze({
    type: 'object',
    properties: {
        chars: {
            type: 'string',
            description: 'Bytes to write to stdin. Defaults to empty, which polls without writing.'
        },
        max_output_tokens: {
            type: 'number',
            description: 'Output token budget. Defaults to 10000 tokens; larger requests may be capped by policy.'
        },
        session_id: {
            type: 'number',
            description: 'Identifier of the running unified exec session.'
        },
        yield_time_ms: {
            type: 'number',
            description: 'Wait before yielding output. Non-empty writes default to 250 ms and cap at 30000 ms; empty polls wait 5000-300000 ms by default.'
        }
    },
    required: ['session_id'],
    additionalProperties: false
});

const CODEX_UPDATE_PLAN_PARAMETERS = Object.freeze({
    type: 'object',
    properties: {
        explanation: {
            type: 'string',
            description: 'Optional explanation for this plan update.'
        },
        plan: {
            type: 'array',
            description: 'The list of steps',
            items: {
                type: 'object',
                properties: {
                    step: {
                        type: 'string',
                        description: 'Task step text.'
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'in_progress', 'completed'],
                        description: 'Step status.'
                    }
                },
                required: ['step', 'status'],
                additionalProperties: false
            }
        }
    },
    required: ['plan'],
    additionalProperties: false
});

const CODEX_NESTED_TOOL_OVERRIDES = Object.freeze({
    exec_command: Object.freeze({
        type: 'function',
        description: CODEX_EXEC_COMMAND_DESCRIPTION,
        parameters: CODEX_EXEC_COMMAND_PARAMETERS,
        output_schema: CODEX_EXEC_RESULT_SCHEMA
    }),
    write_stdin: Object.freeze({
        type: 'function',
        description: 'Writes characters to an existing unified exec session and returns recent output.',
        parameters: CODEX_WRITE_STDIN_PARAMETERS,
        output_schema: CODEX_EXEC_RESULT_SCHEMA
    }),
    apply_patch: Object.freeze({
        type: 'custom',
        description: 'The `apply_patch` tool can be used to edit files. This is a FREEFORM tool, so do not wrap the patch in JSON.',
        parameters: undefined,
        output_schema: undefined
    }),
    update_plan: Object.freeze({
        type: 'function',
        description: 'Updates the task plan.\nProvide an optional explanation and a list of plan items, each with a step and status.\nAt most one step can be in_progress at a time.',
        parameters: CODEX_UPDATE_PLAN_PARAMETERS,
        output_schema: undefined
    })
});

const codeModeProfiles = new Map();

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function normalizeCodeModeIdentifier(toolKey = '') {
    const chars = [...String(toolKey || '')];
    let identifier = '';
    chars.forEach((ch, index) => {
        const valid = index === 0
            ? ch === '_' || ch === '$' || /[A-Za-z]/.test(ch)
            : ch === '_' || ch === '$' || /[A-Za-z0-9]/.test(ch);
        identifier += valid ? ch : '_';
    });
    return identifier || '_';
}

function parseExecSource(input = '') {
    const source = String(input || '');
    if (!source.trim()) {
        throw new Error('exec expects raw JavaScript source text (non-empty). Provide JS only, optionally with first-line `// @exec: {"yield_time_ms": 10000, "max_output_tokens": 1000}`.');
    }
    const newline = source.indexOf('\n');
    const firstLine = newline >= 0 ? source.slice(0, newline).replace(/\r$/, '') : source;
    const rest = newline >= 0 ? source.slice(newline + 1) : '';
    const trimmed = firstLine.replace(/^\s+/, '');
    if (!trimmed.startsWith(CODE_MODE_PRAGMA_PREFIX)) {
        return { code: source, yield_time_ms: null, max_output_tokens: null };
    }
    if (!rest.trim()) {
        throw new Error('exec pragma must be followed by JavaScript source on subsequent lines');
    }
    const directive = trimmed.slice(CODE_MODE_PRAGMA_PREFIX.length).trim();
    if (!directive) {
        throw new Error('exec pragma must be a JSON object with supported fields `yield_time_ms` and `max_output_tokens`');
    }
    let value;
    try {
        value = JSON.parse(directive);
    } catch (error) {
        throw new Error(`exec pragma must be valid JSON with supported fields \`yield_time_ms\` and \`max_output_tokens\`: ${error.message}`);
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('exec pragma must be a JSON object with supported fields `yield_time_ms` and `max_output_tokens`');
    }
    for (const key of Object.keys(value)) {
        if (!['yield_time_ms', 'max_output_tokens'].includes(key)) {
            throw new Error(`exec pragma only supports \`yield_time_ms\` and \`max_output_tokens\`; got \`${key}\``);
        }
    }
    for (const key of ['yield_time_ms', 'max_output_tokens']) {
        if (value[key] !== undefined && (!Number.isSafeInteger(value[key]) || value[key] < 0 || value[key] > MAX_JS_SAFE_INTEGER)) {
            throw new Error(`exec pragma field \`${key}\` must be a non-negative safe integer`);
        }
    }
    return {
        code: rest,
        yield_time_ms: value.yield_time_ms ?? null,
        max_output_tokens: value.max_output_tokens ?? null
    };
}

function renderJsonSchemaLiteral(value) {
    try {
        return JSON.stringify(value);
    } catch {
        return 'unknown';
    }
}

function renderJsonSchemaPropertyName(name) {
    return normalizeCodeModeIdentifier(name) === name ? name : JSON.stringify(name);
}

function renderJsonSchemaArray(schema = {}) {
    if (schema.items !== undefined) {
        return `Array<${renderJsonSchemaToTypescript(schema.items)}>`;
    }
    if (Array.isArray(schema.prefixItems) && schema.prefixItems.length) {
        return `[${schema.prefixItems.map(renderJsonSchemaToTypescript).join(', ')}]`;
    }
    return 'unknown[]';
}

function renderJsonSchemaObjectProperty(name, value, required = []) {
    const optional = required.includes(name) ? '' : '?';
    return `${renderJsonSchemaPropertyName(name)}${optional}: ${renderJsonSchemaToTypescript(value)};`;
}

function renderJsonSchemaObject(schema = {}) {
    const required = Array.isArray(schema.required) ? schema.required.filter((item) => typeof item === 'string') : [];
    const properties = schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)
        ? schema.properties
        : {};
    const sorted = Object.entries(properties).sort(([left], [right]) => left.localeCompare(right));
    const hasDescriptions = sorted.some(([, value]) => typeof value?.description === 'string' && value.description);
    const additionalLine = () => {
        if (schema.additionalProperties === false) return '';
        if (schema.additionalProperties === true) return '[key: string]: unknown;';
        if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
            return `[key: string]: ${renderJsonSchemaToTypescript(schema.additionalProperties)};`;
        }
        return sorted.length ? '' : '[key: string]: unknown;';
    };
    if (hasDescriptions) {
        const lines = ['{'];
        for (const [name, value] of sorted) {
            if (typeof value?.description === 'string') {
                value.description.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => lines.push(`  // ${line}`));
            }
            lines.push(`  ${renderJsonSchemaObjectProperty(name, value, required)}`);
        }
        const extra = additionalLine();
        if (extra) lines.push(`  ${extra}`);
        lines.push('}');
        return lines.join('\n');
    }
    const lines = sorted.map(([name, value]) => renderJsonSchemaObjectProperty(name, value, required));
    const extra = additionalLine();
    if (extra) lines.push(extra);
    return lines.length ? `{ ${lines.join(' ')} }` : '{}';
}

function renderJsonSchemaToTypescript(schema) {
    if (schema === true) return 'unknown';
    if (schema === false) return 'never';
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return 'unknown';
    if (schema.const !== undefined) return renderJsonSchemaLiteral(schema.const);
    if (Array.isArray(schema.enum) && schema.enum.length) return schema.enum.map(renderJsonSchemaLiteral).join(' | ');
    for (const key of ['anyOf', 'oneOf']) {
        if (Array.isArray(schema[key]) && schema[key].length) return schema[key].map(renderJsonSchemaToTypescript).join(' | ');
    }
    if (Array.isArray(schema.allOf) && schema.allOf.length) return schema.allOf.map(renderJsonSchemaToTypescript).join(' & ');
    if (Array.isArray(schema.type)) {
        return schema.type.map((type) => renderJsonSchemaToTypescript({ ...schema, type })).join(' | ');
    }
    switch (schema.type) {
        case 'string': return 'string';
        case 'number':
        case 'integer': return 'number';
        case 'boolean': return 'boolean';
        case 'null': return 'null';
        case 'array': return renderJsonSchemaArray(schema);
        case 'object': return renderJsonSchemaObject(schema);
        default:
            if ('properties' in schema || 'additionalProperties' in schema || 'required' in schema) return renderJsonSchemaObject(schema);
            if ('items' in schema || 'prefixItems' in schema) return renderJsonSchemaArray(schema);
            return 'unknown';
    }
}

function mcpStructuredContentSchema(outputSchema) {
    if (!outputSchema || typeof outputSchema !== 'object' || Array.isArray(outputSchema)) return null;
    const properties = outputSchema.properties;
    if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return null;
    const content = properties.content;
    if (content?.type !== 'array' || !content.items || typeof content.items !== 'object' || content.items.type !== 'object') return null;
    if (properties.isError?.type !== 'boolean') return null;
    if (properties._meta?.type !== 'object') return null;
    return properties.structuredContent === undefined ? true : properties.structuredContent;
}

function adaptCodeModeToolSpec(spec = {}) {
    const name = String(spec.name || spec.function?.name || '');
    const override = CODEX_NESTED_TOOL_OVERRIDES[name];
    if (!override) return cloneJson(spec) || { ...spec };
    const adapted = {
        ...spec,
        ...override,
        name,
        x_ailis_dispatch_tool: spec.x_ailis_dispatch_tool || name
    };
    if (override.parameters === undefined) delete adapted.parameters;
    if (override.output_schema === undefined) delete adapted.output_schema;
    delete adapted.input_schema;
    delete adapted.inputSchema;
    delete adapted.outputSchema;
    return adapted;
}

function adaptCodeModeToolSpecs(specs = []) {
    return (Array.isArray(specs) ? specs : []).map(adaptCodeModeToolSpec);
}

function renderCodeModeToolDefinition(spec = {}) {
    const name = String(spec.name || spec.function?.name || '');
    const description = String(spec.description || spec.function?.description || name).trim();
    const freeform = spec.type === 'custom' || spec.type === 'freeform' || name === 'apply_patch';
    const inputName = freeform ? 'input' : 'args';
    const inputType = freeform
        ? 'string'
        : renderJsonSchemaToTypescript(spec.parameters || spec.input_schema || spec.inputSchema || true);
    const outputSchema = spec.output_schema || spec.outputSchema;
    const structuredContentSchema = mcpStructuredContentSchema(outputSchema);
    const renderedStructuredContent = structuredContentSchema == null
        ? null
        : renderJsonSchemaToTypescript(structuredContentSchema);
    const outputType = structuredContentSchema == null
        ? renderJsonSchemaToTypescript(outputSchema || true)
        : renderedStructuredContent === 'unknown'
            ? 'CallToolResult'
            : `CallToolResult<${renderedStructuredContent}>`;
    const globalName = normalizeCodeModeIdentifier(name);
    const heading = globalName === name ? `### \`${globalName}\`` : `### \`${globalName}\` (\`${name}\`)`;
    return `${heading}\n${description}\n\nexec tool declaration:\n\`\`\`ts\ndeclare const tools: { ${globalName}(${inputName}: ${inputType}): Promise<${outputType}>; };\n\`\`\``;
}

function buildExecToolDescription(enabledTools = [], { deferredTools = [], defaultYieldTimeMs = DEFAULT_EXEC_YIELD_TIME_MS } = {}) {
    const adaptedEnabledTools = adaptCodeModeToolSpecs(enabledTools);
    const adaptedDeferredTools = adaptCodeModeToolSpecs(deferredTools);
    const sections = [EXEC_DESCRIPTION_TEMPLATE.replace('Defaults to 10000 ms.', `Defaults to ${defaultYieldTimeMs} ms.`)];
    if (adaptedDeferredTools.length) sections.push(DEFERRED_NESTED_TOOLS_GUIDANCE);
    if ([...adaptedEnabledTools, ...adaptedDeferredTools]
        .some((tool) => mcpStructuredContentSchema(tool.output_schema || tool.outputSchema) != null)) {
        sections.push(`Shared MCP Types:\n\`\`\`ts\n${MCP_TYPESCRIPT_PREAMBLE}\n\`\`\``);
    }
    if (adaptedEnabledTools.length) sections.push(adaptedEnabledTools.map(renderCodeModeToolDefinition).join('\n\n'));
    return sections.join('\n\n');
}

function registerCodeModeProfile(enabledTools = []) {
    const tools = cloneJson(adaptCodeModeToolSpecs(enabledTools)) || [];
    const digest = createHash('sha256').update(JSON.stringify(tools)).digest('hex').slice(0, 24);
    const profileId = `code-mode-${digest}`;
    codeModeProfiles.delete(profileId);
    codeModeProfiles.set(profileId, tools);
    while (codeModeProfiles.size > MAX_CODE_MODE_PROFILES) {
        codeModeProfiles.delete(codeModeProfiles.keys().next().value);
    }
    return profileId;
}

function getCodeModeProfile(profileId = '') {
    return cloneJson(codeModeProfiles.get(String(profileId || ''))) || [];
}

function createExecToolSpec(enabledTools = [], options = {}) {
    const adaptedTools = adaptCodeModeToolSpecs(enabledTools);
    const profileId = registerCodeModeProfile(adaptedTools);
    return {
        type: 'custom',
        name: PUBLIC_TOOL_NAME,
        description: buildExecToolDescription(adaptedTools, options),
        format: {
            type: 'grammar',
            syntax: 'lark',
            definition: CODE_MODE_FREEFORM_GRAMMAR
        },
        parameters: {
            type: 'object',
            required: ['input'],
            properties: { input: { type: 'string', minLength: 1 } },
            additionalProperties: false
        },
        x_ailis_code_mode_profile: profileId
    };
}

function createExecWaitToolSpec() {
    return {
        type: 'function',
        name: WAIT_TOOL_NAME,
        description: `Waits on a yielded \`exec\` cell and returns new output or completion.\n${WAIT_DESCRIPTION_TEMPLATE}`,
        strict: false,
        parameters: {
            type: 'object',
            required: ['cell_id'],
            properties: {
                cell_id: { type: 'string', description: 'Identifier of the running exec cell.' },
                yield_time_ms: { type: 'number', description: 'Wait before yielding more output. Defaults to 10000 ms.' },
                max_tokens: { type: 'number', description: 'Output token budget for this wait call. Defaults to 10000 tokens.' },
                terminate: { type: 'boolean', description: 'True stops the running exec cell; false or omitted waits for output.' }
            },
            additionalProperties: false
        }
    };
}

module.exports = {
    CODEX_EXEC_COMMAND_DESCRIPTION,
    CODEX_EXEC_COMMAND_PARAMETERS,
    CODEX_EXEC_RESULT_SCHEMA,
    CODEX_NESTED_TOOL_OVERRIDES,
    CODEX_UPDATE_PLAN_PARAMETERS,
    CODEX_WRITE_STDIN_PARAMETERS,
    CODE_MODE_FREEFORM_GRAMMAR,
    DEFAULT_EXEC_YIELD_TIME_MS,
    DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL,
    DEFAULT_WAIT_YIELD_TIME_MS,
    EXEC_DESCRIPTION_TEMPLATE,
    PUBLIC_TOOL_NAME,
    WAIT_TOOL_NAME,
    adaptCodeModeToolSpec,
    adaptCodeModeToolSpecs,
    buildExecToolDescription,
    createExecToolSpec,
    createExecWaitToolSpec,
    getCodeModeProfile,
    normalizeCodeModeIdentifier,
    parseExecSource,
    renderJsonSchemaToTypescript
};
