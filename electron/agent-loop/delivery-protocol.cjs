'use strict';

const DELIVERY_SCHEMA = 'ailis.task_delivery.v1';
const VERIFICATION_SCHEMA = 'ailis.verification_observation.v1';
const TASK_VERIFY_TOOL_ID = 'task_verify';

const DELIVERY_STATUS = Object.freeze({
    WORKING: 'working',
    PATCH_GENERATED: 'patch_generated',
    VALIDATING: 'validating',
    VERIFICATION_FAILED: 'verification_failed',
    VERIFIED_DELIVERY: 'verified_delivery',
    BLOCKED: 'blocked'
});

function normalizeText(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function normalizeToolId(value = '') {
    return normalizeText(value).toLowerCase();
}

function normalizeDeliveryPolicy(value = {}) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const mode = normalizeText(source.mode, 'standard').toLowerCase();
    const enabled = source.enabled === false
        ? false
        : source.enabled === true || source.requireVerification === true || mode === 'engineering';
    return {
        schema: 'ailis.delivery_policy.v1',
        enabled,
        mode,
        requireVerification: enabled && source.requireVerification !== false,
        allowUnverifiedDelivery: source.allowUnverifiedDelivery === true
    };
}

function toolResultDetails(stepResult = {}) {
    const response = stepResult.response || {};
    const result = response.result || {};
    return result.details || result.structuredContent || response.details || response.structuredContent || {};
}

function normalizeVerificationStep(stepResult = {}, index = -1) {
    if (normalizeToolId(stepResult.tool) !== TASK_VERIFY_TOOL_ID) {
        return null;
    }
    const details = toolResultDetails(stepResult);
    const verification = details.verification && typeof details.verification === 'object'
        ? details.verification
        : details;
    const status = normalizeText(
        verification.status,
        stepResult.response?.ok === true ? 'passed' : 'failed'
    ).toLowerCase();
    return {
        schema: VERIFICATION_SCHEMA,
        index,
        id: normalizeText(verification.id || verification.verificationId || stepResult.id),
        scope: normalizeText(verification.scope, 'custom'),
        status,
        passed: status === 'passed' && stepResult.response?.ok === true,
        command: normalizeText(verification.command),
        exitCode: Number.isFinite(Number(verification.exitCode)) ? Number(verification.exitCode) : null,
        durationMs: Number(verification.durationMs || 0) || 0,
        outputId: normalizeText(verification.outputId),
        summary: normalizeText(verification.summary || stepResult.response?.error)
    };
}

function assessTaskDelivery({
    stepResults = [],
    policy = {},
    isMutatingTool = () => false,
    terminalStatus = ''
} = {}) {
    const normalizedPolicy = normalizeDeliveryPolicy(policy);
    const steps = Array.isArray(stepResults) ? stepResults : [];
    let lastMutationIndex = -1;
    const verifications = [];

    steps.forEach((stepResult, index) => {
        const toolId = normalizeToolId(stepResult?.tool);
        if (toolId === TASK_VERIFY_TOOL_ID) {
            const verification = normalizeVerificationStep(stepResult, index);
            if (verification) verifications.push(verification);
            return;
        }
        if (isMutatingTool(toolId, stepResult) === true && stepResult?.response?.ok === true) {
            lastMutationIndex = index;
        }
    });

    const latestVerification = verifications.at(-1) || null;
    const latestPassedVerification = [...verifications].reverse().find((entry) => entry.passed) || null;
    const verificationFresh = Boolean(
        latestPassedVerification && latestPassedVerification.index > lastMutationIndex
    );
    const blocked = [
        'blocked',
        'cancelled',
        'error',
        'expired',
        'failed',
        'interrupted',
        'invalid_agent_tool_call',
        'max_loop',
        'max_steps_reached',
        'stalled',
        'timeout'
    ]
        .includes(normalizeText(terminalStatus).toLowerCase());

    let status = DELIVERY_STATUS.WORKING;
    if (blocked) {
        status = DELIVERY_STATUS.BLOCKED;
    } else if (verificationFresh) {
        status = DELIVERY_STATUS.VERIFIED_DELIVERY;
    } else if (latestVerification && !latestVerification.passed) {
        status = DELIVERY_STATUS.VERIFICATION_FAILED;
    } else if (lastMutationIndex >= 0) {
        status = DELIVERY_STATUS.PATCH_GENERATED;
    } else if (normalizedPolicy.requireVerification) {
        status = DELIVERY_STATUS.VALIDATING;
    }

    const verified = status === DELIVERY_STATUS.VERIFIED_DELIVERY;
    const canDeliver = !normalizedPolicy.requireVerification || verified || normalizedPolicy.allowUnverifiedDelivery;
    const unresolved = [];
    if (normalizedPolicy.requireVerification && !verified) {
        if (latestVerification && !latestVerification.passed) {
            unresolved.push('The latest visible verification failed. Repair the implementation and run task_verify again.');
        } else if (latestPassedVerification && !verificationFresh) {
            unresolved.push('The implementation changed after the last passing verification. Run task_verify again.');
        } else {
            unresolved.push('No passing task_verify observation exists for the current implementation.');
        }
    }

    return {
        schema: DELIVERY_SCHEMA,
        status,
        enabled: normalizedPolicy.enabled,
        required: normalizedPolicy.requireVerification,
        verified,
        canDeliver,
        hasMutation: lastMutationIndex >= 0,
        lastMutationIndex,
        verificationFresh,
        latestVerification,
        verifications,
        unresolved
    };
}

function buildDeliveryGateObservation(delivery = {}) {
    return [
        '<task_delivery_observation>',
        JSON.stringify({
            schema: DELIVERY_SCHEMA,
            status: delivery.status || DELIVERY_STATUS.VALIDATING,
            required: delivery.required === true,
            verified: delivery.verified === true,
            latest_verification: delivery.latestVerification || null,
            unresolved: Array.isArray(delivery.unresolved) ? delivery.unresolved : [],
            instruction: 'Do not finalize yet. Use task_verify with a concrete project-appropriate command. If it fails, inspect the observation, repair the implementation, and verify again. If verification cannot run, return blocked with the concrete failure evidence.'
        }),
        '</task_delivery_observation>'
    ].join('\n');
}

module.exports = {
    DELIVERY_SCHEMA,
    DELIVERY_STATUS,
    TASK_VERIFY_TOOL_ID,
    VERIFICATION_SCHEMA,
    assessTaskDelivery,
    buildDeliveryGateObservation,
    normalizeDeliveryPolicy,
    normalizeVerificationStep
};
