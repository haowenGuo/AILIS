const path = require('path');
const { randomUUID } = require('crypto');

const ARTIFACT_TOOLS_VERSION = 1;

const ARTIFACT_KINDS = Object.freeze([
    'workbook',
    'document',
    'presentation',
    'pdf',
    'table',
    'image',
    'text',
    'html',
    'bundle',
    'unknown'
]);

const ARTIFACT_ENTITY_KINDS = Object.freeze([
    'page',
    'sheet',
    'slide',
    'range',
    'table',
    'text_run',
    'paragraph',
    'image',
    'shape',
    'chart',
    'formula',
    'comment',
    'relationship',
    'resource',
    'metadata'
]);

const ARTIFACT_TOOL_ACTIONS = Object.freeze([
    'schema',
    'list_adapters',
    'plan_import',
    'open_session',
    'summary',
    'index',
    'inspect',
    'search',
    'query',
    'aggregate',
    'edit',
    'render',
    'validate',
    'export',
    'trace',
    'recalculate',
    'rollback',
    'diff',
    'roundtrip',
    'run_checks'
]);

const ARTIFACT_CAPABILITIES = Object.freeze([
    'load',
    'summary',
    'index',
    'inspect',
    'search',
    'query',
    'edit',
    'render',
    'validate',
    'export',
    'trace',
    'recalculate',
    'rollback',
    'diff',
    'roundtrip'
]);

const FORMAT_KIND_MAP = Object.freeze({
    xlsx: 'workbook',
    xlsm: 'workbook',
    xls: 'workbook',
    csv: 'table',
    tsv: 'table',
    docx: 'document',
    doc: 'document',
    pptx: 'presentation',
    ppt: 'presentation',
    pdf: 'pdf',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    webp: 'image',
    tif: 'image',
    tiff: 'image',
    md: 'text',
    markdown: 'text',
    txt: 'text',
    html: 'html',
    htm: 'html',
    json: 'text'
});

const DEFAULT_ADAPTER_CAPABILITIES = Object.freeze(['load', 'summary', 'inspect']);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeList(value = []) {
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeString(String(entry))).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(/[,;\n]+/).map((entry) => normalizeString(entry)).filter(Boolean);
    }
    return [];
}

function uniqueStrings(values = []) {
    return [...new Set(normalizeList(values))];
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function nowIso() {
    return new Date().toISOString();
}

function safeSegment(value = '', fallback = 'artifact') {
    const normalized = normalizeString(value, fallback)
        .replace(/[^A-Za-z0-9_.-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
    return normalized || fallback;
}

function createId(prefix = 'art') {
    return `${safeSegment(prefix, 'art')}_${randomUUID()}`;
}

function normalizeFormat(format = '', sourcePath = '') {
    const explicit = normalizeString(format).replace(/^\./, '').toLowerCase();
    if (explicit) {
        return explicit;
    }
    const ext = path.extname(normalizeString(sourcePath)).replace(/^\./, '').toLowerCase();
    return ext || 'unknown';
}

function inferArtifactKind(input = {}) {
    const explicit = normalizeString(input.kind || input.artifactKind || input.type).toLowerCase();
    if (ARTIFACT_KINDS.includes(explicit)) {
        return explicit;
    }
    const format = normalizeFormat(input.format || input.ext, input.sourcePath || input.path || input.filePath);
    return FORMAT_KIND_MAP[format] || 'unknown';
}

function normalizeCapabilities(value = [], fallback = DEFAULT_ADAPTER_CAPABILITIES) {
    const capabilities = uniqueStrings(value).filter((capability) => ARTIFACT_CAPABILITIES.includes(capability));
    return capabilities.length ? capabilities : [...fallback];
}

function createArtifactDescriptor(input = {}) {
    const format = normalizeFormat(input.format, input.sourcePath || input.path || input.filePath);
    const kind = inferArtifactKind({ ...input, format });
    const sourcePath = normalizeString(input.sourcePath || input.path || input.filePath);
    const id = normalizeString(input.id, createId('art'));
    return {
        schema: `ailis.artifact.v${ARTIFACT_TOOLS_VERSION}`,
        id,
        kind,
        format,
        sourcePath,
        createdAt: normalizeString(input.createdAt, nowIso()),
        updatedAt: normalizeString(input.updatedAt, input.createdAt || nowIso()),
        summary: normalizeString(input.summary, sourcePath ? `${kind} artifact: ${path.basename(sourcePath)}` : `${kind} artifact`),
        metadata: input.metadata && typeof input.metadata === 'object' ? cloneJson(input.metadata) : {},
        capabilities: normalizeCapabilities(input.capabilities, []),
        entities: Array.isArray(input.entities) ? input.entities.map((entity) => createArtifactEntity({ ...entity, artifactId: id })) : [],
        diagnostics: Array.isArray(input.diagnostics) ? input.diagnostics.map(createArtifactDiagnostic) : []
    };
}

function createArtifactEntity(input = {}) {
    const kind = normalizeString(input.kind || input.entityKind, 'metadata').toLowerCase();
    const entityKind = ARTIFACT_ENTITY_KINDS.includes(kind) ? kind : 'metadata';
    const artifactId = normalizeString(input.artifactId || input.artifact_id);
    return {
        schema: `ailis.artifact.entity.v${ARTIFACT_TOOLS_VERSION}`,
        id: normalizeString(input.id, createId('ent')),
        artifactId,
        kind: entityKind,
        locator: normalizeString(input.locator || input.target || input.address),
        label: normalizeString(input.label || input.name || input.title),
        bounds: input.bounds && typeof input.bounds === 'object' ? cloneJson(input.bounds) : {},
        style: input.style && typeof input.style === 'object' ? cloneJson(input.style) : {},
        content: input.content && typeof input.content === 'object' ? cloneJson(input.content) : {},
        native: input.native && typeof input.native === 'object' ? cloneJson(input.native) : {},
        diagnostics: Array.isArray(input.diagnostics) ? input.diagnostics.map(createArtifactDiagnostic) : []
    };
}

function createArtifactDiagnostic(input = {}) {
    const severity = normalizeString(input.severity, 'info').toLowerCase();
    const normalizedSeverity = ['info', 'warning', 'error', 'fatal'].includes(severity) ? severity : 'info';
    return {
        schema: `ailis.artifact.diagnostic.v${ARTIFACT_TOOLS_VERSION}`,
        code: safeSegment(input.code || input.reason || 'diagnostic', 'diagnostic'),
        severity: normalizedSeverity,
        target: normalizeString(input.target || input.locator),
        message: normalizeString(input.message || input.text || input.summary, 'Artifact diagnostic.'),
        recoverable: input.recoverable !== false,
        suggestedActions: uniqueStrings(input.suggestedActions || input.suggested_actions || input.nextActions || []),
        details: input.details && typeof input.details === 'object' ? cloneJson(input.details) : {}
    };
}

function createArtifactOperation(input = {}) {
    const action = normalizeString(input.action || input.op || input.operation, 'inspect').toLowerCase();
    const status = normalizeString(input.status, 'planned').toLowerCase();
    return {
        schema: `ailis.artifact.operation.v${ARTIFACT_TOOLS_VERSION}`,
        id: normalizeString(input.id, createId('op')),
        artifactId: normalizeString(input.artifactId || input.artifact_id),
        sessionId: normalizeString(input.sessionId || input.session_id),
        action: ARTIFACT_TOOL_ACTIONS.includes(action) ? action : action,
        target: normalizeString(input.target || input.locator),
        status: ['planned', 'running', 'completed', 'failed', 'skipped'].includes(status) ? status : 'planned',
        startedAt: normalizeString(input.startedAt || input.started_at, nowIso()),
        finishedAt: normalizeString(input.finishedAt || input.finished_at),
        input: input.input && typeof input.input === 'object' ? cloneJson(input.input) : {},
        output: input.output && typeof input.output === 'object' ? cloneJson(input.output) : {},
        diagnostics: Array.isArray(input.diagnostics) ? input.diagnostics.map(createArtifactDiagnostic) : []
    };
}

function createAdapterManifest(input = {}) {
    const formats = uniqueStrings(input.formats || input.extensions || []).map((entry) => entry.replace(/^\./, '').toLowerCase());
    const kinds = uniqueStrings(input.kinds || input.artifactKinds || []).map((entry) => entry.toLowerCase())
        .filter((entry) => ARTIFACT_KINDS.includes(entry));
    return {
        schema: `ailis.artifact.adapter.v${ARTIFACT_TOOLS_VERSION}`,
        id: safeSegment(input.id || input.name || 'adapter', 'adapter'),
        label: normalizeString(input.label || input.name || input.id, input.id || 'adapter'),
        status: normalizeString(input.status, 'planned'),
        priority: Number.isFinite(Number(input.priority)) ? Number(input.priority) : 100,
        formats,
        kinds,
        capabilities: normalizeCapabilities(input.capabilities),
        engines: input.engines && typeof input.engines === 'object' ? cloneJson(input.engines) : {},
        evaluationCases: uniqueStrings(input.evaluationCases || input.evaluation_cases || []),
        notes: uniqueStrings(input.notes || []),
        optional: input.optional === true
    };
}

function createArtifactEvaluationCase(input = {}) {
    return {
        schema: `ailis.artifact.eval_case.v${ARTIFACT_TOOLS_VERSION}`,
        id: safeSegment(input.id || input.name || 'artifact_eval_case', 'artifact_eval_case'),
        artifactKind: inferArtifactKind({ kind: input.artifactKind || input.kind, format: input.format }),
        format: normalizeFormat(input.format, input.input || input.path),
        input: normalizeString(input.input || input.path),
        goal: normalizeString(input.goal || input.prompt || input.description),
        requiredCapabilities: normalizeCapabilities(input.requiredCapabilities || input.required_capabilities, []),
        expectedEvidence: uniqueStrings(input.expectedEvidence || input.expected_evidence || []),
        expectedAnswer: input.expectedAnswer ?? input.expected_answer ?? null,
        checks: uniqueStrings(input.checks || []),
        status: normalizeString(input.status, 'planned')
    };
}

function buildArtifactToolsSchema() {
    return {
        schema: `ailis.artifact_tools.schema.v${ARTIFACT_TOOLS_VERSION}`,
        version: ARTIFACT_TOOLS_VERSION,
        actions: [...ARTIFACT_TOOL_ACTIONS],
        kinds: [...ARTIFACT_KINDS],
        entityKinds: [...ARTIFACT_ENTITY_KINDS],
        capabilities: [...ARTIFACT_CAPABILITIES],
        coreObjects: [
            'Artifact',
            'ArtifactEntity',
            'ArtifactOperation',
            'ArtifactDiagnostic',
            'AdapterManifest',
            'ArtifactEvaluationCase'
        ]
    };
}

module.exports = {
    ARTIFACT_TOOLS_VERSION,
    ARTIFACT_KINDS,
    ARTIFACT_ENTITY_KINDS,
    ARTIFACT_TOOL_ACTIONS,
    ARTIFACT_CAPABILITIES,
    FORMAT_KIND_MAP,
    buildArtifactToolsSchema,
    cloneJson,
    createAdapterManifest,
    createArtifactDescriptor,
    createArtifactDiagnostic,
    createArtifactEntity,
    createArtifactEvaluationCase,
    createArtifactOperation,
    createId,
    inferArtifactKind,
    normalizeCapabilities,
    normalizeFormat,
    normalizeList,
    normalizeString,
    uniqueStrings
};
