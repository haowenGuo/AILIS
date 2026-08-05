import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const nodeBin = process.execPath;

async function runNode(args) {
    const { stdout, stderr } = await execFileAsync(nodeBin, args, {
        cwd: repoRoot,
        maxBuffer: 16 * 1024 * 1024
    });
    if (stderr.trim()) {
        process.stderr.write(stderr);
    }
    return stdout;
}

test('artifact tools eval runner performs structure, render, and roundtrip checks on real fixtures', { timeout: 120000 }, async () => {
    const fixtureOutput = JSON.parse(await runNode(['scripts/prepare-artifact-tools-fixtures.mjs']));
    assert.equal(fixtureOutput.schema, 'ailis.artifact_tools.fixtures.v1');
    assert.equal(fixtureOutput.outputs.length, 7);

    for (const relativePath of fixtureOutput.outputs) {
        const stat = await fs.stat(path.join(repoRoot, relativePath));
        assert.ok(stat.size > 0, `${relativePath} should be a non-empty fixture`);
    }

    const report = JSON.parse(await runNode(['scripts/run-artifact-tools-eval.mjs', '--json']));
    assert.equal(report.schema, 'ailis.artifact_tools.eval_run.v1');
    assert.equal(report.total, 10);
    assert.equal(report.failed, 0);
    assert.equal(report.blocked, 0);
    assert.equal(report.passed, 10);

    const xlsx = report.results.find((entry) => entry.id === 'xlsx_map_path_color');
    assert.ok(xlsx);
    assert.equal(xlsx.status, 'passed');
    assert.ok(xlsx.structure.checks.some((check) => check.name === 'map_path_landed_color' && check.passed));

    const editCase = report.results.find((entry) => entry.id === 'xlsx_edit_export_roundtrip');
    assert.ok(editCase);
    assert.equal(editCase.status, 'passed');
    assert.equal(editCase.edit.passed, true);
    assert.equal(editCase.edit.afterPassed, true);
    await fs.stat(path.join(repoRoot, editCase.edit.outputPath));

    const traceRecalcCase = report.results.find((entry) => entry.id === 'xlsx_render_trace_recalculate');
    assert.ok(traceRecalcCase);
    assert.equal(traceRecalcCase.status, 'passed');
    assert.equal(traceRecalcCase.trace.passed, true);
    assert.equal(traceRecalcCase.recalculation.passed, true);
    assert.equal(traceRecalcCase.recalculation.afterPassed, true);
    await fs.stat(path.join(repoRoot, traceRecalcCase.recalculation.outputPath));

    const searchCase = report.results.find((entry) => entry.id === 'xlsx_search_index_observation');
    assert.ok(searchCase);
    assert.equal(searchCase.status, 'passed');
    assert.ok(searchCase.searches.length >= 8);
    assert.ok(searchCase.searches.every((search) => search.passed));
    assert.ok(searchCase.searches.some((search) => search.kind === 'style' && search.returned >= 1));
    assert.ok(searchCase.searches.some((search) => search.kind === 'comment' && search.returned >= 1));

    const pdfCase = report.results.find((entry) => entry.id === 'pdf_text_layer_search');
    assert.ok(pdfCase);
    assert.equal(pdfCase.status, 'passed');
    assert.equal(pdfCase.render.renderKind, 'pdf_page_png_poppler');
    assert.ok(pdfCase.searches.some((search) => search.kind === 'text' && search.returned >= 1));

    const docxCase = report.results.find((entry) => entry.id === 'docx_render_layout_gate');
    assert.ok(docxCase);
    assert.equal(docxCase.status, 'passed');
    assert.ok(docxCase.searches.some((search) => search.kind === 'comment' && search.returned >= 1));
    assert.ok(docxCase.searches.some((search) => search.kind === 'image' && search.returned >= 1));

    const pptxCase = report.results.find((entry) => entry.id === 'pptx_render_contact_sheet');
    assert.ok(pptxCase);
    assert.equal(pptxCase.status, 'passed');
    assert.equal(pptxCase.render.renderKind, 'pptx_contact_sheet_png_pillow');
    assert.ok(pptxCase.searches.some((search) => search.kind === 'slide' && search.returned >= 1));

    const imageCase = report.results.find((entry) => entry.id === 'image_metadata_nonblank');
    assert.ok(imageCase);
    assert.equal(imageCase.status, 'passed');
    assert.equal(imageCase.render.renderKind, 'image_png_pillow');
    assert.ok(imageCase.searches.some((search) => search.kind === 'color' && search.returned >= 1));

    for (const entry of report.results) {
        assert.equal(entry.structure.passed, true, `${entry.id} structure should pass`);
        assert.equal(entry.render.passed, true, `${entry.id} render should pass`);
        assert.equal(entry.roundtrip.passed, true, `${entry.id} roundtrip should pass`);
        assert.ok(entry.render.outputPath.endsWith(entry.format === 'csv' ? '.svg' : '.png'));
        const renderPath = path.join(repoRoot, entry.render.outputPath);
        await fs.stat(renderPath);
        if (entry.format !== 'csv') {
            const header = await fs.readFile(renderPath);
            assert.equal(header.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        }
        await fs.stat(path.join(repoRoot, entry.roundtrip.outputPath));
    }
});
