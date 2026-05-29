import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildToolContractsPrompt,
    getToolContractPromptText,
    listToolContracts,
    listToolContractSummaries,
    validateToolContract
} = require('../electron/humanclaw-tool-contracts.cjs');

test('HumanClaw tool contracts expose versioned schemas and validate common failures', () => {
    const contracts = listToolContracts();
    assert.ok(contracts.length >= 10);
    assert.ok(contracts.some((contract) => contract.id === 'mcp_bridge' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'computer' && contract.risk === 'high'));
    assert.ok(contracts.every((contract) => contract.returns?.properties?.content));
    assert.ok(contracts.every((contract) => contract.errors?.includes('invalid_tool_args')));

    const validRead = validateToolContract('read', { path: 'package.json' });
    assert.equal(validRead.ok, true);
    assert.equal(validRead.contract.mutates, false);

    const badRead = validateToolContract('read', {});
    assert.equal(badRead.ok, false);
    assert.equal(badRead.status, 'invalid_tool_args');
    assert.ok(badRead.errors.some((error) => error.includes('path')));

    const badEmail = validateToolContract('email', { action: 'check_new' });
    assert.equal(badEmail.ok, false);
    assert.ok(badEmail.errors.some((error) => error.includes('one of')));

    const badMcpCall = validateToolContract('mcp_bridge', {
        action: 'call_tool',
        server: 'fixture',
        args: { text: 'hello' }
    });
    assert.equal(badMcpCall.ok, false);
    assert.ok(badMcpCall.errors.some((error) => error.includes('requires tool')));

    const validMcpRead = validateToolContract('mcp_bridge', {
        action: 'read_resource',
        server: 'fixture',
        uri: 'fixture://note'
    });
    assert.equal(validMcpRead.ok, true);

    const validMcpHealth = validateToolContract('mcp_bridge', {
        action: 'health_check',
        server: 'fixture'
    });
    assert.equal(validMcpHealth.ok, true);

    const badMcpPrompt = validateToolContract('mcp_bridge', {
        action: 'get_prompt',
        server: 'fixture'
    });
    assert.equal(badMcpPrompt.ok, false);
    assert.ok(badMcpPrompt.errors.some((error) => error.includes('requires prompt')));
});

test('HumanClaw tool contracts generate prompt and summary text from the same source', () => {
    const emailPrompt = getToolContractPromptText('email');
    assert.match(emailPrompt, /TOOL CONTRACT email@v/);
    assert.match(emailPrompt, /input_schema/);
    assert.match(emailPrompt, /return_schema/);
    assert.match(emailPrompt, /error_codes/);

    const combined = buildToolContractsPrompt(['mcp_bridge', 'vision.capture_context']);
    assert.match(combined, /health_check/);
    assert.match(combined, /vision\.capture_context/);

    const summaries = listToolContractSummaries(['mcp_bridge']);
    assert.equal(summaries[0].id, 'mcp_bridge');
    assert.ok(summaries[0].actions.includes('list_prompts'));
});
