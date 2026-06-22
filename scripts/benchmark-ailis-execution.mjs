import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json();
  return { response, body };
}

function summarizeResult(body) {
  return {
    ok: body.ok,
    status: body.status,
    tool: body.tool,
    durationMs: body.durationMs,
    error: body.error || body.result?.details?.error,
    detailsStatus: body.result?.details?.status,
    action: body.result?.details?.action,
  };
}

async function main() {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-execution-bench-'));
  const gateway = new AILISGateway({
    port: 0,
    workspaceRoot,
    projectRoot: path.resolve('.'),
    auditDir: path.join(workspaceRoot, '.audit'),
  });

  const result = {
    ok: false,
    workspaceRoot,
    startedAt: new Date().toISOString(),
    tasks: {},
  };

  try {
    const status = await gateway.start();
    const baseUrl = status.url;
    const callTool = async ({ tool, args, context = {}, runId = 'bench-main' }) => {
      const response = await jsonFetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        body: JSON.stringify({
          tool,
          args,
          context: {
            workspace: workspaceRoot,
            sessionId: 'bench',
            runId,
            ...context,
          },
        }),
      });
      return response.body;
    };

    const codeTask = await runCodeRepairTask(callTool, workspaceRoot);
    const processTask = await runProcessTask(callTool, workspaceRoot);
    const safetyTask = await runSafetyTask(callTool);
    const audit = await jsonFetch(`${baseUrl}/audit?limit=100`);
    const transcript = await jsonFetch(`${baseUrl}/transcript?runId=bench-code-repair&limit=200`);

    result.tasks.codeRepair = codeTask;
    result.tasks.processSession = processTask;
    result.tasks.safety = safetyTask;
    result.auditEntries = audit.body.entries?.length || 0;
    result.transcript = {
      ok: transcript.body.ok,
      itemCount: transcript.body.items?.length || 0,
      types: [...new Set((transcript.body.items || []).map((item) => item.type))],
    };
    result.ok = codeTask.ok && processTask.ok && safetyTask.ok && result.auditEntries >= 8;
  } finally {
    await gateway.stop();
  }

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exitCode = 1;
  }
}

async function runCodeRepairTask(callTool, workspaceRoot) {
  const runId = 'bench-code-repair';
  const packageJson = {
    scripts: {
      test: 'node tests/run-tests.js',
    },
  };
  const buggySource = [
    'function sum(numbers) {',
    '  return numbers[0] || 0;',
    '}',
    '',
    'function average(numbers) {',
    '  return sum(numbers) / numbers.length;',
    '}',
    '',
    'module.exports = { sum, average };',
    '',
  ].join('\n');
  const fixedSource = [
    'function sum(numbers) {',
    '  return numbers.reduce((total, value) => total + Number(value || 0), 0);',
    '}',
    '',
    'function average(numbers) {',
    '  return numbers.length ? sum(numbers) / numbers.length : 0;',
    '}',
    '',
    'module.exports = { sum, average };',
    '',
  ].join('\n');
  const testSource = [
    "const assert = require('node:assert/strict');",
    "const { sum, average } = require('../src/math');",
    '',
    'assert.equal(sum([2, 3, 5]), 10);',
    'assert.equal(average([2, 4, 6]), 4);',
    'assert.equal(average([]), 0);',
    "console.log('BENCH_TEST_OK');",
    '',
  ].join('\n');

  await callTool({ tool: 'write', args: { path: 'package.json', content: JSON.stringify(packageJson, null, 2) }, runId });
  await callTool({ tool: 'write', args: { path: 'src/math.js', content: buggySource }, runId });
  await callTool({ tool: 'write', args: { path: 'tests/run-tests.js', content: testSource }, runId });

  const failingTest = await callTool({
    tool: 'exec',
    args: { command: 'npm test', timeout: 20 },
    context: { approved: true },
    runId,
  });
  assert.equal(failingTest.status, 'error');

  const index = await callTool({
    tool: 'code',
    args: { action: 'semantic_index', path: '.', includeSymbols: true },
    runId,
  });
  const readBug = await callTool({ tool: 'read', args: { path: 'src/math.js' }, runId });
  const fix = await callTool({ tool: 'write', args: { path: 'src/math.js', content: fixedSource }, runId });
  const passingTest = await callTool({
    tool: 'exec',
    args: { command: 'npm test', timeout: 20 },
    context: { approved: true },
    runId,
  });
  const codeTest = await callTool({
    tool: 'code',
    args: { action: 'test', runner: 'npm', script: 'test', cwd: '.' },
    context: { approved: true },
    runId,
  });

  const reportPath = path.join(workspaceRoot, 'reports', 'ailis-code-repair.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        failingTest: summarizeResult(failingTest),
        passingTest: summarizeResult(passingTest),
        codeTest: summarizeResult(codeTest),
        indexedFiles: index.result?.details?.files?.length || 0,
      },
      null,
      2
    ),
    'utf8'
  );

  const sourceAfter = await fs.readFile(path.join(workspaceRoot, 'src', 'math.js'), 'utf8');
  return {
    ok:
      failingTest.status === 'error' &&
      index.status === 'completed' &&
      readBug.ok === true &&
      fix.status === 'completed' &&
      passingTest.status === 'completed' &&
      /BENCH_TEST_OK/.test(JSON.stringify(passingTest.result)) &&
      codeTest.status === 'completed' &&
      /reduce/.test(sourceAfter),
    failingTest: summarizeResult(failingTest),
    index: summarizeResult(index),
    passingTest: summarizeResult(passingTest),
    codeTest: summarizeResult(codeTest),
    reportPath,
  };
}

async function runProcessTask(callTool) {
  const runId = 'bench-process-session';
  const processSource = [
    "process.stdout.write('READY\\n');",
    'let count = 0;',
    "const timer = setInterval(() => process.stdout.write(`tick:${++count}\\n`), 200);",
    "process.stdin.on('data', (chunk) => {",
    "  if (String(chunk).includes('stop')) {",
    '    clearInterval(timer);',
    "    process.stdout.write('STOPPED\\n');",
    '    process.exit(0);',
    '  }',
    '});',
    '',
  ].join('\n');
  await callTool({ tool: 'write', args: { path: 'tools/counter.js', content: processSource }, runId });
  const start = await callTool({
    tool: 'computer',
    args: { action: 'session_start', command: 'node tools/counter.js', timeout: 10000 },
    context: { approved: true },
    runId,
  });
  const sessionId = start.result?.details?.session?.id;
  assert.ok(sessionId);
  await new Promise((resolve) => setTimeout(resolve, 650));
  const firstRead = await callTool({ tool: 'computer', args: { action: 'process_read', sessionId }, runId });
  const wrote = await callTool({
    tool: 'computer',
    args: { action: 'process_write', sessionId, input: 'stop', enter: true },
    context: { approved: true },
    runId,
  });
  await new Promise((resolve) => setTimeout(resolve, 350));
  const finalRead = await callTool({ tool: 'computer', args: { action: 'process_read', sessionId }, runId });
  const text = JSON.stringify(finalRead.result || {});
  return {
    ok:
      start.status === 'completed' &&
      firstRead.status === 'completed' &&
      wrote.status === 'completed' &&
      finalRead.status === 'completed' &&
      /READY/.test(text) &&
      /tick:/.test(text) &&
      /STOPPED/.test(text),
    start: summarizeResult(start),
    firstRead: summarizeResult(firstRead),
    wrote: summarizeResult(wrote),
    finalRead: summarizeResult(finalRead),
    sessionId,
  };
}

async function runSafetyTask(callTool) {
  const runId = 'bench-safety';
  const outsideRead = await callTool({ tool: 'read', args: { path: '../outside.txt' }, runId });
  const execWithoutApproval = await callTool({
    tool: 'exec',
    args: { command: 'node -e "console.log(123)"', timeout: 5 },
    runId,
  });
  const readOnlyWrite = await callTool({
    tool: 'write',
    args: { path: 'should-not-write.txt', content: 'nope' },
    context: { permissionProfile: { fileSystem: 'read-only', shell: 'none', approvalPolicy: 'never' } },
    runId,
  });
  return {
    ok:
      outsideRead.status === 'blocked' &&
      execWithoutApproval.status === 'needs_approval' &&
      readOnlyWrite.status === 'blocked',
    outsideRead: summarizeResult(outsideRead),
    execWithoutApproval: summarizeResult(execWithoutApproval),
    readOnlyWrite: summarizeResult(readOnlyWrite),
  };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
