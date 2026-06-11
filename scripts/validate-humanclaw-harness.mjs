import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getToolContract,
    listToolContracts,
    getToolContractPromptText
} = require('../electron/humanclaw-tool-contracts.cjs');
const { listHumanClawSkills } = require('../electron/humanclaw-skills.cjs');
const {
    createEvidenceArtifact,
    validateEvidenceArtifact
} = require('../electron/humanclaw-evidence-artifacts.cjs');
const { buildTurnItemsPromptObject } = require('../electron/humanclaw-turn-items.cjs');

const REQUIRED_TOOLS = [
    'read',
    'write',
    'edit',
    'apply_patch',
    'exec',
    'update_plan',
    'subagents',
    'mcp_bridge',
    'tool_doctor',
    'capability_manager',
    'self_debugger',
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

const doctor = getToolContract('tool_doctor');
for (const action of ['health_check', 'discover_mcp', 'scorecard', 'record_observation', 'propose_repair']) {
    assert.ok(doctor.schema.properties.action.enum.includes(action), `tool_doctor missing action: ${action}`);
}

const capabilityManager = getToolContract('capability_manager');
for (const action of ['registry', 'plan_install', 'install_capability', 'author_skill', 'rollback', 'execute_repair']) {
    assert.ok(capabilityManager.schema.properties.action.enum.includes(action), `capability_manager missing action: ${action}`);
}

const selfDebugger = getToolContract('self_debugger');
for (const action of ['open_case', 'collect_evidence', 'diagnose', 'propose_patch', 'validate_patch', 'apply_patch', 'run_loop']) {
    assert.ok(selfDebugger.schema.properties.action.enum.includes(action), `self_debugger missing action: ${action}`);
}

const skills = listHumanClawSkills();
for (const skill of skills) {
    assert.ok(skill.body || skill.description, `empty skill package: ${skill.id}`);
    for (const toolId of skill.tools || []) {
        assert.ok(getToolContract(toolId), `skill ${skill.id} references uncontracted tool ${toolId}`);
    }
}

const sampleArtifact = createEvidenceArtifact({
    taskType: 'github_workflow',
    evidenceId: 'repo_state',
    observation: {
        id: 'validate-git-status',
        tool: 'code',
        action: 'git_status',
        title: 'validate repo state',
        status: 'completed',
        ok: true,
        preview: '## main...origin/main\n M package.json'
    }
});
assert.equal(validateEvidenceArtifact(sampleArtifact).ok, true, 'typed evidence artifact validation failed');

const turnItems = buildTurnItemsPromptObject({
    stepResults: [
        {
            id: 'validate-missing-parser',
            title: 'validate failed tool observation',
            tool: 'computer',
            args: { action: 'exec', command: 'missing-parser --version' },
            response: {
                ok: false,
                status: 'tool_failed',
                error: 'missing-parser is not recognized'
            }
        }
    ]
});
assert.equal(turnItems.model, 'codex_like_turn_items');
assert.ok(turnItems.items.some((item) => item.type === 'tool_result' && item.status === 'failed'), 'turn items missing failed tool observation');

console.log(JSON.stringify({
    ok: true,
    contracts: contracts.length,
    skills: skills.length,
    checkedTools: REQUIRED_TOOLS.length,
    evidenceArtifacts: true,
    turnItems: turnItems.items.length
}, null, 2));
