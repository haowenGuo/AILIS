import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const ExcelJS = require('exceljs');

const {
    createArtifactDescriptor,
    createArtifactDiagnostic,
    createArtifactEntity,
    createArtifactOperation,
    inferArtifactKind,
    normalizeFormat
} = require('../electron/ailis-artifact-tools-model.cjs');

const {
    createDefaultArtifactToolsRuntime,
    AILISArtifactToolsRuntime
} = require('../electron/ailis-artifact-tools-runtime.cjs');
const {
    createAILISToolRuntimeRegistry
} = require('../electron/ailis-tool-runtime.cjs');

function parseToolText(result) {
    return JSON.parse(result.content?.[0]?.text || '{}');
}

test('AILIS artifact tools model creates canonical artifact envelopes', () => {
    assert.equal(normalizeFormat('', 'F:/input/model.xlsx'), 'xlsx');
    assert.equal(inferArtifactKind({ sourcePath: 'F:/input/report.docx' }), 'document');

    const artifact = createArtifactDescriptor({
        sourcePath: 'F:/input/map.xlsx',
        capabilities: ['load', 'inspect', 'render'],
        entities: [{
            kind: 'range',
            locator: 'Map!A1:I20',
            content: { rows: 20, cols: 9 }
        }]
    });

    assert.equal(artifact.kind, 'workbook');
    assert.equal(artifact.format, 'xlsx');
    assert.ok(artifact.id.startsWith('art_'));
    assert.deepEqual(artifact.capabilities, ['load', 'inspect', 'render']);
    assert.equal(artifact.entities[0].artifactId, artifact.id);
    assert.equal(artifact.entities[0].kind, 'range');

    const diagnostic = createArtifactDiagnostic({
        code: 'formula_error',
        severity: 'error',
        target: 'Sheet1!F12',
        message: 'Cell contains #REF!',
        suggestedActions: ['trace formula']
    });
    assert.equal(diagnostic.severity, 'error');
    assert.equal(diagnostic.recoverable, true);

    const entity = createArtifactEntity({ artifactId: artifact.id, kind: 'chart', locator: 'Sheet1!Chart 1' });
    assert.equal(entity.kind, 'chart');

    const operation = createArtifactOperation({
        artifactId: artifact.id,
        action: 'render',
        target: 'Map!A1:I20',
        status: 'planned'
    });
    assert.equal(operation.action, 'render');
    assert.equal(operation.status, 'planned');
});

test('AILIS artifact tools runtime registers cross-format adapters without making RAG chunks the core', () => {
    const runtime = createDefaultArtifactToolsRuntime();
    const schema = runtime.execute({ action: 'schema' });

    assert.equal(schema.ok, true);
    assert.equal(schema.schema.runtimeId, 'ailis_artifact_tools');
    assert.ok(schema.schema.actions.includes('materialize'));
    assert.ok(schema.schema.adapters.some((adapter) => adapter.id === 'xlsx'));
    assert.ok(schema.schema.adapters.find((adapter) => adapter.id === 'xlsx').capabilities.includes('query'));
    assert.ok(schema.schema.adapters.find((adapter) => adapter.id === 'xlsx').capabilities.includes('materialize'));
    assert.ok(schema.schema.adapters.some((adapter) => adapter.id === 'pdf'));
    assert.ok(schema.schema.adapters.some((adapter) => adapter.id === 'docx'));
    assert.ok(schema.schema.adapters.some((adapter) => adapter.id === 'pptx'));
    for (const adapterId of ['pdf', 'docx', 'pptx', 'image']) {
        assert.ok(schema.schema.adapters.find((adapter) => adapter.id === adapterId).capabilities.includes('materialize'));
    }
    assert.ok(schema.schema.adapters.some((adapter) => adapter.id === 'ragflow_lite_table'));
    assert.match(schema.schema.boundaries.core, /local deterministic/);

    const visibleAdapters = runtime.execute({ action: 'list_adapters' });
    assert.equal(visibleAdapters.ok, true);
    assert.equal(visibleAdapters.adapters.some((adapter) => adapter.id === 'ragflow_lite_table'), false);

    const optionalAdapters = runtime.execute({ action: 'list_adapters', includeOptional: true });
    assert.equal(optionalAdapters.adapters.some((adapter) => adapter.id === 'ragflow_lite_table'), true);
});

test('AILIS artifact tools runtime plans imports through canonical adapter registry', () => {
    const runtime = createDefaultArtifactToolsRuntime();

    const xlsxPlan = runtime.execute({
        action: 'plan_import',
        path: 'F:/input/map.xlsx',
        requiredCapabilities: ['load', 'inspect', 'render']
    });
    assert.equal(xlsxPlan.ok, true);
    assert.equal(xlsxPlan.plan.adapter.id, 'xlsx');
    assert.equal(xlsxPlan.plan.kind, 'workbook');
    assert.equal(xlsxPlan.plan.route.currentTool, 'artifact_tools');
    assert.ok(xlsxPlan.plan.route.actions.includes('run_checks'));
    assert.ok(xlsxPlan.plan.route.actions.includes('query'));
    assert.equal(xlsxPlan.plan.route.queryTools, undefined);
    assert.equal(xlsxPlan.plan.route.nextActions, undefined);
    assert.notEqual(xlsxPlan.plan.adapter.id, 'ragflow_lite_table');

    const pdfPlan = runtime.execute({
        action: 'plan_import',
        path: 'F:/input/report.pdf',
        requiredCapabilities: ['load', 'inspect', 'render']
    });
    assert.equal(pdfPlan.plan.adapter.id, 'pdf');
    assert.equal(pdfPlan.plan.kind, 'pdf');
    assert.equal(pdfPlan.plan.route.currentTool, 'artifact_tools');
    assert.ok(pdfPlan.plan.route.actions.includes('render'));

    const docxPlan = runtime.execute({
        action: 'plan_import',
        path: 'F:/input/brief.docx',
        requiredCapabilities: ['load', 'inspect', 'render', 'validate']
    });
    assert.equal(docxPlan.plan.adapter.id, 'docx');
    assert.ok(docxPlan.plan.adapter.capabilities.includes('validate'));
});

test('AILIS artifact tools runtime opens planned sessions and supports custom adapters', () => {
    const runtime = new AILISArtifactToolsRuntime({
        adapters: [{
            id: 'html',
            label: 'HTML Runtime',
            priority: 15,
            formats: ['html', 'htm'],
            kinds: ['html'],
            capabilities: ['load', 'inspect', 'search', 'render', 'validate'],
            engines: { parser: 'html-to-text/dom', renderer: 'playwright' }
        }]
    });

    const htmlPlan = runtime.execute({
        action: 'plan_import',
        path: 'F:/input/page.html',
        requiredCapabilities: ['load', 'render']
    });
    assert.equal(htmlPlan.ok, true);
    assert.equal(htmlPlan.plan.adapter.id, 'html');

    const opened = runtime.execute({
        action: 'open_session',
        path: 'F:/input/page.html',
        requiredCapabilities: ['load', 'render']
    });
    assert.equal(opened.ok, true);
    assert.ok(opened.session.id.startsWith('arts_'));
    assert.equal(opened.session.adapterId, 'html');
    assert.equal(opened.session.artifact.kind, 'html');
    assert.equal(opened.session.operations[0].action, 'open_session');
    assert.equal(runtime.execute({ action: 'list_sessions' }).sessions.length, 1);
});

test('AILIS artifact tools runtime carries evaluation cases as first-class architecture inputs', () => {
    const runtime = createDefaultArtifactToolsRuntime({
        evaluationCases: [{
            id: 'csv_dirty_data_fixture',
            artifactKind: 'table',
            format: 'csv',
            goal: 'Infer schema and report malformed rows.',
            requiredCapabilities: ['load', 'inspect', 'validate'],
            expectedEvidence: ['headers', 'malformed rows'],
            checks: ['schema inference', 'diagnostics']
        }]
    });

    const csvCases = runtime.execute({ action: 'list_eval_cases', format: 'csv' });
    assert.equal(csvCases.ok, true);
    assert.ok(csvCases.evaluationCases.some((entry) => entry.id === 'csv_dirty_data_fixture'));
    assert.ok(csvCases.evaluationCases.every((entry) => entry.format === 'csv'));
});

test('AILIS artifact_tools inspect exposes bounded document text in the model view', async () => {
    const runtime = createDefaultArtifactToolsRuntime();
    const fixturePath = path.join(repoRoot, 'evals', 'artifact-tools', 'fixtures', 'docx', 'report-with-tables.docx');
    const inspected = await runtime.execute({
        action: 'inspect',
        path: fixturePath,
        format: 'docx'
    });

    assert.equal(inspected.ok, true);
    assert.equal(inspected.modelView.observation.action, 'inspect');
    assert.equal(inspected.modelView.observation.format, 'docx');
    assert.equal(inspected.modelView.observation.text, inspected.inspection.text.trim());
    assert.ok(inspected.modelView.observation.text.length > 0);
    assert.equal(inspected.modelView.observation.textTruncated, false);
    assert.equal(inspected.modelView.observation.structure.tableCount, inspected.inspection.structure.tableCount);
});

test('AILIS artifact_tools stays off the first-turn surface but is discoverable through tool_search', async () => {
    const noop = async () => ({ content: [{ type: 'text', text: 'noop' }], details: { status: 'completed' } });
    const registry = createAILISToolRuntimeRegistry({
        updatePlan: noop,
        queryContextArtifact: noop,
        computeContextArtifact: noop,
        readExecOutput: noop,
        tailExecOutput: noop,
        searchExecOutput: noop,
        requestPermissions: noop,
        executeMcpBridge: noop,
        toolDoctor: { execute: noop },
        capabilityManager: { execute: noop },
        selfDebugger: { execute: noop },
        executeSelfEvolution: noop
    });

    assert.ok(registry.has('artifact_tools'));
    const search = await registry.dispatch('tool_search', {
        query: 'artifact tools adapter registry import planning',
        limit: 8
    });
    assert.equal(search.isError, false);
    assert.equal(search.details.tools.some((tool) => tool.id === 'artifact_tools'), true);

    const planned = await registry.dispatch('artifact_tools', {
        action: 'plan_import',
        path: 'F:/input/report.pdf',
        requiredCapabilities: ['load', 'inspect', 'render']
    });
    assert.equal(planned.isError, false);
    assert.equal(planned.structuredContent.plan.adapter.id, 'pdf');
    assert.equal(planned.structuredContent.plan.route.currentTool, 'artifact_tools');
});

test('AILIS artifact_tools range query uses usedRange for no-table map workbooks and avoids empty-margin truncation', async () => {
    const tmpDir = path.join(repoRoot, '.ailis-state', 'test-artifacts');
    await fs.mkdir(tmpDir, { recursive: true });
    const fixturePath = path.join(tmpDir, `no-table-map-${Date.now()}.xlsx`);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    const palette = ['0099FF', '92D050', 'F478A7', 'FFFF00'];
    for (let row = 1; row <= 20; row += 1) {
        for (let col = 1; col <= 9; col += 1) {
            const cell = sheet.getCell(row, col);
            cell.value = row === 1 && col === 1 ? 'START' : (row === 20 && col === 9 ? 'END' : null);
            const fill = palette[(row + col) % palette.length];
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: `FF${fill}` }
            };
        }
    }
    await workbook.xlsx.writeFile(fixturePath);

    const noop = async () => ({ content: [{ type: 'text', text: 'noop' }], details: { status: 'completed' } });
    const registry = createAILISToolRuntimeRegistry({
        updatePlan: noop,
        queryContextArtifact: noop,
        computeContextArtifact: noop,
        readExecOutput: noop,
        tailExecOutput: noop,
        searchExecOutput: noop,
        requestPermissions: noop,
        executeMcpBridge: noop,
        toolDoctor: { execute: noop },
        capabilityManager: { execute: noop },
        selfDebugger: { execute: noop },
        executeSelfEvolution: noop
    });

    const opened = await registry.dispatch('artifact_tools', {
        action: 'open_session',
        path: fixturePath
    });
    assert.equal(opened.isError, false);
    const sessionId = opened.structuredContent.session.id;
    const artifactHandle = opened.structuredContent.session.handle;
    assert.equal(artifactHandle.schema, 'ailis.artifact_handle.v1');
    assert.equal(artifactHandle.owner, 'artifact_tools');
    assert.equal(artifactHandle.tool, 'artifact_tools');
    assert.equal(artifactHandle.sessionId, sessionId);
    assert.equal(artifactHandle.artifactId, opened.structuredContent.session.artifact.id);
    assert.deepEqual(opened.structuredContent.modelView.artifactHandle, artifactHandle);

    const defaultRange = await registry.dispatch('artifact_tools', {
        action: 'query',
        artifactHandle,
        include: ['values', 'styles']
    });
    assert.equal(defaultRange.isError, false);
    assert.equal(defaultRange.structuredContent.query.kind, 'range');
    assert.equal(defaultRange.structuredContent.query.range, 'Sheet1!A1:I20');
    assert.equal(defaultRange.structuredContent.query.rowCount, 20);
    assert.equal(defaultRange.structuredContent.query.columnCount, 9);

    const wideRange = await registry.dispatch('artifact_tools', {
        action: 'query',
        sessionId,
        sheet: 'Sheet1',
        range: 'A1:Z30',
        include: ['values', 'styles']
    });
    assert.equal(wideRange.isError, false);
    assert.equal(wideRange.structuredContent.query.requestedRange, 'Sheet1!A1:Z30');
    assert.equal(wideRange.structuredContent.query.range, 'Sheet1!A1:I20');
    assert.equal(wideRange.structuredContent.query.rowCount, 20);
    assert.equal(wideRange.structuredContent.query.columnCount, 9);
    assert.ok(wideRange.structuredContent.query.diagnostics.some((diagnostic) =>
        diagnostic.code === 'xlsx_query_trimmed_to_used_range'
    ));

    const modelView = parseToolText(wideRange);
    assert.equal(modelView.artifact.sessionId, sessionId);
    assert.equal(modelView.observation.range, 'Sheet1!A1:I20');
    assert.equal(modelView.observation.requestedRange, 'Sheet1!A1:Z30');
    assert.equal(modelView.observation.compactRows.length, 20);
    assert.equal(modelView.observation.matrixRowsAvailable.rowCount, 20);
    assert.equal(modelView.observation.matrixRowsLossless, true);
    assert.equal(modelView.observation.truncatedForModelText, undefined);
    assert.match(JSON.stringify(modelView.observation.compactRows), /START/);
    assert.match(JSON.stringify(modelView.observation.compactRows), /END/);
    assert.equal(modelView.observation.compactRowSchema.completeCompactRows, true);
    assert.equal(modelView.observation.nextActions, undefined);

    const inspectedRange = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        sessionId,
        sheet: 'Sheet1',
        range: 'A1:I20',
        include: ['fill', 'value']
    });
    assert.equal(inspectedRange.isError, false);
    assert.equal(inspectedRange.structuredContent.inspection.observation.action, 'inspect');
    assert.equal(inspectedRange.structuredContent.inspection.observation.kind, 'range');
    assert.equal(inspectedRange.structuredContent.inspection.observation.range, 'Sheet1!A1:I20');
    assert.equal(inspectedRange.structuredContent.inspection.observation.matrixRows.length, 20);
    assert.equal(inspectedRange.structuredContent.inspection.observation.matrixRows[0].values[0], 'START');
    assert.equal(inspectedRange.structuredContent.inspection.observation.matrixRows[19].values[8], 'END');
    assert.equal(inspectedRange.structuredContent.inspection.observation.matrixRows[0].fills.length, 9);

    const inspectModelView = parseToolText(inspectedRange);
    assert.equal(inspectModelView.action, 'inspect');
    assert.equal(inspectModelView.observation.action, 'inspect');
    assert.equal(inspectModelView.observation.kind, 'range');
    assert.equal(inspectModelView.observation.compactRows.length, 20);
    assert.equal(inspectModelView.observation.matrixRowsAvailable.rowCount, 20);
    assert.equal(inspectModelView.observation.truncatedForModelText, undefined);

    const inspectedCell = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        sessionId,
        sheet: 'Sheet1',
        range: 'A1',
        include: 'fill'
    });
    const inspectedCellView = parseToolText(inspectedCell);
    assert.equal(inspectedCellView.observation.action, 'inspect');
    assert.equal(inspectedCellView.observation.kind, 'range');
    assert.equal(inspectedCellView.observation.range, 'Sheet1!A1:A1');
    assert.match(inspectedCellView.observation.compactRows[0].cells, /START/);
    assert.equal(inspectedCellView.observation.matrixRowsAvailable.rowCount, 1);

    await fs.rm(fixturePath, { force: true });
});

test('AILIS artifact_tools materializes XLSX matrixRows for script-based map reasoning', async () => {
    const fixturePath = 'evals/artifact-tools/fixtures/xlsx/map-path-color.xlsx';
    const runId = 'test-xlsx-map-materialize';
    const workbenchRunDir = path.join(repoRoot, '.ailis-state', 'workbench', runId);
    await fs.rm(workbenchRunDir, { recursive: true, force: true });

    const noop = async () => ({ content: [{ type: 'text', text: 'noop' }], details: { status: 'completed' } });
    const registry = createAILISToolRuntimeRegistry({
        updatePlan: noop,
        queryContextArtifact: noop,
        computeContextArtifact: noop,
        readExecOutput: noop,
        tailExecOutput: noop,
        searchExecOutput: noop,
        requestPermissions: noop,
        executeMcpBridge: noop,
        toolDoctor: { execute: noop },
        capabilityManager: { execute: noop },
        selfDebugger: { execute: noop },
        executeSelfEvolution: noop
    });

    const materialized = await registry.dispatch('artifact_tools', {
        action: 'materialize',
        path: fixturePath,
        fromAction: 'query',
        sheet: 'Map',
        range: 'A1:G7',
        include: ['values', 'styles'],
        runId,
        repoRoot
    });
    assert.equal(materialized.isError, false);
    assert.equal(materialized.structuredContent.action, 'materialize');
    assert.equal(materialized.structuredContent.materialized.kind, 'xlsx.range.matrixRows');
    assert.equal(path.basename(materialized.structuredContent.materialized.path), 'matrixRows.json');

    const manifest = JSON.parse(await fs.readFile(materialized.structuredContent.workbench.manifestPath, 'utf8'));
    assert.equal(manifest.runId, runId);
    assert.equal(manifest.inputs.length, 1);
    assert.equal(manifest.inputs[0].path, materialized.structuredContent.materialized.path);

    const matrixInput = JSON.parse(await fs.readFile(materialized.structuredContent.materialized.path, 'utf8'));
    assert.equal(matrixInput.matrixRows.length, 7);
    assert.equal(matrixInput.shape.range, 'Map!A1:G7');
    assert.match(JSON.stringify(matrixInput.matrixRows), /START/);
    assert.match(JSON.stringify(matrixInput.matrixRows), /END/);

    const scriptPath = path.join(materialized.structuredContent.workbench.scriptsDir, 'solve-map.mjs');
    const outputPath = path.join(materialized.structuredContent.workbench.outputsDir, 'answer.json');
    await fs.writeFile(scriptPath, `
import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outputPath = process.argv[3];
const blue = '0099FF';
const columns = input.columns;
const cells = new Map();
let start = '';
let end = '';

for (const row of input.matrixRows) {
  for (let index = 0; index < columns.length; index += 1) {
    const ref = columns[index] + row.rowNumber;
    const value = row.values[index] || '';
    const fill = row.fills[index] || '';
    if (fill && fill !== blue) cells.set(ref, { ref, row: row.rowNumber, col: index + 1, value, fill });
    if (value === 'START') start = ref;
    if (value === 'END') end = ref;
  }
}

function refOf(col, row) {
  return columns[col - 1] + row;
}

function neighbors(cell) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dc, dr]) => refOf(cell.col + dc, cell.row + dr))
    .filter((ref) => cells.has(ref));
}

const pathRefs = [start];
let previous = '';
let current = start;
while (current !== end) {
  const next = neighbors(cells.get(current)).filter((ref) => ref !== previous);
  if (next.length !== 1) throw new Error('expected a unique non-blue path at ' + current);
  previous = current;
  current = next[0];
  pathRefs.push(current);
}

const targetIndex = 11 * 2;
const landedRef = pathRefs[targetIndex];
const landed = cells.get(landedRef);
fs.writeFileSync(outputPath, JSON.stringify({ landedRef, answer: landed.fill, pathLength: pathRefs.length }, null, 2));
console.log(landed.fill);
`, 'utf8');
    const executed = await execFileAsync(process.execPath, [scriptPath, materialized.structuredContent.materialized.path, outputPath], {
        cwd: materialized.structuredContent.workbench.root,
        maxBuffer: 1024 * 1024
    });
    assert.match(executed.stdout, /F478A7/);
    const answer = JSON.parse(await fs.readFile(outputPath, 'utf8'));
    assert.equal(answer.landedRef, 'E3');
    assert.equal(answer.answer, 'F478A7');

    await fs.rm(workbenchRunDir, { recursive: true, force: true });
});

test('AILIS artifact_tools executes XLSX declaration edits and export roundtrip', { timeout: 120000 }, async () => {
    await execFileAsync(process.execPath, ['scripts/prepare-artifact-tools-fixtures.mjs'], {
        cwd: repoRoot,
        maxBuffer: 8 * 1024 * 1024
    });
    const noop = async () => ({ content: [{ type: 'text', text: 'noop' }], details: { status: 'completed' } });
    const registry = createAILISToolRuntimeRegistry({
        updatePlan: noop,
        queryContextArtifact: noop,
        computeContextArtifact: noop,
        readExecOutput: noop,
        tailExecOutput: noop,
        searchExecOutput: noop,
        requestPermissions: noop,
        executeMcpBridge: noop,
        toolDoctor: { execute: noop },
        capabilityManager: { execute: noop },
        selfDebugger: { execute: noop },
        executeSelfEvolution: noop
    });

    const fixturePath = 'evals/artifact-tools/fixtures/xlsx/formula-style-model.xlsx';
    const openedSession = await registry.dispatch('artifact_tools', {
        action: 'open_session',
        path: fixturePath,
        repoRoot
    });
    assert.equal(openedSession.isError, false);
    const openModelView = parseToolText(openedSession);
    assert.equal(openModelView.schema, 'ailis.artifact_tools.tool_api_result.v1');
    assert.equal(openModelView.action, 'open_session');
    assert.equal(openModelView.observation.sessionId, openedSession.structuredContent.session.id);
    assert.equal(openModelView.protocol.fullResultLocation, 'structuredContent/details');
    assert.equal(openedSession.content[0].text.includes('"evaluationCases"'), false);

    const inspectedFromSession = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        sessionId: openedSession.structuredContent.session.id,
        include: ['summary', 'styles', 'values'],
        repoRoot
    });
    assert.equal(inspectedFromSession.isError, false);
    assert.equal(inspectedFromSession.structuredContent.adapterId, 'xlsx');
    assert.equal(inspectedFromSession.structuredContent.inspection.structure.workbook.sheetNames.includes('Summary'), true);
    assert.equal(parseToolText(inspectedFromSession).observation.action, 'inspect');

    const outputPath = path.join(repoRoot, 'eval-results', 'artifact-tools', 'exports', 'runtime-edit-test.xlsx');
    const edited = await registry.dispatch('artifact_tools', {
        action: 'edit',
        path: fixturePath,
        outputPath,
        operations: [
            {
                op: 'range.setValues',
                target: 'Summary!A8:B8',
                values: [['Runtime edit', 'OK']]
            },
            {
                op: 'range.setStyles',
                target: 'Summary!B8',
                style: { fill: '#10B981', font: { bold: true, color: '#FFFFFF' } }
            }
        ],
        verifyTarget: 'Summary!A8:B8',
        repoRoot
    });
    assert.equal(edited.isError, false);
    assert.equal(edited.structuredContent.edit.passed, true);
    await fs.stat(outputPath);

    const inspected = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        path: outputPath,
        kind: 'range',
        target: 'Summary!A8:B8',
        include: ['values', 'styles'],
        expected: {
            allowedDiagnosticCodes: ['xlsx_formula_error'],
            xlsx: {
                cells: [{ ref: 'Summary!B8', value: 'OK', fillRgb: '10B981' }]
            }
        },
        repoRoot
    });
    assert.equal(inspected.isError, false);
    assert.equal(inspected.structuredContent.structure.passed, true);
    const inspectedModelView = parseToolText(inspected);
    assert.equal(inspectedModelView.action, 'inspect');
    assert.equal(inspectedModelView.observation.action, 'inspect');
    assert.equal(inspectedModelView.observation.format, 'xlsx');

    const indexed = await registry.dispatch('artifact_tools', {
        action: 'index',
        path: fixturePath,
        repoRoot
    });
    assert.equal(indexed.isError, false);
    assert.ok(indexed.structuredContent.index.summary.indexedCellCount > 0);
    assert.ok(indexed.structuredContent.index.summary.commentCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.definedNameCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.imageCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.hiddenRowCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.hiddenColumnCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.tableRangeCount >= 1);
    assert.ok(indexed.structuredContent.index.summary.imageAnchorCount >= 1);

    const indexedAgain = await registry.dispatch('artifact_tools', {
        action: 'index',
        path: fixturePath,
        repoRoot
    });
    assert.equal(indexedAgain.isError, false);
    assert.equal(indexedAgain.structuredContent.index.cacheHit, true);

    const formulaSearch = await registry.dispatch('artifact_tools', {
        action: 'search',
        path: fixturePath,
        searchKind: 'formula',
        query: 'Data!D2:D4',
        repoRoot
    });
    assert.equal(formulaSearch.isError, false);
    assert.ok(formulaSearch.structuredContent.search.matches.some((match) => match.ref === 'Summary!B3'));
    assert.ok(formulaSearch.structuredContent.search.observation.candidates.length > 0);

    const tableSearch = await registry.dispatch('artifact_tools', {
        action: 'search',
        path: fixturePath,
        searchKind: 'table',
        query: 'SalesTable',
        repoRoot
    });
    assert.equal(tableSearch.isError, false);
    assert.ok(tableSearch.structuredContent.search.matches.some((match) =>
        match.name === 'SalesTable' && /A1:D4/.test(match.ref || match.range || '')
    ));

    const hiddenSearch = await registry.dispatch('artifact_tools', {
        action: 'search',
        path: fixturePath,
        searchKind: 'hidden',
        query: 'Beta',
        repoRoot
    });
    assert.equal(hiddenSearch.isError, false);
    assert.ok(hiddenSearch.structuredContent.search.matches.some((match) =>
        match.ref === 'Data!A3' && match.hiddenRow === true
    ));

    const styleSearch = await registry.dispatch('artifact_tools', {
        action: 'search',
        path: fixturePath,
        searchKind: 'style',
        fillRgb: 'DCFCE7',
        repoRoot
    });
    assert.equal(styleSearch.isError, false);
    assert.ok(styleSearch.structuredContent.search.matches.some((match) => match.ref === 'Summary!B3'));

    const mapRange = await registry.dispatch('artifact_tools', {
        action: 'query',
        path: fixturePath,
        sheet: 'Summary',
        range: 'A1:D7',
        maxRows: 25,
        maxCols: 12,
        repoRoot
    });
    assert.equal(mapRange.isError, false);
    assert.equal(mapRange.structuredContent.query.kind, 'range');
    assert.equal(mapRange.structuredContent.query.range, 'Summary!A1:D7');
    assert.equal(mapRange.structuredContent.query.fillHistogram.DCFCE7 >= 1, true);
    assert.equal(mapRange.structuredContent.query.compactGrid[0].cells[0], 'Quarter Summary');
    assert.ok(mapRange.structuredContent.query.rows.some((row) => row.fills.includes('DCFCE7')));
    assert.ok(mapRange.structuredContent.query.observation.compactRows.some((row) =>
        row.cells.includes('Quarter Summary')
    ));
    const rangeModelView = parseToolText(mapRange);
    assert.equal(rangeModelView.action, 'query');
    assert.equal(rangeModelView.observation.kind, 'range');
    assert.equal(rangeModelView.observation.range, 'Summary!A1:D7');
    assert.equal(rangeModelView.observation.compactRows.length, 7);
    assert.match(rangeModelView.observation.compactRows[0].cells, /Quarter Summary/);
    assert.equal(rangeModelView.observation.cellSeparator, ' | ');

    const commentSearch = await registry.dispatch('artifact_tools', {
        action: 'search',
        path: fixturePath,
        searchKind: 'comment',
        query: 'artifact_search',
        repoRoot
    });
    assert.equal(commentSearch.isError, false);
    assert.ok(commentSearch.structuredContent.search.matches.some((match) => match.ref === 'Data!A2'));
    assert.ok(commentSearch.structuredContent.search.matches.some((match) => /artifact_search/.test(match.text || match.comment || '')));

    const inventory = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        path: fixturePath,
        kind: 'definedName',
        repoRoot
    });
    assert.equal(inventory.isError, false);
    assert.ok(inventory.structuredContent.inspection.view.definedNames.some((entry) => entry.name === 'TotalRevenue'));

    const imageInventory = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        path: fixturePath,
        kind: 'image',
        repoRoot
    });
    assert.equal(imageInventory.isError, false);
    assert.ok(imageInventory.structuredContent.inspection.view.images.length >= 1);
    assert.ok(imageInventory.structuredContent.inspection.view.imageAnchors.some((anchor) =>
        anchor.sheetName === 'Summary' && /D3/.test(anchor.fullRange || anchor.range || '')
    ));

    const visibility = await registry.dispatch('artifact_tools', {
        action: 'inspect',
        path: fixturePath,
        kind: 'visibility',
        repoRoot
    });
    assert.equal(visibility.isError, false);
    assert.ok(visibility.structuredContent.inspection.view.sheets.some((sheet) =>
        sheet.name === 'Data' && sheet.hiddenRows.some((row) => row.row === 3) && sheet.hiddenColumns.some((column) => column.name === 'C')
    ));

    const namedTrace = await registry.dispatch('artifact_tools', {
        action: 'trace',
        path: fixturePath,
        target: 'Summary!B8',
        repoRoot
    });
    assert.equal(namedTrace.isError, false);
    const namedNodeIds = new Set(namedTrace.structuredContent.trace.nodes.map((node) => node.id));
    assert.ok(namedNodeIds.has('definedName:TotalRevenue'));
    assert.ok(namedNodeIds.has('Summary!B3'));

    const maxRevenue = await registry.dispatch('artifact_tools', {
        action: 'query',
        path: fixturePath,
        table: 'SalesTable',
        aggregate: { op: 'max', column: 'Revenue' },
        sortBy: 'Revenue',
        top: 1,
        repoRoot
    });
    assert.equal(maxRevenue.isError, false);
    assert.equal(Number(maxRevenue.structuredContent.query.aggregateResult.value), 45);
    assert.equal(maxRevenue.structuredContent.query.aggregateResult.row.values.Item, 'Beta');
    assert.equal(maxRevenue.structuredContent.query.aggregateResult.row.hidden, true);
    assert.equal(maxRevenue.structuredContent.query.observation.semanticLevel, 'computation');
    assert.equal(maxRevenue.structuredContent.query.observation.computation.deterministic, true);
    assert.equal(maxRevenue.structuredContent.query.observation.computation.operation, 'max');
    assert.equal(Number(maxRevenue.structuredContent.query.observation.computation.value), 45);
    assert.equal(maxRevenue.structuredContent.query.observation.computation.source.table, 'SalesTable');

    const revenueByItem = await registry.dispatch('artifact_tools', {
        action: 'aggregate',
        path: fixturePath,
        table: 'SalesTable',
        groupBy: 'Item',
        aggregate: { op: 'sum', column: 'Revenue' },
        topGroups: 3,
        repoRoot
    });
    assert.equal(revenueByItem.isError, false);
    assert.ok(revenueByItem.structuredContent.query.groups.some((group) =>
        group.key === 'Beta' && Number(group.aggregate.value) === 45
    ));
    assert.equal(revenueByItem.structuredContent.query.observation.semanticLevel, 'computation');
    assert.equal(revenueByItem.structuredContent.query.observation.computation.groupBy, 'Item');

    const firstRender = await registry.dispatch('artifact_tools', {
        action: 'render',
        path: fixturePath,
        target: 'Summary!A1:D7',
        repoRoot
    });
    assert.equal(firstRender.isError, false);
    assert.equal(firstRender.structuredContent.render.passed, true);
    assert.equal(firstRender.structuredContent.render.visualCheck.blank, false);
    const renderModelView = parseToolText(firstRender);
    assert.equal(renderModelView.action, 'render');
    assert.equal(renderModelView.observation.action, 'render');
    assert.equal(renderModelView.observation.passed, true);
    assert.equal(renderModelView.observation.visualCheck.blank, false);

    const validated = await registry.dispatch('artifact_tools', {
        action: 'validate',
        path: fixturePath,
        expected: {
            allowedDiagnosticCodes: ['xlsx_formula_error']
        },
        repoRoot
    });
    assert.equal(validated.isError, false);
    const validateModelView = parseToolText(validated);
    assert.equal(validateModelView.action, 'validate');
    assert.equal(validateModelView.observation.action, 'validate');
    assert.equal(validateModelView.observation.passed, true);

    const cachedRender = await registry.dispatch('artifact_tools', {
        action: 'render',
        path: fixturePath,
        target: 'Summary!A1:D7',
        repoRoot
    });
    assert.equal(cachedRender.isError, false);
    assert.equal(cachedRender.structuredContent.render.cacheHit, true);

    const trace = await registry.dispatch('artifact_tools', {
        action: 'trace',
        path: outputPath,
        target: 'Summary!B3',
        repoRoot
    });
    assert.equal(trace.isError, false);
    assert.equal(trace.structuredContent.trace.passed, true);
    const nodeIds = new Set(trace.structuredContent.trace.nodes.map((node) => node.id));
    assert.ok(nodeIds.has('Data!D2:D4'));
    assert.ok(nodeIds.has('Data!D2'));

    const recalculatedPath = path.join(repoRoot, 'eval-results', 'artifact-tools', 'exports', 'runtime-recalculate-test.xlsx');
    const recalculated = await registry.dispatch('artifact_tools', {
        action: 'recalculate',
        path: outputPath,
        target: 'Summary!B3',
        outputPath: recalculatedPath,
        repoRoot
    });
    assert.equal(recalculated.isError, false);
    assert.equal(recalculated.structuredContent.recalculation.passed, true);
    assert.ok(recalculated.structuredContent.recalculation.updated.some((entry) =>
        entry.ref === 'Summary!B3' && Number(entry.result) === 91
    ));
    await fs.stat(recalculatedPath);

    const rollbackPath = path.join(repoRoot, 'eval-results', 'artifact-tools', 'exports', 'runtime-rollback-test.xlsx');
    const rollback = await registry.dispatch('artifact_tools', {
        action: 'rollback',
        path: outputPath,
        backupPath: edited.structuredContent.edit.rollback.backupPath,
        outputPath: rollbackPath,
        repoRoot
    });
    assert.equal(rollback.isError, false);
    assert.equal(rollback.structuredContent.rollback.passed, true);
    await fs.stat(rollbackPath);
});
