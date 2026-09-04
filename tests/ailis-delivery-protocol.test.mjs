import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    DELIVERY_STATUS,
    assessTaskDelivery,
    buildDeliveryGateObservation,
    normalizeDeliveryPolicy
} = require('../electron/agent-loop/delivery-protocol.cjs');
const {
    buildAgentDirectToolSpecs,
    buildTaskRunHandoffPackage
} = require('../electron/ailis-agent-runner.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { getCodeModeProfile } = require('../electron/codex-code-mode-protocol.cjs');
const { buildTaskResultPacket } = require('../electron/ailis-task-agent-harness.cjs');

const requiredPolicy = {
    enabled: true,
    mode: 'engineering',
    requireVerification: true
};

function step(tool, ok, details = {}) {
    return {
        id: `${tool}-${Math.random()}`,
        tool,
        response: {
            ok,
            status: ok ? 'completed' : 'failed',
            result: { details }
        }
    };
}

const isMutatingTool = (toolId) => ['write', 'apply_patch', 'exec'].includes(toolId);

test('an explicit host disable overrides engineering defaults', () => {
    const policy = normalizeDeliveryPolicy({
        enabled: false,
        mode: 'engineering',
        requireVerification: true
    });
    assert.equal(policy.enabled, false);
    assert.equal(policy.requireVerification, false);
});

test('engineering delivery requires passing verification after the latest mutation', () => {
    const patchOnly = assessTaskDelivery({
        policy: requiredPolicy,
        stepResults: [step('apply_patch', true)],
        isMutatingTool
    });
    assert.equal(patchOnly.status, DELIVERY_STATUS.PATCH_GENERATED);
    assert.equal(patchOnly.canDeliver, false);

    const verified = assessTaskDelivery({
        policy: requiredPolicy,
        stepResults: [
            step('apply_patch', true),
            step('task_verify', true, {
                verification: { status: 'passed', scope: 'targeted_test', exitCode: 0 }
            })
        ],
        isMutatingTool
    });
    assert.equal(verified.status, DELIVERY_STATUS.VERIFIED_DELIVERY);
    assert.equal(verified.verified, true);
    assert.equal(verified.canDeliver, true);
});

test('a later mutation makes earlier verification stale', () => {
    const delivery = assessTaskDelivery({
        policy: requiredPolicy,
        stepResults: [
            step('task_verify', true, {
                verification: { status: 'passed', scope: 'regression_test', exitCode: 0 }
            }),
            step('write', true)
        ],
        isMutatingTool
    });
    assert.equal(delivery.status, DELIVERY_STATUS.PATCH_GENERATED);
    assert.equal(delivery.verificationFresh, false);
    assert.match(delivery.unresolved[0], /changed after the last passing verification/i);
});

test('failed verification remains a repair observation and blocked runs preserve it', () => {
    const failed = assessTaskDelivery({
        policy: requiredPolicy,
        stepResults: [
            step('apply_patch', true),
            step('task_verify', false, {
                verification: { status: 'failed', scope: 'build', exitCode: 1 }
            })
        ],
        isMutatingTool
    });
    assert.equal(failed.status, DELIVERY_STATUS.VERIFICATION_FAILED);
    assert.equal(failed.latestVerification.exitCode, 1);
    assert.equal(failed.canDeliver, false);
    assert.match(buildDeliveryGateObservation(failed), /repair the implementation/i);

    const blocked = assessTaskDelivery({
        policy: requiredPolicy,
        terminalStatus: 'max_steps_reached',
        stepResults: failed.verifications.length ? [
            step('task_verify', false, {
                verification: { status: 'failed', scope: 'build', exitCode: 1 }
            })
        ] : [],
        isMutatingTool
    });
    assert.equal(blocked.status, DELIVERY_STATUS.BLOCKED);
});

test('task_verify is exposed only when the host enables the delivery protocol', () => {
    const verificationSpec = {
        type: 'function',
        name: 'task_verify',
        description: 'verify',
        strict: true,
        parameters: { type: 'object', properties: {}, required: [], additionalProperties: false }
    };
    const readSpec = {
        type: 'function',
        name: 'read',
        description: 'read',
        strict: true,
        parameters: { type: 'object', properties: {}, required: [], additionalProperties: false }
    };
    const gateway = {
        gatewayToolRuntimeRegistry: {
            definition: (id) => id === 'task_verify' ? { spec: verificationSpec } : null,
            modelVisibleSpecs: () => [verificationSpec, readSpec]
        }
    };

    const ordinary = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'task_agent' }
    });
    assert.deepEqual(ordinary.map((entry) => entry.name), ['exec', 'exec_wait']);
    assert.deepEqual(getCodeModeProfile(ordinary[0].x_ailis_code_mode_profile).map((entry) => entry.name), ['read']);

    const engineering = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent',
            deliveryProtocol: requiredPolicy
        }
    });
    assert.deepEqual(engineering.map((entry) => entry.name), ['exec', 'exec_wait', 'task_verify']);
    assert.deepEqual(getCodeModeProfile(engineering[0].x_ailis_code_mode_profile).map((entry) => entry.name), ['read']);
});

test('task_verify wraps command execution in structured pass and fail observations', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-delivery-tool-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emberHarnessEnabled: false
    });

    const originalExecute = gateway.executeLocalCoreTool.bind(gateway);
    gateway.executeLocalCoreTool = async ({ args }) => ({
        content: [{ type: 'text', text: '2 tests passed' }],
        details: {
            exitCode: args.command === 'pass' ? 0 : 1,
            durationMs: 12,
            outputId: 'output-verification'
        },
        isError: args.command !== 'pass'
    });
    try {
        const passed = await gateway.executeGatewayLocalTool('task_verify', {
            command: 'pass',
            scope: 'targeted_test'
        }, { workspaceDir: workspaceRoot, approved: true });
        assert.equal(passed.isError, false);
        assert.equal(passed.details.verification.status, 'passed');
        assert.equal(passed.details.verification.outputId, 'output-verification');
        assert.equal(Object.hasOwn(passed.details.verification, 'execution'), false);

        const failed = await gateway.executeGatewayLocalTool('task_verify', {
            command: 'fail',
            scope: 'regression_test'
        }, { workspaceDir: workspaceRoot, approved: true });
        assert.equal(failed.isError, true);
        assert.equal(failed.details.verification.status, 'failed');
        assert.equal(failed.details.verification.exitCode, 1);
    } finally {
        gateway.executeLocalCoreTool = originalExecute;
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('interruption handoff preserves failed verification evidence and unresolved delivery state', () => {
    const handoff = buildTaskRunHandoffPackage({
        status: 'max_steps_reached',
        reason: 'turn_budget_exhausted',
        message: 'Repair the repository.',
        maxSteps: 12,
        deliveryPolicy: requiredPolicy,
        stepResults: [
            step('apply_patch', true),
            step('task_verify', false, {
                verification: {
                    status: 'failed',
                    scope: 'regression_test',
                    exitCode: 2,
                    outputId: 'verification-log-1',
                    summary: 'Two regression tests failed.'
                }
            })
        ]
    });
    assert.equal(handoff.status, 'max_loop');
    assert.equal(handoff.delivery.status, DELIVERY_STATUS.BLOCKED);
    assert.equal(handoff.delivery.latestVerification.outputId, 'verification-log-1');
    assert.match(handoff.unresolvedFields.join('\n'), /latest visible verification failed/i);
    assert.match(handoff.userVisibleSummary, /verification-log-1/);
});

test('verified delivery survives the TaskResult handoff boundary', () => {
    const delivery = {
        schema: 'ailis.task_delivery.v1',
        status: 'verified_delivery',
        verified: true,
        verifications: [{ id: 'verification-1', status: 'passed' }]
    };
    const packet = buildTaskResultPacket({
        ok: true,
        status: 'verified_delivery',
        taskRunHandoff: {
            status: 'verified_delivery',
            finalAnswer: 'Implemented and verified.',
            delivery
        }
    }, {
        thread: { threadId: 'thread-1', activeGoal: null },
        turn: { turnId: 'turn-1', latestRequest: 'Fix it.' }
    });
    assert.equal(packet.status, 'verified_delivery');
    assert.equal(packet.delivery.status, 'verified_delivery');
    assert.deepEqual(packet.unresolved_fields, []);
});
