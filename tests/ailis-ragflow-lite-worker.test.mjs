import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = require('exceljs');
const execFileAsync = promisify(execFile);

test('ragflow-lite worker runs upstream table chunker for structured spreadsheets', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-ragflow-table-'));
    const filePath = path.join(dir, 'inventory.xlsx');
    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Inventory');
        sheet.addRow(['Product', 'Color', 'Stock']);
        sheet.addRow(['Widget', 'Red', 12]);
        sheet.addRow(['Gadget', 'Blue', 5]);
        await workbook.xlsx.writeFile(filePath);

        const { stdout } = await execFileAsync('python', [
            'scripts/ailis-ragflow-lite-worker.py',
            'table',
            '--path',
            filePath,
            '--language',
            'English'
        ], {
            cwd: path.resolve('F:/AILIS_self_evolution_runtime'),
            maxBuffer: 1024 * 1024
        });

        const parsed = JSON.parse(stdout);
        assert.equal(parsed.status, 'ready');
        assert.equal(parsed.source, 'rag.app.table.chunk');
        assert.equal(parsed.parserType, 'table');
        assert.ok(parsed.chunkCount >= 2);
        assert.ok(parsed.table_column_names.includes('Product'));
        assert.ok(parsed.chunks.some((chunk) => /Widget/.test(chunk.content_with_weight)));
        assert.ok(Array.isArray(parsed.warnings));
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
