import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { executeEmailTool, inferProviderFromAccount, listProviderDetails } = require('../electron/ailis-email-tool.cjs');

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
    return await jsonFetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

test('AILIS email provider presets cover QQ, Gmail, and Outlook', () => {
    const providers = listProviderDetails();
    assert.deepEqual(
        providers.map((provider) => provider.id).sort(),
        ['gmail', 'outlook', 'qq']
    );
    assert.equal(inferProviderFromAccount('alice@qq.com'), 'qq');
    assert.equal(inferProviderFromAccount('alice@gmail.com'), 'gmail');
    assert.equal(inferProviderFromAccount('alice@outlook.com'), 'outlook');
});

test('AILIS email list fetches searched UIDs in UID mode', async () => {
    const source = await fs.readFile(path.resolve('electron/ailis-email-tool.cjs'), 'utf8');
    assert.match(
        source,
        /client\.fetch\(selected,\s*\{[\s\S]*?envelope:\s*true[\s\S]*?\},\s*\{\s*uid:\s*true\s*\}\)/,
        'listMessages must fetch the UID search results with { uid: true }'
    );
});

test('AILIS email OAuth and provider API actions are standardized without live credentials', async () => {
    const oauthUrl = await executeEmailTool({
        action: 'oauth_authorize_url',
        provider: 'gmail',
        clientId: 'client-id',
        redirectUri: 'http://127.0.0.1/callback',
        state: 'state-1'
    });
    assert.equal(oauthUrl.details.status, 'completed');
    assert.match(oauthUrl.details.url, /accounts\.google\.com/);
    assert.match(oauthUrl.details.url, /gmail\.modify/);

    const dryToken = await executeEmailTool({
        action: 'oauth_exchange_code',
        provider: 'outlook',
        tenant: 'common',
        clientId: 'client-id',
        clientSecret: 'secret-value',
        redirectUri: 'http://127.0.0.1/callback',
        code: 'authorization-code',
        dryRun: true
    });
    assert.equal(dryToken.details.status, 'completed');
    assert.equal(dryToken.details.dryRun, true);

    const labels = await executeEmailTool({ action: 'gmail_list_labels' });
    assert.equal(labels.details.status, 'needs_config');

    const graph = await executeEmailTool({ action: 'outlook_graph_messages' });
    assert.equal(graph.details.status, 'needs_config');
});

test('AILIS Gateway exposes and guards the local email tool', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emailProfiles: {
            qq: {
                account: 'saved@qq.com',
                secret: 'saved-secret'
            }
        }
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'email'));

        const providers = await callTool(baseUrl, {
            tool: 'email',
            args: { action: 'providers' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(providers.body.ok, true, providers.body.error);
        assert.equal(providers.body.status, 'completed');
        assert.ok(providers.body.result.details.providers.some((provider) => provider.id === 'qq'));

        const draft = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'draft',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'AILIS email draft'
            },
            context: { workspace: workspaceRoot }
        });
        assert.equal(draft.body.ok, true, draft.body.error);
        assert.match(JSON.stringify(draft.body.result.details), /AILIS email draft/);

        const sendNeedsConfig = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'send',
                provider: 'gmail',
                account: 'me@gmail.com',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'Body'
            },
            context: { workspace: workspaceRoot }
        });
        assert.equal(sendNeedsConfig.body.ok, false);
        assert.equal(sendNeedsConfig.body.status, 'needs_config');

    const sendDryRun = await callTool(baseUrl, {
        tool: 'email',
        args: {
            action: 'send',
            provider: 'qq',
                account: 'me@qq.com',
                secret: 'secret-for-test',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'Body',
                dryRun: true
            },
            context: { workspace: workspaceRoot }
        });
        assert.equal(sendDryRun.body.ok, true, sendDryRun.body.error);
        assert.equal(sendDryRun.body.result.details.dryRun, true);

        const sendDryRunFromContextProfile = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'send',
                provider: 'qq',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'Body',
                dryRun: true
            },
            context: {
                workspace: workspaceRoot,
                emailProfiles: {
                    qq: {
                        account: 'configured@qq.com',
                        secret: 'configured-secret'
                    }
                }
            }
        });
        assert.equal(sendDryRunFromContextProfile.body.ok, true, sendDryRunFromContextProfile.body.error);
        assert.equal(sendDryRunFromContextProfile.body.result.details.account, 'configured@qq.com');
        assert.equal(sendDryRunFromContextProfile.body.result.details.dryRun, true);

        const sendDryRunFromGatewayProfile = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'send',
                provider: 'qq',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'Body',
                dryRun: true
            },
            context: { workspace: workspaceRoot }
        });
        assert.equal(sendDryRunFromGatewayProfile.body.ok, true, sendDryRunFromGatewayProfile.body.error);
        assert.equal(sendDryRunFromGatewayProfile.body.result.details.account, 'saved@qq.com');

        const sendNeedsApproval = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'send',
                provider: 'qq',
                account: 'me@qq.com',
                secret: 'secret-for-test',
                to: 'friend@example.com',
                subject: 'Hello',
                text: 'Body'
            },
            context: { workspace: workspaceRoot }
        });
        assert.equal(sendNeedsApproval.body.ok, false);
        assert.equal(sendNeedsApproval.body.status, 'needs_approval');

        const classifyEmail = await runAgent(baseUrl, {
            sessionId: 'email-test',
            message: '查看今天的邮件',
            classifyOnly: true
        });
        assert.equal(classifyEmail.body.ok, true);
        assert.equal(classifyEmail.body.mode, 'task');
        assert.equal(classifyEmail.body.intent, 'email_management');
        assert.equal(classifyEmail.body.plan[0].tool, 'email');

        const classifyLatestEmail = await runAgent(baseUrl, {
            sessionId: 'email-test-latest',
            message: '取最新10个邮件',
            classifyOnly: true
        });
        assert.equal(classifyLatestEmail.body.ok, true);
        assert.equal(classifyLatestEmail.body.mode, 'task');
        assert.equal(classifyLatestEmail.body.intent, 'email_management');
        assert.equal(classifyLatestEmail.body.plan[0].tool, 'email');
        assert.equal(classifyLatestEmail.body.plan[0].args.action, 'list');
        assert.equal(classifyLatestEmail.body.plan[0].args.limit, 10);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);
        assert.equal(audit.body.ok, true);
        assert.ok(!JSON.stringify(audit.body.entries).includes('secret-for-test'));
    } finally {
        await gateway.stop();
    }
});
