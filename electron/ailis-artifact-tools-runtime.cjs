const fs = require('fs/promises');
const path = require('path');
const {
    ARTIFACT_CAPABILITIES,
    buildArtifactToolsSchema,
    cloneJson,
    createAdapterManifest,
    createArtifactDescriptor,
    createArtifactDiagnostic,
    createArtifactEvaluationCase,
    createArtifactOperation,
    createId,
    inferArtifactKind,
    normalizeCapabilities,
    normalizeFormat,
    normalizeString,
    uniqueStrings
} = require('./ailis-artifact-tools-model.cjs');
const {
    IMPLEMENTED_ADAPTER_IDS,
    editXlsxArtifact,
    exportXlsxArtifact,
    indexFileArtifact,
    indexXlsxArtifact,
    inspectArtifact,
    queryXlsxArtifact,
    recalculateXlsxArtifact,
    renderArtifactPreview,
    rollbackXlsxArtifact,
    roundtripArtifact,
    runArtifactAdapterChecks,
    searchArtifact,
    searchXlsxArtifact,
    traceXlsxFormula,
    validateAgainstExpected
} = require('./ailis-artifact-tools-adapters.cjs');

const ARTIFACT_TOOLS_RUNTIME_ID = 'ailis_artifact_tools';

const DEFAULT_ADAPTER_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'xlsx',
        label: 'XLSX Workbook Runtime',
        status: 'available',
        priority: 10,
        formats: ['xlsx', 'xlsm'],
        kinds: ['workbook'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'query', 'materialize', 'edit', 'render', 'validate', 'export', 'trace', 'recalculate', 'rollback', 'diff', 'roundtrip'],
        engines: {
            parser: 'exceljs/openpyxl/ooxml',
            renderer: 'native-range-renderer/libreoffice',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['xlsx_map_path_color', 'xlsx_formula_error_repair', 'xlsx_dashboard_visual_qa'],
        notes: ['Exact styles, formulas, merged cells, charts, comments, and render QA are first-class requirements.']
    }),
    Object.freeze({
        id: 'pdf',
        label: 'PDF Runtime',
        status: 'available',
        priority: 20,
        formats: ['pdf'],
        kinds: ['pdf'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'materialize', 'render', 'validate', 'trace'],
        engines: {
            parser: 'pypdf/pdfplumber/pdfjs',
            renderer: 'poppler/pdfium/pdfjs',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['pdf_text_layer_search', 'pdf_page_render', 'pdf_scanned_needs_ocr'],
        notes: ['OCR is fallback-only after detecting a weak or missing text layer.']
    }),
    Object.freeze({
        id: 'docx',
        label: 'DOCX Runtime',
        status: 'available',
        priority: 30,
        formats: ['docx'],
        kinds: ['document'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'materialize', 'edit', 'render', 'validate', 'export', 'diff', 'roundtrip'],
        engines: {
            parser: 'python-docx/ooxml',
            renderer: 'libreoffice-headless',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['docx_table_inspect', 'docx_render_layout_gate', 'docx_edit_roundtrip'],
        notes: ['Render-to-PNG is required for layout QA before delivery.']
    }),
    Object.freeze({
        id: 'pptx',
        label: 'PPTX Runtime',
        status: 'available',
        priority: 40,
        formats: ['pptx'],
        kinds: ['presentation'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'materialize', 'edit', 'render', 'validate', 'export', 'diff', 'roundtrip'],
        engines: {
            parser: 'python-pptx/ooxml',
            renderer: 'libreoffice-headless',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['pptx_slide_inventory', 'pptx_template_edit', 'pptx_render_contact_sheet'],
        notes: ['Template-following requires clone/edit semantics, not visual imitation from scratch.']
    }),
    Object.freeze({
        id: 'csv',
        label: 'CSV Table Runtime',
        status: 'available',
        priority: 50,
        formats: ['csv', 'tsv'],
        kinds: ['table'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'materialize', 'edit', 'validate', 'export', 'roundtrip'],
        engines: {
            parser: 'csv-parser/pandas',
            renderer: 'table-preview',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['csv_schema_inference', 'csv_transform_export'],
        notes: ['Schema inference, encoding, delimiter, and malformed-row diagnostics are required.']
    }),
    Object.freeze({
        id: 'image',
        label: 'Image Runtime',
        status: 'available',
        priority: 70,
        formats: ['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff'],
        kinds: ['image'],
        capabilities: ['load', 'summary', 'inspect', 'index', 'search', 'materialize', 'render', 'validate', 'export', 'roundtrip'],
        engines: {
            parser: 'pillow/sharp',
            renderer: 'native-image',
            validator: 'artifact-runtime'
        },
        evaluationCases: ['image_metadata_nonblank', 'image_crop_render'],
        notes: ['OCR and vision models are optional downstream tools, not the core image adapter.']
    }),
    Object.freeze({
        id: 'ragflow_lite_table',
        label: 'RAGFlow-Lite Table Chunk Backend',
        status: 'legacy_optional',
        priority: 200,
        formats: ['xlsx', 'xls', 'csv', 'tsv', 'txt'],
        kinds: ['table', 'workbook', 'text'],
        capabilities: ['load', 'summary', 'inspect', 'search'],
        engines: {
            parser: 'vendor/ragflow-lite table.py',
            renderer: 'none',
            validator: 'limited'
        },
        evaluationCases: ['ragflow_table_chunk_smoke'],
        notes: ['Optional text/RAG chunk backend. Not the canonical artifact runtime and not suitable for exact Excel styles.'],
        optional: true
    })
]);

function normalizeAction(value = '', fallback = 'schema') {
    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function adapterSupports(adapter = {}, request = {}) {
    const format = normalizeFormat(request.format, request.path || request.sourcePath);
    const kind = inferArtifactKind({ kind: request.kind, format, sourcePath: request.path || request.sourcePath });
    const capability = normalizeString(request.capability || request.requiredCapability).toLowerCase();
    const formatOk = !format || format === 'unknown' || adapter.formats.includes(format);
    const kindOk = !kind || kind === 'unknown' || adapter.kinds.includes(kind);
    const capabilityOk = !capability || adapter.capabilities.includes(capability);
    return formatOk && kindOk && capabilityOk;
}

function compareAdapters(left, right) {
    const priority = Number(left.priority || 100) - Number(right.priority || 100);
    if (priority !== 0) {
        return priority;
    }
    return String(left.id).localeCompare(String(right.id));
}

function createErrorResult(code, message, details = {}) {
    return {
        ok: false,
        status: 'failed',
        code,
        message,
        details
    };
}

function compactDiagnostics(diagnostics = [], limit = 20) {
    return (Array.isArray(diagnostics) ? diagnostics : [])
        .slice(0, limit)
        .map((diagnostic) => ({
            code: normalizeString(diagnostic.code),
            severity: normalizeString(diagnostic.severity, 'info'),
            message: normalizeString(diagnostic.message),
            target: normalizeString(diagnostic.target || diagnostic.details?.target)
        }));
}

function compactRouteAdvice(route = {}) {
    if (!route || typeof route !== 'object' || Array.isArray(route)) {
        return {};
    }
    return {
        currentTool: normalizeString(route.currentTool, 'artifact_tools'),
        actions: Array.isArray(route.actions) ? route.actions.slice(0, 16).map((entry) => normalizeString(entry)).filter(Boolean) : []
    };
}

function compactPlanForProtocol(plan = {}) {
    const adapter = plan.adapter || {};
    return {
        sourcePath: normalizeString(plan.sourcePath),
        format: normalizeString(plan.format),
        kind: normalizeString(plan.kind),
        adapterId: normalizeString(adapter.id),
        adapterStatus: normalizeString(adapter.status),
        requiredCapabilities: Array.isArray(plan.requiredCapabilities) ? plan.requiredCapabilities.slice(0, 16) : [],
        route: compactRouteAdvice(plan.route || {}),
        diagnostics: compactDiagnostics(plan.diagnostics || [])
    };
}

function buildRenderObservation(result = {}) {
    const render = result.render || {};
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        action: 'render',
        adapterId: normalizeString(result.adapterId),
        sourcePath: normalizeString(result.plan?.sourcePath || render.sourcePath),
        target: normalizeString(render.target || render.range || result.plan?.target),
        outputPath: normalizeString(render.outputPath),
        renderKind: normalizeString(render.renderKind),
        passed: render.passed === true,
        cacheHit: render.cacheHit === true,
        width: Number(render.width || render.visualCheck?.width || 0) || 0,
        height: Number(render.height || render.visualCheck?.height || 0) || 0,
        bytes: Number(render.bytes || 0) || 0,
        visualCheck: render.visualCheck || null,
        diagnostics: compactDiagnostics(render.diagnostics || [])
    };
}

function buildValidateObservation(result = {}) {
    const validation = result.validation || {};
    const structure = result.structure || {};
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        action: 'validate',
        adapterId: normalizeString(result.adapterId),
        sourcePath: normalizeString(result.plan?.sourcePath),
        status: structure.passed === false
            ? 'failed'
            : normalizeString(validation.status, 'passed'),
        passed: structure.passed !== false,
        checks: structure.checks || validation.checks || {},
        diagnostics: compactDiagnostics(structure.diagnostics || validation.diagnostics || [])
    };
}

function buildOpenSessionObservation(result = {}) {
    const session = result.session || {};
    const artifact = session.artifact || {};
    const artifactHandle = session.handle || buildArtifactToolsHandle({ session, plan: result.plan });
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        action: 'open_session',
        sessionId: normalizeString(session.id),
        artifactId: normalizeString(artifact.id),
        adapterId: normalizeString(session.adapterId || result.plan?.adapter?.id),
        sourcePath: normalizeString(artifact.sourcePath || result.plan?.sourcePath),
        format: normalizeString(artifact.format || result.plan?.format),
        kind: normalizeString(artifact.kind || result.plan?.kind),
        status: normalizeString(session.status, 'completed'),
        artifactHandle,
        diagnostics: compactDiagnostics(session.diagnostics || result.plan?.diagnostics || [])
    };
}

function buildInspectionTextWindow(value = '', maxChars = 4200) {
    const text = String(value || '').trim();
    if (text.length <= maxChars) {
        return {
            text,
            textChars: text.length,
            textTruncated: false
        };
    }
    const marker = '\n\n[inspection text omitted; use artifact_tools search/query with the returned artifactHandle]\n\n';
    const tailChars = Math.min(900, Math.floor(maxChars / 4));
    const headChars = Math.max(1, maxChars - marker.length - tailChars);
    return {
        text: `${text.slice(0, headChars)}${marker}${text.slice(-tailChars)}`,
        textChars: text.length,
        textTruncated: true
    };
}

function buildInspectObservation(result = {}) {
    const inspection = result.inspection || {};
    const structure = inspection.structure || {};
    const textWindow = buildInspectionTextWindow(inspection.text);
    const format = normalizeString(inspection.format || result.plan?.format);
    const imageOnly = ['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff'].includes(format);
    const complete = textWindow.textTruncated !== true;
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        action: 'inspect',
        adapterId: normalizeString(result.adapterId || inspection.adapterId),
        format,
        sourcePath: normalizeString(inspection.sourcePath || result.plan?.sourcePath),
        semanticLevel: imageOnly ? 'metadata' : (structure.tableCount || structure.slideCount || structure.pageCount ? 'structure' : 'text'),
        complete,
        truncated: textWindow.textTruncated === true,
        coverage: {
            kind: imageOnly ? 'image_metadata' : 'artifact_inspection',
            complete,
            truncated: textWindow.textTruncated === true,
            pageCount: Number(structure.pageCount || 0) || 0,
            slideCount: Number(structure.slideCount || 0) || 0,
            tableCount: Number(structure.tableCount || 0) || 0
        },
        ...(imageOnly ? {
            limitation: 'Image inspection exposes metadata and deterministic pixel checks only; it does not provide semantic visual understanding or OCR.'
        } : {}),
        text: textWindow.text,
        textChars: textWindow.textChars,
        textTruncated: textWindow.textTruncated,
        structure: {
            pageCount: Number(structure.pageCount || 0) || 0,
            paragraphCount: Number(structure.paragraphCount || 0) || 0,
            tableCount: Number(structure.tableCount || 0) || 0,
            slideCount: Number(structure.slideCount || 0) || 0,
            imageCount: Number(structure.imageCount || structure.mediaCount || 0) || 0,
            commentCount: Number(structure.commentCount || 0) || 0
        },
        diagnostics: compactDiagnostics(inspection.diagnostics || result.diagnostics || [])
    };
}

function buildArtifactToolsHandle({ session = {}, plan = {} } = {}) {
    const safeSession = session && typeof session === 'object' ? session : {};
    const safePlan = plan && typeof plan === 'object' ? plan : {};
    const sessionId = normalizeString(safeSession.id);
    const artifactId = normalizeString(safeSession.artifact?.id);
    if (!sessionId || !artifactId) {
        return null;
    }
    return {
        schema: 'ailis.artifact_handle.v1',
        owner: 'artifact_tools',
        runtimeId: ARTIFACT_TOOLS_RUNTIME_ID,
        tool: 'artifact_tools',
        sessionId,
        artifactId,
        allowedActions: compactRouteAdvice(safePlan.route || safeSession.artifact?.metadata?.route || {}).actions
    };
}

function resolveArtifactToolsHandleArgs(input = {}) {
    const handle = input.artifactHandle || input.artifact_handle || input.handle;
    if (!handle || typeof handle !== 'object' || Array.isArray(handle)) {
        return { ok: true, args: input };
    }
    const owner = normalizeString(handle.owner || handle.tool || handle.runtimeId || handle.runtime_id);
    if (owner && !['artifact_tools', ARTIFACT_TOOLS_RUNTIME_ID].includes(owner)) {
        return {
            ok: false,
            result: createErrorResult('artifact_owner_mismatch', `Artifact handle belongs to ${owner}, not artifact_tools.`, {
                handle,
                requiredTool: 'artifact_tools'
            })
        };
    }
    return {
        ok: true,
        args: {
            ...input,
            sessionId: input.sessionId || input.session_id || handle.sessionId || handle.session_id,
            artifactId: input.artifactId || input.artifact_id || handle.artifactId || handle.artifact_id
        }
    };
}

function resolveProtocolObservation(result = {}) {
    if (result.observation) {
        return result.observation;
    }
    if (result.inspection?.observation) {
        return result.inspection.observation;
    }
    if (normalizeString(result.action) === 'inspect' && result.inspection) {
        return buildInspectObservation(result);
    }
    if (result.search?.observation) {
        return result.search.observation;
    }
    if (result.query?.observation) {
        return result.query.observation;
    }
    if (result.render) {
        return buildRenderObservation(result);
    }
    if (result.validation || result.structure) {
        return buildValidateObservation(result);
    }
    if (result.session) {
        return buildOpenSessionObservation(result);
    }
    return null;
}

function buildModelView(result = {}) {
    const action = normalizeString(result.action || result.session?.operations?.[0]?.action);
    const observation = resolveProtocolObservation(result);
    const artifactHandle = result.session?.handle || observation?.artifactHandle || buildArtifactToolsHandle({
        session: result.session,
        plan: result.plan
    });
    return {
        schema: 'ailis.artifact_tools.tool_api_result.v1',
        ok: result.ok === true,
        status: normalizeString(result.status, result.ok === false ? 'failed' : 'completed'),
        action,
        adapterId: normalizeString(result.adapterId || result.plan?.adapter?.id || result.session?.adapterId),
        protocol: {
            runtimeId: ARTIFACT_TOOLS_RUNTIME_ID,
            tool: 'artifact_tools',
            contract: 'stable compact Tool API result',
            fullResultLocation: 'structuredContent/details',
            observationLocation: 'observation',
            handleLocation: 'artifactHandle'
        },
        artifactHandle,
        artifact: {
            sessionId: normalizeString(result.session?.id),
            artifactId: normalizeString(result.session?.artifact?.id),
            sourcePath: normalizeString(result.plan?.sourcePath || result.session?.artifact?.sourcePath || observation?.sourcePath),
            format: normalizeString(result.plan?.format || result.session?.artifact?.format || observation?.format),
            kind: normalizeString(result.plan?.kind || result.session?.artifact?.kind),
            handle: artifactHandle
        },
        plan: result.plan ? compactPlanForProtocol(result.plan) : undefined,
        observation,
        diagnostics: compactDiagnostics(result.diagnostics || result.plan?.diagnostics || observation?.diagnostics || [])
    };
}

function attachProtocolResult(result = {}) {
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
        return result;
    }
    const observation = resolveProtocolObservation(result);
    if (observation && !result.observation) {
        result.observation = observation;
    }
    result.modelView = buildModelView(result);
    return result;
}

function createOkResult(payload = {}) {
    return attachProtocolResult({
        ok: true,
        status: 'completed',
        ...payload
    });
}

function safePathSegment(value = '', fallback = 'item') {
    const normalized = normalizeString(value, fallback)
        .replace(/[^A-Za-z0-9_.-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 96);
    return normalized || fallback;
}

function nowIso() {
    return new Date().toISOString();
}

function resolveWorkbenchPaths(input = {}, adapterInput = {}) {
    const repoRoot = path.resolve(normalizeString(
        input.repoRoot ||
        input.repo_root ||
        adapterInput.repoRoot ||
        process.cwd()
    ));
    const workbenchRoot = path.resolve(
        normalizeString(input.workbenchRoot || input.workbench_root)
            ? normalizeString(input.workbenchRoot || input.workbench_root)
            : path.join(repoRoot, '.ailis-state', 'workbench')
    );
    const runId = safePathSegment(
        input.runId ||
        input.run_id ||
        input.agentRunId ||
        input.agent_run_id ||
        input.sessionId ||
        input.session_id ||
        createId('run'),
        'run'
    );
    const runDir = path.join(workbenchRoot, runId);
    return {
        repoRoot,
        workbenchRoot,
        runId,
        runDir,
        inputsDir: path.join(runDir, 'inputs'),
        scriptsDir: path.join(runDir, 'scripts'),
        outputsDir: path.join(runDir, 'outputs'),
        manifestPath: path.join(runDir, 'manifest.json')
    };
}

async function ensureWorkbenchDirs(paths = {}) {
    await fs.mkdir(paths.inputsDir, { recursive: true });
    await fs.mkdir(paths.scriptsDir, { recursive: true });
    await fs.mkdir(paths.outputsDir, { recursive: true });
}

async function readWorkbenchManifest(paths = {}) {
    try {
        const text = await fs.readFile(paths.manifestPath, 'utf8');
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
        }
    } catch {
        // New workbench run or a corrupt manifest; rebuild the envelope below.
    }
    const createdAt = nowIso();
    return {
        schema: 'ailis.workbench.manifest.v1',
        runId: paths.runId,
        root: paths.runDir,
        repoRoot: paths.repoRoot,
        dirs: {
            inputs: paths.inputsDir,
            scripts: paths.scriptsDir,
            outputs: paths.outputsDir
        },
        inputs: [],
        scripts: [],
        outputs: [],
        createdAt,
        updatedAt: createdAt
    };
}

function upsertManifestEntry(list = [], entry = {}) {
    const index = list.findIndex((item) => item.id === entry.id || item.path === entry.path);
    if (index >= 0) {
        list[index] = { ...list[index], ...entry };
        return list;
    }
    list.push(entry);
    return list;
}

async function writeWorkbenchManifest(paths = {}, manifest = {}) {
    manifest.updatedAt = nowIso();
    await fs.writeFile(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function pickMaterializedObservation(sourceResult = {}) {
    return sourceResult.observation ||
        sourceResult.inspection?.observation ||
        sourceResult.query?.observation ||
        sourceResult.index?.observation ||
        null;
}

function buildMaterializedInputPayload({ id, plan = {}, adapterInput = {}, materializeFrom = '', sourceResult = {}, observation = null } = {}) {
    const query = sourceResult.kind ? sourceResult : sourceResult.query || {};
    const inspection = sourceResult.inspection || sourceResult;
    const sourcePath = normalizeString(
        plan.sourcePath ||
        adapterInput.sourcePath ||
        observation?.sourcePath ||
        query.sourcePath ||
        inspection.sourcePath
    );
    const shape = {
        sheetName: normalizeString(observation?.sheetName || query.sheetName || adapterInput.sheet || adapterInput.sheetName),
        range: normalizeString(observation?.range || query.range || adapterInput.range || adapterInput.target),
        requestedRange: normalizeString(observation?.requestedRange || query.requestedRange),
        returnedRange: normalizeString(observation?.returnedRange || query.returnedRange || observation?.range || query.range),
        rowCount: Number(observation?.rowCount || query.rowCount || 0) || 0,
        columnCount: Number(observation?.columnCount || query.columnCount || 0) || 0,
        columns: Array.isArray(observation?.columns) ? observation.columns : (Array.isArray(query.columns) ? query.columns : [])
    };
    const matrixRows = Array.isArray(observation?.matrixRows) ? observation.matrixRows : [];
    const compactRows = Array.isArray(observation?.compactRows) ? observation.compactRows : [];
    return {
        schema: 'ailis.workbench.materialized_input.v1',
        id,
        kind: matrixRows.length ? 'xlsx.range.matrixRows' : `${normalizeString(plan.adapter?.id || sourceResult.adapterId || 'artifact')}.${materializeFrom || 'data'}`,
        createdAt: nowIso(),
        source: {
            action: materializeFrom || normalizeString(sourceResult.action || observation?.action),
            adapterId: normalizeString(plan.adapter?.id || sourceResult.adapterId),
            sourcePath,
            format: normalizeString(plan.format || observation?.format),
            artifactKind: normalizeString(plan.kind),
            sessionId: normalizeString(adapterInput.sessionId || observation?.sessionId)
        },
        shape,
        fillHistogram: observation?.fillHistogram || query.fillHistogram || {},
        matrixRows,
        compactRows,
        rows: Array.isArray(query.rows) ? query.rows : [],
        columns: shape.columns,
        data: matrixRows.length || compactRows.length
            ? undefined
            : cloneJson(sourceResult)
    };
}

function buildMaterializeObservation({ plan = {}, adapterInput = {}, materializeFrom = '', materialized = {}, paths = {}, observation = null } = {}) {
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        action: 'materialize',
        adapterId: normalizeString(plan.adapter?.id),
        sourcePath: normalizeString(plan.sourcePath || adapterInput.sourcePath || observation?.sourcePath),
        format: normalizeString(plan.format || observation?.format),
        kind: normalizeString(plan.kind || observation?.kind),
        fromAction: materializeFrom,
        workbench: {
            schema: 'ailis.workbench.ref.v1',
            runId: paths.runId,
            root: paths.runDir,
            manifestPath: paths.manifestPath,
            inputsDir: paths.inputsDir,
            scriptsDir: paths.scriptsDir,
            outputsDir: paths.outputsDir
        },
        materialized,
        diagnostics: compactDiagnostics(plan.diagnostics || [])
    };
}

class AILISArtifactToolsRuntime {
    constructor(options = {}) {
        this.runtimeId = ARTIFACT_TOOLS_RUNTIME_ID;
        this.adapters = new Map();
        this.sessions = new Map();
        this.evaluationCases = new Map();
        for (const adapter of DEFAULT_ADAPTER_DEFINITIONS) {
            this.registerAdapter(adapter);
        }
        for (const adapter of options.adapters || []) {
            this.registerAdapter(adapter);
        }
        for (const evalCase of options.evaluationCases || []) {
            this.registerEvaluationCase(evalCase);
        }
    }

    registerAdapter(adapter = {}) {
        const manifest = createAdapterManifest(adapter);
        this.adapters.set(manifest.id, manifest);
        return manifest;
    }

    getAdapter(id = '') {
        return this.adapters.get(normalizeString(id)) || null;
    }

    listAdapters(filter = {}) {
        const capability = normalizeString(filter.capability || filter.requiredCapability).toLowerCase();
        const adapters = [...this.adapters.values()]
            .filter((adapter) => {
                if (filter.includeOptional !== true && adapter.optional) {
                    return false;
                }
                if (capability && !adapter.capabilities.includes(capability)) {
                    return false;
                }
                return adapterSupports(adapter, filter);
            })
            .sort(compareAdapters)
            .map((adapter) => cloneJson(adapter));
        return adapters;
    }

    chooseAdapter(request = {}) {
        const explicitId = normalizeString(request.adapterId || request.adapter || request.parserId || request.parser_id);
        if (explicitId) {
            const explicit = this.getAdapter(explicitId);
            if (!explicit) {
                return {
                    adapter: null,
                    diagnostics: [createArtifactDiagnostic({
                        code: 'adapter_not_found',
                        severity: 'error',
                        message: `No artifact adapter is registered for ${explicitId}.`
                    })]
                };
            }
            return {
                adapter: cloneJson(explicit),
                diagnostics: adapterSupports(explicit, request) ? [] : [createArtifactDiagnostic({
                    code: 'adapter_mismatch',
                    severity: 'warning',
                    message: `Adapter ${explicit.id} was requested but does not perfectly match the format/kind/capability filter.`
                })]
            };
        }
        const adapters = this.listAdapters({ ...request, includeOptional: request.includeOptional === true });
        if (!adapters.length) {
            return {
                adapter: null,
                diagnostics: [createArtifactDiagnostic({
                    code: 'no_matching_adapter',
                    severity: 'error',
                    message: 'No artifact adapter matches the requested format, kind, and capability.'
                })]
            };
        }
        return { adapter: adapters[0], diagnostics: [] };
    }

    planImport(input = {}) {
        const sessionId = normalizeString(input.sessionId || input.session_id || input.artifactSessionId || input.artifact_session_id);
        const session = sessionId ? this.sessions.get(sessionId) : null;
        const sessionArtifact = session?.artifact || {};
        const sourcePath = normalizeString(
            input.path ||
            input.sourcePath ||
            input.source_path ||
            input.filePath ||
            input.file_path ||
            input.file ||
            sessionArtifact.sourcePath
        );
        const format = normalizeFormat(input.format || sessionArtifact.format, sourcePath);
        const artifactKind = input.artifactKind || input.artifact_kind || input.fileKind || input.file_kind || sessionArtifact.kind;
        const kind = inferArtifactKind({ kind: artifactKind, sourcePath, format });
        const requiredCapabilities = normalizeCapabilities(input.requiredCapabilities || input.required_capabilities || ['load', 'inspect'], []);
        const { adapter, diagnostics } = this.chooseAdapter({
            ...input,
            adapterId: input.adapterId || input.adapter || session?.adapterId,
            path: sourcePath,
            format,
            kind,
            capability: requiredCapabilities.includes('load') ? 'load' : requiredCapabilities[0]
        });
        const plannedDiagnostics = [...diagnostics];
        if (!sourcePath) {
            plannedDiagnostics.push(createArtifactDiagnostic({
                code: 'missing_source_path',
                severity: 'warning',
                message: 'No source path was provided. The plan describes adapter selection only.',
                recoverable: true
            }));
        }
        const route = adapter ? this.buildRouteAdvice({ adapter, format, kind, requiredCapabilities }) : {};
        return {
            schema: 'ailis.artifact.import_plan.v1',
            sourcePath,
            format,
            kind,
            requiredCapabilities,
            adapter,
            route,
            diagnostics: plannedDiagnostics,
            status: adapter ? 'planned' : 'blocked'
        };
    }

    buildRouteAdvice({ adapter = {}, format = '', kind = '', requiredCapabilities = [] } = {}) {
        if (adapter.id === 'xlsx') {
            return {
                currentTool: 'artifact_tools',
                actions: ['inspect', 'index', 'search', 'query', 'materialize', 'edit', 'render', 'validate', 'trace', 'recalculate', 'rollback', 'export', 'roundtrip', 'run_checks']
            };
        }
        if (adapter.id === 'ragflow_lite_table') {
            return {
                currentTool: 'artifact_import',
                parserId: 'table',
                queryTools: ['artifact_query']
            };
        }
        return {
            currentTool: IMPLEMENTED_ADAPTER_IDS.includes(adapter.id) ? 'artifact_tools' : 'artifact_tools.open_session',
            actions: IMPLEMENTED_ADAPTER_IDS.includes(adapter.id) ? ['inspect', 'materialize', 'render', 'roundtrip', 'run_checks'] : ['open_session']
        };
    }

    openSession(input = {}) {
        const plan = this.planImport(input);
        if (!plan.adapter) {
            return createErrorResult('no_matching_adapter', 'Cannot open artifact session without a matching adapter.', { plan });
        }
        const artifact = createArtifactDescriptor({
            id: input.artifactId,
            sourcePath: plan.sourcePath,
            format: plan.format,
            kind: plan.kind,
            summary: input.summary,
            capabilities: plan.adapter.capabilities,
            metadata: {
                adapterId: plan.adapter.id,
                adapterStatus: plan.adapter.status,
                route: plan.route
            },
            diagnostics: plan.diagnostics
        });
        const sessionId = normalizeString(input.sessionId || input.session_id, createId('arts'));
        const operation = createArtifactOperation({
            sessionId,
            artifactId: artifact.id,
            action: 'open_session',
            target: plan.sourcePath,
            status: plan.adapter.status === 'planned' || plan.adapter.status === 'legacy_optional' ? 'planned' : 'completed',
            input: { sourcePath: plan.sourcePath, format: plan.format, kind: plan.kind },
            output: { adapterId: plan.adapter.id, route: plan.route },
            diagnostics: plan.diagnostics
        });
        const session = {
            schema: 'ailis.artifact.session.v1',
            id: sessionId,
            runtimeId: this.runtimeId,
            status: operation.status,
            adapterId: plan.adapter.id,
            artifact,
            operations: [operation],
            diagnostics: plan.diagnostics,
            createdAt: artifact.createdAt,
            updatedAt: artifact.updatedAt
        };
        session.handle = buildArtifactToolsHandle({ session, plan });
        this.sessions.set(session.id, session);
        return createOkResult({ session: cloneJson(session), plan });
    }

    getSession(id = '') {
        const session = this.sessions.get(normalizeString(id));
        return session ? cloneJson(session) : null;
    }

    listSessions() {
        return [...this.sessions.values()].map((session) => cloneJson(session));
    }

    registerEvaluationCase(input = {}) {
        const evalCase = createArtifactEvaluationCase(input);
        this.evaluationCases.set(evalCase.id, evalCase);
        return evalCase;
    }

    listEvaluationCases(filter = {}) {
        const kind = normalizeString(filter.kind || filter.artifactKind).toLowerCase();
        const format = normalizeFormat(filter.format);
        return [...this.evaluationCases.values()]
            .filter((entry) => !kind || entry.artifactKind === kind)
            .filter((entry) => !format || format === 'unknown' || entry.format === format)
            .map((entry) => cloneJson(entry));
    }

    buildSchema() {
        return {
            ...buildArtifactToolsSchema(),
            runtimeId: this.runtimeId,
            adapters: this.listAdapters({ includeOptional: true }),
            evaluationCaseCount: this.evaluationCases.size,
            boundaries: {
                core: 'local deterministic artifact runtime',
                optionalBackends: ['ocr', 'vlm', 'rag chunking'],
                nonGoal: 'do not make neural document recognition the default artifact runtime'
            }
        };
    }

    buildAdapterInput(input = {}, plan = null) {
        const resolvedPlan = plan || this.planImport(input);
        const sessionId = normalizeString(input.sessionId || input.session_id || input.artifactSessionId || input.artifact_session_id);
        const session = sessionId ? this.sessions.get(sessionId) : null;
        const sessionArtifact = session?.artifact || {};
        return {
            ...input,
            sessionId: session?.id || sessionId || input.sessionId,
            sourcePath: resolvedPlan.sourcePath || input.sourcePath || input.path || sessionArtifact.sourcePath,
            path: resolvedPlan.sourcePath || input.sourcePath || input.path || sessionArtifact.sourcePath,
            format: resolvedPlan.format,
            artifactKind: resolvedPlan.kind,
            artifact_kind: resolvedPlan.kind,
            expected: input.expected || input.expectedStructure || input.expected_structure || {},
            repoRoot: input.repoRoot || input.repo_root || process.cwd()
        };
    }

    ensureImplementedAdapter(plan) {
        if (!plan.adapter) {
            return createErrorResult('no_matching_adapter', 'No matching artifact adapter is available.', { plan });
        }
        if (!IMPLEMENTED_ADAPTER_IDS.includes(plan.adapter.id)) {
            return createErrorResult('adapter_not_implemented', `Adapter ${plan.adapter.id} is registered but does not have an executable local handler yet.`, { plan });
        }
        return null;
    }

    async inspect(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const inspection = await inspectArtifact(adapterInput);
        const structure = validateAgainstExpected(inspection, input.expected || input.expectedStructure || input.expected_structure || {});
        return createOkResult({
            action: 'inspect',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            inspection,
            structure
        });
    }

    async index(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const index = plan.adapter.id === 'xlsx'
            ? await indexXlsxArtifact(adapterInput)
            : await indexFileArtifact(adapterInput);
        return createOkResult({
            action: 'index',
            adapterId: plan.adapter.id,
            plan,
            index: {
                schema: index.schema,
                sourcePath: index.sourcePath,
                cacheHit: index.cacheHit,
                signature: index.signature,
                summary: index.summary,
                validation: index.validation,
                diagnostics: index.diagnostics
            },
            observation: index.structure ? {
                schema: 'ailis.artifact_tools.compact_observation.v1',
                format: 'xlsx',
                action: 'index',
                sourcePath: index.sourcePath,
                indexSummary: index.summary,
                workbook: {
                    sheetCount: index.structure.workbook?.sheetCount || 0,
                    sheetNames: index.structure.workbook?.sheetNames || []
                }
            } : (index.observation || null)
        });
    }

    async search(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const search = plan.adapter.id === 'xlsx'
            ? await searchXlsxArtifact(adapterInput)
            : await searchArtifact(adapterInput);
        return createOkResult({
            action: 'search',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            search
        });
    }

    async query(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_query_not_implemented', `Query is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const query = await queryXlsxArtifact(adapterInput);
        return createOkResult({
            action: 'query',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            query
        });
    }

    async materialize(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const requestedAction = normalizeAction(
            input.fromAction ||
            input.from_action ||
            input.sourceAction ||
            input.source_action ||
            input.materializeFrom ||
            input.materialize_from ||
            '',
            plan.adapter.id === 'xlsx' ? 'query' : 'inspect'
        );
        const materializeFrom = requestedAction === 'aggregate'
            ? 'query'
            : (requestedAction === 'structure' ? 'inspect' : requestedAction);
        let sourceResult = null;
        if (materializeFrom === 'query') {
            if (plan.adapter.id !== 'xlsx') {
                return createErrorResult('adapter_query_not_implemented', `Query materialization is not implemented for adapter ${plan.adapter.id}; use fromAction=inspect/index/render.`, { plan });
            }
            sourceResult = await queryXlsxArtifact(adapterInput);
        } else if (materializeFrom === 'inspect') {
            sourceResult = await inspectArtifact(adapterInput);
        } else if (materializeFrom === 'index' || materializeFrom === 'build_index') {
            sourceResult = plan.adapter.id === 'xlsx'
                ? await indexXlsxArtifact(adapterInput)
                : await indexFileArtifact(adapterInput);
        } else if (materializeFrom === 'search' || materializeFrom === 'artifact_search') {
            sourceResult = plan.adapter.id === 'xlsx'
                ? await searchXlsxArtifact(adapterInput)
                : await searchArtifact(adapterInput);
        } else if (materializeFrom === 'render') {
            const inspection = await inspectArtifact(adapterInput);
            sourceResult = await renderArtifactPreview({ ...adapterInput, inspection });
        } else {
            return createErrorResult('unsupported_materialize_source_action', `Cannot materialize from action ${materializeFrom}.`, {
                supportedFromActions: ['query', 'inspect', 'index', 'search', 'render'],
                plan
            });
        }

        const observation = pickMaterializedObservation(sourceResult);
        const paths = resolveWorkbenchPaths(input, adapterInput);
        await ensureWorkbenchDirs(paths);

        const inputId = safePathSegment(
            input.inputId ||
            input.input_id ||
            `${normalizeString(plan.adapter.id, 'artifact')}-${materializeFrom}-${Date.now()}`,
            'input'
        );
        const payload = buildMaterializedInputPayload({
            id: inputId,
            plan,
            adapterInput,
            materializeFrom,
            sourceResult,
            observation
        });
        const requestedFilename = normalizeString(input.filename || input.fileName || input.file_name);
        const defaultFilename = payload.kind === 'xlsx.range.matrixRows'
            ? 'matrixRows.json'
            : `${safePathSegment(materializeFrom, 'artifact')}.json`;
        const filename = requestedFilename
            ? `${safePathSegment(requestedFilename.replace(/\.json$/i, ''), 'input')}.json`
            : defaultFilename;
        const dataPath = path.join(paths.inputsDir, filename);
        await fs.writeFile(dataPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        const stat = await fs.stat(dataPath);

        const materialized = {
            id: inputId,
            kind: payload.kind,
            path: dataPath,
            relativePath: path.relative(paths.repoRoot, dataPath),
            bytes: stat.size,
            source: payload.source,
            shape: payload.shape,
            counts: {
                matrixRows: payload.matrixRows.length,
                compactRows: payload.compactRows.length,
                rows: payload.rows.length
            },
            createdAt: payload.createdAt
        };
        const manifest = await readWorkbenchManifest(paths);
        manifest.inputs = upsertManifestEntry(Array.isArray(manifest.inputs) ? manifest.inputs : [], materialized);
        manifest.latestInputId = inputId;
        await writeWorkbenchManifest(paths, manifest);

        const compactObservation = buildMaterializeObservation({
            plan,
            adapterInput,
            materializeFrom,
            materialized,
            paths,
            observation
        });
        return createOkResult({
            action: 'materialize',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            sourceAction: materializeFrom,
            materialized,
            workbench: {
                runId: paths.runId,
                root: paths.runDir,
                manifestPath: paths.manifestPath,
                inputsDir: paths.inputsDir,
                scriptsDir: paths.scriptsDir,
                outputsDir: paths.outputsDir
            },
            observation: compactObservation
        });
    }

    async render(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const inspection = await inspectArtifact(adapterInput);
        const render = await renderArtifactPreview({ ...adapterInput, inspection });
        return createOkResult({
            action: 'render',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            render
        });
    }

    async validate(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const inspection = await inspectArtifact(adapterInput);
        const structure = validateAgainstExpected(inspection, input.expected || input.expectedStructure || input.expected_structure || {});
        return createOkResult({
            action: 'validate',
            adapterId: plan.adapter.id,
            session: this.getSession(adapterInput.sessionId),
            plan,
            validation: inspection.validation || {
                status: structure.passed ? 'passed' : 'failed',
                diagnostics: structure.diagnostics
            },
            structure
        });
    }

    async edit(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_edit_not_implemented', `Edit is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const edit = await editXlsxArtifact(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'edit',
            adapterId: plan.adapter.id,
            plan,
            edit
        });
    }

    async export(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_export_not_implemented', `Export is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const exported = await exportXlsxArtifact(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'export',
            adapterId: plan.adapter.id,
            plan,
            export: exported
        });
    }

    async trace(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_trace_not_implemented', `Formula trace is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const trace = await traceXlsxFormula(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'trace',
            adapterId: plan.adapter.id,
            plan,
            trace
        });
    }

    async recalculate(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_recalculate_not_implemented', `Recalculate is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const recalculation = await recalculateXlsxArtifact(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'recalculate',
            adapterId: plan.adapter.id,
            plan,
            recalculation
        });
    }

    async rollback(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        if (plan.adapter.id !== 'xlsx') {
            return createErrorResult('adapter_rollback_not_implemented', `Rollback is not implemented for adapter ${plan.adapter.id}.`, { plan });
        }
        const rollback = await rollbackXlsxArtifact(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'rollback',
            adapterId: plan.adapter.id,
            plan,
            rollback
        });
    }

    async roundtrip(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const adapterInput = this.buildAdapterInput(input, plan);
        const inspection = await inspectArtifact(adapterInput);
        const roundtrip = await roundtripArtifact({ ...adapterInput, inspection });
        return createOkResult({
            action: 'roundtrip',
            adapterId: plan.adapter.id,
            plan,
            roundtrip
        });
    }

    async runChecks(input = {}) {
        const plan = this.planImport(input);
        const blocked = this.ensureImplementedAdapter(plan);
        if (blocked) {
            return blocked;
        }
        const result = await runArtifactAdapterChecks(this.buildAdapterInput(input, plan));
        return createOkResult({
            action: 'run_checks',
            adapterId: plan.adapter.id,
            plan,
            result
        });
    }

    execute(args = {}) {
        const resolvedHandle = resolveArtifactToolsHandleArgs(args);
        if (!resolvedHandle.ok) {
            return resolvedHandle.result;
        }
        args = resolvedHandle.args;
        const action = normalizeAction(args.action || args.operation || args.intent, 'schema');
        if (action === 'schema' || action === 'help') {
            return createOkResult({ action: 'schema', schema: this.buildSchema() });
        }
        if (action === 'list_adapters') {
            return createOkResult({
                action,
                adapters: this.listAdapters({
                    format: args.format,
                    kind: args.kind,
                    capability: args.capability,
                    includeOptional: args.includeOptional === true
                })
            });
        }
        if (action === 'plan_import') {
            return createOkResult({ action, plan: this.planImport(args) });
        }
        if (action === 'open_session' || action === 'load') {
            return this.openSession(args);
        }
        if (action === 'list_sessions') {
            return createOkResult({ action, sessions: this.listSessions() });
        }
        if (action === 'list_eval_cases' || action === 'list_evaluation_cases') {
            return createOkResult({ action, evaluationCases: this.listEvaluationCases(args) });
        }
        if (action === 'index' || action === 'build_index') {
            return this.index(args);
        }
        if (action === 'search' || action === 'artifact_search') {
            return this.search(args);
        }
        if (action === 'query' || action === 'aggregate') {
            return this.query(args);
        }
        if (action === 'materialize' || action === 'workbench_materialize') {
            return this.materialize(args);
        }
        if (action === 'inspect' || action === 'structure') {
            return this.inspect(args);
        }
        if (action === 'validate') {
            return this.validate(args);
        }
        if (action === 'edit') {
            return this.edit(args);
        }
        if (action === 'export') {
            return this.export(args);
        }
        if (action === 'trace') {
            return this.trace(args);
        }
        if (action === 'recalculate' || action === 'recalc') {
            return this.recalculate(args);
        }
        if (action === 'rollback') {
            return this.rollback(args);
        }
        if (action === 'render') {
            return this.render(args);
        }
        if (action === 'roundtrip') {
            return this.roundtrip(args);
        }
        if (action === 'run_checks' || action === 'check' || action === 'eval') {
            return this.runChecks(args);
        }
        return createErrorResult('unsupported_action', `Unsupported artifact runtime action: ${action}`, {
            supportedActions: ['schema', 'list_adapters', 'plan_import', 'open_session', 'index', 'search', 'query', 'aggregate', 'materialize', 'inspect', 'render', 'validate', 'edit', 'trace', 'recalculate', 'rollback', 'export', 'roundtrip', 'run_checks', 'list_sessions', 'list_eval_cases']
        });
    }
}

function createDefaultArtifactToolsRuntime(options = {}) {
    const runtime = new AILISArtifactToolsRuntime(options);
    const defaultCases = [
        {
            id: 'xlsx_map_path_color',
            artifactKind: 'workbook',
            format: 'xlsx',
            goal: 'Answer a path/color question using exact cell values, fills, and coordinates.',
            requiredCapabilities: ['load', 'inspect', 'render', 'validate'],
            expectedEvidence: ['cell values', 'fill colors', 'coordinates'],
            checks: ['structured equality', 'render nonblank']
        },
        {
            id: 'pdf_text_layer_search',
            artifactKind: 'pdf',
            format: 'pdf',
            goal: 'Search text-layer spans and cite page evidence without OCR.',
            requiredCapabilities: ['load', 'inspect', 'search', 'render'],
            expectedEvidence: ['page number', 'text span', 'coordinates'],
            checks: ['text match', 'page render nonblank']
        },
        {
            id: 'docx_render_layout_gate',
            artifactKind: 'document',
            format: 'docx',
            goal: 'Render DOCX pages and detect layout failures before delivery.',
            requiredCapabilities: ['load', 'inspect', 'render', 'validate'],
            expectedEvidence: ['page images', 'layout diagnostics'],
            checks: ['render nonblank', 'no fatal diagnostics']
        },
        {
            id: 'pptx_render_contact_sheet',
            artifactKind: 'presentation',
            format: 'pptx',
            goal: 'Render slide previews and verify slide inventory.',
            requiredCapabilities: ['load', 'inspect', 'render', 'validate'],
            expectedEvidence: ['slide count', 'rendered slides'],
            checks: ['render nonblank', 'slide inventory']
        }
    ];
    for (const evalCase of defaultCases) {
        runtime.registerEvaluationCase(evalCase);
    }
    return runtime;
}

module.exports = {
    ARTIFACT_TOOLS_RUNTIME_ID,
    DEFAULT_ADAPTER_DEFINITIONS,
    AILISArtifactToolsRuntime,
    createDefaultArtifactToolsRuntime
};
