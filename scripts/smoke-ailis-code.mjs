import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { executeCodeTool } = require('../electron/ailis-code-tool.cjs');

const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-code-smoke-'));
await fs.writeFile(path.join(workspaceRoot, 'hello.js'), 'function hello() { return "world"; }\n', 'utf8');

const runtime = { workspaceRoot, workspaceDir: workspaceRoot };
const schema = await executeCodeTool({ action: 'schema' }, {}, runtime);
assert.equal(schema.details.status, 'completed');

const symbols = await executeCodeTool({ action: 'symbols', path: 'hello.js' }, {}, runtime);
assert.equal(symbols.details.status, 'completed');
assert.ok(symbols.details.symbols.some((symbol) => symbol.name === 'hello'));

const diagnostics = await executeCodeTool({ action: 'lsp_status' }, {}, runtime);
assert.equal(diagnostics.details.status, 'completed');

console.log('AILIS code smoke passed');
