import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { readCurationPage } = require('../electron/ailis-curation-reader.cjs');
const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');
const { AILISUserProfileCurator } = require('../electron/ailis-user-profile-curator.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const row = (id, type = 'chat.llm_turn', content = '中文偏好') => JSON.stringify({
    id, iso: '2026-09-16T08:00:00.000Z', type, source: 'test', sessionId: 'main',
    payload: { requestPayload: { memoryUserMessage: content } }
}) + '\n';
async function fixture(t) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curation-page-'));
    t.after(() => fs.rm(dir, { recursive: true, force: true }));
    return dir;
}

test('large diagnostic lines resume mid-record without retaining their payload; event loop stays responsive', async t => {
    const dir = await fixture(t);
    const file = path.join(dir, '2026-09-16.jsonl');
    await fs.writeFile(file, row('trace', 'agent.transcript.item', 'x'.repeat(10 * 1024 * 1024)) + row('user'));
    const original = await fs.stat(file);
    let cursor, more = true, pages = 0, ticks = 0;
    const ids = [];
    const timer = setInterval(() => ticks++, 1);
    try {
        while (more) {
            const page = await readCurationPage(dir, { scanCursor: cursor, maxScanBytes: 512 * 1024 });
            assert.ok(page.bytesRead <= 512 * 1024);
            assert.ok(JSON.stringify(page).length < 10000);
            ids.push(...page.entries.map(e => e.id));
            cursor = page.nextCursor; more = page.hasMore; pages++;
            assert.ok(pages < 30);
        }
    } finally { clearInterval(timer); }
    assert.deepEqual(ids, ['trace', 'user']);
    assert.ok(pages > 15);
    assert.ok(ticks > 0);
    assert.equal((await fs.stat(file)).size, original.size);
    await fs.appendFile(file, row('new'));
    const next = await readCurationPage(dir, { scanCursor: cursor });
    assert.deepEqual(next.entries.map(e => e.id), ['new']);
});

test('physical page cursors preserve equal timestamps and UTF-8 and skip older day files', async t => {
    const dir = await fixture(t);
    await fs.writeFile(path.join(dir, '2026-09-15.jsonl'), 'not valid JSON\n');
    await fs.writeFile(path.join(dir, '2026-09-16.jsonl'), row('a') + row('b') + row('c'));
    const first = await readCurationPage(dir, { since: '2026-09-16T08:00:00.000Z', afterId: 'a', limit: 1 });
    assert.equal(first.entries[0].id, 'b');
    const second = await readCurationPage(dir, { scanCursor: first.nextCursor, limit: 1 });
    assert.equal(second.entries[0].id, 'c');
    assert.equal(second.entries[0].payload.requestPayload.memoryUserMessage, '中文偏好');
    assert.equal(second.hasMore, false);
});

test('oversize user records and malformed complete records fail explicitly, never silently skip', async t => {
    const dir = await fixture(t);
    const file = path.join(dir, '2026-09-16.jsonl');
    await fs.writeFile(file, row('large', 'chat.llm_turn', 'x'.repeat(300000)));
    await assert.rejects(readCurationPage(dir), /curation_record_too_large/);
    await fs.writeFile(file, '{broken}\n');
    await assert.rejects(readCurationPage(dir), /curation_invalid_json/);
});

test('migration preserves the old time cursor across pages of earlier same-day records', async t => {
    const dir = await fixture(t);
    const earlier = row('old', 'agent.transcript.item', 'x'.repeat(800000)).replace('08:00:00', '07:00:00');
    await fs.writeFile(path.join(dir, '2026-09-16.jsonl'), earlier + row('anchor') + row('next'));
    let cursor, more = true; const ids = [];
    while (more) {
        const page = await readCurationPage(dir, {scanCursor:cursor, since:'2026-09-16T08:00:00.000Z', afterId:'anchor', maxScanBytes:512*1024});
        ids.push(...page.entries.map(e=>e.id)); cursor=page.nextCursor; more=page.hasMore;
    }
    assert.deepEqual(ids,['next']);
});

test('partial writes are retried from line start and truncated archives reject stale offsets', async t => {
    const dir = await fixture(t);
    const file = path.join(dir, '2026-09-16.jsonl');
    const text = row('b');
    await fs.writeFile(file, row('a') + text.slice(0, 30));
    const first = await readCurationPage(dir);
    assert.deepEqual(first.entries.map(e => e.id), ['a']);
    assert.equal(first.awaitingAppend, true);
    await fs.appendFile(file, text.slice(30));
    const next = await readCurationPage(dir, { scanCursor: first.nextCursor });
    assert.deepEqual(next.entries.map(e => e.id), ['b']);
    await fs.truncate(file, 0);
    await assert.rejects(readCurationPage(dir, { scanCursor: next.nextCursor }), /curation_cursor_invalid/);
});

test('successful batch checkpoints survive next-batch LLM failure', async t => {
    const dir = await fixture(t);
    const ledger = new AILISRawMemoryLedger({rootDir: path.join(dir, 'raw')});
    ledger.recordChatTurn({requestPayload: {memoryUserMessage:'first'}});
    ledger.recordChatTurn({requestPayload: {memoryUserMessage:'second'}});
    let calls = 0;
    const curator = new AILISUserProfileCurator({rootDir:path.join(dir,'profile'), rawMemoryLedger:ledger,
        llmClient:async () => ++calls === 1 ? {ok:true,content:JSON.stringify({profileUpdates:[],relationshipUpdates:[],rejectedSignals:[]})} : {ok:false,error:'test failure'}});
    const result = await curator.runDailyCuration({force:true,evidenceLimit:1,maxBatches:2});
    assert.equal(result.ok,false);
    const state = JSON.parse(await fs.readFile(curator.statePath,'utf8'));
    assert.ok(state.scanCursor.offset > 0);
    const remaining = await ledger.readCurationPage({scanCursor:state.scanCursor});
    assert.equal(remaining.entries.length,1);
    assert.equal(remaining.entries[0].payload.requestPayload.memoryUserMessage,'second');
    await assert.rejects(fs.access(curator.operationLockPath));
});

test('scheduler queues a single continuation for a bounded page and releases its guard on read failure', async () => {
    const queued = [];
    const events = [];
    const gateway = {
        profileCurationEnabled:true, userProfileCurator:{}, profileCurationRunning:false,
        getUserProfileCurationState:async()=>({userProfile:{items:[{}]}}),
        getRawMemoryStatus:()=>({entryCount:10}),
        curateUserProfile:async()=>({ok:true,status:'partial_completed'}),
        scheduleProfileCurationSoon:trigger=>queued.push(trigger),
        emitGatewayEvent:(type,payload)=>events.push({type,payload})
    };
    await AILISGateway.prototype.runScheduledProfileCuration.call(gateway);
    assert.equal(queued.length,1);
    assert.equal(gateway.profileCurationRunning,false);
    gateway.curateUserProfile=async()=>{throw Error('curation_invalid_json')};
    const failed=await AILISGateway.prototype.runScheduledProfileCuration.call(gateway);
    assert.equal(failed.ok,false);
    assert.equal(queued.length,1);
    assert.equal(gateway.profileCurationRunning,false);
    assert.equal(events.at(-1).type,'memory.profile_curation.error');
});
