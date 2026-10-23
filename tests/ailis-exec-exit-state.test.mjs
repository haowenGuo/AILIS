import assert from 'node:assert/strict';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISCodeModeRuntime, compactUnifiedExecResult } = require('../electron/ailis-code-mode-runtime.cjs');
const { ComputerRuntime } = require('../electron/ailis-computer-tool.cjs');
const { CODEX_EXEC_RESULT_SCHEMA, createExecToolSpec, renderJsonSchemaToTypescript } = require('../electron/codex-code-mode-protocol.cjs');
const { toolOutputToModelInputItems } = require('../electron/ailis-model-input-builder.cjs');
const { responseItemsToWireItems } = require('../electron/ailis-response-model.cjs');

function projectionRuntime() {
    return new AILISCodeModeRuntime({ dispatchTool: async () => { throw new Error('Unexpected dispatch'); } });
}

test('native signal, null exit code and process state survive nested projection unchanged', () => {
    const runtime = projectionRuntime();
    const details = { status:'completed', process_status:'exited', running:false,
        signal:'SIGTERM', exit_code:null, output:'READY\n', wall_time_seconds:0.1,
        chunk_id:'signal-chunk', original_token_count:2 };
    const before = structuredClone(details);
    const projected = runtime.projectNestedToolResult('write_stdin', { details });
    for (const key of ['status','process_status','running','signal','exit_code']) {
        assert.equal(projected[key], details[key]);
    }
    assert.equal(projected.session_id, undefined);
    assert.equal(projected.output, 'READY\n');
    assert.equal(projected.wall_time_seconds, 0.1);
    assert.equal(projected.chunk_id, 'signal-chunk');
    assert.deepEqual(details, before);
    runtime.shutdown();
});

test('normal zero and nonzero exits remain numeric; absent state is not manufactured', () => {
    for (const exit_code of [0,7,130]) {
        const result = compactUnifiedExecResult({ details:{ exit_code, output:'original', wall_time_seconds:0.25 } });
        assert.deepEqual(result,{ exit_code, output:'original', wall_time_seconds:0.25 });
    }
    const absent = compactUnifiedExecResult({ details:{ output:'' } });
    assert.equal(Object.hasOwn(absent,'exit_code'),false);
    assert.equal(Object.hasOwn(absent,'signal'),false);
    assert.equal(Object.hasOwn(absent,'running'),false);
    assert.equal(Object.hasOwn(absent,'status'),false);
});

test('structured spawn errors and timeouts retain state and output instead of becoming string errors', () => {
    const runtime = projectionRuntime();
    for (const state of ['error','timeout']) {
        const details = { status:'error', process_status:state, running:false,
            signal:state==='timeout'?'SIGTERM':null, exit_code:null, output:'diagnostic output',
            error:state==='timeout'?'Process timed out':'spawn missing ENOENT',
            errorCode:state==='error'?'ENOENT':null };
        const result = runtime.projectNestedToolResult('exec_command',{
            ok:false,tool:'exec_command',callId:'failed-process',durationMs:10,
            result:{ isError:true, details }
        });
        for (const key of ['status','process_status','running','signal','exit_code','error','errorCode','output']) {
            assert.equal(result[key],details[key]);
        }
    }
    runtime.shutdown();
});

test('MCP structuredContent process failures receive the same state projection', () => {
    const runtime = projectionRuntime();
    const details = { status:'error',process_status:'error',running:false,exit_code:null,
        signal:null,error:'permission denied',errorCode:'EACCES',output:'native diagnostic' };
    const fromDetails = runtime.projectNestedToolResult('exec_command',{isError:true,details});
    const fromStructured = runtime.projectNestedToolResult('exec_command',{isError:true,structuredContent:details});
    assert.deepEqual(fromStructured,fromDetails);
    runtime.shutdown();
});

test('permission and protocol failures without a process result still throw', () => {
    const runtime = projectionRuntime();
    assert.throws(()=>runtime.projectNestedToolResult('exec_command',{
        ok:false,tool:'exec_command',callId:'permission',error:'approval required',
        result:{isError:true,details:{status:'needs_approval'}}
    }),/approval required/);
    assert.throws(()=>runtime.projectNestedToolResult('exec_command',{
        ok:false,tool:'exec_command',callId:'protocol',error:'invalid arguments'
    }),/invalid arguments/);
    runtime.shutdown();
});

test('Schema declares nullable exit/signal and optional native fields without changing required keys', () => {
    const properties = CODEX_EXEC_RESULT_SCHEMA.properties;
    assert.deepEqual(properties.exit_code.type,['number','null']);
    assert.deepEqual(properties.signal.type,['string','null']);
    for (const key of ['status','process_status','running','error','errorCode']) assert.ok(properties[key]);
    assert.deepEqual(CODEX_EXEC_RESULT_SCHEMA.required,['wall_time_seconds','output']);
    const types = renderJsonSchemaToTypescript(CODEX_EXEC_RESULT_SCHEMA);
    assert.match(types,/exit_code\?: number \| null/);
    assert.match(types,/signal\?: string \| null/);
    assert.match(types,/process_status\?: string/);
});

test('exec worker, session alias and canonical model feedback retain native exit state', async () => {
    const calls = [];
    const spec = createExecToolSpec(['exec_command','write_stdin'].map(name=>({
        type:'function',name,description:name,parameters:{type:'object',properties:{}}
    })));
    const runtime = new AILISCodeModeRuntime({dispatchTool:async call=>{
        calls.push(call);
        const running = call.tool==='exec_command';
        return {ok:true,tool:call.tool,callId:'native-'+calls.length,
            result:{details:running
                ? {status:'completed',process_status:'running',running:true,exit_code:null,
                    signal:null,session_id:'native-session-id',output:'READY\n'}
                : {status:'completed',process_status:'exited',running:false,exit_code:null,
                    signal:'SIGTERM',output:'READY\n'}}};
    }});
    try {
        const result = await runtime.execute({profileId:spec.x_ailis_code_mode_profile,
            context:{sessionId:'exit-state-test'},
            input:'const first=await tools.exec_command({cmd:"controlled"}); text(first); const last=await tools.write_stdin({session_id:first.session_id,chars:""}); text(last);'});
        assert.equal(result.ok,true);
        assert.equal(calls[1].args.session_id,'native-session-id');
        const items = toolOutputToModelInputItems({tool:'exec',callId:'exit-state-call',callType:'custom',
            args:{input:'controlled-state'},response:{ok:true,status:'completed',result}},0,{toolOutputChars:24000});
        const outputs = responseItemsToWireItems(items).filter(item=>item.type.endsWith('_output'));
        const text = JSON.stringify(outputs);
        assert.match(text,/SIGTERM/);
        assert.match(text,/process_status/);
        assert.match(text,/exit_code/);
        assert.match(result.text,/"exit_code":null/);
        assert.match(result.text,/"running":false/);
        assert.match(result.text,/"signal":"SIGTERM"/);
    } finally { runtime.shutdown(); }
});

test('real owned SIGTERM child exposes its native state through the tool result', async () => {
    const runtime = new ComputerRuntime();
    const projection = projectionRuntime();
    const child = spawn(process.execPath,['-e',"process.stdout.write('READY\\n');setTimeout(()=>{},4000)"],
        {stdio:['pipe','pipe','pipe'],windowsHide:true});
    const record = runtime.createSessionRecord({command:'exit-state-child',workdir:process.cwd(),child,timeoutMs:0});
    try {
        const deadline = Date.now()+2000;
        while(!record.stdout.includes('READY') && Date.now()<deadline) await new Promise(resolve=>setTimeout(resolve,10));
        assert.ok(record.stdout.includes('READY'));
        const closed = once(child,'close');
        child.kill('SIGTERM');
        await closed;
        const result = runtime.buildUnifiedExecDetails(record);
        const feedback = projection.projectNestedToolResult('write_stdin',{details:result});
        assert.equal(result.signal,'SIGTERM');
        assert.equal(feedback.signal,result.signal);
        assert.equal(feedback.exit_code,null);
        assert.equal(feedback.running,false);
        assert.equal(feedback.process_status,result.process_status);
        assert.equal(feedback.status,result.status);
        assert.equal(feedback.output,result.output);
    } finally {
        if(child.exitCode===null && child.signalCode===null) child.kill();
        await runtime.shutdown();
        projection.shutdown();
    }
});

for (const fixture of [
    {name:'zero exit', code:'process.stdout.write("ok\\n");process.exitCode=0', exit:0, state:'exited'},
    {name:'nonzero exit', code:'process.stderr.write("failure\\n");process.exitCode=7', exit:7, state:'exited'},
    {name:'spawn failure', missing:true, exit:null, state:'error'},
    {name:'explicit timeout', code:'setTimeout(()=>{},4000)', timeoutMs:100, exit:null, state:'timeout'}
]) {
    test(`real owned ${fixture.name} retains complete native state`, async () => {
        const runtime = new ComputerRuntime();
        const projection = projectionRuntime();
        const executable = fixture.missing
            ? `${process.execPath}.missing-exit-state-test` : process.execPath;
        const child = spawn(executable, fixture.missing?[]:['-e',fixture.code],
            {stdio:['pipe','pipe','pipe'],windowsHide:true});
        const record = runtime.createSessionRecord({command:'exit-state-fixture',workdir:process.cwd(),
            child,timeoutMs:fixture.timeoutMs||0});
        // close follows both spawn errors and process exits; the runtime observes error itself.
        const closed = new Promise(resolve=>child.once('close',resolve));
        try {
            await closed;
            const details = runtime.buildUnifiedExecDetails(record);
            const result = projection.projectNestedToolResult('exec_command',{
                ok:details.status!=='error',tool:'exec_command',callId:'real-fixture',
                result:{isError:details.status==='error',details}
            });
            assert.equal(details.process_status,fixture.state);
            assert.equal(result.exit_code,fixture.exit);
            assert.equal(result.running,false);
            for (const key of ['status','process_status','signal','output','chunk_id',
                'wall_time_seconds','original_token_count']) {
                assert.equal(result[key],details[key],key);
            }
            if (fixture.missing) {
                assert.equal(result.errorCode,'ENOENT');
                assert.equal(result.error,details.error);
            }
            if (fixture.timeoutMs) {
                assert.equal(result.signal,'SIGTERM');
                assert.equal(result.error,'Process timed out');
            }
        } finally {
            if(child.exitCode===null && child.signalCode===null && record.status==='running') child.kill();
            await runtime.shutdown();
            projection.shutdown();
        }
    });
}
