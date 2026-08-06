import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = require('exceljs');
const { executeReadXlsxWorkbookTool } = require('../electron/ailis-xlsx-workbook-tool.cjs');
const { AILISContextArtifactStore } = require('../electron/ailis-context-artifact-store.cjs');

test('read_xlsx_workbook reads values, fills, formulas, and merged ranges', async () => {
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

        const result = await executeReadXlsxWorkbookTool(
            {
                path: filePath,
                sheet: 'Map',
                maxRows: 6,
                maxCols: 6,
                includeStyles: true,
                includeFormulas: true
            },
            {},
            {
                workspaceDir: dir,
                workspaceRoot: dir,
                projectRoot: dir,
                auditDir,
                contextArtifactStore
            }
        );

        assert.equal(result.isError, false);
        assert.match(result.content[0].text, /XLSX_WORKBOOK_READ_COMPLETE/);
        assert.match(result.content[0].text, /fillColors=.*0099FF/);
        assert.doesNotMatch(result.content[0].text, /fullJsonPath/);
        assert.ok(result.structuredContent.artifact.artifactId);
        assert.equal(result.details.artifactId, result.structuredContent.artifact.artifactId);
        assert.equal(result.structuredContent.observationContract.reasoning_ready, true);

        const summary = await contextArtifactStore.execute({
            action: 'summary',
            artifactId: result.details.artifactId
        });
        assert.equal(summary.isError, false);
        assert.match(summary.content[0].text, /artifact_query actions/);

        const range = await contextArtifactStore.execute({
            action: 'range',
            artifactId: result.details.artifactId,
            sheet: 'Map',
            range: 'A1:F4'
        });
        assert.equal(range.isError, false);
        assert.match(range.content[0].text, /START/);
        assert.match(range.content[0].text, /0099FF/);
        assert.equal(range.details.coverage.range, 'A1:F4');
        assert.equal(range.details.complete, true);
        assert.equal(range.details.reasoningReady, true);
        assert.ok(range.details.evidence.evidenceId);

        const coveredRange = await contextArtifactStore.execute({
            action: 'range',
            artifactId: result.details.artifactId,
            sheet: 'Map',
            range: 'B1:C2'
        });
        assert.equal(coveredRange.isError, false);
        assert.match(coveredRange.content[0].text, /covered_by_pinned_evidence/);
        assert.equal(coveredRange.details.coveredByEvidence.evidenceId, range.details.evidence.evidenceId);
        assert.equal(coveredRange.details.coveredByEvidence.range, 'A1:F4');

        const profile = await contextArtifactStore.compute({
            action: 'profile',
            artifactId: result.details.artifactId,
            sheet: 'Map'
        });
        assert.equal(profile.isError, false);
        assert.match(profile.content[0].text, /ARTIFACT_COMPUTE_PROFILE/);
        assert.equal(profile.structuredContent.profiles[0].sheet, 'Map');

        const pathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: result.details.artifactId,
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
        assert.match(pathResult.content[0].text, /answer_candidate=F478A7/);
        assert.equal(pathResult.details.result.pathFound, true);
        assert.equal(pathResult.details.result.path.some((cell) => cell.address === 'B1'), false);
        assert.equal(pathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(pathResult.details.result.extraction.answerCandidate, 'F478A7');
        assert.equal(pathResult.details.reasoningReady, true);

        const nestedPathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: result.details.artifactId,
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
        assert.match(nestedPathResult.content[0].text, /answer_candidate=F478A7/);
        assert.equal(nestedPathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(nestedPathResult.details.result.extraction.answerCandidate, 'F478A7');

        const ruleTextPathResult = await contextArtifactStore.compute({
            action: 'find_path',
            artifactId: result.details.artifactId,
            params: {
                start_cell: 'A1',
                end_cell: 'C2',
                move_rules: '2 cells per turn, up/down/left/right, no backward, no blue cells (0099FF)',
                target_turn: 1,
                return_field: 'cell_fill_color_hex'
            }
        });
        assert.equal(ruleTextPathResult.isError, false);
        assert.match(ruleTextPathResult.content[0].text, /answer_candidate=F478A7/);
        assert.equal(ruleTextPathResult.details.result.extraction.cell.address, 'B2');
        assert.equal(ruleTextPathResult.details.result.extraction.answerCandidate, 'F478A7');

        const search = await contextArtifactStore.execute({
            action: 'search',
            artifactId: result.details.artifactId,
            query: 'SUM'
        });
        assert.equal(search.isError, false);
        assert.equal(search.details.matchCount, 1);

        const record = await contextArtifactStore.getRecord(result.details.artifactId);
        assert.ok(record.metadata.pinnedEvidence.some((entry) =>
            entry.evidenceId === range.details.evidence.evidenceId &&
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
