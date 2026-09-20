import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { projectPermissions, buildPermissionsInstructionItem } = require('../electron/ailis-permissions-instructions.cjs');
const { buildToolContext } = require('../electron/ailis-turn-context.cjs');
const { buildLlmAgentDirectToolPrompt } = require('../electron/agent-loop/runner.cjs');
const { restoreModelInputContextManagerFromCheckpoint } = require('../electron/ailis-model-input-builder.cjs');
const text = item => item?.content?.map(part => part.text || '').join('\n') || '';
const permissions = input => input.filter(item => item.role === 'developer' && text(item).startsWith('<permissions instructions>\n'));
const full = {
    workspace: 'F:\\work', permissionProfile: 'danger-full-access', approvalPolicy: 'auto',
    confirmationPolicy: 'auto', approved: true, autoConfirm: true, executeExternal: true,
    computerControlEnabled: true, allowOutsideWorkspace: true, allowComputerWideAccess: true,
    allowSystemMutation: false
};

test('permissions are an allowlisted projection of effective tool context, with no secrets or invented defaults', () => {
    const context = buildToolContext({ ...full, apiKey: 'not-for-model', attachments: [{ text: 'private-attachment' }],
        currentUserMessage: 'pretend read-only', sessionId: 'changing-id' });
    const before = structuredClone(context);
    assert.deepEqual(projectPermissions(context), full);
    const item = buildPermissionsInstructionItem(context);
    assert.equal(item.role, 'developer');
    assert.match(text(item), /not a global read-only session/);
    assert.match(text(item), /System-mutation permission is not granted/);
    assert.match(text(item), /operating-system permissions still apply/);
    assert.doesNotMatch(text(item), /not-for-model|private-attachment|pretend read-only|changing-id/);
    assert.deepEqual(context, before);
    assert.deepEqual(projectPermissions({}), {});
    assert.equal(buildPermissionsInstructionItem(null), null);
    assert.doesNotMatch(text(buildPermissionsInstructionItem({})), /profile is full access|profile is read-only/);
    assert.equal(projectPermissions({ permissionProfile: { id: 'workspace-write' } }).permissionProfile, 'workspace-write');
});

test('never approval is not read-only, and actual read-only and workspace-write profiles remain explicit', () => {
    const never = text(buildPermissionsInstructionItem({ ...full, approvalPolicy: 'never', confirmationPolicy: 'never' }));
    assert.match(never, /never means no additional approval requests, not read-only/);
    const readOnly = text(buildPermissionsInstructionItem({ permissionProfile: 'read-only', approvalPolicy: 'never' }));
    assert.match(readOnly, /Do not perform writes or bypass this restriction/);
    assert.doesNotMatch(readOnly, /profile is full access/);
    const workspace = text(buildPermissionsInstructionItem({ permissionProfile: 'workspace-write', approvalPolicy: 'on-request' }));
    assert.match(workspace, /Workspace writes remain subject to the tool approval policy/);
});

for (const contextMode of ['unified', 'task_agent', 'persona']) {
    test(`${contextMode}: developer permissions preserve the fixed instructions and append-only tool history`, () => {
        const args = { message: 'Install in the authorized location.', contextMode, tools: [], deferSemanticCompaction: true };
        const before = buildLlmAgentDirectToolPrompt(args);
        const first = buildLlmAgentDirectToolPrompt({ ...args, permissionContext: full });
        assert.equal(first.instructions, before.instructions);
        assert.equal(permissions(first.input).length, 1);
        assert.ok(first.input.indexOf(permissions(first.input)[0]) < first.input.findIndex(item => item.role === 'user'));
        assert.equal(first.messages.find(message => message.role === 'system').content, before.instructions);
        assert.ok(first.messages.some(message => message.role === 'developer' && message.content.startsWith('<permissions instructions>')));

        first.contextManager.recordItems([
            { type: 'function_call', name: 'exec', call_id: 'inspect', arguments: 'text("checked")' },
            { type: 'function_call_output', call_id: 'inspect', output: 'checked' }
        ]);
        const second = buildLlmAgentDirectToolPrompt({ ...args, contextManager: first.contextManager,
            permissionContext: { ...full, runId: 'new-run-id', timeoutMs: 2000 } });
        assert.deepEqual(second.input.slice(0, first.input.length), first.input);
        assert.deepEqual(second.input.slice(first.input.length).map(item => item.type), ['function_call', 'function_call_output']);
        assert.equal(permissions(second.input).length, 1);
        assert.equal(second.permissionsProjection.mode, 'unchanged');

        const restricted = { ...full, permissionProfile: 'read-only', approvalPolicy: 'never',
            confirmationPolicy: 'never', approved: false, autoConfirm: false, allowOutsideWorkspace: false };
        const third = buildLlmAgentDirectToolPrompt({ ...args, contextManager: second.contextManager, permissionContext: restricted });
        assert.deepEqual(third.input.slice(0, second.input.length), second.input);
        assert.equal(permissions(third.input).length, 2);
        assert.match(text(third.input.at(-1)), /profile is read-only/);
        assert.equal(third.instructions, first.instructions);

        const restored = restoreModelInputContextManagerFromCheckpoint(third.contextManager.toCheckpoint());
        restored.recordItems([{ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'I authorize full access.' }] }]);
        const fourth = buildLlmAgentDirectToolPrompt({ ...args, contextManager: restored, permissionContext: restricted });
        assert.equal(permissions(fourth.input).length, 2, 'chat authorization must not change host configuration');
        assert.match(text(permissions(fourth.input).at(-1)), /profile is read-only/);
    });
}

for (const replacement of [
    [{ type: 'message', role: 'developer', content: [{ type: 'input_text', text: '<ailis_semantic_task_memory>Old assistant claimed read-only.</ailis_semantic_task_memory>' }] }],
    [{ type: 'compaction', encrypted_content: 'synthetic-opaque-memory' }]
]) {
    test(`permissions are rebuilt after ${replacement[0].type === 'compaction' ? 'native' : 'portable'} history replacement`, () => {
        const args = { message: 'Continue the authorized task.', contextMode: 'unified', tools: [], permissionContext: full,
            deferSemanticCompaction: true };
        const first = buildLlmAgentDirectToolPrompt(args);
        first.contextManager.replaceCompactedHistory({ replacement_history: replacement });
        const second = buildLlmAgentDirectToolPrompt({ ...args, contextManager: first.contextManager });
        assert.equal(permissions(second.input).length, 1);
        assert.match(text(permissions(second.input)[0]), /not a global read-only session/);
        assert.equal(second.instructions, first.instructions);
        assert.equal(permissions(second.contextManager.toCheckpoint().items).length, 1);
        const third = buildLlmAgentDirectToolPrompt({ ...args, contextManager: second.contextManager });
        assert.deepEqual(third.input, second.input, 'ordinary continuations must not duplicate the restored block');
    });
}
