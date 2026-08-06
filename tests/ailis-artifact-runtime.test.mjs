import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const {
    AILISContextArtifactStore
} = require('../electron/ailis-context-artifact-store.cjs');

test('context artifacts bridge RAGFlow-lite runtime chunks without synthesizing them', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-artifact-runtime-'));
    try {
        const store = new AILISContextArtifactStore({ rootDir: tmpDir });
        const created = await store.createArtifact({
            kind: 'spreadsheet',
            type: 'xlsx',
            sourcePath: path.join(tmpDir, 'map.xlsx'),
            summary: 'Small spreadsheet map',
            payload: {
                workbook: {
                    sheets: [{
                        name: 'Map',
                        dimensions: {
                            inspectedRange: 'A1:C2',
                            rowCount: 2,
                            columnCount: 3
                        },
                        colorLegend: [
                            { rgb: '0099FF', count: 1 },
                            { rgb: 'F478A7', count: 1 }
                        ],
                        cells: [
                            { address: 'A1', value: 'START' },
                            { address: 'B1', fill: { fgRgb: '0099FF' } },
                            { address: 'B2', fill: { fgRgb: 'F478A7' } },
                            { address: 'C2', value: 'END', fill: { fgRgb: '92D050' } }
                        ],
                        nonEmptyCells: [
                            { address: 'A1', value: 'START' },
                            { address: 'C2', value: 'END', fill: '92D050' }
                        ]
                    }]
                },
                ragflowLiteRuntime: {
                    source: 'ragflow_extractor_test_fixture',
                    status: 'ready',
                    parserType: 'table',
                    kind: 'spreadsheet',
                    chunks: [{
                        id: 'ck-ragflow-row-2',
                        parser_id: 'table',
                        doc_type_kwd: 'spreadsheet',
                        docnm_kwd: 'map.xlsx',
                        chunk_type_kwd: 'spreadsheet_row',
                        chunk_order_int: 2,
                        position_int: [[1, 2, 2, 1, 3]],
                        title_tks: 'Map row 2',
                        content_with_weight: 'Sheet Map row 2: B2 fill=F478A7; C2="END" fill=92D050',
                        content_ltks: 'sheet map row 2 b2 fill f478a7 c2 end',
                        chunk_data: { sheet: 'Map', row: 2 }
                    }]
                }
            },
            queryHints: ['summary', 'grid']
        });

        assert.equal(created.metadata.artifactRuntime.runtime, 'ragflow_lite_bridge');
        assert.equal(created.metadata.artifactRuntime.source, 'ragflow_extractor_test_fixture');
        assert.equal(created.metadata.artifactRuntime.parserType, 'table');
        assert.equal(created.metadata.artifactRuntime.chunkCount, 1);
        assert.ok(created.queryHints.includes('chunk_search'));

        const schema = await store.execute({
            action: 'runtime_schema',
            artifactId: created.id
        });
        assert.equal(schema.isError, false);
        assert.equal(schema.structuredContent.parserType, 'table');
        assert.ok(schema.structuredContent.fields.includes('content_with_weight'));

        const search = await store.execute({
            action: 'chunk_search',
            artifactId: created.id,
            query: 'F478A7',
            limit: 3
        });
        assert.equal(search.isError, false);
        assert.match(search.content[0].text, /ARTIFACT_CHUNK_SEARCH/);
        assert.match(search.content[0].text, /F478A7/);
        assert.equal(search.details.complete, true);
        assert.equal(search.details.reasoningReady, true);
        assert.ok(search.structuredContent.matches.some((match) => /F478A7/.test(match.content)));
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});
