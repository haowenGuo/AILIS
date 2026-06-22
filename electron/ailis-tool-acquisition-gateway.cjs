const fsp = require('fs/promises');
const path = require('path');
const { createHash } = require('crypto');
const { spawn } = require('child_process');
const { listToolContractSummaries } = require('./ailis-tool-contracts.cjs');
const { listAILISSkills } = require('./ailis-skills.cjs');
const {
    CONTRACT_SOURCE_PROFILES,
    compileAndLintAilisContract,
    lintAilisContract,
    buildContractPromptCard
} = require('./ailis-contract-compiler.cjs');
const {
    STANDARD_TOOL_PACKS,
    listStandardToolPacks,
    searchStandardToolPacks,
    collectStandardToolPackContracts,
    collectStandardToolPackAuthProfiles,
    publicReadonlyOpenApiOperationsFromStandardPacks
} = require('./ailis-standard-tool-packs.cjs');

const OFFICIAL_MCP_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0/servers';
const LEARNING_SCHEMA_VERSION = 1;
const EXTERNAL_EXPOSURE_VERSION = 1;
const EXTERNAL_AUTH_PROFILE_VERSION = 1;
const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';
const LOCAL_ADAPTER_OUTPUT_LIMIT = 10 * 1024 * 1024;
const LOCAL_DOCUMENT_ADAPTERS = Object.freeze({
    docling_convert_document: Object.freeze({
        id: 'local_docling_converter',
        type: 'local_document_converter',
        runtime: 'python',
        packageName: 'docling',
        importName: 'docling',
        commandEnvVar: 'AILIS_PYTHON',
        outputFormat: 'markdown'
    }),
    markitdown_convert_document: Object.freeze({
        id: 'local_markitdown_converter',
        type: 'local_document_converter',
        runtime: 'python',
        packageName: 'markitdown',
        importName: 'markitdown',
        commandEnvVar: 'AILIS_PYTHON',
        outputFormat: 'markdown'
    }),
    python_document_extract: Object.freeze({
        id: 'local_python_document_extractor',
        type: 'local_document_converter',
        runtime: 'python',
        packageName: 'python-docx,pypdf',
        importNames: Object.freeze(['docx', 'pypdf']),
        commandEnvVar: 'AILIS_PYTHON',
        outputFormat: 'markdown'
    })
});

const CORE_TOOL_BUNDLES = Object.freeze([
    Object.freeze({
        id: 'core:file_system',
        label: '文件系统',
        category: 'file',
        description: 'Read, write, search, hash, copy, move, delete, and verify local files through the computer/file tools.',
        toolIds: Object.freeze(['computer', 'file_manager', 'read', 'write', 'apply_patch']),
        skillIds: Object.freeze(['file_manager']),
        keywords: Object.freeze(['file', 'folder', 'directory', 'read', 'write', 'search', 'copy', 'move', 'delete', '文件', '目录', '读取', '整理']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'computer_list_workspace', tool: 'computer', action: 'list', mutates: false }),
                Object.freeze({ id: 'file_manager_plan', tool: 'file_manager', action: 'plan', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:command_line',
        label: '命令行与 PTY',
        category: 'command',
        description: 'Run shell commands, long-running sessions, PTY interaction, stdin writes, process reads, and permission-gated execution.',
        toolIds: Object.freeze(['computer', 'exec', 'request_permissions']),
        skillIds: Object.freeze(['computer']),
        keywords: Object.freeze(['shell', 'terminal', 'cmd', 'powershell', 'bash', 'pty', 'stdin', 'command', '命令行', '终端', '执行']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'exec_echo', tool: 'computer', action: 'exec_command', mutates: false }),
                Object.freeze({ id: 'session_roundtrip', tool: 'computer', action: 'session_start/process_read/process_write', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:browser',
        label: '浏览器与网页',
        category: 'browser',
        description: 'Use browser-facing MCP/direct tools for web search, fetch, page inspection, screenshots, and web task evidence.',
        toolIds: Object.freeze(['tool_search', 'mcp_bridge', 'vision.capture_context']),
        skillIds: Object.freeze(['mcp_bridge']),
        keywords: Object.freeze(['browser', 'web', 'search', 'fetch', 'html', 'page', 'screenshot', '网页', '浏览器', '搜索', '抓取']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'tool_search_web', tool: 'tool_search', action: 'search', mutates: false }),
                Object.freeze({ id: 'mcp_web_specs', tool: 'mcp_bridge', action: 'search_tools', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:git',
        label: 'Git 与代码版本',
        category: 'git',
        description: 'Inspect status/diff, commit, create PR plans, and verify repository changes through the code/computer tools.',
        toolIds: Object.freeze(['code', 'computer', 'apply_patch']),
        skillIds: Object.freeze(['code']),
        keywords: Object.freeze(['git', 'diff', 'commit', 'branch', 'pr', 'ci', 'repository', '仓库', '提交', '分支']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'git_status', tool: 'code', action: 'git_status', mutates: false }),
                Object.freeze({ id: 'git_diff', tool: 'code', action: 'git_diff', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:python',
        label: 'Python 执行',
        category: 'python',
        description: 'Run Python scripts for data processing, validation, document parsing, tests, and one-off automation.',
        toolIds: Object.freeze(['computer', 'code']),
        skillIds: Object.freeze(['code']),
        keywords: Object.freeze(['python', 'script', 'notebook', 'data', 'pandas', 'numpy', '脚本', '数据处理']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'python_version', tool: 'computer', action: 'exec_command', mutates: false }),
                Object.freeze({ id: 'code_test', tool: 'code', action: 'test', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:document_parse',
        label: '文档解析',
        category: 'document',
        description: 'Parse, verify, and summarize PDF, Markdown, JSON, CSV, spreadsheet, and common document artifacts.',
        toolIds: Object.freeze(['artifact_verifier', 'computer', 'mcp_bridge']),
        skillIds: Object.freeze(['mcp_bridge']),
        keywords: Object.freeze(['pdf', 'docx', 'xlsx', 'csv', 'markdown', 'document', 'parse', 'extract', '文档', '表格', '解析']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'artifact_verifier_schema', tool: 'artifact_verifier', action: 'schema', mutates: false }),
                Object.freeze({ id: 'document_mcp_search', tool: 'tool_search', action: 'search', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:media',
        label: '音视频与多媒体',
        category: 'media',
        description: 'Handle audio/video/image metadata, transcription/OCR-adjacent workflows, downloads, and conversion through Python or MCP tools.',
        toolIds: Object.freeze(['computer', 'mcp_bridge', 'tool_search']),
        skillIds: Object.freeze(['mcp_bridge']),
        keywords: Object.freeze(['audio', 'video', 'image', 'ffmpeg', 'transcribe', 'media', '音频', '视频', '图片', '转写']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'media_tool_search', tool: 'tool_search', action: 'search', mutates: false }),
                Object.freeze({ id: 'python_media_probe', tool: 'computer', action: 'exec_command', mutates: false })
            ])
        })
    }),
    Object.freeze({
        id: 'core:ocr',
        label: 'OCR 与视觉读屏',
        category: 'ocr',
        description: 'Read visible UI/screenshots and route OCR-heavy tasks to vision or installable document/image MCP tools.',
        toolIds: Object.freeze(['vision.capture_context', 'tool_search', 'mcp_bridge']),
        skillIds: Object.freeze(['vision']),
        keywords: Object.freeze(['ocr', 'vision', 'screenshot', 'screen', 'image text', '识别', '截图', '屏幕', '文字识别']),
        smokeProfile: Object.freeze({
            checks: Object.freeze([
                Object.freeze({ id: 'vision_capture_contract', tool: 'vision.capture_context', action: 'capture_context', mutates: false }),
                Object.freeze({ id: 'ocr_mcp_search', tool: 'tool_search', action: 'search', mutates: false })
            ])
        })
    })
]);

const BUILTIN_PUBLIC_OPENAPI_OPERATIONS = Object.freeze([
    Object.freeze({
        operationId: 'clinicalTrialsGetStudy',
        method: 'get',
        path: '/api/v2/studies/{nctId}',
        baseUrl: 'https://clinicaltrials.gov',
        sourceName: 'clinicaltrials',
        summary: 'Get a ClinicalTrials.gov study record by NCT id, including actual enrollment count and structured study fields.',
        parameters: Object.freeze([
            Object.freeze({
                name: 'nctId',
                in: 'path',
                required: true,
                schema: Object.freeze({ type: 'string' }),
                description: 'ClinicalTrials.gov NCT identifier, for example NCT03411733.'
            })
        ]),
        whenToUse: Object.freeze([
            'Use for structured ClinicalTrials.gov study records, actual enrollment count, phase, status, dates, and NCT-specific fields.'
        ]),
        whenNotToUse: Object.freeze([
            'Do not use for broad medical web search or non-ClinicalTrials.gov pages.'
        ]),
        preconditions: Object.freeze(['The NCT id is known or can be found from prior evidence.']),
        examples: Object.freeze([Object.freeze({ nctId: 'NCT03411733' })]),
        badExamples: Object.freeze([Object.freeze({ query: 'H pylori acne' })]),
        alternatives: Object.freeze(['Use web_search/web_fetch only to discover the NCT id, then use this structured API.']),
        errors: Object.freeze({
            not_found: Object.freeze({
                recoverable: false
            })
        }),
        permissions: Object.freeze(['clinicaltrials.read'])
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
    return Array.isArray(value) ? value : [value];
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

function safeSegment(value, fallback = 'item') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90) || fallback;
}

function safeToolSegment(value, fallback = 'item') {
    return normalizeString(value, fallback)
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 80) || fallback;
}

function splitToolSegment(value = '') {
    return safeToolSegment(value, '')
        .split('_')
        .map((part) => part.trim())
        .filter(Boolean);
}

function stripProviderPrefix(toolSegment = '', providerSegment = '') {
    const tool = safeToolSegment(toolSegment, 'tool');
    const provider = safeToolSegment(providerSegment, 'external');
    const providerCompact = provider.replace(/_/g, '');
    const parts = splitToolSegment(tool);
    let compactPrefix = '';
    for (let index = 0; index < parts.length - 1; index += 1) {
        compactPrefix += parts[index];
        if (compactPrefix === providerCompact) {
            return parts.slice(index + 1).join('_') || tool;
        }
    }
    return tool.startsWith(`${provider}_`) ? tool.slice(provider.length + 1) || tool : tool;
}

function inferHostProvider(value = '') {
    const text = normalizeString(value);
    if (!text) {
        return '';
    }
    try {
        const url = new URL(text.includes('://') ? text : `https://${text}`);
        const host = url.hostname.replace(/^www\./i, '');
        const first = host.split('.').find(Boolean);
        return safeToolSegment(first, '');
    } catch {
        return '';
    }
}

function inferExternalProviderSegment(exposure = {}) {
    const source = exposure.source || {};
    const explicit = normalizeString(source.provider || source.service || source.name || exposure.provider);
    if (explicit && !['external', 'generic_tool', 'openapi_operation', 'composio_tool'].includes(explicit)) {
        return safeToolSegment(explicit, 'external');
    }
    return inferHostProvider(source.baseUrl || source.url || source.sourceUrl) ||
        safeToolSegment(explicit || source.type || 'external', 'external');
}

function inferExternalToolSegment(exposure = {}, providerSegment = '') {
    const raw = normalizeString(
        exposure.virtualName ||
            exposure.toolId ||
            exposure.contract?.id ||
            exposure.contract?.name ||
            exposure.modelFacing?.name ||
            exposure.name ||
            exposure.title,
        'tool'
    );
    return stripProviderPrefix(safeToolSegment(raw, 'tool'), providerSegment);
}

function createExternalVirtualToolId(exposure = {}) {
    const provider = inferExternalProviderSegment(exposure);
    const tool = inferExternalToolSegment(exposure, provider);
    return `external__${provider}__${tool}`;
}

function isExternalVirtualToolId(value = '') {
    return /^external__[a-z0-9_]+__[a-z0-9_]+$/.test(normalizeString(value));
}

function sampleArgsFromSchema(schema = {}) {
    const properties = schema?.properties && typeof schema.properties === 'object' ? schema.properties : {};
    const required = Array.isArray(schema?.required) ? schema.required : Object.keys(properties).slice(0, 4);
    const sample = {};
    for (const name of required.slice(0, 8)) {
        if (!name || typeof name !== 'string') {
            continue;
        }
        const prop = properties[name] || {};
        if (prop.default !== undefined) {
            sample[name] = prop.default;
        } else if (Array.isArray(prop.examples) && prop.examples.length) {
            sample[name] = prop.examples[0];
        } else if (Array.isArray(prop.enum) && prop.enum.length) {
            sample[name] = prop.enum[0];
        } else {
            sample[name] = `<${name}>`;
        }
    }
    return sample;
}

async function readJsonFile(filePath, fallback) {
    try {
        const raw = await fsp.readFile(filePath, 'utf8');
        return JSON.parse(raw || '{}');
    } catch {
        return fallback;
    }
}

async function writeJsonFileAtomic(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(tmpPath, filePath);
}

function tokenize(text = '') {
    return String(text || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_@./:-]+/gu, ' ')
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2);
}

function stableTaskSignature(text = '') {
    const terms = [...new Set(tokenize(text))].sort().slice(0, 24);
    if (!terms.length) {
        return '';
    }
    return createHash('sha256').update(terms.join(' ')).digest('hex').slice(0, 16);
}

function scoreText(query = '', text = '') {
    const terms = tokenize(query);
    if (!terms.length) {
        return 0;
    }
    const haystack = String(text || '').toLowerCase();
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function redactHeaders(headers = {}) {
    const redacted = {};
    for (const [key, value] of Object.entries(headers || {})) {
        if (/authorization|token|api[_-]?key|secret|cookie/i.test(key)) {
            redacted[key] = '__REDACTED__';
        } else {
            redacted[key] = String(value);
        }
    }
    return redacted;
}

function extractResponseHeaders(headers) {
    const wanted = new Set([
        'retry-after',
        'x-ratelimit-limit',
        'x-ratelimit-remaining',
        'x-ratelimit-reset',
        'x-rate-limit-limit',
        'x-rate-limit-remaining',
        'x-rate-limit-reset'
    ]);
    const result = {};
    if (!headers?.forEach) {
        return result;
    }
    headers.forEach((value, key) => {
        const lower = String(key).toLowerCase();
        if (wanted.has(lower)) {
            result[lower] = value;
        }
    });
    return result;
}

function classifyHttpFailure(status, exposure = {}, responseHeaders = {}) {
    const provider = normalizeString(exposure.source?.name || exposure.provider || exposure.source?.provider || exposure.toolId || 'external_api');
    if (status === 429) {
        return {
            reason: 'rate_limited',
            message: `${provider} returned HTTP 429 rate limit. Do not retry in a tight loop.`,
            retryAfter: responseHeaders['retry-after'] || '',
            nextActions: [
                'Switch to an alternate structured source if one is available.',
                'Use an authenticated API profile when the provider supports one.',
                'Retry only after the provider rate-limit window resets.'
            ]
        };
    }
    if (status === 403) {
        return {
            reason: 'forbidden_or_blocked',
            message: `${provider} returned HTTP 403 forbidden. This is usually access policy, bot protection, missing auth, or a blocked endpoint, not a query wording problem.`,
            nextActions: [
                'Switch to an official API or mirrored structured source.',
                'Use an authenticated profile when the task requires this provider.',
                'Do not keep rewriting the same web request against the blocked endpoint.'
            ]
        };
    }
    if (status === 401) {
        return {
            reason: 'authentication_required',
            message: `${provider} returned HTTP 401 authentication required.`,
            nextActions: ['Configure the required auth profile, then rerun smoke before exposing as callable.']
        };
    }
    if (status >= 500) {
        return {
            reason: 'provider_unavailable',
            message: `${provider} returned HTTP ${status}. Treat this as provider/server instability.`,
            nextActions: ['Retry once with backoff, then switch source if the task can be solved another way.']
        };
    }
    if (status >= 400) {
        return {
            reason: 'http_client_error',
            message: `${provider} returned HTTP ${status}. Check required parameters and endpoint access policy before retrying.`,
            nextActions: ['Inspect the response body for parameter errors.', 'Avoid repeated equivalent retries.']
        };
    }
    return null;
}

function inferLocalDocumentAdapter(raw = {}, requestedAdapter = {}) {
    const requestedType = normalizeString(requestedAdapter.type || requestedAdapter.id);
    if (requestedType === 'local_document_converter' || /^local_(docling|markitdown)_converter$/.test(requestedType)) {
        return {
            ...requestedAdapter,
            id: normalizeString(requestedAdapter.id, requestedType),
            type: 'local_document_converter',
            runtime: normalizeString(requestedAdapter.runtime, 'python'),
            packageName: normalizeString(requestedAdapter.packageName || requestedAdapter.package || requestedAdapter.dependency),
            importName: normalizeString(requestedAdapter.importName || requestedAdapter.import || requestedAdapter.packageName || requestedAdapter.package),
            importNames: normalizeArray(requestedAdapter.importNames || requestedAdapter.requiredImports || requestedAdapter.imports).map(String).filter(Boolean),
            commandEnvVar: normalizeString(requestedAdapter.commandEnvVar || requestedAdapter.pythonEnvVar, 'AILIS_PYTHON')
        };
    }
    const key = normalizeString(raw.toolId || raw.id || raw.name || raw.operationId).toLowerCase();
    const adapter = LOCAL_DOCUMENT_ADAPTERS[key];
    return adapter ? cloneJson(adapter) : null;
}

function localAdapterCommand(adapter = {}) {
    const envVar = normalizeString(adapter.commandEnvVar, 'AILIS_PYTHON');
    return normalizeString(envVar && process.env[envVar], normalizeString(adapter.command, 'python'));
}

function runProcessCapture(command, args = [], { timeoutMs = 30000, cwd = '', env = {}, maxOutputBytes = LOCAL_ADAPTER_OUTPUT_LIMIT } = {}) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: cwd || undefined,
            env: {
                ...process.env,
                ...env
            },
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        let killedForOutput = false;
        const timer = setTimeout(() => {
            child.kill();
        }, Math.max(1000, Number(timeoutMs) || 30000));
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString('utf8');
            if (Buffer.byteLength(stdout, 'utf8') > maxOutputBytes) {
                killedForOutput = true;
                child.kill();
            }
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString('utf8');
            if (Buffer.byteLength(stderr, 'utf8') > maxOutputBytes) {
                killedForOutput = true;
                child.kill();
            }
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            resolve({
                status: 'spawn_error',
                ok: false,
                exitCode: null,
                stdout,
                stderr,
                error: error?.message || String(error)
            });
        });
        child.on('close', (code, signal) => {
            clearTimeout(timer);
            resolve({
                status: killedForOutput ? 'output_limit_exceeded' : code === 0 ? 'completed' : 'process_failed',
                ok: code === 0 && !killedForOutput,
                exitCode: code,
                signal,
                stdout,
                stderr
            });
        });
    });
}

function pythonImportProbeSource() {
    return [
        'import importlib.util, sys',
        'name = sys.argv[1]',
        'sys.exit(0 if importlib.util.find_spec(name) else 2)'
    ].join('\n');
}

function markitdownConvertSource() {
    return [
        'import json, os, sys, traceback',
        'path = sys.argv[1]',
        'try:',
        '    from markitdown import MarkItDown',
        '    converter = MarkItDown()',
        '    result = converter.convert(path)',
        '    text = getattr(result, "text_content", "") or str(result)',
        '    payload = {"ok": True, "format": "markdown", "text": text, "tables": [], "metadata": {"converter": "markitdown", "source_path": os.path.abspath(path)}}',
        '    print(json.dumps(payload, ensure_ascii=False))',
        'except Exception as exc:',
        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',
        '    sys.exit(1)'
    ].join('\n');
}

function doclingConvertSource() {
    return [
        'import json, os, sys, traceback',
        'path = sys.argv[1]',
        'output_format = sys.argv[2] if len(sys.argv) > 2 else "markdown"',
        'try:',
        '    from docling.document_converter import DocumentConverter',
        '    result = DocumentConverter().convert(path)',
        '    doc = result.document',
        '    text = ""',
        '    data = None',
        '    tables = []',
        '    if output_format == "json":',
        '        if hasattr(doc, "export_to_dict"):',
        '            data = doc.export_to_dict()',
        '        text = json.dumps(data if data is not None else {}, ensure_ascii=False)',
        '    elif hasattr(doc, "export_to_markdown"):',
        '        text = doc.export_to_markdown()',
        '    elif hasattr(doc, "export_to_text"):',
        '        text = doc.export_to_text()',
        '    else:',
        '        text = str(doc)',
        '    if hasattr(doc, "tables"):',
        '        tables = [str(table) for table in list(getattr(doc, "tables") or [])[:50]]',
        '    payload = {"ok": True, "format": output_format, "text": text, "tables": tables, "metadata": {"converter": "docling", "source_path": os.path.abspath(path)}}',
        '    if data is not None:',
        '        payload["document"] = data',
        '    print(json.dumps(payload, ensure_ascii=False))',
        'except Exception as exc:',
        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',
        '    sys.exit(1)'
    ].join('\n');
}

function pythonDocumentExtractSource() {
    return [
        'import csv, json, os, sys, traceback',
        'path = sys.argv[1]',
        'ext = os.path.splitext(path)[1].lower()',
        'try:',
        '    text_parts = []',
        '    tables = []',
        '    if ext == ".docx":',
        '        import docx',
        '        document = docx.Document(path)',
        '        for paragraph in document.paragraphs:',
        '            value = paragraph.text.strip()',
        '            if value:',
        '                text_parts.append(value)',
        '        for table_index, table in enumerate(document.tables):',
        '            rows = []',
        '            text_parts.append("")',
        '            text_parts.append(f"Table {table_index + 1}")',
        '            for row in table.rows:',
        '                values = [cell.text.strip().replace("\\n", " ") for cell in row.cells]',
        '                rows.append(values)',
        '                text_parts.append(" | ".join(values))',
        '            tables.append({"index": table_index, "rows": rows})',
        '    elif ext == ".pdf":',
        '        from pypdf import PdfReader',
        '        reader = PdfReader(path)',
        '        for index, page in enumerate(reader.pages):',
        '            text_parts.append(f"Page {index + 1}")',
        '            text_parts.append(page.extract_text() or "")',
        '    elif ext in [".txt", ".md", ".csv", ".tsv", ".html", ".htm", ".json"]:',
        '        with open(path, "r", encoding="utf-8", errors="replace") as handle:',
        '            text_parts.append(handle.read())',
        '        if ext in [".csv", ".tsv"]:',
        '            delimiter = "\\t" if ext == ".tsv" else ","',
        '            with open(path, "r", encoding="utf-8", errors="replace", newline="") as handle:',
        '                tables.append({"index": 0, "rows": list(csv.reader(handle, delimiter=delimiter))})',
        '    else:',
        '        raise RuntimeError(f"unsupported format for python_document_extract: {ext}")',
        '    payload = {"ok": True, "format": "markdown", "text": "\\n".join(text_parts), "tables": tables, "metadata": {"converter": "python_document_extract", "source_path": os.path.abspath(path), "extension": ext}}',
        '    print(json.dumps(payload, ensure_ascii=False))',
        'except Exception as exc:',
        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',
        '    sys.exit(1)'
    ].join('\n');
}

function pickServerUrl(raw = {}, args = {}) {
    const servers = normalizeArray(raw.servers || raw.server);
    const serverUrl = servers
        .map((entry) => typeof entry === 'string' ? entry : entry?.url)
        .map((entry) => normalizeString(entry))
        .find(Boolean);
    return normalizeString(
        args.baseUrl ||
            args.baseURL ||
            raw.baseUrl ||
            raw.baseURL ||
            raw.serverUrl ||
            raw.serverURL ||
            raw.server_url ||
            serverUrl
    );
}

function normalizeOpenApiParameterLocations(parameters = []) {
    const locations = {};
    for (const parameter of normalizeArray(parameters)) {
        const name = normalizeString(parameter?.name);
        if (!name) {
            continue;
        }
        locations[name] = normalizeString(parameter.in, 'query').toLowerCase();
    }
    return locations;
}

function firstString(...values) {
    for (const value of values) {
        const text = normalizeString(value);
        if (text) {
            return text;
        }
    }
    return '';
}

function inferComposioToolSlug(raw = {}) {
    return firstString(
        raw.toolSlug,
        raw.tool_slug,
        raw.slug,
        raw.actionSlug,
        raw.action_slug,
        raw.name,
        raw.id,
        raw.operationId
    );
}

function normalizeAuthType(value = '', provider = '') {
    const explicit = normalizeString(value).toLowerCase().replace(/[-\s]+/g, '_');
    if (explicit) {
        return explicit;
    }
    const source = normalizeString(provider).toLowerCase();
    if (source.includes('composio')) {
        return 'composio_api_key_env';
    }
    return 'none';
}

function redactUrlSecret(urlText = '') {
    try {
        const url = new URL(urlText);
        for (const key of [...url.searchParams.keys()]) {
            if (/token|api[_-]?key|secret|authorization|password/i.test(key)) {
                url.searchParams.set(key, '__REDACTED__');
            }
        }
        return url.toString();
    } catch {
        return urlText;
    }
}

function secretEnvNameForServer(serverName = '') {
    return `AILIS_MCP_${safeSegment(serverName, 'SERVER').replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()}_TOKEN`;
}

function registryMeta(entry = {}) {
    return entry?._meta?.['io.modelcontextprotocol.registry/official'] || {};
}

function normalizeRemote(remote = {}) {
    if (!isPlainObject(remote)) {
        return null;
    }
    const url = normalizeString(remote.url);
    if (!url) {
        return null;
    }
    const type = normalizeString(remote.type || remote.transport, 'streamable-http').toLowerCase();
    const requiredHeaders = normalizeArray(remote.headers)
        .filter((header) => header?.isRequired || header?.required)
        .map((header) => ({
            name: normalizeString(header.name),
            description: normalizeString(header.description),
            isSecret: header.isSecret !== false
        }))
        .filter((header) => header.name);
    const authRequired = requiredHeaders.some((header) => header.isSecret || /authorization|token|key/i.test(header.name));
    return {
        type,
        url,
        requiredHeaders,
        authRequired
    };
}

function pickRegistryRemote(server = {}) {
    const remotes = normalizeArray(server.remotes).map(normalizeRemote).filter(Boolean);
    return remotes.find((remote) => remote.type === 'streamable-http')
        || remotes.find((remote) => remote.type.includes('http'))
        || remotes[0]
        || null;
}

function pickNpmPackage(server = {}) {
    return normalizeArray(server.packages).find((entry) => {
        const registry = normalizeString(entry?.registry_name || entry?.registry || entry?.type).toLowerCase();
        return registry === 'npm' || registry.includes('npm');
    }) || null;
}

function buildRegistryCandidate(entry = {}) {
    const server = entry.server || entry;
    const name = normalizeString(server.name || server.id);
    if (!name) {
        return null;
    }
    const meta = registryMeta(entry);
    const remote = pickRegistryRemote(server);
    const npmPackage = pickNpmPackage(server);
    const repositoryUrl = normalizeString(server.repository?.url || server.repositoryUrl || server.repo);
    const latest = meta.isLatest !== false;
    const envVar = remote?.authRequired ? secretEnvNameForServer(name) : '';
    const mcpConfig = remote
        ? {
            transport: 'http',
            url: remote.url,
            protocolVersion: '2025-06-18',
            timeoutMs: 30000,
            ...(envVar ? { bearerTokenEnvVar: envVar } : {})
        }
        : null;
    const packageName = normalizeString(npmPackage?.name || npmPackage?.package || npmPackage?.identifier);
    const sourceKind = mcpConfig
        ? 'mcp_config'
        : packageName
            ? 'npm_mcp'
            : repositoryUrl
                ? 'github_mcp'
                : 'registry_metadata';
    const id = `mcp-registry:${safeSegment(name)}:${safeSegment(server.version || 'latest')}`;
    const description = normalizeString(server.description || server.summary);
    return {
        id,
        type: 'mcp_candidate',
        source: 'official_mcp_registry',
        sourceUrl: OFFICIAL_MCP_REGISTRY_URL,
        name,
        serverName: safeSegment(name.replace(/[./@]+/g, '-'), 'mcp_server'),
        title: normalizeString(server.title || server.displayName, name),
        description,
        version: normalizeString(server.version),
        latest,
        websiteUrl: normalizeString(server.websiteUrl || server.website_url),
        repositoryUrl,
        risk: remote?.authRequired ? 'medium' : sourceKind === 'github_mcp' ? 'high' : 'medium',
        install: {
            sourceKind,
            npmPackage: packageName,
            githubRepo: repositoryUrl,
            mcpConfig,
            requiredSecrets: remote?.requiredHeaders || [],
            authEnvVar: envVar
        },
        smokeProfile: buildMcpSmokeProfile({
            serverName: safeSegment(name.replace(/[./@]+/g, '-'), 'mcp_server'),
            sourceKind,
            authRequired: remote?.authRequired === true
        }),
        searchText: [
            name,
            server.title,
            description,
            server.version,
            server.websiteUrl,
            repositoryUrl,
            remote?.url,
            packageName,
            remote?.requiredHeaders?.map((header) => `${header.name} ${header.description}`).join(' ')
        ].filter(Boolean).join(' ')
    };
}

function buildMcpSmokeProfile({ serverName = '', sourceKind = 'mcp_config', authRequired = false } = {}) {
    return {
        id: `smoke:${safeSegment(serverName, 'mcp_server')}`,
        target: serverName,
        sourceKind,
        authRequired,
        exposePolicy: 'only_expose_after_all_required_checks_pass',
        checks: [
            {
                id: 'mcp_config_static_shape',
                title: 'MCP config has a supported transport and endpoint/command.',
                type: 'static_config',
                required: true
            },
            {
                id: 'mcp_initialize',
                title: 'MCP server initializes successfully.',
                type: 'mcp_health_check',
                required: true
            },
            {
                id: 'mcp_tools_list',
                title: 'MCP server returns at least one model-visible tool schema.',
                type: 'mcp_list_tools',
                minTools: 1,
                required: true
            },
            {
                id: 'mcp_direct_tool_specs',
                title: 'AILIS can convert returned tools into mcp__server__tool direct specs.',
                type: 'mcp_direct_spec_generation',
                required: true
            }
        ]
    };
}

class AILISToolAcquisitionGateway {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.stateDir = path.resolve(options.stateDir || path.join(this.projectRoot, '.ailis-state', 'tool-acquisition'));
        this.learningPath = path.join(this.stateDir, 'tool-learning.json');
        this.contractIntakePath = path.join(this.stateDir, 'contract-intake.json');
        this.externalExposurePath = path.join(this.stateDir, 'external-tool-exposure.json');
        this.externalAuthProfilesPath = path.join(this.stateDir, 'external-auth-profiles.json');
        this.registryUrl = normalizeString(options.registryUrl, OFFICIAL_MCP_REGISTRY_URL);
        this.fetchRegistry = typeof options.registryFetcher === 'function' ? options.registryFetcher : this.defaultFetchRegistry.bind(this);
        this.mcpManager = options.mcpManager || null;
        this.localAdapterRunner = options.localAdapterRunner || null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
    }

    getStatus() {
        return {
            enabled: true,
            registryUrl: this.registryUrl,
            learningPath: this.learningPath,
            contractIntakePath: this.contractIntakePath,
            externalExposurePath: this.externalExposurePath,
            externalAuthProfilesPath: this.externalAuthProfilesPath,
            contractSourceCount: CONTRACT_SOURCE_PROFILES.length,
            coreBundleCount: CORE_TOOL_BUNDLES.length,
            standardToolPackCount: STANDARD_TOOL_PACKS.length
        };
    }

    listContractSources() {
        return CONTRACT_SOURCE_PROFILES.map((profile) => cloneJson(profile));
    }

    listStandardToolPacks(args = {}) {
        return listStandardToolPacks({
            includeTools: args.includeTools !== false
        });
    }

    searchStandardToolPacks(args = {}) {
        return searchStandardToolPacks(
            args.query || args.q || args.taskText || args.task || '',
            {
                limit: args.limit || 12,
                includeTools: args.includeTools !== false
            }
        );
    }

    listCoreTools() {
        const availableContracts = new Set(listToolContractSummaries().map((contract) => contract.id));
        const availableSkills = new Set(listAILISSkills().map((skill) => skill.id));
        return CORE_TOOL_BUNDLES.map((bundle) => {
            const availableToolIds = bundle.toolIds.filter((toolId) => availableContracts.has(toolId));
            const availableSkillIds = bundle.skillIds.filter((skillId) => availableSkills.has(skillId));
            const health = availableToolIds.length || availableSkillIds.length ? 'available' : 'needs_mcp_or_plugin';
            return {
                id: bundle.id,
                type: 'core_tool_bundle',
                label: bundle.label,
                category: bundle.category,
                description: bundle.description,
                health,
                source: 'ailis_core_tool_catalog',
                toolIds: [...bundle.toolIds],
                availableToolIds,
                skillIds: [...bundle.skillIds],
                availableSkillIds,
                keywords: [...bundle.keywords],
                smokeProfile: cloneJson(bundle.smokeProfile)
            };
        });
    }

    async searchCandidates(args = {}) {
        const query = normalizeString(args.query || args.q || args.taskText || args.task || args.intent);
        const limit = Math.max(1, Math.min(Number(args.limit || 12), 50));
        const includeCore = args.includeCore !== false;
        const includeRegistry = args.includeRegistry !== false;
        const includeStandardPacks = args.includeStandardPacks !== false && args.includeStandardToolPacks !== false;
        const errors = [];
        let candidates = [];
        if (includeCore) {
            candidates.push(...this.searchCoreCandidates(query, limit));
        }
        if (includeStandardPacks) {
            candidates.push(...this.searchStandardToolPacks({
                query,
                limit,
                includeTools: args.includePackTools === true
            }).map((pack) => ({
                ...pack,
                health: 'available_after_exposure',
                searchText: pack.searchText || JSON.stringify(pack),
                smokeProfile: {
                    checks: [
                        {
                            id: `${pack.id}_contract_lint`,
                            type: 'contract_lint',
                            mutates: false
                        },
                        {
                            id: `${pack.id}_exposure_dry_run`,
                            type: 'standard_tool_pack_exposure',
                            mutates: false
                        }
                    ]
                }
            })));
        }
        if (includeRegistry) {
            try {
                const registry = await this.searchOfficialRegistry({
                    query,
                    limit: Math.max(limit, Number(args.registryLimit || limit)),
                    maxPages: Number(args.registryMaxPages || args.maxPages || 3),
                    includeAllVersions: args.includeAllVersions === true,
                    registryUrl: normalizeString(args.registryUrl, this.registryUrl)
                });
                candidates.push(...registry);
            } catch (error) {
                errors.push({
                    source: 'official_mcp_registry',
                    error: error?.message || String(error)
                });
            }
        }
        const ranked = candidates
            .map((candidate) => ({
                candidate,
                score: query ? scoreText(query, candidate.searchText || JSON.stringify(candidate)) : 1
            }))
            .filter((entry) => !query || entry.score > 0 || entry.candidate.type === 'core_tool_bundle')
            .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
            .slice(0, limit)
            .map((entry) => ({
                ...entry.candidate,
                matchScore: entry.score
            }));
        return {
            status: errors.length ? 'partial' : 'completed',
            query,
            sourceCount: {
                core: includeCore ? CORE_TOOL_BUNDLES.length : 0,
                standardPacks: includeStandardPacks ? STANDARD_TOOL_PACKS.length : 0,
                registry: ranked.filter((candidate) => candidate.source === 'official_mcp_registry').length
            },
            candidateCount: ranked.length,
            candidates: ranked,
            errors
        };
    }

    searchCoreCandidates(query = '', limit = 12) {
        const core = this.listCoreTools();
        const ranked = core
            .map((bundle) => ({
                bundle,
                score: query ? scoreText(query, [
                    bundle.id,
                    bundle.label,
                    bundle.category,
                    bundle.description,
                    bundle.toolIds.join(' '),
                    bundle.keywords.join(' ')
                ].join(' ')) : 1
            }))
            .filter((entry) => !query || entry.score > 0)
            .sort((a, b) => b.score - a.score || a.bundle.id.localeCompare(b.bundle.id))
            .slice(0, Math.max(1, Number(limit) || 12))
            .map((entry) => ({
                ...entry.bundle,
                searchText: [
                    entry.bundle.id,
                    entry.bundle.label,
                    entry.bundle.category,
                    entry.bundle.description,
                    entry.bundle.toolIds.join(' '),
                    entry.bundle.keywords.join(' ')
                ].join(' ')
            }));
        return ranked;
    }

    async searchOfficialRegistry({ query = '', limit = 12, maxPages = 3, includeAllVersions = false, registryUrl = '' } = {}) {
        const rawEntries = await this.fetchRegistryEntries({ limit, maxPages, registryUrl });
        const latestByName = new Map();
        const candidates = [];
        for (const entry of rawEntries) {
            const candidate = buildRegistryCandidate(entry);
            if (!candidate) {
                continue;
            }
            if (includeAllVersions) {
                candidates.push(candidate);
                continue;
            }
            const previous = latestByName.get(candidate.name);
            if (!previous || candidate.latest || String(candidate.version).localeCompare(String(previous.version)) > 0) {
                latestByName.set(candidate.name, candidate);
            }
        }
        const source = includeAllVersions ? candidates : [...latestByName.values()];
        const ranked = source
            .map((candidate) => ({
                candidate,
                score: query ? scoreText(query, candidate.searchText) : 1
            }))
            .filter((entry) => !query || entry.score > 0)
            .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
            .slice(0, Math.max(1, Math.min(Number(limit) || 12, 100)))
            .map((entry) => entry.candidate);
        return ranked;
    }

    async fetchRegistryEntries({ limit = 12, maxPages = 3, registryUrl = '' } = {}) {
        const pageLimit = Math.max(1, Math.min(Number(limit) || 12, 100));
        const pages = Math.max(1, Math.min(Number(maxPages) || 3, 10));
        const entries = [];
        let cursor = '';
        for (let page = 0; page < pages && entries.length < pageLimit * pages; page += 1) {
            const url = new URL(normalizeString(registryUrl, this.registryUrl));
            url.searchParams.set('limit', String(pageLimit));
            if (cursor) {
                url.searchParams.set('cursor', cursor);
            }
            const payload = await this.fetchRegistry(url.toString());
            const servers = Array.isArray(payload?.servers) ? payload.servers : [];
            entries.push(...servers);
            cursor = normalizeString(payload?.metadata?.nextCursor || payload?.nextCursor);
            if (!cursor || !servers.length) {
                break;
            }
        }
        return entries;
    }

    async defaultFetchRegistry(url) {
        if (typeof fetch !== 'function') {
            throw new Error('global fetch is unavailable in this Node runtime');
        }
        const response = await fetch(url, {
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`MCP Registry request failed with HTTP ${response.status}`);
        }
        return await response.json();
    }

    async planMcpCandidate(args = {}) {
        const candidate = await this.resolveCandidate(args);
        if (!candidate) {
            return {
                status: 'not_found',
                candidateId: normalizeString(args.candidateId || args.id)
            };
        }
        if (candidate.type !== 'mcp_candidate') {
            return {
                status: 'not_installable',
                candidate,
                reason: 'Only MCP registry candidates can be converted into MCP install plans.'
            };
        }
        const install = candidate.install || {};
        if (!['mcp_config', 'npm_mcp', 'github_mcp'].includes(install.sourceKind)) {
            return {
                status: 'not_installable',
                candidate,
                reason: 'Candidate does not include a supported remote, npm, or GitHub install source.'
            };
        }
        const secretEnvVar = normalizeString(args.secretEnvVar || args.bearerTokenEnvVar || install.authEnvVar);
        const mcpConfig = cloneJson(install.mcpConfig || args.mcpConfig || null);
        if (mcpConfig && secretEnvVar && !mcpConfig.bearerTokenEnvVar && !mcpConfig.bearer_token_env_var) {
            mcpConfig.bearerTokenEnvVar = secretEnvVar;
        }
        const capabilityId = safeSegment(args.capabilityId || candidate.name.replace(/[./@]+/g, '-'), 'mcp_capability');
        const serverName = safeSegment(args.mcpServerName || args.server || candidate.serverName || capabilityId, capabilityId);
        const planArgs = {
            action: 'plan_install',
            request: normalizeString(args.request, `Install MCP Registry server ${candidate.title || candidate.name}`),
            capabilityId,
            label: normalizeString(args.label, candidate.title || candidate.name),
            description: normalizeString(args.description, candidate.description || candidate.title || candidate.name),
            sourceKind: install.sourceKind,
            risk: normalizeString(args.risk, candidate.risk || 'medium'),
            npmPackage: normalizeString(args.npmPackage || install.npmPackage),
            githubRepo: normalizeString(args.githubRepo || install.githubRepo || candidate.repositoryUrl),
            mcpServerName: serverName,
            mcpConfig,
            skillId: safeSegment(args.skillId || `${capabilityId}_skill`, `${capabilityId}_skill`),
            skillLabel: normalizeString(args.skillLabel || args.label, `${candidate.title || candidate.name} Skill`),
            skillDescription: normalizeString(args.skillDescription, `MCP capability loaded from the official MCP Registry entry ${candidate.name}.`),
            when: normalizeString(args.when, `用户需要 ${candidate.title || candidate.name} 相关外部工具能力时。`),
            triggers: normalizeArray(args.triggers || [candidate.name, candidate.title, candidate.description]).filter(Boolean).map(String),
            validationCommands: normalizeArray(args.validationCommands || ['pnpm test:ailis-skills']).map(String)
        };
        return {
            status: 'completed',
            candidate,
            planArgs,
            smokeProfile: candidate.smokeProfile
        };
    }

    async resolveCandidate(args = {}) {
        if (isPlainObject(args.candidate)) {
            return buildRegistryCandidate(args.candidate) || cloneJson(args.candidate);
        }
        if (args.mcpConfig || args.url) {
            const name = normalizeString(args.name || args.server || args.mcpServerName || args.url, 'custom-mcp');
            return buildRegistryCandidate({
                server: {
                    name,
                    title: normalizeString(args.title || args.label, name),
                    description: normalizeString(args.description || args.request, name),
                    version: normalizeString(args.version, 'custom'),
                    remotes: [
                        {
                            type: normalizeString(args.transport || 'streamable-http'),
                            url: normalizeString(args.url || args.mcpConfig?.url)
                        }
                    ]
                },
                _meta: {
                    'io.modelcontextprotocol.registry/official': {
                        isLatest: true
                    }
                }
            });
        }
        const candidateId = normalizeString(args.candidateId || args.id);
        const query = normalizeString(args.query || args.name || args.server || candidateId);
        if (!query) {
            return null;
        }
        const search = await this.searchCandidates({
            query,
            limit: Math.max(5, Number(args.limit || 10)),
            includeCore: false,
            includeRegistry: true,
            registryLimit: args.registryLimit,
            registryMaxPages: args.registryMaxPages,
            registryUrl: args.registryUrl
        });
        return search.candidates.find((candidate) => candidate.id === candidateId)
            || search.candidates.find((candidate) => candidate.name === query || candidate.serverName === query)
            || search.candidates[0]
            || null;
    }

    async buildSmokeProfile(args = {}) {
        const candidate = await this.resolveCandidate(args);
        if (candidate?.smokeProfile) {
            return {
                status: 'completed',
                candidate,
                smokeProfile: candidate.smokeProfile
            };
        }
        return {
            status: 'completed',
            candidate: candidate || null,
            smokeProfile: buildMcpSmokeProfile({
                serverName: normalizeString(args.server || args.mcpServerName || args.name, 'mcp_server'),
                sourceKind: normalizeString(args.sourceKind, 'mcp_config')
            })
        };
    }

    async smokeMcpCandidate(args = {}) {
        if (!this.mcpManager?.registerServers || !this.mcpManager?.healthCheck || !this.mcpManager?.listToolSpecs) {
            return {
                status: 'unsupported',
                error: 'smoke_mcp_candidate requires an MCP manager with registerServers/healthCheck/listToolSpecs'
            };
        }
        if (args.approved !== true) {
            return {
                status: 'needs_approval',
                approvalText: 'Run a temporary MCP smoke test? This may start a local server process or contact a remote MCP endpoint.'
            };
        }
        const planned = await this.planMcpCandidate(args);
        if (planned.status !== 'completed') {
            return planned;
        }
        const serverName = planned.planArgs.mcpServerName;
        const mcpConfig = planned.planArgs.mcpConfig;
        if (!mcpConfig) {
            return {
                status: 'unsupported',
                candidate: planned.candidate,
                error: 'candidate does not include a direct MCP config to smoke test'
            };
        }
        this.mcpManager.registerServers({ [serverName]: mcpConfig }, { persist: false });
        try {
            const health = await this.mcpManager.healthCheck(serverName, args.timeoutMs || 15000);
            const specs = await this.mcpManager.listToolSpecs(serverName, args.timeoutMs || 15000).catch(() => []);
            const ok = health.every((entry) => entry.ok) && specs.length > 0;
            return {
                status: ok ? 'completed' : 'failed',
                candidate: planned.candidate,
                serverName,
                health,
                directSpecCount: specs.length,
                directSpecs: specs.slice(0, Number(args.limit || 8)),
                smokeProfile: planned.smokeProfile
            };
        } finally {
            this.mcpManager.removeServer(serverName, { persist: false });
        }
    }

    compileContract(args = {}) {
        const raw = args.rawContract ||
            args.contract ||
            args.toolSpec ||
            args.tool ||
            args.operation ||
            args.openapiOperation ||
            args;
        const result = compileAndLintAilisContract(raw, {
            id: args.contractId || args.id,
            name: args.name,
            title: args.title,
            description: args.description,
            purpose: args.purpose,
            sourceType: args.sourceType || args.source_type,
            sourceName: args.sourceName,
            sourceUrl: args.sourceUrl,
            server: args.server || args.serverName || args.mcpServerName,
            risk: args.risk,
            approval: args.approval,
            minScore: args.minScore
        });
        return {
            status: 'completed',
            ...result
        };
    }

    lintContract(args = {}) {
        const contract = args.compiledContract || args.contract;
        if (!contract || !contract.inputSchema) {
            return this.compileContract(args);
        }
        const lint = lintAilisContract(contract, { minScore: args.minScore });
        return {
            status: 'completed',
            contract,
            lint,
            promptCard: buildContractPromptCard(contract, lint)
        };
    }

    async loadContractIntake() {
        const state = await readJsonFile(this.contractIntakePath, null);
        if (state?.version === 1 && Array.isArray(state.contracts)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            contracts: []
        };
    }

    async saveContractIntake(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            contracts: Array.isArray(state.contracts) ? state.contracts : []
        };
        await writeJsonFileAtomic(this.contractIntakePath, next);
        return next;
    }

    async intakeContracts(args = {}) {
        const sourceType = normalizeString(args.sourceType || args.source_type);
        const rawContracts = normalizeArray(
            args.rawContracts ||
                args.contracts ||
                args.tools ||
                args.toolSpecs ||
                args.openapiOperations ||
                args.operations ||
                args.mcpTools ||
                args.rawContract ||
                args.contract ||
                args.toolSpec ||
                args.tool
        );
        if (!rawContracts.length) {
            return {
                status: 'invalid_tool_args',
                error: 'intake_contracts requires contracts/tools/toolSpecs/rawContract'
            };
        }
        const minScore = Number(args.minScore || 75);
        const compiled = rawContracts.map((raw, index) => compileAndLintAilisContract(raw, {
            sourceType: sourceType || raw.sourceType || raw.source_type,
            server: args.server || args.serverName || args.mcpServerName,
            sourceName: args.sourceName,
            sourceUrl: args.sourceUrl,
            minScore,
            id: raw.id || raw.name || `${sourceType || 'tool'}_${index + 1}`
        }));
        const accepted = compiled.filter((entry) => entry.lint.approved);
        const rejected = compiled.filter((entry) => !entry.lint.approved);
        const state = await this.loadContractIntake();
        const byId = new Map((state.contracts || []).map((entry) => [entry.contract.id, entry]));
        for (const entry of compiled) {
            byId.set(entry.contract.id, {
                importedAt: new Date().toISOString(),
                status: entry.lint.status,
                score: entry.lint.score,
                minScore: entry.lint.minScore,
                source: entry.contract.source,
                contract: entry.contract,
                lint: entry.lint,
                promptCard: entry.promptCard
            });
        }
        state.contracts = [...byId.values()]
            .sort((a, b) => String(a.contract.id).localeCompare(String(b.contract.id)));
        const saved = await this.saveContractIntake(state);
        this.emitGatewayEvent('tool_acquisition.contract_intake.updated', {
            accepted: accepted.length,
            rejected: rejected.length,
            total: compiled.length
        });
        return {
            status: 'completed',
            contractIntakePath: this.contractIntakePath,
            total: compiled.length,
            accepted: accepted.length,
            rejected: rejected.length,
            acceptedContracts: accepted.map((entry) => ({
                id: entry.contract.id,
                score: entry.lint.score,
                source: entry.contract.source,
                smokeProfile: entry.contract.smokeProfile
            })),
            rejectedContracts: rejected.map((entry) => ({
                id: entry.contract.id,
                score: entry.lint.score,
                issues: entry.lint.issues
            })),
            contractCount: saved.contracts.length
        };
    }

    async listContractIntake(args = {}) {
        const state = await this.loadContractIntake();
        const status = normalizeString(args.status);
        const query = normalizeString(args.query).toLowerCase();
        const contracts = state.contracts
            .filter((entry) => !status || entry.status === status)
            .filter((entry) => !query || JSON.stringify(entry).toLowerCase().includes(query))
            .slice(0, Math.max(1, Math.min(Number(args.limit || 50), 500)));
        return {
            status: 'completed',
            contractIntakePath: this.contractIntakePath,
            updatedAt: state.updatedAt || '',
            contractCount: state.contracts.length,
            contracts
        };
    }

    makeExternalExposureEntry({
        contract,
        lint,
        promptCard = '',
        source = {},
        callable = false,
        toolId = '',
        modelSpec = null,
        verification = 'unverified',
        exposureKind = 'external_contract_tool',
        adapter = null,
        authProfileId = '',
        notes = []
    } = {}) {
        const safeId = safeSegment(contract?.id || toolId || source.name || 'external_tool');
        const entry = {
            id: `external:${safeId}`,
            type: exposureKind,
            status: 'exposed',
            exposure: 'direct_external',
            callable: callable === true,
            verified: verification === 'verified',
            verification,
            toolId: normalizeString(toolId || contract?.id),
            name: normalizeString(contract?.name || toolId || safeId),
            title: normalizeString(contract?.title || contract?.name || toolId || safeId),
            source: {
                ...(contract?.source || {}),
                ...source
            },
            score: lint?.score ?? null,
            lintStatus: lint?.status || '',
            risk: normalizeString(contract?.risk, 'medium'),
            mutates: contract?.mutates === true,
            approval: normalizeString(contract?.approval, 'policy'),
            adapter: adapter && typeof adapter === 'object' && !Array.isArray(adapter) ? adapter : null,
            authProfileId: normalizeString(authProfileId || adapter?.authProfileId || contract?.authProfileId),
            callableReason: callable === true
                ? 'Runtime has a live callable direct spec for this tool.'
                : 'Visible to Agent as an external contract/candidate; execution requires install, adapter, auth, or smoke verification.',
            modelFacing: modelSpec || {
                type: 'external_contract',
                name: normalizeString(contract?.id || toolId || safeId),
                description: normalizeString(contract?.purpose || contract?.description || promptCard).slice(0, 1800),
                parameters: contract?.inputSchema || {},
                output_schema: contract?.outputSchema || {},
                prompt_card: promptCard
            },
            contract,
            lint,
            notes: normalizeArray(notes).map(String).filter(Boolean).slice(0, 12),
            exposedAt: new Date().toISOString()
        };
        entry.virtualToolId = entry.callable ? createExternalVirtualToolId(entry) : '';
        return entry;
    }

    async loadExternalExposure() {
        const state = await readJsonFile(this.externalExposurePath, null);
        if (state?.version === EXTERNAL_EXPOSURE_VERSION && Array.isArray(state.exposures)) {
            return state;
        }
        return {
            version: EXTERNAL_EXPOSURE_VERSION,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            exposures: []
        };
    }

    async saveExternalExposure(state) {
        const next = {
            version: EXTERNAL_EXPOSURE_VERSION,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            exposures: Array.isArray(state.exposures) ? state.exposures : []
        };
        await writeJsonFileAtomic(this.externalExposurePath, next);
        return next;
    }

    async loadExternalAuthProfiles() {
        const state = await readJsonFile(this.externalAuthProfilesPath, null);
        if (state?.version === EXTERNAL_AUTH_PROFILE_VERSION && Array.isArray(state.profiles)) {
            return state;
        }
        return {
            version: EXTERNAL_AUTH_PROFILE_VERSION,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            profiles: []
        };
    }

    async saveExternalAuthProfiles(state) {
        const next = {
            version: EXTERNAL_AUTH_PROFILE_VERSION,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profiles: Array.isArray(state.profiles) ? state.profiles : []
        };
        await writeJsonFileAtomic(this.externalAuthProfilesPath, next);
        return next;
    }

    normalizeExternalAuthProfile(args = {}) {
        const provider = normalizeString(args.provider || args.sourceType || args.source || args.type, 'external');
        const id = safeSegment(
            args.authProfileId || args.profileId || args.id || args.name || `${provider}_auth`,
            'external_auth'
        );
        const authType = normalizeAuthType(args.authType || args.auth_type || args.kind, provider);
        if (args.secret || args.secretValue || args.token || args.apiKey || args.password) {
            return {
                error: 'raw_secret_not_allowed',
                message: 'Do not store raw secrets in AILIS auth profiles. Put the secret in an environment variable and store only envVar here.'
            };
        }
        const envVar = normalizeString(
            args.envVar ||
                args.apiKeyEnvVar ||
                args.tokenEnvVar ||
                args.bearerTokenEnvVar ||
                (authType === 'composio_api_key_env' ? 'COMPOSIO_API_KEY' : '')
        );
        return {
            id,
            label: normalizeString(args.label || args.title, id),
            provider,
            authType,
            envVar,
            headerName: normalizeString(
                args.headerName || args.header || (authType === 'api_key_env' || authType === 'composio_api_key_env' ? 'x-api-key' : '')
            ),
            queryParamName: normalizeString(args.queryParamName || args.queryParam || args.param),
            tokenPrefix: normalizeString(args.tokenPrefix || args.prefix, authType === 'bearer_env' ? 'Bearer' : ''),
            baseUrl: normalizeString(args.baseUrl || args.baseURL || args.apiBaseUrl || args.api_base_url),
            userId: normalizeString(args.userId || args.user_id),
            connectedAccountId: normalizeString(args.connectedAccountId || args.connected_account_id),
            entityId: normalizeString(args.entityId || args.entity_id),
            defaultHeaders: args.defaultHeaders && typeof args.defaultHeaders === 'object' && !Array.isArray(args.defaultHeaders)
                ? redactHeaders(args.defaultHeaders)
                : {},
            scope: normalizeArray(args.scope || args.scopes || args.permissions).map(String).filter(Boolean).slice(0, 32)
        };
    }

    authProfileStatus(profile = {}) {
        const authType = normalizeAuthType(profile.authType, profile.provider);
        const envRequired = !['none', 'no_auth'].includes(authType);
        const envVar = normalizeString(profile.envVar);
        const envPresent = !envRequired || Boolean(envVar && process.env[envVar]);
        const issues = [];
        if (envRequired && !envVar) {
            issues.push('missing_env_var');
        }
        if (envRequired && envVar && !process.env[envVar]) {
            issues.push('env_var_not_set');
        }
        if (authType === 'api_key_env' && !normalizeString(profile.headerName || profile.queryParamName)) {
            issues.push('missing_api_key_location');
        }
        if (authType === 'composio_api_key_env' && !normalizeString(profile.headerName, 'x-api-key')) {
            issues.push('missing_composio_header_name');
        }
        return {
            status: issues.length ? 'needs_config' : 'ready',
            envRequired,
            envPresent,
            issues
        };
    }

    publicAuthProfile(profile = {}) {
        const status = this.authProfileStatus(profile);
        return {
            ...profile,
            envPresent: status.envPresent,
            readiness: status.status,
            issues: status.issues,
            secretValue: undefined
        };
    }

    async configureExternalAuthProfile(args = {}) {
        const profile = this.normalizeExternalAuthProfile(args);
        if (profile.error) {
            return {
                status: profile.error,
                ok: false,
                message: profile.message
            };
        }
        const now = new Date().toISOString();
        const state = await this.loadExternalAuthProfiles();
        const byId = new Map((state.profiles || []).map((entry) => [entry.id, entry]));
        const previous = byId.get(profile.id) || {};
        const nextProfile = {
            ...previous,
            ...profile,
            createdAt: previous.createdAt || now,
            updatedAt: now
        };
        byId.set(profile.id, nextProfile);
        state.profiles = [...byId.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
        const saved = await this.saveExternalAuthProfiles(state);
        this.emitGatewayEvent('tool_acquisition.external_auth.profile_configured', {
            id: nextProfile.id,
            provider: nextProfile.provider,
            authType: nextProfile.authType,
            readiness: this.authProfileStatus(nextProfile).status
        });
        return {
            status: 'completed',
            externalAuthProfilesPath: this.externalAuthProfilesPath,
            profile: this.publicAuthProfile(nextProfile),
            total: saved.profiles.length
        };
    }

    async listExternalAuthProfiles(args = {}) {
        const state = await this.loadExternalAuthProfiles();
        const query = normalizeString(args.query || args.provider || args.sourceType || args.source).toLowerCase();
        const profiles = (state.profiles || [])
            .filter((entry) => !query || JSON.stringify(entry).toLowerCase().includes(query))
            .slice(0, Math.max(1, Math.min(Number(args.limit || 50), 500)))
            .map((entry) => this.publicAuthProfile(entry));
        return {
            status: 'completed',
            externalAuthProfilesPath: this.externalAuthProfilesPath,
            updatedAt: state.updatedAt || '',
            total: state.profiles.length,
            returned: profiles.length,
            profiles
        };
    }

    async getExternalAuthProfile(id = '') {
        const requested = normalizeString(id);
        if (!requested) {
            return null;
        }
        const state = await this.loadExternalAuthProfiles();
        const lowered = requested.toLowerCase();
        return (state.profiles || []).find((entry) =>
            [entry.id, entry.label, entry.provider].map((value) => normalizeString(value).toLowerCase()).includes(lowered)
        ) || null;
    }

    resolveInlineAuthProfile(args = {}, exposure = {}) {
        const inline = args.authProfile && typeof args.authProfile === 'object' && !Array.isArray(args.authProfile)
            ? args.authProfile
            : args.auth && typeof args.auth === 'object' && !Array.isArray(args.auth)
                ? args.auth
                : null;
        if (!inline) {
            return null;
        }
        const profile = this.normalizeExternalAuthProfile({
            ...inline,
            provider: inline.provider || exposure.source?.type || exposure.source?.name
        });
        return profile.error ? null : profile;
    }

    async resolveAuthProfileForExecution(exposure = {}, args = {}) {
        const requested = normalizeString(
            args.authProfileId ||
                args.profileId ||
                exposure.authProfileId ||
                exposure.adapter?.authProfileId ||
                exposure.source?.authProfileId
        );
        if (requested) {
            const profile = await this.getExternalAuthProfile(requested);
            if (!profile) {
                return {
                    profile: null,
                    status: 'auth_profile_not_found',
                    message: `External auth profile not found: ${requested}`
                };
            }
            return {
                profile,
                status: 'completed'
            };
        }
        const inline = this.resolveInlineAuthProfile(args, exposure);
        if (inline) {
            return {
                profile: inline,
                status: 'completed'
            };
        }
        return {
            profile: null,
            status: 'completed'
        };
    }

    buildAuthMaterial(profile = null) {
        if (!profile) {
            return {
                status: 'completed',
                headers: {},
                query: {},
                body: {}
            };
        }
        const authType = normalizeAuthType(profile.authType, profile.provider);
        if (['none', 'no_auth'].includes(authType)) {
            return {
                status: 'completed',
                headers: {},
                query: {},
                body: {}
            };
        }
        const envVar = normalizeString(profile.envVar);
        const secret = envVar ? process.env[envVar] : '';
        if (!envVar || !secret) {
            return {
                status: 'auth_required',
                ok: false,
                authProfileId: profile.id,
                authType,
                envVar,
                message: envVar
                    ? `Required environment variable is not set: ${envVar}`
                    : `Auth profile ${profile.id || profile.provider || 'external'} requires an envVar.`
            };
        }
        const headers = {};
        const query = {};
        if (authType === 'bearer_env') {
            const prefix = normalizeString(profile.tokenPrefix, 'Bearer');
            headers.Authorization = prefix ? `${prefix} ${secret}` : secret;
        } else if (authType === 'api_key_env') {
            const headerName = normalizeString(profile.headerName);
            const queryParamName = normalizeString(profile.queryParamName);
            if (headerName) {
                headers[headerName] = secret;
            } else if (queryParamName) {
                query[queryParamName] = secret;
            } else {
                return {
                    status: 'auth_required',
                    ok: false,
                    authProfileId: profile.id,
                    authType,
                    envVar,
                    message: 'api_key_env auth profile requires headerName or queryParamName.'
                };
            }
        } else if (authType === 'composio_api_key_env') {
            headers[normalizeString(profile.headerName, 'x-api-key')] = secret;
        } else if (authType === 'basic_env') {
            headers.Authorization = `Basic ${Buffer.from(secret).toString('base64')}`;
        } else {
            return {
                status: 'unsupported_auth_type',
                ok: false,
                authProfileId: profile.id,
                authType,
                message: `Unsupported external auth profile type: ${authType}`
            };
        }
        return {
            status: 'completed',
            headers,
            query,
            body: {},
            authProfileId: profile.id,
            authType,
            envVar
        };
    }

    needsExternalExecutionApproval(exposure = {}, { method = '', sourceType = '' } = {}, args = {}, context = {}) {
        if (args.approved === true || context.approved === true || context.executeExternalApproved === true) {
            return null;
        }
        const normalizedMethod = normalizeString(method, 'GET').toUpperCase();
        const source = normalizeString(sourceType || exposure.source?.type);
        const mutates = exposure.mutates === true || exposure.contract?.mutates === true || !SAFE_HTTP_METHODS.has(normalizedMethod);
        const composioNeedsApproval = source === 'composio_tool' && exposure.contract?.readOnlyHint !== true;
        if (!mutates && !composioNeedsApproval) {
            return null;
        }
        return {
            status: 'needs_approval',
            ok: false,
            exposureId: exposure.id,
            toolId: exposure.toolId,
            approvalText: `Execute external ${source || 'tool'} ${exposure.title || exposure.toolId || exposure.id}? This may contact an external service${mutates ? ' and mutate remote state' : ''}.`,
            approval: {
                required: true,
                reason: source === 'composio_tool' ? 'composio_external_action_requires_approval' : 'external_mutation_requires_approval',
                source,
                method: normalizedMethod,
                mutates
            }
        };
    }

    async exposeInstalledMcpToolSpecs(args = {}) {
        if (!this.mcpManager?.listToolSpecs) {
            return [];
        }
        const specs = await this.mcpManager.listToolSpecs(
            normalizeString(args.server || args.serverName || args.mcpServerName),
            args.timeoutMs || 15000
        ).catch(() => []);
        return specs.slice(0, Math.max(1, Math.min(Number(args.limit || 100), 500))).map((spec) => {
            const raw = {
                id: spec.id || spec.name,
                name: spec.tool || spec.name || spec.id,
                title: spec.title || spec.name || spec.id,
                description: spec.description || '',
                inputSchema: spec.input_schema || spec.inputSchema || spec.parameters || {},
                outputSchema: spec.output_schema || spec.outputSchema || {},
                server: spec.server
            };
            const compiled = compileAndLintAilisContract(raw, {
                sourceType: 'mcp_tool',
                server: spec.server,
                minScore: args.minScore || 60
            });
            return this.makeExternalExposureEntry({
                contract: compiled.contract,
                lint: compiled.lint,
                promptCard: compiled.promptCard,
                source: {
                    type: 'installed_mcp_direct',
                    name: spec.server,
                    rawToolName: spec.tool || spec.name
                },
                callable: true,
                toolId: spec.id || spec.name,
                modelSpec: spec,
                verification: 'verified',
                exposureKind: 'live_mcp_direct_tool',
                notes: ['Installed MCP direct specs are callable as mcp__server__tool ids.']
            });
        });
    }

    async exposeMcpRegistryCandidates(args = {}) {
        const query = normalizeString(args.query || args.taskText || args.task || args.request);
        const candidates = await this.searchOfficialRegistry({
            query,
            limit: Math.max(1, Math.min(Number(args.registryLimit || args.limit || 20), 100)),
            maxPages: Math.max(1, Math.min(Number(args.registryMaxPages || args.maxPages || 3), 10)),
            includeAllVersions: args.includeAllVersions === true,
            registryUrl: normalizeString(args.registryUrl, this.registryUrl)
        }).catch((error) => {
            this.emitGatewayEvent('tool_acquisition.external_exposure.registry_failed', {
                error: error?.message || String(error)
            });
            return [];
        });
        return candidates.map((candidate) => {
            const raw = {
                id: candidate.id,
                name: candidate.name,
                title: candidate.title,
                description: candidate.description,
                inputSchema: {
                    type: 'object',
                    required: ['query'],
                    additionalProperties: false,
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Task or capability need used to decide whether to install this MCP server.'
                        }
                    }
                },
                whenToUse: [`Use when the task needs the external MCP server ${candidate.title || candidate.name}.`],
                whenNotToUse: ['Do not call as a direct runtime tool before installation and smoke test pass.'],
                preconditions: ['Run plan_mcp_candidate, install_capability, and smoke_mcp_candidate before marking tools callable.'],
                examples: [{ query: candidate.title || candidate.name }],
                badExamples: [{ tool_call: candidate.name }],
                alternatives: ['Search installed MCP direct specs first.', 'Use core tools if they already satisfy the task.'],
                errors: {
                    not_installed: {
                        recoverable: true,
                        nextActions: ['plan_mcp_candidate', 'install_capability', 'smoke_mcp_candidate']
                    }
                },
                permissions: candidate.install?.authEnvVar ? [candidate.install.authEnvVar] : []
            };
            const compiled = compileAndLintAilisContract(raw, {
                sourceType: 'mcp_tool',
                sourceName: 'official_mcp_registry',
                sourceUrl: candidate.sourceUrl || this.registryUrl,
                minScore: args.minScore || 60
            });
            return this.makeExternalExposureEntry({
                contract: compiled.contract,
                lint: compiled.lint,
                promptCard: compiled.promptCard,
                source: {
                    type: 'mcp_registry_candidate',
                    name: candidate.name,
                    url: candidate.sourceUrl || this.registryUrl
                },
                callable: false,
                toolId: candidate.name,
                verification: 'install_required',
                exposureKind: 'mcp_registry_candidate_tool',
                notes: [
                    'This is directly visible to Agent for discovery/planning.',
                    'It is not callable until installed and smoke tested.'
                ]
            });
        });
    }

    compileRawExternalToolsForExposure(rawContracts = [], args = {}) {
        const sourceType = normalizeString(args.sourceType || args.source_type || 'generic_tool');
        return normalizeArray(rawContracts).map((raw, index) => {
            const requestedAdapter = raw.adapter && typeof raw.adapter === 'object' && !Array.isArray(raw.adapter)
                ? raw.adapter
                : {};
            const authProfileId = normalizeString(
                raw.authProfileId ||
                    raw.auth_profile_id ||
                    args.authProfileId ||
                    args.profileId ||
                    requestedAdapter.authProfileId
            );
            const openApiAdapterEnabled = sourceType === 'openapi_operation' && (
                args.enableOpenApiAdapter === true ||
                args.enableExternalAdapters === true ||
                requestedAdapter.id === 'openapi_http' ||
                requestedAdapter.type === 'openapi_http'
            );
            const composioAdapterEnabled = sourceType === 'composio_tool' && (
                args.enableComposioAdapter === true ||
                args.enableExternalAdapters === true ||
                requestedAdapter.id === 'composio_rest_v3' ||
                requestedAdapter.type === 'composio_rest_v3'
            );
            const inferredLocalAdapter = inferLocalDocumentAdapter(raw, requestedAdapter);
            const localAdapterEnabled = ['pydantic_tool', 'langchain_tool'].includes(sourceType) &&
                inferredLocalAdapter &&
                (
                    args.enableLocalAdapters === true ||
                    args.enableLocalDocumentAdapters === true ||
                    args.enableExternalAdapters === true ||
                    requestedAdapter.id ||
                    requestedAdapter.type
                );
            const openApiMeta = sourceType === 'openapi_operation'
                ? {
                    method: normalizeString(raw.method, 'GET').toUpperCase(),
                    path: normalizeString(raw.path),
                    baseUrl: pickServerUrl(raw, args),
                    parameterLocations: normalizeOpenApiParameterLocations(raw.parameters)
                }
                : {};
            const composioMeta = sourceType === 'composio_tool'
                ? {
                    toolSlug: inferComposioToolSlug(raw),
                    baseUrl: normalizeString(raw.baseUrl || raw.baseURL || args.composioBaseUrl || args.baseUrl, DEFAULT_COMPOSIO_API_BASE_URL),
                    userId: normalizeString(raw.userId || raw.user_id || args.userId || args.user_id),
                    connectedAccountId: normalizeString(raw.connectedAccountId || raw.connected_account_id || args.connectedAccountId || args.connected_account_id),
                    entityId: normalizeString(raw.entityId || raw.entity_id || args.entityId || args.entity_id)
                }
                : {};
            const adapter = openApiAdapterEnabled
                ? {
                    id: 'openapi_http',
                    type: 'openapi_http',
                    authProfileId,
                    supportsMutationsWithApproval: true
                }
                : composioAdapterEnabled
                    ? {
                        id: 'composio_rest_v3',
                        type: 'composio_rest_v3',
                        authProfileId,
                        supportsMutationsWithApproval: true
                    }
                    : requestedAdapter.id || requestedAdapter.type
                        ? {
                            ...requestedAdapter,
                            authProfileId
                        }
                        : localAdapterEnabled
                            ? {
                                ...inferredLocalAdapter,
                                authProfileId
                            }
                        : null;
            const callable = args.trustCallable === true && (
                raw.callable === true ||
                openApiAdapterEnabled ||
                composioAdapterEnabled ||
                localAdapterEnabled
            );
            const compiled = compileAndLintAilisContract(raw, {
                sourceType: sourceType || raw.sourceType || raw.source_type,
                server: args.server || args.serverName || args.mcpServerName,
                sourceName: args.sourceName,
                sourceUrl: args.sourceUrl,
                minScore: args.minScore || 60,
                id: raw.toolId || raw.id || raw.name || raw.operationId || `${sourceType || 'external'}_${index + 1}`
            });
            return this.makeExternalExposureEntry({
                contract: compiled.contract,
                lint: compiled.lint,
                promptCard: compiled.promptCard,
                source: {
                    type: sourceType,
                    name: normalizeString(args.sourceName || raw.sourceName || raw.source || sourceType),
                    url: normalizeString(args.sourceUrl || raw.sourceUrl || raw.url),
                    authProfileId,
                    ...openApiMeta,
                    ...composioMeta
                },
                callable,
                toolId: raw.toolId || raw.id || raw.name || raw.operationId,
                verification: callable ? (adapter?.id ? 'adapter_configured' : 'declared_callable') : 'adapter_required',
                exposureKind: `${sourceType}_external_contract_tool`,
                adapter,
                authProfileId,
                notes: [
                    callable
                        ? `External ${adapter?.id || 'declared'} adapter is configured; execution still checks auth and approval at call time.`
                        : 'Adapter/auth/executor required before runtime can call this tool.'
                ]
            });
        });
    }

    builtinPublicExternalExposures() {
        return this.compileRawExternalToolsForExposure(BUILTIN_PUBLIC_OPENAPI_OPERATIONS.map((entry) => ({ ...entry })), {
            sourceType: 'openapi_operation',
            trustCallable: true,
            enableOpenApiAdapter: true,
            minScore: 60
        }).map((entry) => ({
            ...entry,
            type: 'builtin_public_openapi_tool',
            verified: true,
            verification: 'builtin_public_readonly',
            notes: [
                ...normalizeArray(entry.notes),
                'Built-in public read-only OpenAPI adapter; no auth required.'
            ],
            virtualToolId: createExternalVirtualToolId(entry)
        }));
    }

    standardPackPublicExternalExposures(args = {}) {
        const operations = publicReadonlyOpenApiOperationsFromStandardPacks({
            packIds: args.standardToolPacks || args.packIds || args.packs,
            query: args.query || args.taskText || args.task
        });
        return this.compileRawExternalToolsForExposure(operations.map((entry) => ({
            ...entry,
            callable: true
        })), {
            sourceType: 'openapi_operation',
            trustCallable: true,
            enableOpenApiAdapter: true,
            minScore: args.minScore || 60
        }).map((entry) => ({
            ...entry,
            type: 'standard_pack_public_openapi_tool',
            verified: true,
            verification: 'standard_pack_public_readonly',
            notes: [
                ...normalizeArray(entry.notes),
                'AILIS Standard Tool Pack public read-only OpenAPI adapter; no auth required.'
            ],
            virtualToolId: createExternalVirtualToolId(entry)
        }));
    }

    findExternalExposure(state = {}, args = {}) {
        const requested = normalizeString(
            args.exposureId || args.exposure_id || args.externalToolId || args.external_tool_id || args.toolId || args.tool || args.id || args.name
        );
        if (!requested) {
            return null;
        }
        const lowered = requested.toLowerCase();
        return [
            ...(state.exposures || []),
            ...this.builtinPublicExternalExposures(),
            ...this.standardPackPublicExternalExposures(args)
        ].find((entry) => {
            const values = [
                entry.id,
                entry.toolId,
                entry.name,
                entry.title,
                entry.virtualToolId,
                createExternalVirtualToolId(entry),
                entry.contract?.id,
                entry.contract?.name,
                entry.modelFacing?.name
            ].map((value) => normalizeString(value).toLowerCase()).filter(Boolean);
            return values.includes(lowered);
        }) || null;
    }

    makeExternalExposureSearchEntry(exposure = {}) {
        const modelFacing = exposure.modelFacing || {};
        const contract = exposure.contract || {};
        const parameters = modelFacing.parameters || contract.inputSchema || {};
        const virtualToolId = exposure.virtualToolId || (exposure.callable ? createExternalVirtualToolId(exposure) : '');
        const description = normalizeString(
            modelFacing.description ||
                contract.purpose ||
                contract.description ||
                exposure.title ||
                exposure.name ||
                exposure.toolId
        );
        const callable = exposure.callable === true;
        return {
            id: callable ? virtualToolId : exposure.id,
            type: callable ? 'external_direct_tool' : 'external_exposure_candidate',
            exposure: exposure.exposure || 'direct_external',
            exposureId: exposure.id,
            toolId: exposure.toolId || contract.id || modelFacing.name,
            virtualToolId: callable ? virtualToolId : '',
            callable,
            verified: exposure.verified === true,
            verification: exposure.verification || '',
            adapter: exposure.adapter || null,
            source: exposure.source || {},
            score: exposure.score ?? null,
            risk: exposure.risk || contract.risk || '',
            spec: callable
                ? {
                    type: 'function',
                    name: virtualToolId,
                    description: `${description}\n\nUse this direct external tool after tool_search surfaces it. The Gateway routes it to the verified external adapter; do not wrap it in capability_manager.execute_exposed_external_tool.`,
                    strict: false,
                    parameters,
                    output_schema: modelFacing.output_schema || contract.outputSchema || {}
                }
                : modelFacing,
            call_pattern: callable
                ? {
                    tool: virtualToolId,
                    args: sampleArgsFromSchema(parameters)
                }
                : {
                    tool: 'capability_manager',
                    args: {
                        action: 'bulk_expose_external_tools',
                        reason: 'This candidate is visible but not callable yet; install, configure adapter/auth, and smoke test before exposing it.'
                    }
                },
            notes: exposure.notes || []
        };
    }

    makeContractIntakeSearchEntry(entry = {}) {
        const contract = entry.contract || {};
        const source = contract.source || entry.source || {};
        const description = normalizeString(contract.purpose || contract.description || entry.promptCard || contract.name || contract.id);
        return {
            id: `contract:${contract.id || contract.name || 'external'}`,
            type: 'external_contract_intake',
            callable: false,
            verified: false,
            verification: entry.status || '',
            toolId: contract.id || contract.name || '',
            source,
            score: entry.score ?? entry.lint?.score ?? null,
            risk: contract.risk || '',
            spec: {
                type: 'external_contract',
                name: contract.id || contract.name || '',
                description,
                parameters: contract.inputSchema || {},
                output_schema: contract.outputSchema || {},
                prompt_card: entry.promptCard || ''
            },
            call_pattern: {
                tool: 'capability_manager',
                args: {
                    action: 'bulk_expose_external_tools',
                    reason: 'Compile/expose this accepted contract with a verified adapter before direct execution.'
                }
            }
        };
    }

    async searchExternalToolEntries(args = {}) {
        const query = normalizeString(args.query || args.q || args.taskText || args.task).toLowerCase();
        const limit = Math.max(1, Math.min(Number(args.limit || 12), 100));
        const includeExposed = args.includeExposed !== false;
        const includeContracts = args.includeContracts !== false;
        const entries = [];

        if (includeExposed) {
            const state = await this.loadExternalExposure();
            for (const exposure of [
                ...(state.exposures || []),
                ...(args.includeBuiltinPublic !== false ? this.builtinPublicExternalExposures() : []),
                ...(args.includeStandardPublic !== false ? this.standardPackPublicExternalExposures(args) : [])
            ]) {
                entries.push(this.makeExternalExposureSearchEntry(exposure));
            }
        }

        if (includeContracts) {
            const intake = await this.loadContractIntake();
            const exposedContractIds = new Set(entries.map((entry) => normalizeString(entry.toolId).toLowerCase()).filter(Boolean));
            for (const contractEntry of intake.contracts || []) {
                const id = normalizeString(contractEntry.contract?.id || contractEntry.contract?.name).toLowerCase();
                if (id && exposedContractIds.has(id)) {
                    continue;
                }
                entries.push(this.makeContractIntakeSearchEntry(contractEntry));
            }
        }

        const uniqueEntries = [...new Map(entries.map((entry, index) => {
            const key = normalizeString(
                entry.virtualToolId ||
                    (entry.callable === true ? entry.call_pattern?.tool : '') ||
                    entry.toolId ||
                    entry.exposureId ||
                    entry.id
            ).toLowerCase();
            return [key || `${entry.type || 'entry'}:${index}`, entry];
        })).values()];

        const scored = uniqueEntries.map((entry) => {
            const searchText = JSON.stringify({
                id: entry.id,
                toolId: entry.toolId,
                virtualToolId: entry.virtualToolId,
                type: entry.type,
                source: entry.source,
                spec: entry.spec,
                notes: entry.notes
            });
            return {
                entry,
                score: query ? scoreText(query, searchText) : 1
            };
        });

        const tools = scored
            .filter(({ score }) => score > 0)
            .sort((left, right) =>
                right.score - left.score ||
                (right.entry.callable === true ? 1 : 0) - (left.entry.callable === true ? 1 : 0) ||
                String(left.entry.id).localeCompare(String(right.entry.id))
            )
            .slice(0, limit)
            .map(({ entry, score }) => ({
                ...entry,
                search_score: score
            }));

        return {
            status: 'completed',
            query,
            total: uniqueEntries.length,
            returned: tools.length,
            tools
        };
    }

    buildExternalExposureNotCallableResult(exposure = {}) {
        const status = exposure.verification === 'install_required'
            ? 'install_required'
            : exposure.verification === 'adapter_required'
                ? 'adapter_required'
                : 'not_callable';
        return {
            status,
            ok: false,
            exposureId: exposure.id,
            toolId: exposure.toolId,
            callable: false,
            verification: exposure.verification,
            source: exposure.source,
            message: 'This external tool is visible to the Agent as a contract/candidate, but it is not a verified callable runtime tool yet.',
            nextActions: [
                'Use capability_manager.plan_mcp_candidate/install_capability/smoke_mcp_candidate for MCP Registry candidates.',
                'Implement or configure the adapter/auth/executor, then re-expose with callable=true after smoke tests.',
                'Use built-in core tools if they can complete the task without this external integration.'
            ],
            contractSummary: buildContractPromptCard(exposure.contract || {})
        };
    }

    buildOpenApiUrlForExposure(exposure = {}, params = {}, extraQuery = {}) {
        const source = exposure.source || {};
        const baseUrl = normalizeString(source.baseUrl || source.url);
        const pathTemplate = normalizeString(source.path);
        if (!baseUrl || !pathTemplate) {
            return {
                error: 'openapi_callable_missing_base_url_or_path',
                message: 'Callable OpenAPI exposure requires source.baseUrl and source.path.'
            };
        }
        const used = new Set();
        const pathValue = pathTemplate.replace(/\{([^}]+)\}/g, (_match, key) => {
            const name = normalizeString(key);
            used.add(name);
            return encodeURIComponent(String(params[name] ?? ''));
        });
        const url = new URL(pathValue, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
        const locations = source.parameterLocations && typeof source.parameterLocations === 'object'
            ? source.parameterLocations
            : {};
        for (const [key, value] of Object.entries({ ...(params || {}), ...(extraQuery || {}) })) {
            if (used.has(key) || value === undefined || value === null || key === 'headers' || key === 'body') {
                continue;
            }
            const location = normalizeString(locations[key], 'query');
            if (location !== 'query') {
                continue;
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    url.searchParams.append(key, String(item));
                }
            } else if (typeof value !== 'object') {
                url.searchParams.set(key, String(value));
            }
        }
        return { url: url.toString() };
    }

    async checkLocalAdapterReadiness(adapter = {}, args = {}) {
        if (this.localAdapterRunner?.check) {
            return await this.localAdapterRunner.check(adapter, args);
        }
        if (normalizeString(adapter.type) !== 'local_document_converter') {
            return {
                status: 'adapter_unsupported',
                ok: false,
                adapter,
                message: 'Only local_document_converter adapters are supported by the local adapter runner.'
            };
        }
        const importNames = normalizeArray(adapter.importNames || adapter.requiredImports || adapter.importName || adapter.packageName)
            .map((entry) => normalizeString(entry))
            .filter(Boolean);
        if (!importNames.length) {
            return {
                status: 'adapter_invalid',
                ok: false,
                adapter,
                message: 'Local document adapter is missing importName/packageName.'
            };
        }
        const command = localAdapterCommand(adapter);
        const missingImports = [];
        for (const importName of importNames) {
            const result = await runProcessCapture(command, ['-c', pythonImportProbeSource(), importName], {
                timeoutMs: args.timeoutMs || 15000,
                cwd: this.projectRoot,
                maxOutputBytes: 256000
            });
            if (result.status === 'spawn_error') {
                return {
                    status: 'missing_runtime',
                    ok: false,
                    adapter,
                    command,
                    message: `Python runtime is unavailable for local adapter: ${result.error}`,
                    nextActions: ['Set AILIS_PYTHON to a Python executable with the required package installed.']
                };
            }
            if (!result.ok) {
                missingImports.push(importName);
            }
        }
        if (!missingImports.length) {
            return {
                status: 'completed',
                ok: true,
                adapter,
                command,
                packageName: normalizeString(adapter.packageName || importNames.join(',')),
                importName: importNames[0],
                importNames
            };
        }
        return {
            status: 'missing_dependency',
            ok: false,
            adapter,
            command,
            packageName: normalizeString(adapter.packageName || missingImports.join(',')),
            importName: missingImports[0],
            importNames,
            missingImports,
            message: `Python package is not importable: ${missingImports.join(', ')}`,
            nextActions: [`Install ${adapter.packageName || missingImports.join(', ')} in the AILIS Python environment.`, 'Use the alternate document converter if available.']
        };
    }

    async writeLocalAdapterArtifact(exposure = {}, payload = {}, text = '') {
        const artifactDir = path.join(this.stateDir, 'local-adapter-artifacts');
        await fsp.mkdir(artifactDir, { recursive: true });
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeTool = safeSegment(exposure.toolId || exposure.id || 'local_adapter');
        const extension = normalizeString(payload.format).toLowerCase() === 'json' ? 'json' : 'md';
        const artifactPath = path.join(artifactDir, `${safeTool}-${stamp}.${extension}`);
        const body = extension === 'json' && payload.document
            ? JSON.stringify(payload.document, null, 2)
            : String(text || payload.text || '');
        await fsp.writeFile(artifactPath, body, 'utf8');
        return artifactPath;
    }

    parseLocalAdapterPayload(result = {}) {
        const raw = normalizeString(result.stdout);
        if (!raw) {
            return {
                ok: false,
                error: normalizeString(result.stderr, 'Local adapter returned no stdout.')
            };
        }
        try {
            return JSON.parse(raw);
        } catch {
            return {
                ok: result.ok === true,
                text: raw,
                stderr: result.stderr
            };
        }
    }

    async executeLocalAdapterExposure(exposure = {}, params = {}, args = {}) {
        const adapter = exposure.adapter || {};
        if (normalizeString(adapter.type) !== 'local_document_converter') {
            return {
                status: 'adapter_required',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: 'This local contract needs a local_document_converter adapter before execution.'
            };
        }
        const filePath = path.resolve(normalizeString(params.path || params.file || params.filePath));
        if (!filePath || !normalizeString(params.path || params.file || params.filePath)) {
            return {
                status: 'invalid_args',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: 'Local document adapter requires args.path pointing to an existing local file.'
            };
        }
        const stat = await fsp.stat(filePath).catch(() => null);
        if (!stat?.isFile()) {
            return {
                status: 'file_not_found',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                path: filePath,
                message: 'Local document path does not exist or is not a file.'
            };
        }
        const readiness = await this.checkLocalAdapterReadiness(adapter, args);
        if (!readiness.ok) {
            return {
                ...readiness,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                path: filePath
            };
        }
        if (this.localAdapterRunner?.execute) {
            return await this.localAdapterRunner.execute(exposure, params, args);
        }
        const outputFormat = normalizeString(params.output_format || params.format || adapter.outputFormat, 'markdown');
        const command = localAdapterCommand(adapter);
        const adapterId = normalizeString(adapter.id);
        const source = adapterId === 'local_docling_converter'
            ? doclingConvertSource()
            : adapterId === 'local_python_document_extractor'
                ? pythonDocumentExtractSource()
                : markitdownConvertSource();
        const childArgs = adapterId === 'local_docling_converter'
            ? ['-c', source, filePath, outputFormat]
            : ['-c', source, filePath];
        const result = await runProcessCapture(command, childArgs, {
            timeoutMs: args.timeoutMs || params.timeoutMs || 120000,
            cwd: this.projectRoot,
            maxOutputBytes: LOCAL_ADAPTER_OUTPUT_LIMIT
        });
        const payload = this.parseLocalAdapterPayload(result);
        if (!result.ok || payload.ok === false) {
            return {
                status: result.status === 'output_limit_exceeded' ? 'output_limit_exceeded' : 'adapter_execution_failed',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                path: filePath,
                adapter,
                command,
                exitCode: result.exitCode,
                error: payload.error || normalizeString(result.stderr, 'Local adapter execution failed.'),
                stderr: normalizeString(result.stderr).slice(0, 4000),
                nextActions: ['Try the alternate document converter.', 'If output is too large, request a page range or table-only extraction.']
            };
        }
        const text = normalizeString(payload.text);
        const maxChars = Math.max(1000, Math.min(Number(params.max_chars || params.maxChars || 50000), 500000));
        const artifactPath = args.writeArtifact === false ? '' : await this.writeLocalAdapterArtifact(exposure, payload, text);
        return {
            status: 'completed',
            ok: true,
            exposureId: exposure.id,
            toolId: exposure.toolId,
            path: filePath,
            adapter,
            format: payload.format || outputFormat,
            text: text.slice(0, maxChars),
            truncated: text.length > maxChars,
            fullTextPath: artifactPath,
            tables: normalizeArray(payload.tables),
            metadata: payload.metadata || {},
            document: payload.document && outputFormat === 'json' ? payload.document : undefined
        };
    }

    async executeOpenApiExposure(exposure = {}, params = {}, args = {}, context = {}) {
        const method = normalizeString(exposure.source?.method, 'GET').toUpperCase();
        const hasOpenApiAdapter = exposure.adapter?.id === 'openapi_http' || exposure.adapter?.type === 'openapi_http';
        if (!SAFE_HTTP_METHODS.has(method) && !hasOpenApiAdapter) {
            return {
                status: 'blocked_unsafe_openapi_method',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                method,
                message: 'Only GET/HEAD/OPTIONS OpenAPI operations can be executed by the generic external executor. Mutating operations need a dedicated adapter and approval flow.'
            };
        }
        const approval = this.needsExternalExecutionApproval(exposure, { method, sourceType: 'openapi_operation' }, args, context);
        if (approval) {
            return approval;
        }
        const auth = await this.resolveAuthProfileForExecution(exposure, args);
        if (auth.status !== 'completed') {
            return {
                status: auth.status,
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: auth.message
            };
        }
        const authMaterial = this.buildAuthMaterial(auth.profile);
        if (authMaterial.status !== 'completed') {
            return {
                ...authMaterial,
                exposureId: exposure.id,
                toolId: exposure.toolId
            };
        }
        const effectiveExposure = auth.profile?.baseUrl
            ? {
                ...exposure,
                source: {
                    ...(exposure.source || {}),
                    baseUrl: auth.profile.baseUrl
                }
            }
            : exposure;
        const built = this.buildOpenApiUrlForExposure(effectiveExposure, params, authMaterial.query);
        if (built.error) {
            return {
                status: built.error,
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: built.message
            };
        }
        const timeoutMs = Math.max(1000, Math.min(Number(args.timeoutMs || params.timeoutMs || 15000), 60000));
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const headers = {
            accept: 'application/json, text/plain;q=0.9, */*;q=0.5',
            ...(auth.profile?.defaultHeaders && typeof auth.profile.defaultHeaders === 'object' ? auth.profile.defaultHeaders : {}),
            ...authMaterial.headers,
            ...(params.headers && typeof params.headers === 'object' && !Array.isArray(params.headers) ? params.headers : {})
        };
        const fetchOptions = {
            method,
            headers,
            signal: controller.signal
        };
        if (!SAFE_HTTP_METHODS.has(method)) {
            headers['content-type'] = headers['content-type'] || headers['Content-Type'] || 'application/json';
            const requestBody = params.body !== undefined
                ? params.body
                : params.json !== undefined
                    ? params.json
                    : Object.fromEntries(Object.entries(params || {}).filter(([key]) =>
                        !['headers', 'timeoutMs'].includes(key) &&
                        !Object.prototype.hasOwnProperty.call(effectiveExposure.source?.parameterLocations || {}, key) &&
                        !String(effectiveExposure.source?.path || '').includes(`{${key}}`)
                    ));
            fetchOptions.body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody || {});
        }
        try {
            const response = await fetch(built.url, fetchOptions);
            const contentType = response.headers.get('content-type') || '';
            const responseHeaders = extractResponseHeaders(response.headers);
            const failure = response.ok ? null : classifyHttpFailure(response.status, exposure, responseHeaders);
            const text = await response.text();
            let body = text;
            if (/json/i.test(contentType)) {
                try {
                    body = JSON.parse(text);
                } catch {
                    body = text;
                }
            }
            return {
                status: response.ok ? 'completed' : 'http_error',
                ok: response.ok,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                method,
                url: redactUrlSecret(built.url),
                request: {
                    headers: redactHeaders(headers),
                    authProfileId: auth.profile?.id || ''
                },
                http: {
                    status: response.status,
                    statusText: response.statusText,
                    contentType,
                    headers: responseHeaders
                },
                failure,
                failureReason: failure?.reason,
                message: failure?.message,
                nextActions: failure?.nextActions,
                body
            };
        } catch (error) {
            return {
                status: error?.name === 'AbortError' ? 'timeout' : 'error',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                method,
                url: redactUrlSecret(built.url),
                error: error?.message || String(error)
            };
        } finally {
            clearTimeout(timer);
        }
    }

    buildComposioExecuteBody(exposure = {}, params = {}, profile = {}, args = {}) {
        const source = exposure.source || {};
        const argumentsValue = params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments)
            ? params.arguments
            : params.args && typeof params.args === 'object' && !Array.isArray(params.args)
                ? params.args
                : Object.fromEntries(Object.entries(params || {}).filter(([key]) =>
                    !['headers', 'timeoutMs', 'user_id', 'userId', 'connected_account_id', 'connectedAccountId', 'entity_id', 'entityId'].includes(key)
                ));
        const userId = firstString(params.user_id, params.userId, args.user_id, args.userId, source.userId, profile.userId);
        const connectedAccountId = firstString(
            params.connected_account_id,
            params.connectedAccountId,
            args.connected_account_id,
            args.connectedAccountId,
            source.connectedAccountId,
            profile.connectedAccountId
        );
        const entityId = firstString(params.entity_id, params.entityId, args.entity_id, args.entityId, source.entityId, profile.entityId);
        return {
            arguments: argumentsValue,
            ...(userId ? { user_id: userId } : {}),
            ...(connectedAccountId ? { connected_account_id: connectedAccountId } : {}),
            ...(entityId ? { entity_id: entityId } : {})
        };
    }

    async executeComposioExposure(exposure = {}, params = {}, args = {}, context = {}) {
        const approval = this.needsExternalExecutionApproval(exposure, { method: 'POST', sourceType: 'composio_tool' }, args, context);
        if (approval) {
            return approval;
        }
        const hasAdapter = exposure.adapter?.id === 'composio_rest_v3' || exposure.adapter?.type === 'composio_rest_v3';
        if (!hasAdapter) {
            return {
                status: 'adapter_required',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: 'Composio execution requires the composio_rest_v3 adapter.'
            };
        }
        const auth = await this.resolveAuthProfileForExecution(exposure, args);
        if (auth.status !== 'completed') {
            return {
                status: auth.status,
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: auth.message
            };
        }
        const authMaterial = this.buildAuthMaterial(auth.profile || {
            id: 'composio_default',
            provider: 'composio',
            authType: 'composio_api_key_env',
            envVar: 'COMPOSIO_API_KEY',
            headerName: 'x-api-key'
        });
        if (authMaterial.status !== 'completed') {
            return {
                ...authMaterial,
                exposureId: exposure.id,
                toolId: exposure.toolId
            };
        }
        const slug = normalizeString(exposure.source?.toolSlug || exposure.toolId || exposure.name || exposure.contract?.name);
        if (!slug) {
            return {
                status: 'invalid_composio_exposure',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                message: 'Composio exposure is missing toolSlug/name.'
            };
        }
        const baseUrl = normalizeString(auth.profile?.baseUrl || exposure.source?.baseUrl, DEFAULT_COMPOSIO_API_BASE_URL).replace(/\/+$/, '');
        const url = `${baseUrl}/tools/execute/${encodeURIComponent(slug)}`;
        const timeoutMs = Math.max(1000, Math.min(Number(args.timeoutMs || params.timeoutMs || 30000), 120000));
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const headers = {
            accept: 'application/json, text/plain;q=0.9, */*;q=0.5',
            'content-type': 'application/json',
            ...(auth.profile?.defaultHeaders && typeof auth.profile.defaultHeaders === 'object' ? auth.profile.defaultHeaders : {}),
            ...authMaterial.headers,
            ...(params.headers && typeof params.headers === 'object' && !Array.isArray(params.headers) ? params.headers : {})
        };
        const body = this.buildComposioExecuteBody(exposure, params, auth.profile || {}, args);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });
            const contentType = response.headers.get('content-type') || '';
            const responseHeaders = extractResponseHeaders(response.headers);
            const failure = response.ok ? null : classifyHttpFailure(response.status, exposure, responseHeaders);
            const text = await response.text();
            let parsed = text;
            if (/json/i.test(contentType)) {
                try {
                    parsed = JSON.parse(text);
                } catch {
                    parsed = text;
                }
            }
            return {
                status: response.ok ? 'completed' : 'http_error',
                ok: response.ok,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                source: exposure.source,
                adapter: exposure.adapter,
                url: redactUrlSecret(url),
                request: {
                    headers: redactHeaders(headers),
                    authProfileId: auth.profile?.id || '',
                    hasUserScope: Boolean(body.user_id || body.connected_account_id || body.entity_id)
                },
                http: {
                    status: response.status,
                    statusText: response.statusText,
                    contentType,
                    headers: responseHeaders
                },
                failure,
                failureReason: failure?.reason,
                message: failure?.message,
                nextActions: failure?.nextActions,
                body: parsed
            };
        } catch (error) {
            return {
                status: error?.name === 'AbortError' ? 'timeout' : 'error',
                ok: false,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                url: redactUrlSecret(url),
                error: error?.message || String(error)
            };
        } finally {
            clearTimeout(timer);
        }
    }

    async executeExposedExternalTool(args = {}, context = {}) {
        const state = await this.loadExternalExposure();
        const exposure = this.findExternalExposure(state, args);
        if (!exposure) {
            return {
                status: 'not_found',
                ok: false,
                requested: normalizeString(args.exposureId || args.toolId || args.tool || args.id || args.name),
                message: 'No exposed external tool matched this id/name/toolId.',
                available: (state.exposures || []).slice(0, 20).map((entry) => ({
                    id: entry.id,
                    toolId: entry.toolId,
                    title: entry.title,
                    callable: entry.callable,
                    verification: entry.verification
                }))
            };
        }
        const params = args.args && typeof args.args === 'object' && !Array.isArray(args.args)
            ? args.args
            : args.parameters && typeof args.parameters === 'object' && !Array.isArray(args.parameters)
                ? args.parameters
                : {};
        if (exposure.callable !== true) {
            return this.buildExternalExposureNotCallableResult(exposure);
        }
        if (exposure.source?.type === 'installed_mcp_direct' || /^mcp__/.test(exposure.toolId || '')) {
            if (!this.mcpManager?.callTool) {
                return {
                    status: 'mcp_manager_unavailable',
                    ok: false,
                    exposureId: exposure.id,
                    toolId: exposure.toolId,
                    message: 'MCP manager is not available in this runtime.'
                };
            }
            const server = normalizeString(exposure.source?.name);
            const tool = normalizeString(exposure.source?.rawToolName || exposure.contract?.source?.rawToolName || exposure.name);
            if (!server || !tool) {
                return {
                    status: 'invalid_mcp_exposure',
                    ok: false,
                    exposureId: exposure.id,
                    toolId: exposure.toolId,
                    message: 'Callable MCP exposure is missing server or raw tool name.'
                };
            }
            const result = await this.mcpManager.callTool({
                server,
                tool,
                args: params,
                meta: args.meta,
                timeoutMs: args.timeoutMs
            });
            return {
                status: 'completed',
                ok: true,
                exposureId: exposure.id,
                toolId: exposure.toolId,
                source: exposure.source,
                result
            };
        }
        if (exposure.source?.type === 'openapi_operation') {
            return await this.executeOpenApiExposure(exposure, params, args, context);
        }
        if (exposure.source?.type === 'composio_tool') {
            return await this.executeComposioExposure(exposure, params, args, context);
        }
        if (exposure.source?.type === 'pydantic_tool' || exposure.adapter?.type === 'local_document_converter') {
            return await this.executeLocalAdapterExposure(exposure, params, args, context);
        }
        return {
            status: 'executor_missing',
            ok: false,
            exposureId: exposure.id,
            toolId: exposure.toolId,
            callable: true,
            source: exposure.source,
            message: 'This exposure was marked callable, but AILIS does not have an executor adapter for this source type yet.',
            nextActions: ['Install or implement a source-specific adapter.', 'Run smoke tests, then re-expose after verification.']
        };
    }

    async executeVirtualExternalTool(toolId = '', params = {}, context = {}) {
        if (!isExternalVirtualToolId(toolId)) {
            return {
                status: 'invalid_external_virtual_tool',
                ok: false,
                toolId,
                message: 'External virtual tools must use the form external__provider__tool.'
            };
        }
        return await this.executeExposedExternalTool({
            toolId,
            args: params,
            timeoutMs: params?.timeoutMs || context?.timeoutMs
        }, context);
    }

    async smokeExternalExposureObject(exposure = {}, args = {}, context = {}) {
        const checks = [];
        const addCheck = (id, ok, details = {}) => {
            checks.push({
                id,
                ok: Boolean(ok),
                ...details
            });
        };
        addCheck('exposure_present', true, {
            exposureId: exposure.id,
            toolId: exposure.toolId,
            sourceType: exposure.source?.type || ''
        });
        addCheck('contract_lint_approved', exposure.lint?.approved !== false, {
            score: exposure.score,
            lintStatus: exposure.lintStatus
        });
        addCheck('callable_flag', exposure.callable === true, {
            callable: exposure.callable,
            verification: exposure.verification
        });
        const adapterRequired = ['openapi_operation', 'composio_tool'].includes(exposure.source?.type) ||
            exposure.adapter?.type === 'local_document_converter';
        addCheck('adapter_configured', !adapterRequired || Boolean(exposure.adapter?.id || exposure.adapter?.type), {
            adapter: exposure.adapter || null
        });
        const auth = await this.resolveAuthProfileForExecution(exposure, args);
        if (auth.status !== 'completed') {
            addCheck('auth_profile', false, {
                status: auth.status,
                message: auth.message
            });
        } else if (auth.profile) {
            const authStatus = this.authProfileStatus(auth.profile);
            addCheck('auth_profile', authStatus.status === 'ready', {
                status: authStatus.status,
                profile: this.publicAuthProfile(auth.profile)
            });
        } else {
            addCheck('auth_profile', true, {
                profile: null,
                note: 'No auth profile required or provided.'
            });
        }
        if (exposure.adapter?.type === 'local_document_converter') {
            const readiness = await this.checkLocalAdapterReadiness(exposure.adapter, args);
            addCheck('local_adapter_dependency', readiness.ok === true, {
                status: readiness.status,
                packageName: readiness.packageName,
                importName: readiness.importName,
                command: readiness.command,
                message: readiness.message,
                nextActions: readiness.nextActions
            });
        }
        const ok = checks.every((check) => check.ok);
        if (args.live !== true && args.execute !== true) {
            return {
                status: ok ? 'completed' : 'smoke_failed',
                ok,
                mode: 'static',
                exposureId: exposure.id,
                toolId: exposure.toolId,
                checks
            };
        }
        if (!ok) {
            return {
                status: 'smoke_failed',
                ok: false,
                mode: 'live_skipped',
                exposureId: exposure.id,
                toolId: exposure.toolId,
                checks
            };
        }
        const live = await this.executeExposedExternalTool({
            ...args,
            args: args.args || args.parameters || {}
        }, context);
        return {
            status: live.ok === true || live.status === 'completed' ? 'completed' : 'smoke_failed',
            ok: live.ok === true || live.status === 'completed',
            mode: 'live',
            exposureId: exposure.id,
            toolId: exposure.toolId,
            checks,
            live
        };
    }

    async smokeExposedExternalTool(args = {}, context = {}) {
        const state = await this.loadExternalExposure();
        const exposure = this.findExternalExposure(state, args);
        if (!exposure) {
            return {
                status: 'not_found',
                ok: false,
                requested: normalizeString(args.exposureId || args.toolId || args.tool || args.id || args.name),
                message: 'No exposed external tool matched this id/name/toolId.'
            };
        }
        return await this.smokeExternalExposureObject(exposure, args, context);
    }

    compileStandardToolPackExposureEntries(args = {}) {
        const collected = collectStandardToolPackContracts({
            packIds: args.standardToolPacks || args.packIds || args.packs,
            query: args.query || args.taskText || args.task,
            limit: args.limit || args.maxTools || 100,
            includePublicReadonly: args.includePublicReadonly !== false,
            includeAuthRequired: args.includeAuthRequired !== false,
            includeLocalContracts: args.includeLocalContracts !== false
        });
        const publicOpenApi = collected.groups.openapiOperations.filter((tool) => normalizeString(tool.exposure) === 'public_readonly');
        const authOpenApi = collected.groups.openapiOperations.filter((tool) => normalizeString(tool.exposure) !== 'public_readonly');
        const authAdaptersEnabled = args.enableAuthRequiredAdapters === true || args.enableAuthenticatedAdapters === true;
        const localAdaptersEnabled = args.enableLocalAdapters === true || args.enableLocalDocumentAdapters === true;
        const authProfiles = collectStandardToolPackAuthProfiles({
            packIds: args.standardToolPacks || args.packIds || args.packs,
            query: args.query || args.taskText || args.task,
            limit: args.limit || args.maxTools || 100
        });
        const exposures = [
            ...this.compileRawExternalToolsForExposure(publicOpenApi.map((entry) => ({ ...entry, callable: true })), {
                ...args,
                sourceType: 'openapi_operation',
                trustCallable: true,
                enableOpenApiAdapter: true,
                minScore: args.minScore || 60
            }),
            ...this.compileRawExternalToolsForExposure(authOpenApi, {
                ...args,
                sourceType: 'openapi_operation',
                trustCallable: authAdaptersEnabled,
                enableOpenApiAdapter: authAdaptersEnabled,
                minScore: args.minScore || 60
            }),
            ...this.compileRawExternalToolsForExposure(collected.groups.composioTools, {
                ...args,
                sourceType: 'composio_tool',
                trustCallable: authAdaptersEnabled,
                enableComposioAdapter: authAdaptersEnabled,
                minScore: args.minScore || 60
            }),
            ...this.compileRawExternalToolsForExposure(collected.groups.mcpTools, {
                ...args,
                sourceType: 'mcp_tool',
                trustCallable: false,
                minScore: args.minScore || 60
            }),
            ...this.compileRawExternalToolsForExposure(collected.groups.contracts, {
                ...args,
                sourceType: normalizeString(args.sourceType || args.source_type || 'pydantic_tool'),
                trustCallable: localAdaptersEnabled,
                enableLocalAdapters: localAdaptersEnabled,
                minScore: args.minScore || 60
            })
        ].map((entry) => ({
            ...entry,
            standardToolPack: true,
            type: entry.callable ? 'standard_pack_callable_tool' : 'standard_pack_contract_tool',
            verification: entry.callable ? entry.verification : normalizeString(entry.verification, 'adapter_required'),
            notes: [
                ...normalizeArray(entry.notes),
                'Imported from AILIS Standard Tool Packs; use smoke_exposed_external_tool before relying on live authenticated backends.'
            ]
        }));
        return {
            status: 'completed',
            selectedPacks: collected.selectedPacks,
            counts: collected.counts,
            authProfiles,
            exposures
        };
    }

    defaultSmokeArgsForExposure(exposure = {}, args = {}) {
        const toolId = normalizeString(exposure.toolId || exposure.contract?.id);
        const maps = [
            args.smokeArgsByToolId,
            args.smokeArgs,
            args.parametersByToolId
        ].filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry));
        for (const map of maps) {
            if (map[toolId] && typeof map[toolId] === 'object' && !Array.isArray(map[toolId])) {
                return map[toolId];
            }
        }
        const defaults = {
            gmail_list_messages: { userId: 'me', maxResults: 1 },
            msgraph_list_messages: { '$top': 1, '$select': 'subject,from,receivedDateTime,isRead', '$orderby': 'receivedDateTime desc' },
            composio_gmail_search_emails: { query: 'newer_than:1d', max_results: 1 },
            firecrawl_scrape: { url: 'https://example.com', formats: ['markdown'], onlyMainContent: true },
            tavily_search: { query: 'OpenAI Codex', search_depth: 'basic', include_answer: false, include_raw_content: false, max_results: 1 },
            openalex_search_works: { search: 'Toolformer language models can teach themselves to use tools', 'per-page': 1 },
            crossref_search_works: { 'query.bibliographic': 'Toolformer language models can teach themselves to use tools', rows: 1 },
            semantic_scholar_search_contract: { query: 'Toolformer language models can teach themselves to use tools', fields: 'title,authors,year,venue,externalIds', limit: 1 }
        };
        if (defaults[toolId]) {
            return defaults[toolId];
        }
        return normalizeArray(exposure.contract?.examples)[0] ||
            normalizeArray(exposure.contract?.generatedExamples)[0] ||
            {};
    }

    shouldRunLiveSmokeForExposure(exposure = {}, args = {}) {
        if (args.liveSmoke !== true && args.executeSmoke !== true && args.live !== true) {
            return false;
        }
        if (args.liveSmokeAll === true) {
            return true;
        }
        const allow = new Set(normalizeArray(args.liveSmokeTools || args.liveTools || args.tools).map((entry) => normalizeString(entry).toLowerCase()).filter(Boolean));
        if (!allow.size) {
            return false;
        }
        const values = [
            exposure.toolId,
            exposure.id,
            exposure.virtualToolId,
            exposure.contract?.id
        ].map((entry) => normalizeString(entry).toLowerCase()).filter(Boolean);
        return values.some((value) => allow.has(value));
    }

    downgradeExposureAfterSmokeFailure(exposure = {}, smoke = {}) {
        const failed = normalizeArray(smoke.checks).find((check) => check.ok === false) || {};
        const reason = normalizeString(failed.status || failed.id || smoke.status, 'smoke_failed');
        return {
            ...exposure,
            callable: false,
            verified: false,
            virtualToolId: '',
            verification: reason,
            callableReason: `Standard pack adapter was not promoted because smoke failed: ${reason}.`,
            notes: [
                ...normalizeArray(exposure.notes),
                `Smoke failed (${reason}); keep visible as a contract-only candidate until repaired.`
            ].slice(-12),
            smoke: {
                status: smoke.status,
                ok: false,
                mode: smoke.mode,
                failedCheck: failed.id || '',
                reason,
                checks: smoke.checks
            }
        };
    }

    promoteExposureAfterSmokePass(exposure = {}, smoke = {}) {
        const next = {
            ...exposure,
            callable: true,
            verified: true,
            verification: smoke.mode === 'live' ? 'live_smoke_passed' : 'static_smoke_passed',
            callableReason: smoke.mode === 'live'
                ? 'Runtime adapter passed live smoke and can be called directly.'
                : 'Runtime adapter passed static auth/dependency smoke and can be called directly.',
            smoke: {
                status: smoke.status,
                ok: true,
                mode: smoke.mode,
                checks: smoke.checks
            }
        };
        next.virtualToolId = createExternalVirtualToolId(next);
        return next;
    }

    async verifyStandardExposureEntries(exposures = [], args = {}, context = {}) {
        const smokeResults = [];
        const verified = [];
        for (const exposure of exposures) {
            const shouldSmoke = exposure.standardToolPack === true &&
                (
                    exposure.callable === true ||
                    exposure.adapter?.id ||
                    exposure.adapter?.type
                );
            if (!shouldSmoke) {
                verified.push(exposure);
                continue;
            }
            const live = this.shouldRunLiveSmokeForExposure(exposure, args);
            const smoke = await this.smokeExternalExposureObject(exposure, {
                ...args,
                live,
                execute: live,
                approved: args.approved === true || live,
                args: args.args || args.parameters || this.defaultSmokeArgsForExposure(exposure, args)
            }, context);
            const failed = normalizeArray(smoke.checks).find((check) => check.ok === false) || {};
            smokeResults.push({
                toolId: exposure.toolId,
                status: smoke.status,
                ok: smoke.ok,
                mode: smoke.mode,
                verification: smoke.ok ? (smoke.mode === 'live' ? 'live_smoke_passed' : 'static_smoke_passed') : 'smoke_failed',
                reason: smoke.ok ? '' : normalizeString(failed.status || failed.id || smoke.status, 'smoke_failed')
            });
            verified.push(smoke.ok
                ? this.promoteExposureAfterSmokePass(exposure, smoke)
                : this.downgradeExposureAfterSmokeFailure(exposure, smoke));
        }
        return {
            exposures: verified,
            smokeResults
        };
    }

    async exposeStandardToolPacks(args = {}) {
        const compiled = this.compileStandardToolPackExposureEntries(args);
        const includeRejected = args.includeRejected === true;
        const maxExposure = Math.max(1, Math.min(Number(args.limit || args.maxTools || 100), 1000));
        let filtered = compiled.exposures
            .filter((entry) => includeRejected || entry.lint?.approved !== false)
            .slice(0, maxExposure);
        let configuredAuthProfiles = [];
        if (args.configureAuthProfiles !== false && args.dryRun !== true) {
            for (const profile of compiled.authProfiles || []) {
                const configured = await this.configureExternalAuthProfile(profile);
                configuredAuthProfiles.push(configured.profile || configured);
            }
        }
        let smokeResults = [];
        if (args.verifyAdapters === true || args.verifyLiveAdapters === true || args.smokeAdapters === true) {
            const verified = await this.verifyStandardExposureEntries(filtered, args);
            filtered = verified.exposures;
            smokeResults = verified.smokeResults;
        }
        if (args.dryRun === true) {
            return {
                status: 'completed',
                dryRun: true,
                selectedPacks: compiled.selectedPacks,
                counts: compiled.counts,
                authProfiles: compiled.authProfiles || [],
                configuredAuthProfiles,
                smokeResults,
                added: filtered.length,
                callable: filtered.filter((entry) => entry.callable).length,
                nonCallable: filtered.filter((entry) => !entry.callable).length,
                rejectedSkipped: compiled.exposures.length - filtered.length,
                exposures: filtered
            };
        }
        const state = await this.loadExternalExposure();
        const byId = new Map((state.exposures || []).map((entry) => [entry.id, entry]));
        for (const entry of filtered) {
            byId.set(entry.id, entry);
        }
        state.exposures = [...byId.values()]
            .sort((a, b) =>
                Number(b.callable) - Number(a.callable) ||
                Number(b.score || 0) - Number(a.score || 0) ||
                String(a.id).localeCompare(String(b.id))
            );
        const saved = await this.saveExternalExposure(state);
        this.emitGatewayEvent('tool_acquisition.standard_tool_packs.exposed', {
            added: filtered.length,
            callable: filtered.filter((entry) => entry.callable).length,
            total: saved.exposures.length
        });
        return {
            status: 'completed',
            externalExposurePath: this.externalExposurePath,
            selectedPacks: compiled.selectedPacks,
            counts: compiled.counts,
            authProfiles: compiled.authProfiles || [],
            configuredAuthProfiles,
            smokeResults,
            added: filtered.length,
            total: saved.exposures.length,
            callable: filtered.filter((entry) => entry.callable).length,
            nonCallable: filtered.filter((entry) => !entry.callable).length,
            rejectedSkipped: compiled.exposures.length - filtered.length,
            exposures: filtered
        };
    }

    async bulkExposeExternalTools(args = {}) {
        const includeInstalledMcp = args.includeInstalledMcp !== false && args.includeInstalledMCP !== false;
        const includeMcpRegistry = args.includeMcpRegistry !== false && args.includeMCPRegistry !== false;
        const includeRejected = args.includeRejected === true;
        const maxExposure = Math.max(1, Math.min(Number(args.limit || args.maxTools || 100), 1000));
        const exposures = [];
        if (args.includeStandardToolPacks === true || args.includeStandardPacks === true || args.standardToolPacks || args.packIds || args.packs) {
            exposures.push(...this.compileStandardToolPackExposureEntries(args).exposures);
        }
        if (includeInstalledMcp) {
            exposures.push(...await this.exposeInstalledMcpToolSpecs(args));
        }
        if (includeMcpRegistry) {
            exposures.push(...await this.exposeMcpRegistryCandidates(args));
        }
        const rawGroups = [
            { sourceType: 'composio_tool', items: args.composioTools || args.composio || [] },
            { sourceType: 'openapi_operation', items: args.openapiOperations || args.openApiOperations || args.openapi || [] },
            { sourceType: 'mcp_tool', items: args.mcpTools || args.mcpToolSpecs || [] },
            { sourceType: normalizeString(args.sourceType || args.source_type || 'generic_tool'), items: args.contracts || args.rawContracts || args.tools || args.toolSpecs || [] }
        ];
        for (const group of rawGroups) {
            if (!normalizeArray(group.items).length) {
                continue;
            }
            exposures.push(...this.compileRawExternalToolsForExposure(group.items, {
                ...args,
                sourceType: group.sourceType
            }));
        }
        const filtered = exposures
            .filter((entry) => includeRejected || entry.lint?.approved !== false)
            .slice(0, maxExposure);
        const state = await this.loadExternalExposure();
        const byId = new Map((state.exposures || []).map((entry) => [entry.id, entry]));
        for (const entry of filtered) {
            byId.set(entry.id, entry);
        }
        state.exposures = [...byId.values()]
            .sort((a, b) =>
                Number(b.callable) - Number(a.callable) ||
                Number(b.score || 0) - Number(a.score || 0) ||
                String(a.id).localeCompare(String(b.id))
            );
        const saved = await this.saveExternalExposure(state);
        this.emitGatewayEvent('tool_acquisition.external_tools.exposed', {
            added: filtered.length,
            callable: filtered.filter((entry) => entry.callable).length,
            total: saved.exposures.length
        });
        return {
            status: 'completed',
            externalExposurePath: this.externalExposurePath,
            added: filtered.length,
            total: saved.exposures.length,
            callable: filtered.filter((entry) => entry.callable).length,
            nonCallable: filtered.filter((entry) => !entry.callable).length,
            rejectedSkipped: exposures.length - filtered.length,
            exposurePolicy: includeRejected
                ? 'direct_visible_even_if_lint_rejected'
                : 'direct_visible_after_contract_lint',
            exposures: filtered
        };
    }

    async listExposedExternalTools(args = {}) {
        const state = await this.loadExternalExposure();
        const query = normalizeString(args.query || args.taskText || args.task).toLowerCase();
        const callable = args.callable === undefined ? null : args.callable === true || normalizeString(args.callable).toLowerCase() === 'true';
        const limit = Math.max(1, Math.min(Number(args.limit || 50), 500));
        const exposures = (state.exposures || [])
            .filter((entry) => callable === null || entry.callable === callable)
            .filter((entry) => !query || scoreText(query, JSON.stringify(entry)) > 0)
            .slice(0, limit);
        return {
            status: 'completed',
            externalExposurePath: this.externalExposurePath,
            updatedAt: state.updatedAt || '',
            total: state.exposures.length,
            returned: exposures.length,
            callable: exposures.filter((entry) => entry.callable).length,
            exposures
        };
    }

    async loadLearningTable() {
        const state = await readJsonFile(this.learningPath, null);
        if (state?.version === LEARNING_SCHEMA_VERSION && Array.isArray(state.tasks)) {
            return state;
        }
        return {
            version: LEARNING_SCHEMA_VERSION,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            tasks: []
        };
    }

    async saveLearningTable(state) {
        const next = {
            version: LEARNING_SCHEMA_VERSION,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tasks: Array.isArray(state.tasks) ? state.tasks : []
        };
        await writeJsonFileAtomic(this.learningPath, next);
        return next;
    }

    async recordToolOutcome(args = {}) {
        const taskText = normalizeString(args.taskText || args.task || args.userRequest || args.query);
        const taskSignature = normalizeString(args.taskSignature || args.signature, stableTaskSignature(taskText));
        const toolIds = normalizeArray(args.toolIds || args.tools || args.toolId || args.tool).map(String).filter(Boolean);
        if (!taskSignature || !toolIds.length) {
            return {
                status: 'invalid_tool_args',
                error: 'record_tool_outcome requires taskText/taskSignature and toolId/toolIds'
            };
        }
        const success = args.success === true || normalizeString(args.status).toLowerCase() === 'success';
        const score = Math.max(0, Math.min(Number(args.score ?? (success ? 1 : 0)), 1));
        const state = await this.loadLearningTable();
        let task = state.tasks.find((entry) => entry.signature === taskSignature);
        if (!task) {
            task = {
                signature: taskSignature,
                taskText,
                tokens: [...new Set(tokenize(taskText))].slice(0, 40),
                uses: 0,
                successes: 0,
                failures: 0,
                toolStats: {},
                examples: []
            };
            state.tasks.push(task);
        }
        task.taskText = task.taskText || taskText;
        task.tokens = [...new Set([...(task.tokens || []), ...tokenize(taskText)])].slice(0, 60);
        task.uses += 1;
        if (success) {
            task.successes += 1;
        } else {
            task.failures += 1;
        }
        for (const toolId of toolIds) {
            const stat = task.toolStats[toolId] || {
                uses: 0,
                successes: 0,
                failures: 0,
                scoreSum: 0,
                lastUsedAt: ''
            };
            stat.uses += 1;
            stat.scoreSum += score;
            if (success) {
                stat.successes += 1;
            } else {
                stat.failures += 1;
            }
            stat.lastUsedAt = new Date().toISOString();
            task.toolStats[toolId] = stat;
        }
        task.examples = normalizeArray(task.examples).slice(-8);
        task.examples.push({
            at: new Date().toISOString(),
            runId: normalizeString(args.runId),
            success,
            score,
            toolIds,
            evidence: normalizeString(args.evidence || args.note).slice(0, 600)
        });
        task.lastUpdatedAt = new Date().toISOString();
        const saved = await this.saveLearningTable(state);
        this.emitGatewayEvent('tool_acquisition.learning.recorded', {
            taskSignature,
            toolIds,
            success
        });
        return {
            status: 'completed',
            learningPath: this.learningPath,
            task,
            taskCount: saved.tasks.length
        };
    }

    async recommendTools(args = {}) {
        const taskText = normalizeString(args.taskText || args.task || args.query || args.userRequest);
        const limit = Math.max(1, Math.min(Number(args.limit || 8), 30));
        const state = await this.loadLearningTable();
        const queryTokens = new Set(tokenize(taskText));
        const learned = [];
        for (const task of state.tasks) {
            const overlap = (task.tokens || []).reduce((sum, token) => sum + (queryTokens.has(token) ? 1 : 0), 0);
            if (!overlap && taskText) {
                continue;
            }
            for (const [toolId, stat] of Object.entries(task.toolStats || {})) {
                const successRate = stat.uses ? stat.successes / stat.uses : 0;
                learned.push({
                    source: 'learning_table',
                    toolId,
                    taskSignature: task.signature,
                    taskText: task.taskText,
                    overlap,
                    uses: stat.uses,
                    successRate,
                    averageScore: stat.uses ? stat.scoreSum / stat.uses : 0,
                    lastUsedAt: stat.lastUsedAt
                });
            }
        }
        const core = this.searchCoreCandidates(taskText, limit).map((candidate) => ({
            source: 'core_catalog',
            toolId: candidate.id,
            candidate,
            overlap: scoreText(taskText, candidate.searchText),
            uses: 0,
            successRate: candidate.health === 'available' ? 1 : 0,
            averageScore: candidate.health === 'available' ? 1 : 0,
            lastUsedAt: ''
        }));
        const recommendations = [...learned, ...core]
            .sort((a, b) =>
                (b.overlap - a.overlap)
                || (b.successRate - a.successRate)
                || (b.averageScore - a.averageScore)
                || String(a.toolId).localeCompare(String(b.toolId))
            )
            .slice(0, limit);
        return {
            status: 'completed',
            taskText,
            learningPath: this.learningPath,
            recommendationCount: recommendations.length,
            recommendations
        };
    }
}

module.exports = {
    AILISToolAcquisitionGateway,
    OFFICIAL_MCP_REGISTRY_URL,
    CORE_TOOL_BUNDLES,
    BUILTIN_PUBLIC_OPENAPI_OPERATIONS,
    STANDARD_TOOL_PACKS,
    buildMcpSmokeProfile,
    buildRegistryCandidate,
    createExternalVirtualToolId,
    isExternalVirtualToolId,
    stableTaskSignature
};
