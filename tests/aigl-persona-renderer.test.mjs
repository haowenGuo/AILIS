import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    attachPersonaSurface,
    getToolExperience,
    renderApprovalSurface,
    renderMaxStepsSurface,
    renderPersonaSurfaceGateway,
    renderToolFailureSurface,
    renderStatusSurface
} = require('../electron/aigl-persona-renderer.cjs');

test('AIGL persona renderer turns tool approval into embodied user-facing surface', () => {
    const surface = renderApprovalSurface({
        toolId: 'vision.capture_context',
        title: '看一下屏幕',
        reason: '需要确认当前报错内容',
        visionTargetLabel: '屏幕'
    });

    assert.equal(surface.renderer, 'aigl-persona-renderer');
    assert.equal(surface.experience.embodiedAction, 'look');
    assert.match(surface.text, /先得到你的确认/);
    assert.match(surface.text, /看一眼屏幕/);
    assert.doesNotMatch(surface.text, /approvalId|tool_call|raw observation/);
    assert.equal(surface.expression, 'relaxed');
});

test('AIGL persona renderer attaches structured surface while preserving agent status', () => {
    const surface = renderStatusSurface({
        text: '我先停在这里，避免越跑越乱。',
        status: 'max_steps_reached',
        expression: 'relaxed'
    });
    const result = attachPersonaSurface({
        ok: false,
        status: 'max_steps_reached',
        displayText: 'raw'
    }, surface);

    assert.equal(result.status, 'max_steps_reached');
    assert.equal(result.surface.lipSync.mode, 'audio_envelope');
    assert.match(result.displayText, /^\[expression:relaxed\]/);
    assert.equal(result.expression, 'relaxed');
    assert.equal(result.action, null);
    assert.match(result.speechText, /先停在这里|避免越跑越乱/);
    assert.equal(result.bubbleText, '我先停在这里，避免越跑越乱。');
});

test('AIGL persona renderer owns failure text instead of leaking upstream tool logs', () => {
    const surface = renderPersonaSurfaceGateway({
        task_state: 'failed',
        evidence_state: 'missing',
        error_code: 'tool_failed',
        text: 'Agentic Executor tool_call failed: exec git_status raw observation SECRET=abc',
        speech_text: 'Agentic Executor tool_call failed',
        bubble_text: 'raw observation',
        next_action: '重新检查仓库状态',
        tool_id: 'code'
    });

    assert.match(surface.text, /这一步我先停住/);
    assert.match(surface.text, /不会把这一步说成已经完成/);
    assert.doesNotMatch(surface.text, /Agentic Executor|tool_call|raw observation|SECRET|git_status/);
    assert.doesNotMatch(surface.speechText, /Agentic Executor|tool_call|raw observation|SECRET|git_status/);
    assert.equal(surface.expression, 'relaxed');
    assert.equal(surface.action, null);
});

test('AIGL persona renderer hides internal invalid-json failure details', () => {
    const surface = renderPersonaSurfaceGateway({
        task_state: 'failed',
        evidence_state: 'missing',
        error_code: 'invalid_json',
        reason: 'Agentic Executor 没有返回合法 JSON。',
        next_action: '换一种方式重新整理论文摘要'
    });

    assert.match(surface.text, /可靠结论/);
    assert.match(surface.text, /不会把这一步说成已经完成/);
    assert.doesNotMatch(surface.text, /JSON|结构化结果|任务执行流程|合法|格式|内部结果/);
    assert.doesNotMatch(surface.speechText, /JSON|结构化结果|任务执行流程|合法|格式|内部结果/);
});

test('AIGL persona renderer maps angry emotion to available avatar channels', () => {
    const surface = renderPersonaSurfaceGateway({
        task_state: 'completed',
        evidence_state: 'none',
        emotion_hint: 'angry',
        relationship_stage: 'familiarizing',
        text: '被领导催进度真的会很烦，我先陪你把这口气接住。'
    });

    assert.equal(surface.expression, 'angry');
    assert.equal(surface.action, null);
    assert.match(surface.text, /被领导催进度/);
});

test('AIGL persona renderer reads tool experience metadata from contracts', () => {
    const email = getToolExperience('email');
    const computer = getToolExperience('computer');

    assert.equal(email.userFacingVerb, '看看邮箱');
    assert.equal(email.userSafePreview, 'redacted_summary');
    assert.equal(computer.embodiedAction, 'check_local_state');
});

test('AIGL persona renderer compresses max-step fallback into human wording', () => {
    const surface = renderMaxStepsSurface({
        maxSteps: 50,
        stepCount: 7,
        latestSummary: '确认本地配置是否已保存',
        mode: 'task'
    });

    assert.equal(surface.source, 'agent_max_steps');
    assert.equal(surface.experience.maxSteps, 50);
    assert.match(surface.text, /已经做了 7 轮处理/);
    assert.match(surface.text, /目前主要卡在：确认本地配置是否已保存/);
    assert.doesNotMatch(surface.text, /我已经做过这些步骤|tool_call|raw observation/);
    assert.equal(surface.bubbleText, '我先停住，避免越跑越乱。');
});

test('AIGL persona renderer hides raw email config errors from user-facing failure text', () => {
    const surface = renderToolFailureSurface({
        step: {
            tool: 'email',
            title: '检查未读邮件',
            args: { action: 'list', filter: 'unread' }
        },
        response: {
            ok: false,
            status: 'needs_config',
            error: 'email 工具需要 account/email 参数，或设置 HUMANCLAW_EMAIL_<PROVIDER>_ACCOUNT。'
        },
        userMessage: '帮我看看有没有 GitHub 的新邮件',
        intent: 'email_management',
        fallbackText: '需要设置 HUMANCLAW_EMAIL_QQ_SECRET'
    });

    assert.equal(surface.source, 'tool_failure');
    assert.equal(surface.toolId, 'email');
    assert.match(surface.text, /邮箱账号/);
    assert.match(surface.text, /不会假装已经看过邮件/);
    assert.match(surface.bubbleText, /邮箱还没连上/);
    assert.doesNotMatch(surface.text, /HUMANCLAW_EMAIL|<PROVIDER>|tool_call|raw observation|SECRET/);
    assert.doesNotMatch(surface.bubbleText, /HUMANCLAW_EMAIL|<PROVIDER>|tool_call|raw observation|SECRET/);
});
