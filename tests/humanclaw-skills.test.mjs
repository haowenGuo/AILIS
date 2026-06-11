import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildHumanClawSkillContextText,
    getHumanClawSkill,
    listHumanClawSkillSummaries
} = require('../electron/humanclaw-skills.cjs');
const {
    getToolContract,
    getToolContractPromptText
} = require('../electron/humanclaw-tool-contracts.cjs');

test('HumanClaw skills load from SKILL.md packages and reference contracted tools', () => {
    const skills = listHumanClawSkillSummaries();
    assert.ok(skills.length >= 6);
    assert.ok(skills.some((skill) => skill.id === 'vision' && skill.source === 'skill_file'));
    assert.ok(skills.some((skill) => skill.id === 'mcp_bridge'));
    assert.ok(skills.some((skill) => skill.id === 'capability_manager'));
    assert.ok(skills.some((skill) => skill.id === 'self_debugger'));

    for (const skill of skills) {
        for (const toolId of skill.tools || []) {
            assert.ok(getToolContract(toolId), `${skill.id} references an uncontracted tool: ${toolId}`);
        }
    }

    const mcp = getHumanClawSkill('mcp_bridge');
    assert.equal(mcp.id, 'mcp_bridge');
    assert.ok(mcp.tools.includes('mcp_bridge'));

    const context = buildHumanClawSkillContextText('mcp_bridge');
    assert.match(context, /SKILL PACKAGE mcp_bridge/);
    assert.doesNotMatch(context, /TOOL CONTRACT mcp_bridge@v/);
    assert.match(context, /health_check/);
    assert.match(context, /mcp__aigl_research__web_fetch/);
    assert.doesNotMatch(context, /先 `list_servers`/);
    assert.doesNotMatch(context, /调用 `call_tool` 前/);
    assert.match(getToolContractPromptText('mcp_bridge'), /TOOL CONTRACT mcp_bridge@v/);

    const capabilityContext = buildHumanClawSkillContextText('capability_manager');
    assert.doesNotMatch(capabilityContext, /TOOL CONTRACT capability_manager@v/);
    assert.match(capabilityContext, /install_capability/);
    assert.match(getToolContractPromptText('capability_manager'), /TOOL CONTRACT capability_manager@v/);

    const selfDebuggerContext = buildHumanClawSkillContextText('self_debugger');
    assert.doesNotMatch(selfDebuggerContext, /TOOL CONTRACT self_debugger@v/);
    assert.match(selfDebuggerContext, /validate_patch/);
    assert.match(getToolContractPromptText('self_debugger'), /TOOL CONTRACT self_debugger@v/);
});
