import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const settings = { provider:'openai-compatible', baseUrl:'https://provider.invalid/v1',
    apiKey:'fixture-api-secret', model:'test-model', timeoutMs:5000 };
const messages = [{role:'user',content:'PRIVATE_PROMPT_MUST_NOT_ENTER_TRANSPORT_LOG'}];
const reply = () => Response.json({choices:[{message:{role:'assistant',content:'OK'},finish_reason:'stop'}]});
const reset = () => Object.assign(new TypeError('fetch failed'), {
    cause: Object.assign(new Error('socket hang up'), {code:'ECONNRESET'}) });
const eventsFor = (events, extra = {}) => ({messages,onProviderRequestEvent:e=>events.push(e),...extra});

test('connection reset preserves cause chain, request id and awaiting-headers phase', async t => {
    let calls=0; const events=[];
    t.mock.method(globalThis,'fetch',async()=>{calls++;throw reset();});
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    assert.equal(calls,1,'no retry introduced');
    assert.equal(result.code,'transient_network_error');
    assert.equal(result.details.causeCode,'ECONNRESET');
    assert.equal(result.details.causeMessage,'socket hang up');
    assert.equal(result.details.phase,'awaiting_headers');
    assert.equal(result.details.endpointKind,'chat_completions');
    assert.deepEqual(events.map(e=>e.event),['request_started','failed']);
    assert.equal(events[0].requestId,result.details.requestId);
    assert.ok(result.details.elapsedMs>=0);
});

test('cloud session failure is identified separately and stops before completion POST', async t => {
    const events=[],urls=[];
    t.mock.method(globalThis,'fetch',async url=>{urls.push(String(url));throw reset();});
    const result=await callDesktopLlmProvider({...settings,provider:'ailis-cloud',baseUrl:'https://session-fail.invalid/api/llm/v1'},eventsFor(events));
    assert.deepEqual(urls,['https://session-fail.invalid/api/llm/session']);
    assert.equal(result.details.endpointKind,'cloud_session');
    assert.equal(result.details.causeCode,'ECONNRESET');
});

test('session and completion events have separate IDs; diagnostics leave wire body and cache unchanged', async t => {
    const events=[],bodies=[]; let sessionCount=0;
    t.mock.method(globalThis,'fetch',async(url,options)=>{
        if(options.method==='GET'){sessionCount++;return Response.json({token:'fixture-cloud-secret',expiresAt:'2099-01-01T00:00:00Z'});}
        bodies.push(options.body); return reply();
    });
    const cfg={...settings,provider:'ailis-cloud',baseUrl:'https://session-ok.invalid/api/llm/v1'};
    assert.equal((await callDesktopLlmProvider(cfg,eventsFor(events))).ok,true);
    assert.equal((await callDesktopLlmProvider(cfg,{messages})).ok,true);
    assert.equal(sessionCount,1);
    assert.equal(bodies[0],bodies[1]);
    assert.deepEqual(events.filter(e=>e.event==='request_started').map(e=>e.endpointKind),['cloud_session','chat_completions']);
    assert.equal(new Set(events.map(e=>e.requestId)).size,2);
    assert.doesNotMatch(JSON.stringify(events),/fixture-cloud-secret|fixture-api-secret|PRIVATE_PROMPT/);
});

test('HTTP errors keep status and safe request id but never log the response body', async t => {
    const events=[];
    t.mock.method(globalThis,'fetch',async()=>new Response('PRIVATE_RESPONSE_BODY',{
        status:503,headers:{'x-request-id':'upstream-request-123'}}));
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    assert.equal(result.status,503);
    assert.equal(result.details.httpStatus,503);
    assert.equal(result.details.serverRequestId,'upstream-request-123');
    assert.equal(result.details.code,'http_error');
    assert.doesNotMatch(JSON.stringify(events),/PRIVATE_RESPONSE_BODY/);
});

test('failure after headers distinguishes response-body read from connection setup', async t => {
    const events=[];
    t.mock.method(globalThis,'fetch',async()=>({ok:true,status:200,headers:new Headers(),json:async()=>{throw reset();}}));
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    assert.equal(result.details.phase,'response_body');
    assert.equal(result.details.httpStatus,200);
    assert.equal(result.details.causeCode,'ECONNRESET');
    assert.deepEqual(events.map(e=>e.event),['request_started','response_headers','body_read_started','failed']);
});

test('stream interruption records first chunk once, bytes and error cause', async t => {
    const events=[];let reads=0;
    const chunk=new TextEncoder().encode('data: {"choices":[{"delta":{"content":"OK"}}]}\n\n');
    t.mock.method(globalThis,'fetch',async()=>({ok:true,status:200,headers:new Headers({'content-type':'text/event-stream'}),
        body:{getReader:()=>({read:async()=>{if(reads++===0)return {done:false,value:chunk};throw reset();}})}}));
    const result=await callDesktopLlmProvider(settings,eventsFor(events,{onTextDelta:()=>{}}));
    assert.equal(result.ok,false);
    assert.equal(result.details.phase,'response_body');
    assert.equal(result.details.receivedBytes,chunk.length);
    assert.equal(events.filter(e=>e.event==='first_body_chunk').length,1);
});

test('normal SSE and JSON-compatible streams record completion without per-token logs', async t => {
    const events=[];let n=0;
    t.mock.method(globalThis,'fetch',async()=>n++===0?new Response(
        'data: {"choices":[{"delta":{"content":"OK"}}]}\n\ndata: [DONE]\n\n',
        {headers:{'content-type':'text/event-stream'}}):reply());
    for(let i=0;i<2;i++)assert.equal((await callDesktopLlmProvider(settings,eventsFor(events,{onTextDelta:()=>{}}))).ok,true);
    assert.equal(events.filter(e=>e.event==='request_completed').length,2);
    assert.equal(events.filter(e=>e.event==='first_body_chunk').length,1);
    assert.ok(events.length<=10);
});

test('caller cancellation remains aborted and records external abort source', async t => {
    const controller=new AbortController(),events=[];
    t.mock.method(globalThis,'fetch',async(_url,{signal})=>new Promise((_resolve,reject)=>{
        signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true});
        controller.abort();
    }));
    const result=await callDesktopLlmProvider(settings,eventsFor(events,{abortSignal:controller.signal}));
    assert.equal(result.code,'aborted');
    assert.equal(result.details.abortSource,'external');
});

test('deadline timeout remains timeout and records configured budget', async t => {
    const realSetTimeout=globalThis.setTimeout,events=[];
    t.mock.method(globalThis,'setTimeout',(fn,ms,...args)=>realSetTimeout(fn,ms===5000?5:ms,...args));
    t.mock.method(globalThis,'fetch',async(_url,{signal})=>new Promise((_resolve,reject)=>{
        signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true});
    }));
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    assert.equal(result.code,'timeout');
    assert.equal(result.details.timeoutMs,5000);
    assert.equal(result.details.abortSource,'deadline');
});

test('diagnostics redact credentials and URL components before truncation', async t => {
    const events=[];
    t.mock.method(globalThis,'fetch',async()=>{throw Object.assign(new TypeError('fetch failed fixture-api-secret'),{
        cause:Object.assign(new Error('fixture-api-secret https://user:pass@x.invalid/private?key=abc Bearer tok-value password=hidden '+ 'X'.repeat(1000)),{code:'ECONNRESET'})});});
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    const serialized=JSON.stringify({events,details:result.details});
    assert.doesNotMatch(serialized,/fixture-api-secret|user:pass|private\?key|tok-value|hidden/);
    assert.ok(result.details.causeMessage.length<=320);
    assert.match(serialized,/REDACTED/);
});

test('invalid JSON response details do not leak quoted body fragments', async t => {
    const events=[];
    t.mock.method(globalThis,'fetch',async()=>new Response('PRIVATE_RESPONSE_BODY'));
    const result=await callDesktopLlmProvider(settings,eventsFor(events));
    assert.equal(result.ok,false);
    assert.equal(result.details.message,'Invalid JSON response');
    assert.doesNotMatch(JSON.stringify({events,details:result.details}),/PRIVATE_RESPONSE_BODY/);
});

test('throwing audit callback cannot fail an otherwise successful model response', async t => {
    t.mock.method(globalThis,'fetch',async()=>reply());
    const result=await callDesktopLlmProvider(settings,{messages,onProviderRequestEvent:async()=>{throw Error('log unavailable');}});
    assert.equal(result.ok,true);
    assert.equal(result.content,'OK');
});

test('concurrent requests have isolated diagnostic callbacks', async t => {
    const a=[],b=[];
    t.mock.method(globalThis,'fetch',async()=>{await Promise.resolve();return reply();});
    await Promise.all([callDesktopLlmProvider(settings,eventsFor(a)),callDesktopLlmProvider(settings,eventsFor(b))]);
    assert.equal(a.length,4);assert.equal(b.length,4);
    assert.equal(new Set(a.map(e=>e.requestId)).size,1);
    assert.equal(new Set(b.map(e=>e.requestId)).size,1);
    assert.notEqual(a[0].requestId,b[0].requestId);
});

test('real Agent Loop persists request phases and error details without adding diagnostics to context', {timeout:20000}, async t => {
    const root=await fs.mkdtemp(path.join(os.tmpdir(),'ailis-transport-test-'));
    const gateway=new AILISGateway({port:0,workspaceRoot:root,projectRoot:path.resolve('.'),auditDir:path.join(root,'.audit'),
        emberHarnessEnabled:false,profileCurationEnabled:false});
    t.after(async()=>{await gateway.stop();
        assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-transport-test-'));
        await fs.rm(root,{recursive:true,force:true});});
    let callCount=0;
    t.mock.method(globalThis,'fetch',async()=>{callCount++;throw reset();});
    const sessionId='transport-regression';
    const result=await gateway.runAgent({message:'Say hello.',sessionId,memoryPolicy:'disabled',context:{
        agentRole:'unified_agent',agentLoop:'llm',directToolExecutor:true,maxSteps:1,
        permissionProfile:'danger-full-access',approvalPolicy:'auto',confirmationPolicy:'auto',
        llmSettings:settings}});
    assert.equal(result.ok,false);
    assert.equal(callCount,1);
    const transcript=await gateway.runtime.readTranscript(result.runId,2000);
    const events=transcript.items.filter(e=>e.type==='agent.llm_request');
    assert.deepEqual(events.map(e=>e.payload.diagnostic.event),['request_started','failed']);
    const call=transcript.items.find(e=>e.type==='agent.llm_call');
    assert.equal(call.payload.details.causeCode,'ECONNRESET');
    assert.equal(call.payload.details.requestId,events[0].payload.diagnostic.requestId);
    assert.equal(call.payload.callId,events[0].payload.callId);
    const checkpoint=gateway.sessionContextStore.getCheckpoint(sessionId);
    assert.doesNotMatch(JSON.stringify(checkpoint),/agent\.llm_request|awaiting_headers|causeCode/);
});
