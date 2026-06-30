import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = require('exceljs');
const {
    AILISContextArtifactStore
} = require('../electron/ailis-context-artifact-store.cjs');
const {
    executeArtifactImportTool
} = require('../electron/ailis-artifact-import-tool.cjs');

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

test('artifact_import registers RAGFlow-lite worker chunks as queryable context artifacts', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-artifact-import-'));
    const filePath = path.join(dir, 'inventory.xlsx');
    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Inventory');
        sheet.addRow(['Product', 'Color', 'Stock']);
        sheet.addRow(['Widget', 'Red', 12]);
        sheet.addRow(['Gadget', 'Blue', 5]);
        await workbook.xlsx.writeFile(filePath);

        const store = new AILISContextArtifactStore({ rootDir: path.join(dir, '.artifacts') });
        const imported = await executeArtifactImportTool({
            path: filePath,
            parserId: 'table',
            language: 'English'
        }, {
            runId: 'artifact-import-test',
            sessionId: 'test-session'
        }, {
            workspaceDir: dir,
            workspaceRoot: dir,
            projectRoot,
            contextArtifactStore: store
        });

        assert.equal(imported.isError, false);
        assert.match(imported.content[0].text, /ARTIFACT_IMPORT_COMPLETE/);
        assert.match(imported.content[0].text, /next=artifact_query/);
        assert.ok(imported.details.artifactId);
        assert.ok(imported.details.chunkCount >= 2);
        assert.equal(imported.structuredContent.ragflowLiteRuntime.source, 'rag.app.table.chunk');

        const schema = await store.execute({
            action: 'runtime_schema',
            artifactId: imported.details.artifactId
        });
        assert.equal(schema.isError, false);
        assert.equal(schema.structuredContent.parserType, 'table');
        assert.ok(schema.structuredContent.chunkCount >= 2);

        const search = await store.execute({
            action: 'chunk_search',
            artifactId: imported.details.artifactId,
            query: 'Widget',
            limit: 5
        });
        assert.equal(search.isError, false);
        assert.match(search.content[0].text, /ARTIFACT_CHUNK_SEARCH/);
        assert.match(search.content[0].text, /Widget/);
        assert.ok(search.structuredContent.matches.some((match) => /Widget/.test(match.content)));
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
