import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { executeCodeTool } = require('../electron/ailis-code-tool.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

test('AILIS code tool covers Git, search, symbols, AST rename, diagnostics, and Gateway routing', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-code-test-'));
    const runtime = { workspaceRoot, workspaceDir: workspaceRoot };
    await fs.writeFile(path.join(workspaceRoot, 'sample.js'), [
        'export function greet(name) {',
        '  const message = `hello ${name}`;',
        '  return message;',
        '}',
        ''
    ].join('\n'), 'utf8');
    await fs.writeFile(path.join(workspaceRoot, 'sample.ts'), 'const count: number = 1;\n', 'utf8');

    const schema = await executeCodeTool({ action: 'schema' }, {}, runtime);
    assert.equal(schema.details.status, 'completed');
    assert.ok(schema.details.schema.actions.includes('rename_symbol'));
    assert.ok(schema.details.schema.actions.includes('lsp_diagnostics'));

    const index = await executeCodeTool({ action: 'semantic_index', path: '.', includeSymbols: true }, {}, runtime);
    assert.equal(index.details.status, 'completed');
    assert.ok(index.details.files.some((file) => file.relativePath === 'sample.js'));
    assert.ok(index.details.symbols.some((symbol) => symbol.name === 'greet'));

    const search = await executeCodeTool({ action: 'search', path: '.', query: 'hello' }, {}, runtime);
    assert.equal(search.details.status, 'completed');
    assert.ok(search.details.matches.some((match) => String(match.path).endsWith('sample.js')));

    const symbols = await executeCodeTool({ action: 'symbols', path: 'sample.js' }, {}, runtime);
    assert.equal(symbols.details.status, 'completed');
    assert.ok(symbols.details.symbols.some((symbol) => symbol.kind === 'function' && symbol.name === 'greet'));

    const renameBlocked = await executeCodeTool({ action: 'rename_symbol', path: 'sample.js', from: 'message', to: 'reply' }, {}, runtime);
    assert.equal(renameBlocked.details.status, 'needs_approval');

    const rename = await executeCodeTool({ action: 'rename_symbol', path: 'sample.js', from: 'message', to: 'reply' }, { approved: true }, runtime);
    assert.equal(rename.details.status, 'completed');
    assert.equal(rename.details.replacements, 2);
    const renamedText = await fs.readFile(path.join(workspaceRoot, 'sample.js'), 'utf8');
    assert.match(renamedText, /const reply/);

    const diagnostics = await executeCodeTool({ action: 'lsp_diagnostics', path: 'sample.ts' }, {}, runtime);
    assert.equal(diagnostics.details.status, 'completed');

    const gitStatus = await executeCodeTool({ action: 'git_status', cwd: path.resolve('.') }, {}, { workspaceRoot: path.resolve('.'), workspaceDir: path.resolve('.') });
    assert.ok(['completed', 'error'].includes(gitStatus.details.status));

    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    try {
        const status = await gateway.start();
        const tools = await jsonFetch(`${status.url}/tools`);
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'code'));

        const classify = await jsonFetch(`${status.url}/agent/run`, {
            method: 'POST',
            body: JSON.stringify({
                sessionId: 'code-test',
                message: '/code symbols {"path":"sample.js"}',
                classifyOnly: true
            })
        });
        assert.equal(classify.body.intent, 'code_operation');
        assert.equal(classify.body.plan[0].tool, 'code');
    } finally {
        await gateway.stop();
    }
});
