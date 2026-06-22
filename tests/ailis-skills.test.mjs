import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildAILISSkillContextText,
    getAILISSkill,
    listAILISSkillSummaries
} = require('../electron/ailis-skills.cjs');
const {
    getToolContract,
    getToolContractPromptText
} = require('../electron/ailis-tool-contracts.cjs');

test('AILIS skills load from SKILL.md packages and reference contracted tools', () => {
    const skills = listAILISSkillSummaries();
    assert.ok(skills.length >= 6);
    assert.ok(skills.some((skill) => skill.id === 'vision' && skill.source === 'skill_file'));
    assert.ok(skills.some((skill) => skill.id === 'mcp_bridge'));
    assert.ok(skills.some((skill) => skill.id === 'capability_manager'));
    assert.ok(skills.some((skill) => skill.id === 'self_debugger'));
    assert.ok(skills.some((skill) => skill.id === 'self_evolution' && skill.source === 'skill_file'));
    assert.ok(skills.some((skill) => skill.id === 'github_pages' && skill.source === 'skill_file'));

    for (const skill of skills) {
        for (const toolId of skill.tools || []) {
            assert.ok(getToolContract(toolId), `${skill.id} references an uncontracted tool: ${toolId}`);
        }
    }

    const mcp = getAILISSkill('mcp_bridge');
    assert.equal(mcp.id, 'mcp_bridge');
    assert.ok(mcp.tools.includes('mcp_bridge'));

    const context = buildAILISSkillContextText('mcp_bridge');
    assert.match(context, /SKILL PACKAGE mcp_bridge/);
    assert.doesNotMatch(context, /TOOL CONTRACT mcp_bridge@v/);
    assert.match(context, /health_check/);
    assert.match(context, /mcp__ailis_research__web_fetch/);
    assert.doesNotMatch(context, /先 `list_servers`/);
    assert.doesNotMatch(context, /调用 `call_tool` 前/);
    assert.match(getToolContractPromptText('mcp_bridge'), /TOOL CONTRACT mcp_bridge@v/);

    const capabilityContext = buildAILISSkillContextText('capability_manager');
    assert.doesNotMatch(capabilityContext, /TOOL CONTRACT capability_manager@v/);
    assert.match(capabilityContext, /install_capability/);
    assert.match(getToolContractPromptText('capability_manager'), /TOOL CONTRACT capability_manager@v/);

    const selfDebuggerContext = buildAILISSkillContextText('self_debugger');
    assert.doesNotMatch(selfDebuggerContext, /TOOL CONTRACT self_debugger@v/);
    assert.match(selfDebuggerContext, /validate_patch/);
    assert.match(getToolContractPromptText('self_debugger'), /TOOL CONTRACT self_debugger@v/);

    const selfEvolutionContext = buildAILISSkillContextText('self_evolution');
    assert.doesNotMatch(selfEvolutionContext, /TOOL CONTRACT self_evolution@v/);
    assert.match(selfEvolutionContext, /analyze/);
    assert.match(selfEvolutionContext, /不把用户引导去控制面板/);
    assert.match(getToolContractPromptText('self_evolution'), /TOOL CONTRACT self_evolution@v/);

    const githubPagesContext = buildAILISSkillContextText('github_pages');
    assert.match(githubPagesContext, /GITHUB PAGES SKILL/);
    assert.match(githubPagesContext, /github_pages\.diagnose_publish/);
    assert.match(getToolContractPromptText('github_pages'), /TOOL CONTRACT github_pages@v/);
});
