import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = require('exceljs');
const { createDefaultArtifactToolsRuntime } = require('../electron/ailis-artifact-tools-runtime.cjs');
const { AILISContextArtifactStore } = require('../electron/ailis-context-artifact-store.cjs');

test('current XLSX adapter reads real workbooks and historical spreadsheet artifacts remain queryable', async () => {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-xlsx-tool-'));
    const filePath = path.join(dir, 'colored-map.xlsx');
    const auditDir = path.join(dir, '.audit');
    const contextArtifactStore = new AILISContextArtifactStore({
        rootDir: path.join(auditDir, 'context-artifacts')
    });

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Map');
        sheet.getCell('A1').value = 'START';
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0099FF' }
        };
        sheet.getCell('C2').value = 'END';
        sheet.getCell('C2').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF92D050' }
        };
        sheet.getCell('B2').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF478A7' }
        };
        sheet.getCell('A2').value = 1;
        sheet.getCell('A3').value = 2;
        sheet.getCell('F1').value = { formula: 'SUM(A2:A3)', result: 3 };
        sheet.mergeCells('D4:E4');
        sheet.getCell('D4').value = 'merged-note';
        await workbook.xlsx.writeFile(filePath);

        const runtime = createDefaultArtifactToolsRuntime();
        const opened = await runtime.execute({ action: 'open_session', path: filePath });
        assert.equal(opened.ok, true);
        const inspected = await runtime.execute({
            action: 'inspect', sessionId: opened.session.id, sheet: 'Map',
            range: 'A1:F4', include: ['values', 'styles', 'formulas']
        });
        assert.equal(inspected.ok, true);
        const rows = inspected.inspection.observation.matrixRows;
        assert.equal(rows[0].values[0], 'START');
        assert.equal(rows[0].fills[1], '0099FF');
        assert.equal(rows[1].values[2], 'END');
        const formulas = await runtime.execute({
            action: 'search', sessionId: opened.session.id,
            searchKind: 'formula', query: 'SUM'
        });
        assert.equal(formulas.ok, true);
        assert.ok(formulas.search.matches.some((cell) => cell.ref === 'Map!F1'));

        // Historical persisted payload contract: keep query/cache/compute coverage
        // without retaining the unregistered legacy XLSX producer.
        const legacyRecord = await contextArtifactStore.createArtifact({
            kind: 'spreadsheet', type: 'xlsx_workbook', sourcePath: filePath,
            summary: 'Historical Map worksheet', payload: { workbook: { sheets: [{
                name: 'Map', dimensions: { inspectedRange: 'A1:F4', rowCount: 4, columnCount: 6 },
                mergedRanges: ['D4:E4'],
                cells: [{ address: 'F1', value: 3, formula: { formula: 'SUM(A2:A3)', result: 3 } }],
                grids: {
                    columns: ['A', 'B', 'C', 'D', 'E', 'F'], rowNumbers: [1, 2, 3, 4],
                    display: [
                        ['START', '', '', '', '', '3'],
                        ['1', '', 'END', '', '', ''],
                        ['2', '', '', '', '', ''],
                        ['', '', '', 'merged-note', 'merged-note', '']
                    ],
                    fills: [
                        ['', '0099FF', '', '', '', ''],
                        ['', 'F478A7', '92D050', '', '', ''],
                        ['', '', '', '', '', ''],
                        ['', '', '', '', '', '']
                    ]
                }
            }] } }
        });
        const artifactId = legacyRecord.id;

        const summary = await contextArtifactStore.execute({
            action: 'summary',
            artifactId: artifactId
        });
        assert.equal(summary.isError, false);
        assert.match(summary.content[0].text, /artifact_query actions/);

        const range = await contextArtifactStore.execute({
            action: 'range',
            artifactId: artifactId,
            sheet: 'Map',
            range: 'A1:F4'
        });
        assert.equal(range.isError, false);
        assert.match(range.content[0].text, /START/);
        assert.match(range.content[0].text, /0099FF/);
        assert.equal(range.details.coverage.range, 'A1:F4');
        assert.equal(range.details.complete, true);
        assert.equal(Object.hasOwn(range.details, 'reasoningReady'), false);
        assert.ok(range.details.cachedCoverage.coverageId);

        const coveredRange = await contextArtifactStore.execute({
            action: 'range',
            artifactId: artifactId,
            sheet: 'Map',
            range: 'B1:C2'
        });
        assert.equal(coveredRange.isError, false);
        assert.match(coveredRange.content[0].text, /covered_by_cache/);
        assert.equal(coveredRange.details.coveredByCache.coverageId, range.details.cachedCoverage.coverageId);
        assert.equal(coveredRange.details.coveredByCache.range, 'A1:F4');

        const profile = await contextArtifactStore.compute({
            action: 'profile',
            artifactId: artifactId,
            sheet: 'Map'
        });
        assert.equal(profile.isError, false);
        assert.match(profile.content[0].text, /ARTIFACT_COMPUTE_PROFILE/);
        assert.equal(profile.structuredContent.profiles[0].sheet, 'Map');

        const pathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: artifactId,
            sheet: 'Map',
            startValue: 'START',
            endValue: 'END',
            blockedFills: ['0099FF'],
            stepSize: 2,
            stepToExtract: 1,
            extractField: 'cell_color_hex'
        });
        assert.equal(pathResult.isError, false);
        assert.match(pathResult.content[0].text, /ARTIFACT_COMPUTE_FIND_PATH/);
        assert.match(pathResult.content[0].text, /extracted_value=F478A7/);
        assert.equal(pathResult.details.result.pathFound, true);
        assert.equal(pathResult.details.result.path.some((cell) => cell.address === 'B1'), false);
        assert.equal(pathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(pathResult.details.result.extraction.extractedValue, 'F478A7');
        assert.equal(Object.hasOwn(pathResult.details, 'reasoningReady'), false);

        const nestedPathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: artifactId,
            params: {
                start_cell: 'START',
                end_cell: 'END',
                move_step: 2,
                target_turn: 1,
                avoid_color: 'blue',
                return_field: 'cell_hex_color'
            }
        });
        assert.equal(nestedPathResult.isError, false);
        assert.match(nestedPathResult.content[0].text, /extracted_value=F478A7/);
        assert.equal(nestedPathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(nestedPathResult.details.result.extraction.extractedValue, 'F478A7');

        const ruleTextPathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: artifactId,
            params: {
                start_cell: 'A1',
                end_cell: 'C2',
                move_rules: '2 cells per turn, up/down/left/right, no backward, no blue cells (0099FF)',
                target_turn: 1,
                return_field: 'cell_fill_color_hex'
            }
        });
        assert.equal(ruleTextPathResult.isError, false);
        assert.match(ruleTextPathResult.content[0].text, /extracted_value=F478A7/);
        assert.equal(ruleTextPathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(ruleTextPathResult.details.result.extraction.extractedValue, 'F478A7');

        const search = await contextArtifactStore.execute({
            action: 'search',
            artifactId: artifactId,
            query: 'SUM'
        });
        assert.equal(search.isError, false);
        assert.equal(search.details.matchCount, 1);

        const record = await contextArtifactStore.getRecord(artifactId);
        assert.ok(record.metadata.pinnedCoverage.some((entry) =>
            entry.coverageId === range.details.cachedCoverage.coverageId &&
            entry.coverage?.range === 'A1:F4'
        ));
        await fsp.stat(record.payloadPath);
        const guarded = contextArtifactStore.guardReadResult(record, record.payloadPath);
        assert.equal(guarded.isError, true);
        assert.equal(guarded.details.status, 'blocked');
        assert.equal(guarded.details.suggestedNext.tool, 'artifact_query');
    } finally {
        await fsp.rm(dir, { recursive: true, force: true });
    }
});
