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
} = require('../electron/ailis-tool-contracts.cjs');

test('AILIS tool contracts expose versioned schemas and validate common failures', () => {
    const contracts = listToolContracts();
    assert.ok(contracts.length >= 10);
    assert.ok(contracts.some((contract) => contract.id === 'mcp_bridge' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'tool_search' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'tool_doctor' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'capability_manager' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'self_debugger' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'self_evolution' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'github_pages' && contract.risk === 'low'));
    assert.ok(contracts.some((contract) => contract.id === 'computer' && contract.risk === 'high'));
    assert.ok(contracts.every((contract) => contract.returns?.properties?.content));
    assert.ok(contracts.every((contract) => contract.errors?.includes('invalid_tool_args')));
    assert.ok(contracts.every((contract) => contract.experience?.embodiedAction));
    assert.ok(contracts.every((contract) => contract.experience?.userFacingVerb));

    const validRead = validateToolContract('read', { path: 'package.json' });
    assert.equal(validRead.ok, true);
    assert.equal(validRead.contract.mutates, false);
    assert.equal(validRead.contract.experience.userFacingVerb, '看一下文件');

    const badRead = validateToolContract('read', {});
    assert.equal(badRead.ok, false);
    assert.equal(badRead.status, 'invalid_tool_args');
    assert.ok(badRead.errors.some((error) => error.includes('path')));

    const badEmail = validateToolContract('email', { action: 'check_new' });
    assert.equal(badEmail.ok, false);
    assert.ok(badEmail.errors.some((error) => error.includes('one of')));

    const validEmailReadNumericUid = validateToolContract('email', {
        action: 'read',
        uid: 2652
    });
    assert.equal(validEmailReadNumericUid.ok, true);
    assert.equal(validEmailReadNumericUid.args.uid, '2652');

    const validEmailListStringLimit = validateToolContract('email', {
        action: 'list',
        limit: '10',
        filter: 'unread'
    });
    assert.equal(validEmailListStringLimit.ok, true);
    assert.equal(validEmailListStringLimit.args.limit, 10);

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

    const validMcpToolNameAlias = validateToolContract('mcp_bridge', {
        action: 'call_tool',
        server: 'fixture',
        tool_name: 'echo',
        arguments: { text: 'hello' }
    });
    assert.equal(validMcpToolNameAlias.ok, true);
    assert.equal(validMcpToolNameAlias.args.tool, 'echo');

    const validMcpToolArgsAlias = validateToolContract('mcp_bridge', {
        action: 'call_tool',
        server: 'fixture',
        tool: 'echo',
        tool_args: { text: 'hello' }
    });
    assert.equal(validMcpToolArgsAlias.ok, true);
    assert.deepEqual(validMcpToolArgsAlias.args.args, { text: 'hello' });

    const validMcpHealth = validateToolContract('mcp_bridge', {
        action: 'health_check',
        server: 'fixture'
    });
    assert.equal(validMcpHealth.ok, true);

    const validToolSearch = validateToolContract('tool_search', {
        query: 'playwright wait selector',
        limit: 5
    });
    assert.equal(validToolSearch.ok, true);

    const validGitHubPages = validateToolContract('github_pages', {
        action: 'diagnose_publish',
        targetPath: 'about-ailis.html',
        skipNetwork: true
    });
    assert.equal(validGitHubPages.ok, true);

    const validArtifactCompute = validateToolContract('artifact_compute', {
        artifactId: 'ctx-spreadsheet-demo',
        sheet: 'Map'
    });
    assert.equal(validArtifactCompute.ok, true);
    assert.equal(validArtifactCompute.args.action, 'profile');

    const badArtifactCompute = validateToolContract('artifact_compute', {
        action: 'find_path',
        sheet: 'Map'
    });
    assert.equal(badArtifactCompute.ok, false);
    assert.ok(badArtifactCompute.errors.some((error) => error.includes('requires artifactId')));

    const badToolSearch = validateToolContract('tool_search', {});
    assert.equal(badToolSearch.ok, false);
    assert.ok(badToolSearch.errors.some((error) => error.includes('requires query')));

    const badMcpPrompt = validateToolContract('mcp_bridge', {
        action: 'get_prompt',
        server: 'fixture'
    });
    assert.equal(badMcpPrompt.ok, false);
    assert.ok(badMcpPrompt.errors.some((error) => error.includes('requires prompt')));

    const validDoctorObservation = validateToolContract('tool_doctor', {
        action: 'record_observation',
        tool: 'mcp_bridge',
        status: 'timeout',
        latencyMs: 25000,
        errorCode: 'timeout'
    });
    assert.equal(validDoctorObservation.ok, true);

    const badRepair = validateToolContract('tool_doctor', {
        action: 'propose_repair',
        tool: 'mcp_bridge'
    });
    assert.equal(badRepair.ok, false);
    assert.ok(badRepair.errors.some((error) => error.includes('requires title')));

    const validCapabilityPlan = validateToolContract('capability_manager', {
        action: 'plan_install',
        request: 'install github MCP',
        sourceKind: 'github_mcp',
        githubRepo: 'https://github.com/example/mcp.git'
    });
    assert.equal(validCapabilityPlan.ok, true);

    const validCandidateSearch = validateToolContract('capability_manager', {
        action: 'search_tool_candidates',
        query: 'ocr pdf tools'
    });
    assert.equal(validCandidateSearch.ok, true);

    const validCandidatePlan = validateToolContract('capability_manager', {
        action: 'plan_mcp_candidate',
        candidateId: 'mcp-registry:io-example-docs:1.0.0'
    });
    assert.equal(validCandidatePlan.ok, true);

    const validLearningRecord = validateToolContract('capability_manager', {
        action: 'record_tool_outcome',
        taskText: 'read a pdf',
        toolId: 'mcp__docs__read',
        success: true,
        score: 1
    });
    assert.equal(validLearningRecord.ok, true);

    const badCapabilityRepair = validateToolContract('capability_manager', {
        action: 'execute_repair'
    });
    assert.equal(badCapabilityRepair.ok, false);
    assert.ok(badCapabilityRepair.errors.some((error) => error.includes('requires candidateDiff')));

    const validSelfDebugCase = validateToolContract('self_debugger', {
        action: 'open_case',
        bugReport: 'AILIS failed to read the latest tool result',
        affectedCapability: 'agent_loop'
    });
    assert.equal(validSelfDebugCase.ok, true);

    const badSelfDebugCase = validateToolContract('self_debugger', {
        action: 'open_case'
    });
    assert.equal(badSelfDebugCase.ok, false);
    assert.ok(badSelfDebugCase.errors.some((error) => error.includes('requires bugReport')));

    const validSelfDebugApply = validateToolContract('self_debugger', {
        action: 'apply_patch',
        caseId: 'debug-123'
    });
    assert.equal(validSelfDebugApply.ok, true);

    const validSelfEvolutionAnalyze = validateToolContract('self_evolution', {
        action: 'analyze',
        taskText: '以后按我的偏好优化 AILIS'
    });
    assert.equal(validSelfEvolutionAnalyze.ok, true);

    const badSelfEvolutionApply = validateToolContract('self_evolution', {
        action: 'apply_proposal'
    });
    assert.equal(badSelfEvolutionApply.ok, false);
    assert.ok(badSelfEvolutionApply.errors.some((error) => error.includes('requires id')));
});

test('AILIS tool contracts generate prompt and summary text from the same source', () => {
    const emailPrompt = getToolContractPromptText('email');
    assert.match(emailPrompt, /TOOL CONTRACT email@v/);
    assert.match(emailPrompt, /input_schema/);
    assert.match(emailPrompt, /return_schema/);
    assert.match(emailPrompt, /error_codes/);
    assert.match(emailPrompt, /experience=/);
    assert.match(emailPrompt, /看看邮箱/);

    const combined = buildToolContractsPrompt(['mcp_bridge', 'vision.capture_context']);
    assert.match(combined, /health_check/);
    assert.match(combined, /vision\.capture_context/);

    const summaries = listToolContractSummaries(['mcp_bridge']);
    assert.equal(summaries[0].id, 'mcp_bridge');
    assert.ok(summaries[0].actions.includes('list_prompts'));
    assert.equal(summaries[0].experience.embodiedAction, 'use_external_tool');

    const toolSearchPrompt = getToolContractPromptText('tool_search');
    assert.match(toolSearchPrompt, /tool_search/);
    assert.match(toolSearchPrompt, /query/);
    assert.match(toolSearchPrompt, /deferred tools/i);

    const artifactComputePrompt = getToolContractPromptText('artifact_compute');
    assert.match(artifactComputePrompt, /artifact_compute/);
    assert.match(artifactComputePrompt, /find_path/);

    const doctorPrompt = getToolContractPromptText('tool_doctor');
    assert.match(doctorPrompt, /discover_mcp/);
    assert.match(doctorPrompt, /检查工具健康/);

    const capabilityPrompt = getToolContractPromptText('capability_manager');
    assert.match(capabilityPrompt, /install_capability/);
    assert.match(capabilityPrompt, /安装和修复能力/);

    const selfDebuggerPrompt = getToolContractPromptText('self_debugger');
    assert.match(selfDebuggerPrompt, /collect_evidence/);
    assert.match(selfDebuggerPrompt, /自我排查问题/);

    const selfEvolutionPrompt = getToolContractPromptText('self_evolution');
    assert.match(selfEvolutionPrompt, /apply_proposal/);
    assert.match(selfEvolutionPrompt, /分析并优化自己/);

    const subagentPrompt = getToolContractPromptText('subagents');
    assert.match(subagentPrompt, /"maximum": 50/);
});
