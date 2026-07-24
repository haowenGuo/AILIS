const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');

const VISION_TOOL_ID = 'vision.capture_context';
const DEFAULT_VISION_TIMEOUT_MS = 90000;
const SUPPORTED_TARGETS = new Set(['screen', 'chat-window', 'active-window', 'region']);

const AILIS_VISION_TOOL_DEFINITION = Object.freeze({
    id: VISION_TOOL_ID,
    label: VISION_TOOL_ID,
    description: 'Read-only visual perception tool. Captures a screen/window/region snapshot and returns a textual visual understanding observation.',
    sectionId: 'vision',
    route: 'ailis-local',
    materialized: true,
    status: 'available',
    needsApprovalActions: Object.freeze(['capture_context'])
});

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value) {
    return normalizeString(value, 'capture_context').toLowerCase().replace(/[-\s]+/g, '_');
}

function normalizeTarget(value) {
    const target = normalizeString(value, 'screen').toLowerCase().replace(/_/g, '-');
    if (SUPPORTED_TARGETS.has(target)) {
        return target;
    }
    if (['chat', 'chat_window', 'conversation'].includes(target)) {
        return 'chat-window';
    }
    if (['window', 'current-window', 'active'].includes(target)) {
        return 'active-window';
    }
    return 'screen';
}

function normalizeTimeoutMs(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return DEFAULT_VISION_TIMEOUT_MS;
    }
    return Math.round(Math.min(Math.max(numericValue, 10000), 120000));
}

function isFullControlContext(context = {}) {
    const rawPermission = context.permissionProfile || context.permissions || context.policy || context.sandbox;
    const permissionProfile = normalizeString(
        typeof rawPermission === 'string' ? rawPermission : rawPermission?.id || rawPermission?.name
    ).toLowerCase();
    const approvalPolicy = normalizeString(context.approvalPolicy || context.confirmationPolicy).toLowerCase();
    return (
        context.computerControlEnabled === true &&
        (
            context.approved === true ||
            context.autoConfirm === true ||
            approvalPolicy === 'auto' ||
            permissionProfile === 'danger-full-access' ||
            permissionProfile === 'full-access'
        )
    );
}

function isVisionApprovedContext(context = {}, permissionPolicy = 'manual') {
    const normalizedPolicy = normalizeString(permissionPolicy, 'manual').toLowerCase();
    return (
        context.visionApproved === true ||
        normalizedPolicy === 'auto' ||
        isFullControlContext(context)
    );
}

function getTargetLabel(target) {
    if (target === 'chat-window') {
        return '聊天窗口';
    }
    if (target === 'active-window') {
        return '当前窗口';
    }
    if (target === 'region') {
        return '框选区域';
    }
    return '全屏';
}

function buildSchemaResult() {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(
                    {
                        tool: VISION_TOOL_ID,
                        status: 'completed',
                        description: '只读视觉感知工具，用于在文本不足时获取截图并返回视觉理解。',
                        actions: ['schema', 'capture_context'],
                        args: {
                            action: 'capture_context',
                            target: 'screen | chat-window | active-window | region',
                            reason: '为什么需要看这一眼',
                            question: '希望视觉理解回答的问题'
                        },
                        boundaries: [
                            '不会点击、输入、拖动或操作屏幕',
                            '不会连续监控屏幕',
                            '只返回截图附件元数据和视觉理解文本'
                        ]
                    },
                    null,
                    2
                )
            }
        ],
        details: {
            status: 'completed',
            tool: VISION_TOOL_ID,
            action: 'schema'
        }
    };
}

function stripSnapshotData(snapshot = {}) {
    return {
        type: snapshot.type || 'vision',
        id: snapshot.id || '',
        source: snapshot.source || '',
        label: snapshot.label || '',
        imagePath: snapshot.imagePath || '',
        thumbnailPath: snapshot.thumbnailPath || '',
        mimeType: snapshot.mimeType || 'image/png',
        width: Number(snapshot.width) || 0,
        height: Number(snapshot.height) || 0,
        originalWidth: Number(snapshot.originalWidth) || 0,
        originalHeight: Number(snapshot.originalHeight) || 0,
        bounds: snapshot.bounds || null,
        createdAt: snapshot.createdAt || ''
    };
}

function buildVisionUnderstandingMessages({ snapshot, target, reason, question }) {
    return [
        {
            role: 'system',
            content: [
                '你是 AILIS 的 VisionUnderstandingSkill，只负责根据截图做只读视觉理解。',
                '你不能声称自己已经点击、输入、拖动或操作屏幕。',
                '输出给上层 Agent 的 observation 要稳定、简洁、可复核。',
                '必须区分：确定看到的内容、不确定或看不清的内容、给用户的下一步建议。',
                '如果截图信息不足，直接说明需要更清晰或更小范围的截图。'
            ].join('\n')
        },
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: [
                        `截图来源：${getTargetLabel(target)}`,
                        reason ? `调用原因：${reason}` : '',
                        question ? `用户/Agent 问题：${question}` : '',
                        '请只基于截图回答，不要补充截图里看不到的事实。'
                    ].filter(Boolean).join('\n')
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: snapshot.dataUrl
                    }
                }
            ]
        }
    ];
}

function buildNeedsApprovalResult({ target, reason }) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(
                    {
                        status: 'needs_approval',
                        tool: VISION_TOOL_ID,
                        target,
                        reason,
                        message: '视觉截图需要用户确认。'
                    },
                    null,
                    2
                )
            }
        ],
        isError: true,
        details: {
            status: 'needs_approval',
            tool: VISION_TOOL_ID,
            target,
            reason,
            approval: 'required'
        }
    };
}

async function executeVisionTool(args = {}, context = {}, services = {}) {
    const action = normalizeAction(args.action || args.operation || args.intent);
    if (action === 'schema') {
        return buildSchemaResult();
    }
    if (!['capture_context', 'capture'].includes(action)) {
        return {
            content: [{ type: 'text', text: `unsupported vision action: ${action}` }],
            isError: true,
            details: {
                status: 'unsupported_action',
                tool: VISION_TOOL_ID,
                action
            }
        };
    }

    const target = normalizeTarget(args.target || args.source);
    const reason = normalizeString(args.reason || args.why || args.summary);
    const question = normalizeString(args.question || args.prompt || args.query || reason);
    const permissionPolicy = normalizeString(
        context.visionPermissionPolicy || context.visionPolicy || services.permissionPolicy,
        'manual'
    );

    if (permissionPolicy === 'strict' && target !== 'chat-window') {
        return {
            content: [
                {
                    type: 'text',
                    text: 'strict vision policy only allows chat-window screenshots.'
                }
            ],
            isError: true,
            details: {
                status: 'blocked',
                tool: VISION_TOOL_ID,
                target,
                policy: permissionPolicy
            }
        };
    }

    if (context.planner === 'llm-agentic-executor' && !isVisionApprovedContext(context, permissionPolicy)) {
        return buildNeedsApprovalResult({ target, reason });
    }

    if (typeof services.capture !== 'function') {
        return {
            content: [{ type: 'text', text: 'vision capture service is not configured.' }],
            isError: true,
            details: {
                status: 'needs_config',
                tool: VISION_TOOL_ID,
                reason: 'missing_capture_service'
            }
        };
    }

    const snapshot = await services.capture({
        target,
        reason,
        bounds: args.bounds || null
    });

    if (!snapshot?.dataUrl) {
        return {
            content: [{ type: 'text', text: 'vision snapshot did not include model image data.' }],
            isError: true,
            details: {
                status: 'error',
                tool: VISION_TOOL_ID,
                target,
                snapshot: stripSnapshotData(snapshot)
            }
        };
    }

    const settings = typeof services.getLlmSettings === 'function'
        ? services.getLlmSettings()
        : context.llmSettings || {};
    const response = await callDesktopLlmProvider(settings, {
        messages: buildVisionUnderstandingMessages({
            snapshot,
            target,
            reason,
            question
        }),
        temperature: 0.35,
        timeoutMs: normalizeTimeoutMs(args.timeoutMs || context.timeoutMs)
    });

    if (!response.ok) {
        return {
            content: [
                {
                    type: 'text',
                    text: `视觉理解失败：${response.error || response.code || 'unknown error'}`
                }
            ],
            isError: true,
            details: {
                status: response.code || 'error',
                tool: VISION_TOOL_ID,
                target,
                snapshot: stripSnapshotData(snapshot),
                error: response.error || ''
            }
        };
    }

    const attachment = stripSnapshotData(snapshot);
    return {
        content: [
            {
                type: 'text',
                text: [
                    `vision.capture_context completed (${getTargetLabel(target)}).`,
                    '',
                    response.content
                ].join('\n')
            }
        ],
        details: {
            status: 'completed',
            tool: VISION_TOOL_ID,
            action: 'capture_context',
            target,
            reason,
            snapshot: attachment,
            attachment,
            understanding: response.content,
            model: response.model || settings.model || '',
            usage: response.usage || null
        }
    };
}

module.exports = {
    AILIS_VISION_TOOL_DEFINITION,
    VISION_TOOL_ID,
    executeVisionTool,
    isVisionApprovedContext,
    normalizeTarget,
    stripSnapshotData
};
