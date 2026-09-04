import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { buildLlmAgentDirectToolPrompt } = require('../electron/agent-loop/runner.cjs');
const { getToolContract, listToolContracts } = require('../electron/ailis-tool-contracts.cjs');

test('spreadsheet tool contracts expose the current adapter and omit the retired reader', () => {
    assert.equal(getToolContract('read_xlsx_workbook'), null);
    assert.ok(getToolContract('artifact_tools'));
    assert.ok(getToolContract('artifact_query'));
    assert.equal(listToolContracts().some((contract) => contract.id === 'read_xlsx_workbook'), false);
});

test('the removed dual-actor main scheduler cannot be selected again', () => {
    assert.equal(AILISGateway.prototype.runTaskAgentControlledPersonaTurn, undefined);
    assert.equal(AILISGateway.prototype.startPrivatePersonaDraft, undefined);
    assert.equal(typeof AILISGateway.prototype.runUnifiedAgentTurn, 'function');
    // Explicit legacy handoffs and checkpoint migration are separate, retained APIs.
    assert.equal(typeof AILISGateway.prototype.renderTaskPacket, 'function');
    assert.equal(typeof AILISGateway.prototype.getPersonaContextCheckpoint, 'function');
});

test('unified and compatibility prompts share the address-direction policy without a second actor', () => {
    const args = { model: 'gpt-5.6-luna', message: '老婆，分析一下架构' };
    const unified = buildLlmAgentDirectToolPrompt({ ...args, contextMode: 'unified' });
    const persona = buildLlmAgentDirectToolPrompt({ ...args, contextMode: 'persona' });
    for (const prompt of [unified, persona]) {
        assert.match(prompt.instructions, /不要从单向称呼或模糊关系线索推断用户没有表达的互称规则/);
        assert.match(prompt.instructions, /不能确定时自然省略称呼/);
    }
    assert.match(unified.instructions, /There is no separate task\/persona routing/);
    assert.doesNotMatch(unified.instructions, /call handoff_task exactly once/);
});
