import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getToolContract,
    listToolContracts,
    getToolContractPromptText
} = require('../electron/humanclaw-tool-contracts.cjs');
const { listHumanClawSkills } = require('../electron/humanclaw-skills.cjs');

const REQUIRED_TOOLS = [
    'read',
    'write',
    'edit',
    'apply_patch',
    'exec',
    'update_plan',
    'subagents',
    'mcp_bridge',
    'email',
    'file_manager',
    'computer',
    'code',
    'vision.capture_context'
];

const contracts = listToolContracts();
for (const toolId of REQUIRED_TOOLS) {
    const contract = getToolContract(toolId);
    assert.ok(contract, `missing tool contract: ${toolId}`);
    assert.ok(contract.returns, `missing return schema: ${toolId}`);
    assert.ok(contract.errors?.length, `missing error codes: ${toolId}`);
    assert.match(getToolContractPromptText(toolId), /input_schema/);
}

const mcp = getToolContract('mcp_bridge');
for (const action of ['health_check', 'list_prompts', 'get_prompt', 'call_tool', 'read_resource']) {
    assert.ok(mcp.schema.properties.action.enum.includes(action), `mcp_bridge missing action: ${action}`);
}

const skills = listHumanClawSkills();
for (const skill of skills) {
    assert.ok(skill.body || skill.description, `empty skill package: ${skill.id}`);
    for (const toolId of skill.tools || []) {
        assert.ok(getToolContract(toolId), `skill ${skill.id} references uncontracted tool ${toolId}`);
    }
}

console.log(JSON.stringify({
    ok: true,
    contracts: contracts.length,
    skills: skills.length,
    checkedTools: REQUIRED_TOOLS.length
}, null, 2));
