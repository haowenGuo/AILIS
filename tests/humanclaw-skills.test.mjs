import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildHumanClawSkillContextText,
    getHumanClawSkill,
    listHumanClawSkillSummaries
} = require('../electron/humanclaw-skills.cjs');
const { getToolContract } = require('../electron/humanclaw-tool-contracts.cjs');

test('HumanClaw skills load from SKILL.md packages and reference contracted tools', () => {
    const skills = listHumanClawSkillSummaries();
    assert.ok(skills.length >= 6);
    assert.ok(skills.some((skill) => skill.id === 'vision' && skill.source === 'skill_file'));
    assert.ok(skills.some((skill) => skill.id === 'mcp_bridge'));

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
    assert.match(context, /TOOL CONTRACT mcp_bridge@v/);
    assert.match(context, /health_check/);
});
