import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { markdownResourceLinks, classifyMarkdownHref } from '../shared/markdown.mjs';
import { markdownToPlainText } from '../src/markdown-renderer.js';
const require = createRequire(import.meta.url);
const { AILISTaskInteraction } = require('../electron/ailis-task-interaction.cjs');
const { registerFinalArtifacts, readWorkspaceArtifact, MAX_FILE_BYTES, MAX_TOTAL_BYTES } = require('../electron/ailis-task-artifacts.cjs');

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-artifact-'));
    const workspace = path.join(root, 'workspace'); fs.mkdirSync(workspace);
    const gateway = new EventEmitter(); gateway.workspaceRoot = workspace; gateway.resolveToolPath = value => value;
    const host = new AILISTaskInteraction({ rootDir: path.join(root, 'state'), gateway });
    host.record('one', { type: 'run.add', run: { id: 'run-one', status: 'completed', items: [] } });
    const collect = text => registerFinalArtifacts(host, 'one', 'run-one', text);
    const items = () => host.snapshot('one').runs[0].items;
    const read = (ref, extra = {}) => host.readResource({ sessionId: 'one', runId: 'run-one', resourceId: ref.id, ...extra });
    const write = (name, data) => { const target = path.join(workspace, name); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data); return target; };
    t.after(() => { host.dispose(); fs.rmSync(root, { recursive: true, force: true }); });
    return { root, workspace, host, gateway, collect, items, read, write };
}

test('one Markdown parser collects explicit destinations, not prose, code, or remote URLs', () => {
    const text = '文件 outside.txt\n\n[报告](<report (final).html>) ![图](plot.png) [同一份](plot.png)\n\n[引用][a]\n\n[a]: sub/file.md\n\n`[不读](secret.txt)`\n\n```md\n[不读](hidden.txt)\n```\n\n[网页](https://example.com) ![外图](https://example.com/a.png)';
    assert.deepEqual(markdownResourceLinks(text).map(link => link.href), ['report%20(final).html', 'plot.png', 'sub/file.md']);
    assert.equal(markdownResourceLinks('[a](a.md) [b](b.md)', 1).length, 1);
    for (const href of ['javascript:alert(1)', 'data:image/svg+xml,x', '//server/share', '\\\\server\\share', 'https://u:p@host/x', '\u0000a']) assert.equal(classifyMarkdownHref(href), 'blocked', href);
    for (const href of ['F:/workspace/a.md', '/F:/workspace/a.md', 'file:///F:/workspace/a.md']) assert.equal(classifyMarkdownHref(href), 'local');
    assert.equal(markdownToPlainText('**完成**\n\n- 一\n- 二\n\n[文件](file.md)'), '完成\n\n一\n\n二\n\n文件');
});

test('HTML and binary resources persist unchanged; download is byte exact and scoped', async t => {
    const f = fixture(t); const html = '\ufeff<!doctype html>\r\n<h1>成果</h1>\r\n  ';
    const binary = Buffer.from([80, 75, 0, 1, 255, 0, 128, 42]);
    f.write('report (final).html', html); f.write('report.xlsx', binary);
    await f.collect('[文档](<report (final).html>) [表格](report.xlsx)');
    const [doc, sheet] = f.items(); assert.equal(doc.artifactRef.mime, 'text/html'); assert.equal(f.read(doc.artifactRef).text, html);
    assert.deepEqual(Buffer.from(f.read(sheet.artifactRef, { format: 'base64' }).base64, 'base64'), binary);
    assert.equal(f.read(sheet.artifactRef).previewUnavailable, true);
    assert.throws(() => f.host.readResource({ sessionId: 'other', runId: 'run-one', resourceId: doc.artifactRef.id }), /不属于/);
    assert.throws(() => f.host.readResource({ sessionId: 'one', runId: 'wrong', resourceId: doc.artifactRef.id }), /不属于/);
    assert.throws(() => f.read(doc.artifactRef, { format: 'file' }), /不支持/);
    f.write('report (final).html', 'Changed later'); assert.equal(f.read(doc.artifactRef).text, html);
    f.host.dispose(); const restored = new AILISTaskInteraction({ rootDir: path.join(f.root, 'state'), gateway: f.gateway });
    assert.equal(restored.readResource({ sessionId: 'one', runId: 'run-one', resourceId: doc.artifactRef.id }).text, html); restored.dispose();
    fs.writeFileSync(path.join(f.root, 'state', 'resources', doc.artifactRef.id), 'tampered'); assert.throws(() => f.read(doc.artifactRef), /校验失败/);
});

test('workspace boundary, hidden files, unsupported files and broken references fail closed', async t => {
    const f = fixture(t); fs.writeFileSync(path.join(f.root, 'outside.txt'), 'outside'); f.write('.env', 'not published');
    f.write('private/.git/config.txt', 'internal'); f.write('program.exe', 'not a document');
    await f.collect('[out](../outside.txt) [env](.env) [config](private/.git/config.txt) [exe](program.exe) [missing](gone.md)');
    assert.equal(f.items().length, 5); assert.ok(f.items().every(item => item.artifactStatus === 'unavailable' && !item.artifactRef));
    assert.equal(fs.existsSync(path.join(f.root, 'state', 'resources')), false);
});

test('symlink/junction and hardlink resources cannot export another file', async t => {
    const f = fixture(t); const outside = path.join(f.root, 'outside'); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'secret.txt'), 'secret');
    fs.symlinkSync(outside, path.join(f.workspace, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
    fs.linkSync(path.join(outside, 'secret.txt'), path.join(f.workspace, 'hard.txt'));
    await f.collect('[junction](linked/secret.txt) [hard](hard.txt)');
    assert.ok(f.items().every(item => !item.artifactRef));
});

test('snapshots obey byte/count budgets; text previews do not truncate downloads', async t => {
    const f = fixture(t); const large = f.write('large.txt', ''); fs.truncateSync(large, MAX_FILE_BYTES + 1);
    await f.collect('[large](large.txt)'); assert.match(f.items()[0].artifactError, /16 MiB/);
    const text = 'x'.repeat(1024 * 1024 + 50); f.write('long.md', text);
    await assert.rejects(readWorkspaceArtifact(f.host, 'long.md', 10), /64 MiB/);
    await f.collect('[long](long.md)'); const ref = f.items().at(-1).artifactRef;
    assert.equal(f.read(ref).truncated, true); assert.equal(f.read(ref).text.length, 1024 * 1024);
    assert.equal(Buffer.from(f.read(ref, { format: 'base64' }).base64, 'base64').toString(), text);
    assert.equal(MAX_TOTAL_BYTES, 64 * 1024 * 1024);
    const many = Array.from({ length: 25 }, (_, i) => `[${i}](missing${i}.txt)`).join(' '); const before = f.items().length;
    await f.collect(many); assert.equal(f.items().length - before, 20);
});

test('controlled-write diff evidence is retained and receives artifact actions without duplicate cards', async t => {
    const f = fixture(t); const target = f.write('notes.md', '# Notes');
    f.host.record('one', { type: 'item', runId: 'run-one', item: { id: 'change', kind: 'file', path: target, action: 'add', added: 1, removed: 0, afterRef: f.host.resource(Buffer.from('# Notes')) } });
    await f.collect('[first](notes.md) [second](./notes.md)'); const item = f.items()[0];
    assert.equal(f.items().length, 1); assert.equal(item.id, 'change'); assert.equal(item.added, 1); assert.equal(item.action, 'add');
    assert.deepEqual(item.hrefs, ['notes.md', './notes.md']); assert.equal(f.read(item.artifactRef).mime, 'text/markdown');
});

test('absolute paths, URI paths and source-line suffixes resolve to the same scoped snapshot', async t => {
    const f = fixture(t); const target = f.write('source.js', 'const value = 1;');
    const absolute = target.replace(/\\/g, '/');
    await f.collect(`[absolute](<${absolute}>) [line](<${absolute}:12>) [uri](<${pathToFileURL(target).href}>)`);
    assert.equal(f.items().length, 1); assert.equal(f.items()[0].hrefs.length, 3);
    assert.equal(f.read(f.items()[0].artifactRef).text, 'const value = 1;');
});

test('final model Markdown is not rewritten; shell-created file needs no fileChange event', async t => {
    const f = fixture(t); f.write('result.html', '<h1>Result</h1>');
    const final = '完成：[结果](result.html)';
    f.gateway.runAgent = async () => ({ ok: true, status: 'completed', displayText: final });
    const receipt = await f.host.submit({ sessionId: 'new', clientMessageId: 'artifact-new-001', text: '生成结果' });
    await f.host.active.get('new').promise;
    const run = f.host.snapshot('new').runs[0]; assert.equal(run.id, receipt.runId); assert.equal(run.status, 'completed');
    assert.equal(run.items.find(item => item.kind === 'assistant').text, final);
    assert.equal(run.items.find(item => item.kind === 'artifact').artifactStatus, 'ready');
});
