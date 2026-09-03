import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    CODE_MODE_FREEFORM_GRAMMAR,
    CODEX_EXEC_COMMAND_DESCRIPTION,
    EXEC_DESCRIPTION_TEMPLATE,
    createExecToolSpec,
    createExecWaitToolSpec,
    getCodeModeProfile,
    parseExecSource
} = require('../electron/codex-code-mode-protocol.cjs');
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');

function functionSpec(name, properties = {}) {
    return {
        type: 'function',
        name,
        description: `${name} test tool.`,
        parameters: {
            type: 'object',
            properties,
            additionalProperties: false
        }
    };
}

test('TaskAgent exec spec preserves the Codex 0.145 freeform description and Lark grammar', () => {
    const spec = createExecToolSpec([functionSpec('read', { path: { type: 'string' } })]);
    assert.equal(spec.type, 'custom');
    assert.equal(spec.name, 'exec');
    assert.ok(spec.description.startsWith(EXEC_DESCRIPTION_TEMPLATE));
    assert.equal(CODE_MODE_FREEFORM_GRAMMAR, '\nstart: pragma_source | plain_source\npragma_source: PRAGMA_LINE NEWLINE SOURCE\nplain_source: SOURCE\nPRAGMA_LINE: /[ \\t]*\\/\\/ @exec:[^\\r\\n]*/\nNEWLINE: /\\r?\\n/\nSOURCE: /[\\s\\S]+/\n');
    assert.match(EXEC_DESCRIPTION_TEMPLATE, /discarded\.\n- Global helpers:/);
    assert.match(EXEC_DESCRIPTION_TEMPLATE, /original" }`\.\nWhen provided/);
    assert.match(EXEC_DESCRIPTION_TEMPLATE, /MCP tool audio block/);
    assert.match(spec.description, /declare const tools: \{ read\(args:/);
    assert.deepEqual(spec.format, {
        type: 'grammar',
        syntax: 'lark',
        definition: CODE_MODE_FREEFORM_GRAMMAR
    });
    assert.deepEqual(getCodeModeProfile(spec.x_ailis_code_mode_profile).map((tool) => tool.name), ['read']);
    assert.equal(createExecWaitToolSpec().name, 'exec_wait');
});

test('complete exec Description freezes the Codex 0.145 built-in nested-tool ABI', () => {
    const spec = createExecToolSpec([
        functionSpec('exec_command'),
        functionSpec('write_stdin'),
        functionSpec('apply_patch'),
        functionSpec('update_plan')
    ]);
    assert.match(spec.description, new RegExp(CODEX_EXEC_COMMAND_DESCRIPTION.split('\n')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(spec.description, /declare const tools: \{ exec_command\(args:/);
    assert.match(spec.description, /session_id\?: number;/);
    assert.match(spec.description, /output: string;/);
    assert.match(spec.description, /declare const tools: \{ write_stdin\(args:/);
    assert.match(spec.description, /declare const tools: \{ apply_patch\(input: string\): Promise<unknown>; \};/);
    assert.match(spec.description, /declare const tools: \{ update_plan\(args:/);
    assert.doesNotMatch(spec.description, /structuredContent.*exec_command/s);
    assert.doesNotMatch(spec.description, /callId/);
    assert.equal(
        createHash('sha256').update(spec.description).digest('hex'),
        '3ccb2454faad73044bb1c3a281c026b6115a532e81bd776a55edbe19b48529d8'
    );
});

test('exec pragma parsing matches the Codex yield and output-budget contract', () => {
    assert.deepEqual(parseExecSource('// @exec: {"yield_time_ms": 25, "max_output_tokens": 50}\ntext("ok")'), {
        code: 'text("ok")',
        yield_time_ms: 25,
        max_output_tokens: 50
    });
    assert.throws(() => parseExecSource('// @exec: {"unknown": 1}\ntext("no")'), /only supports/);
});

test('exec composes multiple enabled tools in one JavaScript program', async () => {
    const calls = [];
    const spec = createExecToolSpec([
        functionSpec('double', { value: { type: 'number' } }),
        functionSpec('label', { value: { type: 'number' } })
    ]);
    const runtime = new AILISCodeModeRuntime({
        dispatchTool: async ({ tool, args }) => {
            calls.push({ tool, args });
            if (tool === 'double') return { value: args.value * 2 };
            return { text: `value=${args.value}` };
        }
    });
    const result = await runtime.execute({
        input: 'const doubled = await tools.double({value: 21}); const labeled = await tools.label({value: doubled.value}); text(labeled.text);',
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'compose-test' }
    });
    assert.equal(result.ok, true);
    assert.match(result.text, /Script completed/);
    assert.match(result.text, /value=42/);
    assert.deepEqual(calls, [
        { tool: 'double', args: { value: 21 } },
        { tool: 'label', args: { value: 42 } }
    ]);
});

test('exec yields a live cell and exec_wait returns only its later completion', async () => {
    const spec = createExecToolSpec([functionSpec('noop')]);
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({ ok: true }) });
    const first = await runtime.execute({
        input: '// @exec: {"yield_time_ms": 0}\nconst value = await new Promise((resolve) => setTimeout(() => resolve("later"), 60)); text(value);',
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'wait-test' }
    });
    assert.equal(first.status, 'running');
    assert.match(first.text, /Script running with cell ID/);
    const second = await runtime.wait({ cell_id: first.details.cell_id, yield_time_ms: 1000 });
    assert.equal(second.status, 'completed');
    assert.match(second.text, /later/);
});

test('exec isolate does not expose Node, network globals, or host-realm constructor escapes', async () => {
    const spec = createExecToolSpec([functionSpec('echo', { value: { type: 'number' } })]);
    const runtime = new AILISCodeModeRuntime({
        dispatchTool: async ({ args }) => ({ value: args.value })
    });
    const source = `
text(typeof process);
text(typeof require);
text(typeof fetch);
let toolEscape = false;
try { tools.echo.constructor.constructor('return process')(); toolEscape = true; } catch {}
const result = await tools.echo({value: 7});
let resultEscape = false;
try { result.constructor.constructor('return process')(); resultEscape = true; } catch {}
text(toolEscape);
text(resultEscape);
text(ALL_TOOLS.filter((tool) => tool.name === 'echo').length);
`;
    const result = await runtime.execute({
        input: source,
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'isolation-test' }
    });
    assert.equal(result.ok, true);
    assert.match(result.text, /undefined\nundefined\nundefined\nfalse\nfalse\n1/);
});

test('freeform nested tools receive strings and unexposed tools are unavailable', async () => {
    const calls = [];
    const spec = createExecToolSpec([{
        type: 'custom',
        name: 'apply_patch',
        description: 'Apply a patch.'
    }]);
    const runtime = new AILISCodeModeRuntime({
        dispatchTool: async (call) => {
            calls.push(call);
            return 'patched';
        }
    });
    const success = await runtime.execute({
        input: 'const result = await tools.apply_patch("*** Begin Patch\\n*** End Patch"); text(result);',
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'freeform-test' }
    });
    assert.equal(success.ok, true);
    assert.equal(calls[0].tool, 'apply_patch');
    assert.deepEqual(calls[0].args, { input: '*** Begin Patch\n*** End Patch' });

    const failure = await runtime.execute({
        input: 'await tools.not_enabled({});',
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'freeform-test' }
    });
    assert.equal(failure.ok, false);
    assert.match(failure.text, /not_enabled/);
});

test('Codex nested exec ABI unwraps Gateway envelopes and aliases string sessions to numbers', async () => {
    const calls = [];
    const internalSessionId = 'pty-a47f2251-d667-4fe5-b187-e135dfbd26bb';
    const spec = createExecToolSpec([
        functionSpec('exec_command'),
        functionSpec('write_stdin')
    ]);
    const runtime = new AILISCodeModeRuntime({
        dispatchTool: async (call) => {
            calls.push(call);
            if (call.tool === 'exec_command') {
                return {
                    ok: true,
                    callId: 'gateway-call-1',
                    tool: 'exec_command',
                    status: 'completed',
                    durationMs: 20,
                    result: {
                        content: [{ type: 'text', text: 'booting' }],
                        structuredContent: { status: 'completed' },
                        details: {
                            session_id: internalSessionId,
                            chunk_id: 'chunk-1',
                            wall_time_seconds: 0.02,
                            original_token_count: 2,
                            output: 'booting',
                            stdout: 'booting',
                            stderr: '',
                            outputStore: { outputId: 'must-not-leak' }
                        }
                    }
                };
            }
            return {
                ok: true,
                callId: 'gateway-call-2',
                tool: 'write_stdin',
                status: 'completed',
                durationMs: 30,
                result: {
                    content: [{ type: 'text', text: 'done' }],
                    details: {
                        exit_code: 0,
                        chunk_id: 'chunk-2',
                        wall_time_seconds: 0.03,
                        original_token_count: 1,
                        output: 'done',
                        stdout: 'done',
                        stderr: ''
                    }
                }
            };
        }
    });
    const result = await runtime.execute({
        input: `const first = await tools.exec_command({cmd: "long-task"});
text({keys: Object.keys(first).sort(), session_type: typeof first.session_id, output: first.output});
const second = await tools.write_stdin({session_id: first.session_id, chars: ""});
text({keys: Object.keys(second).sort(), output: second.output});`,
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'gateway-envelope-test' }
    });
    assert.equal(result.ok, true);
    assert.deepEqual(calls.map(({ tool }) => tool), ['exec_command', 'write_stdin']);
    assert.equal(calls[1].args.session_id, internalSessionId);
    assert.match(result.text, /"session_type":"number"/);
    assert.match(result.text, /"output":"booting"/);
    assert.match(result.text, /"output":"done"/);
    assert.doesNotMatch(result.text, /gateway-call|callId|details|structuredContent|outputStore|stdout|stderr/);
});

test('apply_patch and update_plan receive compact Codex-style nested results', async () => {
    const spec = createExecToolSpec([
        functionSpec('apply_patch'),
        functionSpec('update_plan')
    ]);
    const runtime = new AILISCodeModeRuntime({
        dispatchTool: async ({ tool }) => tool === 'apply_patch'
            ? {
                  ok: true,
                  callId: 'patch-envelope',
                  tool,
                  result: { content: [{ type: 'text', text: 'Done!' }], details: { noisy: true } }
              }
            : {
                  ok: true,
                  callId: 'plan-envelope',
                  tool,
                  result: {
                      content: [{ type: 'text', text: 'Plan updated.' }],
                      structuredContent: { status: 'completed' },
                      details: { status: 'completed', noisy: true }
                  }
              }
    });
    const result = await runtime.execute({
        input: `const patch = await tools.apply_patch("*** Begin Patch\\n*** End Patch");
const plan = await tools.update_plan({plan:[{step:"inspect",status:"completed"}]});
text({patch, plan});`,
        profileId: spec.x_ailis_code_mode_profile,
        context: { sessionId: 'compact-control-tools-test' }
    });
    assert.equal(result.ok, true);
    assert.match(result.text, /"patch":"Done!"/);
    assert.match(result.text, /"plan":\{"status":"completed"\}/);
    assert.doesNotMatch(result.text, /patch-envelope|plan-envelope|noisy/);
});
