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
    assert.ok(contracts.some((contract) => contract.id === 'web_search' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'tool_doctor' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'capability_manager' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'self_debugger' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'self_evolution' && contract.version >= 1));
    assert.ok(contracts.some((contract) => contract.id === 'github_pages' && contract.risk === 'low'));
    assert.ok(contracts.some((contract) => contract.id === 'computer' && contract.risk === 'high'));
    for (const toolId of ['spawn_agent', 'followup_task', 'wait_agent', 'list_agents', 'close_agent']) {
        assert.ok(contracts.some((contract) => contract.id === toolId), `${toolId} contract is registered`);
    }
    const codexCollaborationTools = new Set(['spawn_agent', 'followup_task', 'wait_agent', 'list_agents', 'close_agent']);
    assert.ok(contracts.every((contract) =>
        codexCollaborationTools.has(contract.id) || contract.returns?.properties?.content
    ));
    assert.ok(contracts.every((contract) => contract.errors?.includes('invalid_tool_args')));
    assert.ok(contracts.every((contract) => contract.experience?.embodiedAction));
    assert.ok(contracts.every((contract) => contract.experience?.userFacingVerb));

    const validSpawnAgent = validateToolContract('spawn_agent', {
        task_name: 'mavuika_guide',
        message: 'Research and produce the current guide.',
        fork_turns: 'all'
    });
    assert.equal(validSpawnAgent.ok, true);
    assert.equal(validSpawnAgent.contract.approval, 'never');
    const spawnContract = contracts.find((contract) => contract.id === 'spawn_agent');
    assert.deepEqual(spawnContract.returns.required, ['task_name', 'nickname']);
    assert.equal(spawnContract.returns.additionalProperties, false);

    const invalidSpawnAgent = validateToolContract('spawn_agent', {
        task_name: 'Mavuika-Guide',
        message: 'Research the guide.',
        unexpected: true
    });
    assert.equal(invalidSpawnAgent.ok, false);
    assert.ok(invalidSpawnAgent.errors.some((error) => error.includes('task_name')));
    assert.ok(invalidSpawnAgent.errors.some((error) => error.includes('unexpected')));

    const validFollowupTask = validateToolContract('followup_task', {
        target: 'mavuika_guide',
        message: 'Verify the weapon ranking.'
    });
    assert.equal(validFollowupTask.ok, true);

    const invalidWaitAgent = validateToolContract('wait_agent', { timeoutMs: 10_000 });
    assert.equal(invalidWaitAgent.ok, false);
    assert.ok(invalidWaitAgent.errors.some((error) => error.includes('timeoutMs')));
    const waitContract = contracts.find((contract) => contract.id === 'wait_agent');
    assert.deepEqual(waitContract.returns.required, ['message', 'timed_out']);
    const listContract = contracts.find((contract) => contract.id === 'list_agents');
    assert.deepEqual(listContract.returns.required, ['agents']);

    const validRead = validateToolContract('read', { path: 'package.json' });
    assert.equal(validRead.ok, true);
    assert.equal(validRead.contract.mutates, false);
    assert.equal(validRead.contract.experience.userFacingVerb, '看一下文件');

    const badRead = validateToolContract('read', {});
    assert.equal(badRead.ok, false);
    assert.equal(badRead.status, 'invalid_tool_args');
    assert.ok(badRead.errors.some((error) => error.includes('path')));

    const validCodeModeExec = validateToolContract('exec', { input: 'text("ok")' });
    assert.equal(validCodeModeExec.ok, true);
    const validLegacyExec = validateToolContract('exec', { command: 'node --version' });
    assert.equal(validLegacyExec.ok, true);
    assert.equal(validateToolContract('exec', {}).ok, false);
    assert.equal(validateToolContract('exec', { input: 'text("ok")', command: 'node --version' }).ok, false);
    assert.equal(validateToolContract('exec_wait', { cell_id: 'cell-1' }).ok, true);

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

    const validWebSearch = validateToolContract('web_search', {
        query: 'official release date',
        maxResults: 5,
        search_context_size: 'medium'
    });
    assert.equal(validWebSearch.ok, true);
    const validWebScreenshot = validateToolContract('web_run', {
        screenshot: [{
            ref_id: 'turn0view0',
            detail: 'original'
        }]
    });
    assert.equal(validWebScreenshot.ok, true);

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

    const validArtifactToolsPlan = validateToolContract('artifact_tools', {
        action: 'plan_import',
        path: 'report.pdf',
        requiredCapabilities: ['load', 'inspect', 'render']
    });
    assert.equal(validArtifactToolsPlan.ok, true);

    const validArtifactImport = validateToolContract('artifact_import', {
        path: 'inventory.xlsx',
        parserId: 'table'
    });
    assert.equal(validArtifactImport.ok, true);
    assert.equal(validArtifactImport.args.action, 'import');

    const badArtifactImport = validateToolContract('artifact_import', {});
    assert.equal(badArtifactImport.ok, false);
    assert.ok(badArtifactImport.errors.some((error) => error.includes('requires path')));

    const badArtifactCompute = validateToolContract('artifact_compute', {
        action: 'find_path',
        sheet: 'Map'
    });
    assert.equal(badArtifactCompute.ok, false);
    assert.ok(badArtifactCompute.errors.some((error) => error.includes('requires artifactId')));

    const badToolSearch = validateToolContract('tool_search', {});
    assert.equal(badToolSearch.ok, false);
    assert.ok(badToolSearch.errors.some((error) => error.includes('requires query')));

    const badWebSearch = validateToolContract('web_search', {});
    assert.equal(badWebSearch.ok, false);
    assert.ok(badWebSearch.errors.some((error) => error.includes('requires query')));

    const validWebRun = validateToolContract('web_run', {
        search_query: [{ q: 'Codex app-server tool lifecycle' }],
        response_length: 'medium'
    });
    assert.equal(validWebRun.ok, true);
    assert.equal(contracts.find((contract) => contract.id === 'web_run').schema.minProperties, 1);
    const webRunContract = contracts.find((contract) => contract.id === 'web_run');
    assert.equal(webRunContract.schema.properties.search_query.items.properties.q.maxLength, 240);
    assert.equal(webRunContract.schema.properties.search_query.items.properties.domains.maxItems, 8);
    const emptyWebRun = validateToolContract('web_run', {});
    assert.equal(emptyWebRun.ok, false);
    assert.ok(emptyWebRun.errors.some((error) => error.includes('exactly one non-empty operation')));
    const mixedWebRun = validateToolContract('web_run', {
        search_query: [{ q: 'query' }],
        open: [{ ref_id: 'turn0search0' }]
    });
    assert.equal(mixedWebRun.ok, false);
    const unsupportedWebRun = validateToolContract('web_run', {
        image_query: [{ q: 'unsupported' }]
    });
    assert.equal(unsupportedWebRun.ok, false);

    const wrongArtifactOwner = validateToolContract('artifact_query', {
        action: 'summary',
        artifactHandle: {
            owner: 'artifact_tools',
            tool: 'artifact_tools',
            sessionId: 'arts-demo',
            artifactId: 'art_demo'
        }
    });
    assert.equal(wrongArtifactOwner.ok, false);
    assert.ok(wrongArtifactOwner.errors.some((error) => error.includes('owned by artifact_tools')));

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

    const artifactToolsPrompt = getToolContractPromptText('artifact_tools');
    assert.match(artifactToolsPrompt, /artifact_tools/);
    assert.match(artifactToolsPrompt, /plan_import/);

    const artifactImportPrompt = getToolContractPromptText('artifact_import');
    assert.match(artifactImportPrompt, /artifact_import/);
    assert.match(artifactImportPrompt, /parserId/);

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

    assert.equal(getToolContractPromptText('subagents'), '');
    assert.equal(listToolContracts().some((contract) => contract.id === 'subagents'), false);
});
