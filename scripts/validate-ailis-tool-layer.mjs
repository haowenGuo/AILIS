import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-layer-deep-'));
const gateway = new AILISGateway({
    port: 0,
    workspaceRoot,
    projectRoot: path.resolve('.'),
    auditDir: path.join(workspaceRoot, '.audit')
});

const report = {
    ok: false,
    workspaceRoot,
    generatedAt: new Date().toISOString(),
    domains: {
        commandLine: { ok: false, checks: {} },
        filesystem: { ok: false, checks: {} },
        email: { ok: false, checks: {} },
        code: { ok: false, checks: {} },
        agent: { ok: false, checks: {} },
        safety: { ok: false, checks: {} }
    },
    optionalCapabilities: {},
    limitations: []
};

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

async function callTool(baseUrl, payload) {
    return (await jsonFetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })).body;
}

async function runAgent(baseUrl, payload) {
    return (await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })).body;
}

function mark(domain, name, result, extra = {}) {
    report.domains[domain].checks[name] = {
        pass: Boolean(result),
        ...extra
    };
}

function expectOk(response, label) {
    assert.equal(response.ok, true, `${label}: ${response.error || response.status}`);
    return response;
}

function expectStatus(response, status, label) {
    assert.equal(response.status, status, `${label}: expected ${status}, got ${response.status}`);
    return response;
}

async function retryUntil(fn, predicate, { attempts = 10, delayMs = 500 } = {}) {
    let last = null;
    for (let index = 0; index < attempts; index += 1) {
        last = await fn();
        if (predicate(last)) {
            return last;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return last;
}

async function validateCommandLine(baseUrl) {
    const ctx = { workspace: workspaceRoot };
    const approved = { ...ctx, approved: true };

    const execBlocked = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'exec', command: 'node -e "console.log(1)"' },
        context: ctx
    });
    expectStatus(execBlocked, 'needs_approval', 'exec approval gate');
    mark('commandLine', 'exec_requires_approval', true, { status: execBlocked.status });

    const exec = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'exec', command: 'node -e "console.log(\'DEEP_EXEC_OK\')"', timeoutMs: 10000 },
        context: approved
    }), 'exec approved');
    assert.match(exec.result.details.stdout, /DEEP_EXEC_OK/);
    mark('commandLine', 'exec_runs_command', true, { stdout: exec.result.details.stdout.trim() });

    const session = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'session_start',
            command: 'node -e "console.log(\'SESSION_READY\'); process.stdin.on(\'data\', d => console.log(\'ECHO:\' + d.toString().trim())); setTimeout(()=>{}, 30000)"',
            timeoutMs: 60000
        },
        context: approved
    }), 'session_start');
    const sessionId = session.result.details.session.id;
    mark('commandLine', 'session_start', true, { sessionId });

    const ready = await retryUntil(
        () => callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_read', sessionId },
            context: ctx
        }),
        (response) => /SESSION_READY/.test(response.result?.details?.session?.stdout || '')
    );
    expectOk(ready, 'process_read ready');
    mark('commandLine', 'process_read_stdout', true);

    const writeBlocked = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'process_write', sessionId, input: 'ping', enter: true },
        context: ctx
    });
    expectStatus(writeBlocked, 'needs_approval', 'process_write approval gate');
    mark('commandLine', 'process_write_requires_approval', true);

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'process_write', sessionId, input: 'ping', enter: true },
        context: approved
    }), 'process_write approved');
    const echoed = await retryUntil(
        () => callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_read', sessionId },
            context: ctx
        }),
        (response) => /ECHO:ping/.test(response.result?.details?.session?.stdout || '')
    );
    expectOk(echoed, 'process_read echo');
    assert.match(echoed.result.details.session.stdout, /ECHO:ping/);
    mark('commandLine', 'process_write_and_observe', true);

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'process_kill', sessionId },
        context: approved
    }), 'process_kill');
    mark('commandLine', 'process_kill', true);

    const ptyStatus = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'pty_status' },
        context: ctx
    }), 'pty_status');
    report.optionalCapabilities.pty = {
        available: Boolean(ptyStatus.result.details.available),
        status: ptyStatus.status,
        note: ptyStatus.result.details.available
            ? 'node-pty loads in this runtime; actual full-screen TUI still needs manual interactive verification.'
            : 'node-pty is not available in this runtime; process sessions remain available.'
    };
    const ptyDryRun = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'pty_start', command: 'node -v', dryRun: true },
        context: approved
    });
    assert.ok(['completed', 'not_available'].includes(ptyDryRun.status));
    mark('commandLine', 'pty_interface_present', true, { status: ptyDryRun.status });

    report.domains.commandLine.ok = Object.values(report.domains.commandLine.checks).every((entry) => entry.pass);
}

async function validateFilesystem(baseUrl) {
    const ctx = { workspace: workspaceRoot };
    const approved = { ...ctx, approved: true };

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'mkdir', path: 'fs/a/b' },
        context: approved
    }), 'mkdir nested');
    mark('filesystem', 'mkdir_nested', true);

    const writeV1 = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'write', path: 'fs/a/b/story.txt', content: 'version-1\n' },
        context: approved
    }), 'write v1');
    assert.ok(writeV1.result.details.rollback?.id);
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'append', path: 'fs/a/b/story.txt', content: 'append-line\n' },
        context: approved
    }), 'append');
    const read = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'read', path: 'fs/a/b/story.txt' },
        context: ctx
    }), 'read');
    assert.match(read.result.content[0].text, /append-line/);
    mark('filesystem', 'write_append_read', true);

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'write_binary',
            path: 'fs/blob.bin',
            dataBase64: Buffer.from('0123456789abcdef').toString('base64')
        },
        context: approved
    }), 'write_binary');
    const chunk = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'read_binary', path: 'fs/blob.bin', offset: 4, length: 6 },
        context: ctx
    }), 'read_binary');
    assert.equal(Buffer.from(chunk.result.details.dataBase64, 'base64').toString('utf8'), '456789');
    mark('filesystem', 'binary_stream_chunk', true);

    const watch = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'watch_start', path: 'fs', maxEvents: 100 },
        context: ctx
    }), 'watch_start');
    const watchId = watch.result.details.watcher.id;
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'write', path: 'fs/watched.txt', content: 'watch-event\n' },
        context: approved
    }), 'write watched');
    const polled = await retryUntil(
        () => callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'watch_poll', id: watchId },
            context: ctx
        }),
        (response) => (response.result?.details?.events || []).some((event) => String(event.filename || event.path).includes('watched.txt'))
    );
    expectOk(polled, 'watch_poll');
    mark('filesystem', 'file_watch_event', true, { events: polled.result.details.events.length });
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'watch_stop', id: watchId },
        context: approved
    }), 'watch_stop');

    const overwrite = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'write', path: 'fs/a/b/story.txt', content: 'version-2\n' },
        context: approved
    }), 'overwrite for rollback');
    const rollbackId = overwrite.result.details.rollback.id;
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'rollback_restore', id: rollbackId },
        context: approved
    }), 'rollback_restore');
    const restored = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'read', path: 'fs/a/b/story.txt' },
        context: ctx
    }), 'read restored');
    assert.match(restored.result.content[0].text, /append-line/);
    mark('filesystem', 'rollback_restore', true, { rollbackId });

    const list = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'list', path: 'fs' },
        context: ctx
    }), 'list');
    assert.ok(list.result.details.entries.some((entry) => entry.name === 'blob.bin'));
    const tree = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'tree', path: 'fs', maxDepth: 4 },
        context: ctx
    }), 'tree');
    assert.ok(tree.result.details.nodes.some((entry) => entry.relativePath.includes('story.txt')));
    const search = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'search', path: 'fs', contains: 'append-line' },
        context: ctx
    }), 'search contains');
    assert.ok(search.result.details.results.some((entry) => entry.path.endsWith('story.txt')));
    mark('filesystem', 'list_tree_search', true);

    const hash = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'hash', path: 'fs/blob.bin', algorithm: 'sha256' },
        context: ctx
    }), 'hash');
    assert.match(hash.result.details.digest, /^[a-f0-9]{64}$/);
    const du = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'du', path: 'fs' },
        context: ctx
    }), 'du');
    assert.ok(du.result.details.size > 0);
    mark('filesystem', 'hash_and_du', true);

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'copy', source: 'fs/a/b/story.txt', target: 'fs/story-copy.txt' },
        context: approved
    }), 'copy');
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'move', source: 'fs/story-copy.txt', target: 'fs/story-moved.txt' },
        context: approved
    }), 'move');
    const deleted = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'delete', path: 'fs/story-moved.txt', trash: true },
        context: approved
    }), 'trash delete');
    assert.equal(deleted.result.details.action, 'trash');
    mark('filesystem', 'copy_move_trash', true);

    const acl = expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'acl_get', path: 'fs/a/b/story.txt' },
        context: ctx
    }), 'acl_get');
    assert.ok(acl.result.details.stdout);
    const aclSetBlocked = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'acl_set', path: 'fs/a/b/story.txt', icaclsArgs: ['/grant', 'Everyone:(R)'], dryRun: false },
        context: ctx
    });
    expectStatus(aclSetBlocked, 'needs_approval', 'acl_set approval gate');
    mark('filesystem', 'acl_get_and_acl_set_gate', true);

    report.domains.filesystem.ok = Object.values(report.domains.filesystem.checks).every((entry) => entry.pass);
}

async function validateEmail(baseUrl) {
    const ctx = { workspace: workspaceRoot };

    const providers = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: { action: 'providers' },
        context: ctx
    }), 'email providers');
    const providerIds = providers.result.details.providers.map((provider) => provider.id);
    assert.deepEqual(providerIds.sort(), ['gmail', 'outlook', 'qq']);
    mark('email', 'providers_qq_gmail_outlook', true, { providers: providerIds });

    const draft = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'draft',
            provider: 'gmail',
            account: 'assistant@gmail.com',
            to: 'friend@example.com',
            subject: 'Deep validation',
            text: 'This is a AILIS local draft.'
        },
        context: ctx
    }), 'email draft');
    assert.match(JSON.stringify(draft.result.details), /Deep validation/);
    mark('email', 'draft_without_network', true);

    const drySend = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'send',
            provider: 'qq',
            account: 'deep@qq.com',
            secret: 'deep-secret-should-be-redacted',
            to: 'friend@example.com',
            subject: 'Dry send',
            text: 'Dry run only.',
            dryRun: true
        },
        context: ctx
    }), 'email dry send');
    assert.equal(drySend.status, 'completed');
    mark('email', 'smtp_send_dry_run', true);

    const gmailOauth = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'oauth_authorize_url',
            provider: 'gmail',
            clientId: 'client-id',
            redirectUri: 'http://127.0.0.1/oauth/callback',
            state: 'deep'
        },
        context: ctx
    }), 'gmail oauth url');
    assert.match(gmailOauth.result.details.url, /accounts\.google\.com/);
    const outlookOauth = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'oauth_authorize_url',
            provider: 'outlook',
            tenant: 'common',
            clientId: 'client-id',
            redirectUri: 'http://127.0.0.1/oauth/callback'
        },
        context: ctx
    }), 'outlook oauth url');
    assert.match(outlookOauth.result.details.url, /login\.microsoftonline\.com/);
    mark('email', 'oauth_urls', true);

    const refreshDryRun = expectOk(await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'oauth_refresh',
            provider: 'gmail',
            clientId: 'client-id',
            refreshToken: 'refresh-token',
            dryRun: true
        },
        context: ctx
    }), 'oauth refresh dry run');
    assert.equal(refreshDryRun.result.details.dryRun, true);
    mark('email', 'oauth_refresh_dry_run', true);

    const labels = await callTool(baseUrl, {
        tool: 'email',
        args: { action: 'gmail_list_labels' },
        context: ctx
    });
    expectStatus(labels, 'needs_config', 'gmail labels needs token');
    const graph = await callTool(baseUrl, {
        tool: 'email',
        args: { action: 'outlook_graph_messages' },
        context: ctx
    });
    expectStatus(graph, 'needs_config', 'outlook graph needs token');
    mark('email', 'provider_apis_need_tokens_cleanly', true);
    report.optionalCapabilities.emailLiveLogin = {
        available: false,
        status: 'needs_user_oauth_or_app_password',
        note: 'Offline validation passed. Live Gmail/Outlook/QQ mailbox operations require user credentials or OAuth tokens.'
    };

    const audit = (await jsonFetch(`${baseUrl}/audit?limit=50`)).body;
    assert.equal(audit.ok, true);
    assert.equal(JSON.stringify(audit.entries || []).includes('deep-secret-should-be-redacted'), false);
    mark('safety', 'email_secret_redacted_from_audit', true);

    report.domains.email.ok = Object.values(report.domains.email.checks).every((entry) => entry.pass);
}

async function validateCode(baseUrl) {
    const ctx = { workspace: workspaceRoot };
    const approved = { ...ctx, approved: true };

    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'write',
            path: 'package.json',
            content: JSON.stringify({
                name: 'ailis-deep-validation',
                version: '0.0.0',
                type: 'module',
                scripts: {
                    test: 'node ./test-runner.mjs'
                }
            }, null, 2)
        },
        context: approved
    }), 'write package');
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'write',
            path: 'test-runner.mjs',
            content: 'console.log("CODE_TEST_OK");\n'
        },
        context: approved
    }), 'write test runner');
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'write',
            path: 'src/math.js',
            content: [
                'export function add(a, b) {',
                '  const result = a + b;',
                '  return result;',
                '}',
                ''
            ].join('\n')
        },
        context: approved
    }), 'write JS source');
    expectOk(await callTool(baseUrl, {
        tool: 'computer',
        args: {
            action: 'write',
            path: 'src/types.ts',
            content: 'const total: number = 3;\nexport { total };\n'
        },
        context: approved
    }), 'write TS source');

    const semantic = expectOk(await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'semantic_index', path: '.', includeSymbols: true },
        context: ctx
    }), 'semantic index');
    assert.ok(semantic.result.details.symbols.some((symbol) => symbol.name === 'add'));
    mark('code', 'semantic_index_symbols', true);

    const search = expectOk(await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'search', path: '.', query: 'result' },
        context: ctx
    }), 'code search');
    assert.ok(search.result.details.matches.some((match) => String(match.path).endsWith('math.js')));
    mark('code', 'search_content', true);

    const symbols = expectOk(await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'symbols', path: 'src/math.js' },
        context: ctx
    }), 'symbols');
    assert.ok(symbols.result.details.symbols.some((symbol) => symbol.kind === 'function' && symbol.name === 'add'));
    mark('code', 'symbols_outline', true);

    const renameBlocked = await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'rename_symbol', path: 'src/math.js', from: 'result', to: 'sum' },
        context: ctx
    });
    expectStatus(renameBlocked, 'needs_approval', 'rename approval gate');
    const rename = expectOk(await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'rename_symbol', path: 'src/math.js', from: 'result', to: 'sum' },
        context: approved
    }), 'rename symbol');
    assert.equal(rename.result.details.replacements, 2);
    mark('code', 'ast_rename_symbol', true);

    const diagnostics = await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'lsp_diagnostics', path: 'src/types.ts' },
        context: ctx
    });
    assert.ok(['completed', 'error'].includes(diagnostics.status));
    mark('code', 'typescript_diagnostics_entrypoint', true, { status: diagnostics.status });

    const testBlocked = await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'test', script: 'test' },
        context: ctx
    });
    expectStatus(testBlocked, 'needs_approval', 'code test approval gate');
    const testRun = expectOk(await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'test', script: 'test', timeoutMs: 60000 },
        context: approved
    }), 'code test run');
    assert.match(testRun.result.details.stdout, /CODE_TEST_OK/);
    mark('code', 'run_package_test', true);

    const gitInit = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'exec', command: 'git init', timeoutMs: 30000 },
        context: approved
    });
    if (!gitInit.ok) {
        report.optionalCapabilities.git = {
            available: false,
            status: gitInit.status,
            note: gitInit.error || gitInit.result?.details?.stderr || 'git init failed'
        };
    } else {
        await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'git config user.email ailis@example.local', timeoutMs: 30000 },
            context: approved
        });
        await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'git config user.name AILIS', timeoutMs: 30000 },
            context: approved
        });
        await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'git add .', timeoutMs: 30000 },
            context: approved
        });
        const gitStatus = expectOk(await callTool(baseUrl, {
            tool: 'code',
            args: { action: 'git_status' },
            context: ctx
        }), 'git status');
        assert.match(gitStatus.result.details.stdout, /A\s+package\.json|A\s+src\/math\.js|A\s+src\\math\.js/);
        const commit = await callTool(baseUrl, {
            tool: 'code',
            args: { action: 'git_commit', message: 'Initial AILIS validation commit' },
            context: approved
        });
        assert.ok(commit.ok || /nothing to commit/i.test(commit.result?.details?.stderr || commit.error || ''));
        const log = expectOk(await callTool(baseUrl, {
            tool: 'code',
            args: { action: 'git_log', limit: 3 },
            context: ctx
        }), 'git log');
        assert.match(log.result.content[0].text, /AILIS validation commit|Initial/);
        mark('code', 'git_status_commit_log', true);
        report.optionalCapabilities.git = { available: true, status: 'completed' };
    }

    const ci = await callTool(baseUrl, {
        tool: 'code',
        args: { action: 'ci_status' },
        context: ctx
    });
    assert.ok(['completed', 'needs_config', 'error'].includes(ci.status));
    report.optionalCapabilities.githubCli = {
        available: ci.status === 'completed',
        status: ci.status,
        note: ci.status === 'completed'
            ? 'gh CLI is available for CI lookup.'
            : 'CI/PR workflow requires authenticated GitHub CLI.'
    };
    mark('code', 'ci_pr_entrypoint_checked', true, { ciStatus: ci.status });

    report.domains.code.ok = Object.values(report.domains.code.checks).every((entry) => entry.pass);
}

async function validateAgent(baseUrl) {
    const classifyShell = await runAgent(baseUrl, {
        sessionId: 'deep-agent',
        message: '后台运行 node -v',
        classifyOnly: true
    });
    assert.equal(classifyShell.intent, 'computer_operation');
    assert.equal(classifyShell.plan[0].tool, 'computer');
    mark('agent', 'classifies_shell_task', true);

    const classifyCode = await runAgent(baseUrl, {
        sessionId: 'deep-agent',
        message: '/code symbols {"path":"src/math.js"}',
        classifyOnly: true
    });
    assert.equal(classifyCode.intent, 'code_operation');
    assert.equal(classifyCode.plan[0].tool, 'code');
    mark('agent', 'classifies_code_task', true);

    const classifyEmail = await runAgent(baseUrl, {
        sessionId: 'deep-agent',
        message: '查看 Gmail 未读邮件',
        classifyOnly: true
    });
    assert.equal(classifyEmail.intent, 'email_management');
    assert.equal(classifyEmail.plan[0].tool, 'email');
    mark('agent', 'classifies_email_task', true);

    const agentRead = await runAgent(baseUrl, {
        sessionId: 'deep-agent',
        message: '列出目录 fs'
    });
    assert.equal(agentRead.intent, 'computer_operation');
    assert.ok(agentRead.ok);
    mark('agent', 'executes_task_through_gateway', true);

    const llmMissingConfig = await runAgent(baseUrl, {
        sessionId: 'deep-agent',
        message: '你好',
        agentLoop: 'llm',
        classifyOnly: false,
        context: { workspace: workspaceRoot }
    });
    assert.equal(llmMissingConfig.ok, false);
    assert.equal(llmMissingConfig.status, 'needs_llm_config');
    assert.equal(llmMissingConfig.planner, 'llm-agentic-executor');
    mark('agent', 'llm_loop_requires_config_without_rule_fallback', true, { planner: llmMissingConfig.planner });

    report.domains.agent.ok = Object.values(report.domains.agent.checks).every((entry) => entry.pass);
}

async function validateSafety(baseUrl) {
    const blocked = await callTool(baseUrl, {
        tool: 'computer',
        args: { action: 'write', path: path.join(path.parse(workspaceRoot).root, 'ailis-outside-block-test.txt'), content: 'blocked' },
        context: { workspace: workspaceRoot, approved: true }
    });
    expectStatus(blocked, 'blocked', 'outside workspace mutation blocked');
    mark('safety', 'outside_workspace_blocked', true);

    const audit = (await jsonFetch(`${baseUrl}/audit?limit=120`)).body;
    assert.equal(audit.ok, true);
    mark('safety', 'audit_log_available', true, { entries: audit.entries?.length || 0 });

    report.domains.safety.ok = Object.values(report.domains.safety.checks).every((entry) => entry.pass);
}

try {
    const status = await gateway.start();
    const baseUrl = status.url;
    report.gateway = status;

    const tools = (await jsonFetch(`${baseUrl}/tools`)).body;
    expectOk(tools, 'tools list');
    const localIds = new Set((tools.localTools || []).map((tool) => tool.id));
    for (const id of ['computer', 'code', 'email', 'file_manager']) {
        assert.equal(localIds.has(id), true, `missing local tool: ${id}`);
    }
    report.localTools = [...localIds].sort();

    await validateCommandLine(baseUrl);
    await validateFilesystem(baseUrl);
    await validateEmail(baseUrl);
    await validateCode(baseUrl);
    await validateAgent(baseUrl);
    await validateSafety(baseUrl);

    if (!report.optionalCapabilities.pty?.available) {
        report.limitations.push('PTY full interactive terminal is interface-checked but not live-spawn verified in this runtime.');
    }
    if (!report.optionalCapabilities.emailLiveLogin?.available) {
        report.limitations.push('Live Gmail/Outlook/QQ mailbox management requires user OAuth tokens or app passwords.');
    }
    if (!report.optionalCapabilities.githubCli?.available) {
        report.limitations.push('GitHub PR/CI workflow requires authenticated gh CLI.');
    }

    report.ok = Object.values(report.domains).every((domain) => domain.ok);
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) {
        process.exitCode = 1;
    }
} catch (error) {
    report.error = error instanceof Error ? error.stack || error.message : String(error);
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
} finally {
    await gateway.stop();
}
