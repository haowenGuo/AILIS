import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import budget from '../electron/ailis-runtime-budget.cjs';
import context from '../electron/ailis-context-manager.cjs';
import gatewayRuntime from '../electron/ailis-gateway.cjs';

const {ContextManager}=context;
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const message=(role,text)=>({type:'message',role,content:[{type:role==='assistant'?'output_text':'input_text',text}]});
const options={model:'gpt-6-luna',provider:'codex-model-bridge',reasoningEffort:'xhigh',
    instructions:'Keep the complete history.',staticPrefix:'Keep the complete history.',
    toolSchemas:[{type:'function',name:'inspect',parameters:{type:'object',properties:{}}}],
    inputModalities:['text','image'],
    budgetConfig:{effectiveInputLimitTokens:267904,softTokenLimit:220000,hardTokenLimit:244800,stopTokenLimit:258400}};

function anchoredManager({cipherBytes=1600000,inputTokens=50000,outputTokens=2000}={}){
    const manager=new ContextManager({items:[message('user','Inspect without changing files.')],toolOutputChars:0});
    const request=manager.forPromptPackage(options);
    const input=manager.rawItems();
    const output=[{type:'reasoning',encrypted_content:'x'.repeat(cipherBytes),summary:[]},
        {type:'function_call',call_id:'inspect-call',name:'inspect',arguments:'{}'}];
    manager.recordItems(output);
    manager.setTokenInfo({promptTokens:inputTokens,completionTokens:outputTokens,totalTokens:inputTokens+outputTokens},
        {inputItems:input,outputItems:output,contextHash:request.budgetReport.measurement.contextHash});
    return {manager,input,output};
}

test('ciphertext has a typed estimate but text containing ciphertext is never discounted',()=>{
    const encrypted='a'.repeat(10000);
    for(const type of ['reasoning','compaction','context_compaction']){
        const item={type,encrypted_content:encrypted};
        const raw=JSON.stringify(item),wrapperBytes=Buffer.byteLength(raw)-encrypted.length;
        const payloadEstimate=Math.floor(encrypted.length*3/4)-650;
        assert.equal(budget.approxTokenCount(item),Math.ceil((wrapperBytes+payloadEstimate)/4));
        assert.equal(JSON.stringify(item),raw);
        assert.equal(budget.approxTokenCount(raw),Math.ceil(Buffer.byteLength(raw)/4));
    }
    for(const value of [{encrypted_content:encrypted},{type:'input_text',text:encrypted},
        {type:'function_call',provider_metadata:{reasoning_content:encrypted}}]){
        assert.equal(budget.approxTokenCount(value),Math.ceil(Buffer.byteLength(JSON.stringify(value))/4));
    }
});

test('budget counts canonical content once and keeps bookkeeping only as diagnostics',()=>{
    const manager=new ContextManager({items:[message('user','Work on the task.')]});
    const report=manager.contextBudgetReport({...options,goal:'not additional input '.repeat(50000),
        taskState:{trace:'not additional input '.repeat(50000)}});
    const counted=report.parts.filter(part=>part.counted);
    assert.deepEqual(counted.map(part=>part.name),['instructions','recentResponseItems','toolSchemas']);
    assert.equal(report.estimatedPromptTokens,counted.reduce((total,part)=>total+part.approxTokens,0));
    assert.equal(report.shouldCompact,false);
    assert.equal(budget.buildContextBudgetReport({instructions:'same',staticPrefix:'same'}).estimatedPromptTokens,
        budget.approxTokenCount('same'));
    assert.deepEqual(report.thresholdTokens,{soft:220000,hard:244800,stop:258400});
});

test('valid usage overrides inflated ciphertext estimates and counts appended feedback without mutation',()=>{
    const {manager}=anchoredManager();
    manager.recordItems([{type:'function_call_output',call_id:'inspect-call',output:'Evidence is intact.'}]);
    const before=manager.rawItems(),canonicalHash=hash(before);
    const pkg=manager.forPromptPackage(options),report=pkg.budgetReport;
    const feedbackTokens=budget.approxTokenCount(before.at(-1));
    assert.ok(report.estimatedPromptTokens>244800);
    assert.equal(report.measurement.mode,'provider_usage_anchor');
    assert.equal(report.measurement.appendedItems,1);
    assert.equal(report.measurement.appendedEstimate,feedbackTokens);
    assert.equal(report.effectivePromptTokens,52000+feedbackTokens+8192);
    assert.equal(report.shouldCompact,false);
    assert.equal(hash(manager.rawItems()),canonicalHash);
    assert.equal(hash(pkg.recentResponseItems),canonicalHash);
});

test('new tool output and new user messages can still reach the real hard limit',()=>{
    const {manager}=anchoredManager({cipherBytes:10000,inputTokens:230000});
    manager.recordItems([{type:'function_call_output',call_id:'inspect-call',output:'evidence '.repeat(30000)},
        message('user','Keep the original constraints.')]);
    const report=manager.forPromptPackage(options).budgetReport;
    assert.equal(report.measurement.mode,'provider_usage_anchor');
    assert.equal(report.measurement.appendedItems,2);
    assert.ok(report.effectivePromptTokens>244800);
    assert.equal(report.shouldCompact,true);
});

test('measurement reserve scales down for explicitly small context windows',()=>{
    const {manager}=anchoredManager({cipherBytes:1000,inputTokens:100,outputTokens:10});
    manager.recordItems([{type:'function_call_output',call_id:'inspect-call',output:'complete'}]);
    const report=manager.forPromptPackage({...options,budgetConfig:{effectiveInputLimitTokens:1000,
        softTokenLimit:600,hardTokenLimit:800,stopTokenLimit:950}}).budgetReport;
    assert.equal(report.measurement.mode,'provider_usage_anchor');
    assert.equal(report.measurement.reserve,50);
    assert.equal(report.shouldCompact,false);
});

test('usage anchor survives clone and checkpoint, but history replacement resets old measurements',()=>{
    const {manager}=anchoredManager({cipherBytes:10000});
    const checkpoint=manager.toCheckpoint();
    assert.ok(checkpoint.token_usage_anchor);
    for(const restored of [manager.clone(),ContextManager.fromCheckpoint(checkpoint)]){
        restored.recordItems([{type:'function_call_output',call_id:'inspect-call',output:'complete'}]);
        assert.equal(restored.forPromptPackage(options).budgetReport.measurement.mode,'provider_usage_anchor');
        restored.replace([message('developer','Small replacement memory.')]);
        assert.equal(restored.tokenInfo(),null);
        assert.equal(restored.toCheckpoint().token_usage_anchor,undefined);
        assert.equal(restored.forPromptPackage(options).budgetReport.measurement.mode,'structured_estimate');
    }
    const legacy=ContextManager.fromCheckpoint({items:[message('user','Legacy history.')],token_info:{promptTokens:1000}});
    assert.equal(legacy.forPromptPackage(options).budgetReport.measurement.fallbackReason,'no_usage_anchor');
});

test('provider, model, effort, instructions, and schema changes invalidate the usage anchor',()=>{
    for(const change of [{provider:'openai-responses'},{model:'different-model'},{reasoningEffort:'medium'},
        {instructions:'Changed instructions.'},{toolSchemas:[{name:'other'}]}]){
        const {manager}=anchoredManager({cipherBytes:10000,inputTokens:250000});
        manager.recordItems([{type:'function_call_output',call_id:'inspect-call',output:'complete'}]);
        const report=manager.forPromptPackage({...options,...change}).budgetReport;
        assert.equal(report.measurement.mode,'structured_estimate');
        assert.equal(report.measurement.fallbackReason,'request_context_changed');
        assert.equal(report.measurement.providerUsageApplicable,false);
        assert.ok(report.effectivePromptTokens<250000,'stale previous-model usage is not an authoritative floor');
    }
});

test('rewritten, truncated, or malformed anchor history is not treated as an append',()=>{
    for(const mutate of [manager=>{manager.items[0].content[0].text='rewritten';},
        manager=>{manager.items.pop();},manager=>{manager.token_usage_anchor.itemCount=-1;}]){
        const {manager}=anchoredManager({cipherBytes:10000});
        mutate(manager);
        const report=manager.contextBudgetReport(options);
        assert.equal(report.measurement.mode,'structured_estimate');
        assert.equal(report.measurement.fallbackReason,'history_prefix_changed');
    }
});

test('missing usage or request/output mismatch cannot create a usage anchor',()=>{
    for(const kind of ['missing-output-tokens','different-input','different-output','no-output']){
        const {manager,input,output}=anchoredManager({cipherBytes:10000});
        const info={promptTokens:1000,completionTokens:100};
        const measurement={inputItems:input,outputItems:output,
            contextHash:manager.contextBudgetReport(options).measurement.contextHash};
        if(kind==='missing-output-tokens')delete info.completionTokens;
        if(kind==='different-input')measurement.inputItems=[message('user','Different wire input.')];
        if(kind==='different-output')measurement.outputItems=[message('assistant','Different response.')];
        if(kind==='no-output')measurement.outputItems=[];
        manager.setTokenInfo(info,measurement);
        assert.equal(manager.toCheckpoint().token_usage_anchor,undefined);
        assert.equal(manager.contextBudgetReport(options).measurement.mode,'structured_estimate');
    }
});

test('new inline images use their visual estimate in a usage-anchored continuation',()=>{
    const {manager}=anchoredManager({cipherBytes:10000});
    const image={type:'input_image',image_url:'data:image/png;base64,'+'A'.repeat(1000000),detail:'high'};
    manager.recordItems([{type:'function_call_output',call_id:'inspect-call',
        output:{body:{kind:'content_items',value:[image]},success:true}}]);
    const report=manager.forPromptPackage(options).budgetReport;
    assert.equal(report.measurement.mode,'provider_usage_anchor');
    assert.ok(report.measurement.appendedEstimate>1800);
    assert.ok(report.measurement.appendedEstimate<2500);
    assert.equal(report.shouldCompact,false);
});

test('Gateway two-call legacy Responses loop keeps the existing safe fallback when native items are unavailable', {timeout:20000}, async t=>{
    const root=await fs.mkdtemp(path.join(os.tmpdir(),'ailis-token-accounting-'));
    const gateway=new gatewayRuntime.AILISGateway({port:0,workspaceRoot:root,projectRoot:path.resolve('.'),
        auditDir:path.join(root,'.audit'),emberHarnessEnabled:false,profileCurationEnabled:false});
    const requests=[];
    const server=http.createServer(async(req,res)=>{
        let data='';for await(const chunk of req)data+=chunk;
        const body=JSON.parse(data);requests.push(body);
        res.setHeader('content-type','application/json');
        const compact=JSON.stringify(body.input.at(-1)).includes('<ailis_semantic_compaction_request>');
        const output=requests.length===1?[
            {type:'function_call',call_id:'measured-tool',name:'exec',arguments:JSON.stringify({input:'text("measured-feedback");'})}
        ]:[message('assistant',compact?'Unexpected compaction.':'Measurement verified.')];
        res.end(JSON.stringify({id:`measurement-${requests.length}`,output,
            usage:{input_tokens:50000,output_tokens:2000,total_tokens:52000}}));
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    t.after(async()=>{
        await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
        await gateway.stop();
        assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-token-accounting-'));
        await fs.rm(root,{recursive:true,force:true});
    });
    const sessionId='token-accounting-integration';
    const result=await gateway.runAgent({message:'Print measured-feedback, then finish.',sessionId,
        context:{agentRole:'unified_agent',agentLoop:'llm',directToolExecutor:true,maxSteps:4,
            permissionProfile:'danger-full-access',approvalPolicy:'auto',confirmationPolicy:'auto',
            executeExternal:true,allowOutsideWorkspace:true,allowComputerWideAccess:true,allowSystemMutation:false,
            contextSoftTokenLimit:220000,contextHardTokenLimit:244800,contextStopTokenLimit:258400,
            llmSettings:{provider:'openai-responses',baseUrl:`http://127.0.0.1:${server.address().port}/v1`,
                apiKey:'local-test-only',model:'gpt-6-luna',reasoningEffort:'xhigh',timeoutMs:10000}}});
    assert.equal(result.status,'completed',result.displayText);
    assert.equal(requests.length,2,'no hidden summary request is allowed');
    assert.deepEqual(requests[1].input.slice(0,requests[0].input.length),requests[0].input);
    for(const key of ['model','instructions','tools','reasoning','parallel_tool_calls','prompt_cache_key'])
        assert.deepEqual(requests[1][key],requests[0][key]);
    const transcript=await gateway.runtime.readTranscript(result.runId,2000);
    const snapshots=transcript.items.filter(item=>item.type==='agent.context_snapshot');
    assert.equal(snapshots.length,2);
    const report=snapshots[1].payload.context_package.budgetReport;
    assert.equal(report.measurement.mode,'structured_estimate');
    assert.equal(report.shouldCompact,false);
    assert.equal(transcript.items.some(item=>item.type==='agent.context_compaction'),false);
    assert.equal(gateway.sessionContextStore.getCheckpoint(sessionId).token_usage_anchor,undefined);
});
