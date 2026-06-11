const fsp = require('fs/promises');
const path = require('path');
const { createHash } = require('crypto');
const { listToolContractSummaries } = require('./humanclaw-tool-contracts.cjs');
const { listHumanClawSkills } = require('./humanclaw-skills.cjs');
const {
    CONTRACT_SOURCE_PROFILES,
    compileAndLintAiglContract,
    lintAiglContract,
    buildContractPromptCard
} = require('./humanclaw-contract-compiler.cjs');

const OFFICIAL_MCP_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0/servers';
const LEARNING_SCHEMA_VERSION = 1;
const EXTERNAL_EXPOSURE_VERSION = 1;
const EXTERNAL_AUTH_PROFILE_VERSION = 1;
const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';

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
    return `HUMANCLAW_MCP_${safeSegment(serverName, 'SERVER').replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()}_TOKEN`;
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
                title: 'AIGL can convert returned tools into mcp__server__tool direct specs.',
                type: 'mcp_direct_spec_generation',
                required: true
            }
        ]
    };
}

class HumanClawToolAcquisitionGateway {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.stateDir = path.resolve(options.stateDir || path.join(this.projectRoot, '.humanclaw-state', 'tool-acquisition'));
        this.learningPath = path.join(this.stateDir, 'tool-learning.json');
        this.contractIntakePath = path.join(this.stateDir, 'contract-intake.json');
        this.externalExposurePath = path.join(this.stateDir, 'external-tool-exposure.json');
        this.externalAuthProfilesPath = path.join(this.stateDir, 'external-auth-profiles.json');
        this.registryUrl = normalizeString(options.registryUrl, OFFICIAL_MCP_REGISTRY_URL);
        this.fetchRegistry = typeof options.registryFetcher === 'function' ? options.registryFetcher : this.defaultFetchRegistry.bind(this);
        this.mcpManager = options.mcpManager || null;
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
            coreBundleCount: CORE_TOOL_BUNDLES.length
        };
    }

    listContractSources() {
        return CONTRACT_SOURCE_PROFILES.map((profile) => cloneJson(profile));
    }

    listCoreTools() {
        const availableContracts = new Set(listToolContractSummaries().map((contract) => contract.id));
        const availableSkills = new Set(listHumanClawSkills().map((skill) => skill.id));
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
                source: 'aigl_core_tool_catalog',
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
        const errors = [];
        let candidates = [];
        if (includeCore) {
            candidates.push(...this.searchCoreCandidates(query, limit));
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
            validationCommands: normalizeArray(args.validationCommands || ['pnpm test:humanclaw-skills']).map(String)
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
        const result = compileAndLintAiglContract(raw, {
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
        const lint = lintAiglContract(contract, { minScore: args.minScore });
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
        const compiled = rawContracts.map((raw, index) => compileAndLintAiglContract(raw, {
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
                message: 'Do not store raw secrets in AIGL auth profiles. Put the secret in an environment variable and store only envVar here.'
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
            const compiled = compileAndLintAiglContract(raw, {
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
            const compiled = compileAndLintAiglContract(raw, {
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
                        : null;
            const callable = args.trustCallable === true && (
                raw.callable === true ||
                openApiAdapterEnabled ||
                composioAdapterEnabled
            );
            const compiled = compileAndLintAiglContract(raw, {
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

    findExternalExposure(state = {}, args = {}) {
        const requested = normalizeString(
            args.exposureId || args.exposure_id || args.externalToolId || args.external_tool_id || args.toolId || args.tool || args.id || args.name
        );
        if (!requested) {
            return null;
        }
        const lowered = requested.toLowerCase();
        return [...(state.exposures || []), ...this.builtinPublicExternalExposures()].find((entry) => {
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
                ...(args.includeBuiltinPublic !== false ? this.builtinPublicExternalExposures() : [])
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

        const scored = entries.map((entry) => {
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
                (right.entry.callable === true ? 1 : 0) - (left.entry.callable === true ? 1 : 0) ||
                right.score - left.score ||
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
            total: entries.length,
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
                    contentType
                },
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
                    contentType
                },
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
        return {
            status: 'executor_missing',
            ok: false,
            exposureId: exposure.id,
            toolId: exposure.toolId,
            callable: true,
            source: exposure.source,
            message: 'This exposure was marked callable, but AIGL does not have an executor adapter for this source type yet.',
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
        const adapterRequired = ['openapi_operation', 'composio_tool'].includes(exposure.source?.type);
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
                profile: this.publicAuthProfile(auth.profile)
            });
        } else {
            addCheck('auth_profile', true, {
                profile: null,
                note: 'No auth profile required or provided.'
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

    async bulkExposeExternalTools(args = {}) {
        const includeInstalledMcp = args.includeInstalledMcp !== false && args.includeInstalledMCP !== false;
        const includeMcpRegistry = args.includeMcpRegistry !== false && args.includeMCPRegistry !== false;
        const includeRejected = args.includeRejected === true;
        const maxExposure = Math.max(1, Math.min(Number(args.limit || args.maxTools || 100), 1000));
        const exposures = [];
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
    HumanClawToolAcquisitionGateway,
    OFFICIAL_MCP_REGISTRY_URL,
    CORE_TOOL_BUNDLES,
    BUILTIN_PUBLIC_OPENAPI_OPERATIONS,
    buildMcpSmokeProfile,
    buildRegistryCandidate,
    createExternalVirtualToolId,
    isExternalVirtualToolId,
    stableTaskSignature
};
