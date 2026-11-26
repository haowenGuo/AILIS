'use strict';

// Offline benchmark: real Agent transports and files, synthetic local model.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { createHash, randomUUID } = require('node:crypto');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');

const root = path.resolve(__dirname, '../../..');
const workerCount = 3;
const perWorkerSeries = process.env.AILIS_AB_SLOT_SERIES?.split(',').map(Number);
const totalSlotSeries = process.env.AILIS_AB_TOTAL_SLOT_SERIES?.split(',').map(Number);
const profile = process.env.AILIS_AB_PROFILE === '1';
assert.ok(!(perWorkerSeries && totalSlotSeries), 'Choose per-worker or total slots, not both');
const slotSeries = totalSlotSeries || perWorkerSeries?.map((slots) => slots * workerCount);
const clientCount = Number(process.env.AILIS_AB_CLIENTS || 24);
if (slotSeries) {
    assert.ok(slotSeries.every((slots) => Number.isInteger(slots) && slots >= workerCount && slots <= 64 * workerCount), 'Invalid total slots');
    assert.ok(Number.isInteger(clientCount) && clientCount >= 6 && clientCount <= 64 * workerCount, 'Invalid client count');
}
const [artifactsPath, caddy, redis] = process.argv.slice(2);
if (!artifactsPath || !caddy || (!redis && !slotSeries)) throw new Error('Usage: node concurrency-routing-ab.cjs <artifact-root> <caddy.exe> [redis-server.exe]');
const artifacts = path.resolve(artifactsPath);
const prod = path.join(artifacts, 'production-source');
const node = process.execPath;
const token = randomUUID();
const model = 'ailis-local-loadtest-fixture';
const data = new Map();
const owners = new Map();
const receipt = [];
const observer = path.join(__dirname, 'fixed-shard-fixture.cjs');
const sessionId = 'same-conversation';
const bootEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    !/^(AILIS_|NODE_OPTIONS$|HTTP_PROXY$|HTTPS_PROXY$|ALL_PROXY$)/i.test(key)));
const url = (port) => `http://127.0.0.1:${port}`;
const num = (n) => n == null ? null : +n.toFixed(2);
const p95 = (values) => num([...values].sort((a, b) => a - b)[Math.ceil(values.length * .95) - 1]);
const shard = (tenant) => createHash('sha256').update(tenant).digest().readUInt32BE() % workerCount;
const distribute = (count, index) => Math.floor(count / workerCount) + (index < count % workerCount ? 1 : 0);

async function serve(server) {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    return server;
}
async function port() {
    const server = await serve(http.createServer());
    const chosen = server.address().port;
    await new Promise((resolve) => server.close(resolve));
    return chosen;
}
async function ready(check, name) {
    for (let tries = 0; tries < 100; tries++) {
        if (await check().catch(() => false)) return;
        await delay(100);
    }
    throw new Error(`${name} did not become ready`);
}
function start(children, file, args, env) {
    const stdio = ['ignore', 'pipe', 'pipe'];
    if (args.includes(observer)) stdio.push('ipc');
    const child = spawn(file, args, { cwd: root, env, windowsHide: true, stdio });
    child.on('message', ({ marker, phase, at, running, pid }) => {
        const trace = data.get(marker);
        if (!trace) return;
        if (phase === 'admitted') trace.admitted ??= at - performance.timeOrigin;
        if (phase === 'firstRead' || phase === 'firstWrite') trace[phase] ??= at - performance.timeOrigin;
        if (phase === 'dispatch') {
            trace.dispatch ??= at - performance.timeOrigin;
            Object.assign(trace, { running, pid });
        }
    });
    child.log = '';
    child.on('error', (error) => { child.log += String(error); });
    for (const stream of [child.stdout, child.stderr]) stream.on('data', (chunk) => {
        child.log = (child.log + chunk.toString()).slice(-12000);
    });
    children.push(child);
    return child;
}
const status = (target) => fetch(`${target}/health`, { signal: AbortSignal.timeout(1500) }).then((res) => res.json());

async function profileWorkers(children, mode) {
    if (!profile) return;
    await Promise.all(children.filter((child) => child.connected).map(async (child) => {
        const signal = AbortSignal.timeout(10000);
        const wait = once(child, 'message', { signal });
        child.send({ profile: mode });
        // All measured requests have drained before stopping the profile.
        let [ack] = await wait;
        while (ack.profileAck !== mode) [ack] = await once(child, 'message', { signal });
        assert.ok(!ack.profileError, ack.profileError);
    }));
}

async function stop(children) {
    await Promise.all(children.reverse().map(async (child) => {
        if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
        const exited = once(child, 'exit');
        child.kill();
        await Promise.race([exited, delay(4000, null, { ref: false })]);
    }));
}

async function request(target, tenant, route, payload, onFirst) {
    const started = performance.now();
    const res = await fetch(`${target}${route}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/event-stream',
            'x-ailis-internal-token': token, 'x-ailis-bench-shard': String(shard(tenant)) },
        body: JSON.stringify({ tenantId: tenant, payload }), signal: AbortSignal.timeout(25000)
    });
    const worker = res.headers.get('x-ailis-bench-worker');
    if (!res.headers.get('content-type')?.includes('text/event-stream')) {
        const body = await res.json().catch(() => ({}));
        return { worker, result: body, status: res.status };
    }
    const decoder = new TextDecoder();
    let buffer = '', text = '', first, result, completions = 0;
    for await (const chunk of res.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let cut;
        while ((cut = buffer.indexOf('\n\n')) >= 0) {
            const packet = buffer.slice(0, cut);
            buffer = buffer.slice(cut + 2);
            const event = packet.match(/^event: (.+)$/m)?.[1];
            if (!event) continue;
            const item = JSON.parse(packet.match(/^data: (.+)$/m)[1]);
            if (event === 'response.output_text.delta') {
                text += item.delta;
                if (first === undefined) {
                    first = performance.now();
                    onFirst?.({ worker, item });
                }
            }
            if (event === 'response.completed') completions++;
            if (event === 'response.completed' || event === 'error' || event === 'response.error') result = item.result || item;
        }
    }
    return { started, first, ended: performance.now(), worker, result, text, completions, status: res.status };
}

function register(tenant, key) {
    const trace = [];
    trace.tenant = tenant;
    data.set(key, trace);
    owners.set(key, tenant);
    return trace;
}

const reply = (key) => `AILIS local load test response ${key.slice(-8)}.`;

async function testWindow(arm, tenants, duration, trial, layout, warmup) {
    const { target, slotsByWorker } = arm;
    const completed = [], errors = {};
    let attempts = 0;
    const stopAt = performance.now() + duration;
    const startedAt = performance.now();
    await Promise.all(tenants.map(async (tenant) => {
        while (performance.now() < stopAt) {
            attempts++;
            const key = `ailis_probe_${randomUUID().replaceAll('-', '')}`;
            const trace = register(tenant, key);
            try {
                const run = await request(target, tenant, '/agent/run', { sessionId,
                    message: `Reply briefly in plain text. No tools are needed. ${key}`, maxAgentSteps: 2 });
                if (!run.result?.ok || run.first == null) {
                    const detail = run.result?.status === 'hosted_runtime_error' ? run.result?.error : run.result?.status;
                    throw new Error(detail || run.result?.error || `http_${run.status}_no_stream`);
                }
                assert.ok(layout !== 'fixed-shards' || run.worker === String(shard(tenant)), 'wrong shard');
                if (slotSeries) {
                    assert.equal(run.completions, 1, 'expected one completion per request');
                    assert.equal(run.text, reply(key), 'wrong stream or missing delta');
                    assert.equal(trace.foreign, false, 'foreign tenant context or missing model span');
                    assert.ok(Number.isFinite(trace.admitted) && trace.dispatch >= trace.admitted, 'missing or invalid admission timestamps');
                    assert.ok(trace.running >= 1 && trace.running <= slotsByWorker[shard(tenant)], 'execution slot limit violated');
                    const keys = arm.completed.get(tenant) || [];
                    keys.push(key);
                    arm.completed.set(tenant, keys);
                }
                const span = trace.length === 1 && trace[0].done ? trace[0] : null;
                completed.push({ full: run.ended - run.started, first: run.first - run.started,
                    pid: trace.pid, running: trace.running,
                    ...(span && trace.firstRead != null && trace.firstWrite != null ? {
                        providerToRead: trace.firstRead - span.first,
                        readToWrite: trace.firstWrite - trace.firstRead,
                        writeToClient: run.first - trace.firstWrite
                    } : {}),
                    ...(trace.admitted != null && trace.dispatch != null ? { queue: trace.dispatch - trace.admitted } : {}),
                    ...(trace.dispatch ? { dispatch: trace.dispatch - run.started } : {}),
                    ...(span ? { prepare: span.start - run.started, fixture: span.done - span.start,
                        relay: run.first - span.first, finish: run.ended - span.done } : {}) });
            } catch (error) {
                const key = String(error.message).slice(0, 150);
                errors[key] = (errors[key] || 0) + 1;
            } finally { data.delete(key); }
            if (!warmup || !slotSeries) await delay(500);
            else break;
        }
    }));
    const peaks = {};
    for (const row of completed) if (row.pid) peaks[row.pid] = Math.max(peaks[row.pid] || 0, row.running);
    const report = { trial, layout, ...slotSummary(arm), users: tenants.length, warmup, workerCount, attempts, errors, completed: completed.length,
        successRate: num(completed.length / attempts * 100), elapsedMs: num(performance.now() - startedAt), peakRunsByPid: peaks,
        timedSpans: completed.filter((row) => row.relay != null).length,
        timedRelayPhases: completed.filter((row) => row.readToWrite != null).length,
        p95Ms: Object.fromEntries(['first', 'full', 'queue', 'dispatch', 'prepare', 'fixture', 'relay', 'finish',
            'providerToRead', 'readToWrite', 'writeToClient'].map((key) =>
            [key, p95(completed.map((row) => row[key]).filter(Number.isFinite))])) };
    receipt.push(report);
    console.log(JSON.stringify(report));
    return report;
}

async function checkLifecycle(arm, tenants) {
    const a = tenants[0];
    const sameProcess = arm.slotsByWorker[shard(a)] > 1;
    const b = tenants.find((tenant) => tenant !== a && ((shard(a) === shard(tenant)) === sameProcess));
    assert.ok(b);
    const key = `ailis_probe_${randomUUID().replaceAll('-', '')}`;
    const held = register(a, key);
    held.long = true;
    const missingRoute = await fetch(`${arm.target}/health`);
    assert.equal(missingRoute.status, 403);
    const id = randomUUID();
    let notify;
    const first = new Promise((resolve) => { notify = resolve; });
    let done = false;
    const run = request(arm.target, a, '/agent/run', { sessionId, runId: id, message: `Please say hello. ${key}` }, notify)
        .finally(() => { done = true; data.delete(key); });
    const started = await Promise.race([first, run.then(() => { throw new Error('A completed without a first delta'); })]);
    const wrong = await request(arm.target, b, '/agent/interrupt', { sessionId, runId: id });
    assert.equal(wrong.result?.status, 'no_active_run');
    const duplicate = await request(arm.target, a, '/agent/run', { sessionId, message: 'Do not admit a duplicate task.' });
    assert.equal(duplicate.result?.error, 'tenant_busy');
    const otherKey = `ailis_probe_${randomUUID().replaceAll('-', '')}`;
    const other = register(b, otherKey);
    const br = await request(arm.target, b, '/agent/run', { sessionId, message: `Reply briefly to the other session. ${otherKey}` });
    data.delete(otherKey);
    assert.equal(br.result?.ok, true);
    assert.equal(br.worker === started.worker, sameProcess);
    if (slotSeries) {
        assert.equal(br.text, reply(otherKey));
        assert.equal(other.foreign, false);
        if (sameProcess) {
            assert.equal(held.pid, other.pid);
            assert.ok(other.running >= 2);
        }
    }
    assert.equal(done, false, 'B waited for A');
    const cancel = await request(arm.target, a, '/agent/interrupt', { sessionId, runId: id });
    assert.equal(cancel.worker, started.worker);
    assert.equal(cancel.result?.status, 'interrupt_requested');
    const stopped = await run;
    assert.notEqual(stopped.result?.status, 'completed');
    const message = `Resume the conversation number ${process.pid}`;
    const follow = await request(arm.target, a, '/agent/run', { sessionId, message });
    assert.equal(follow.result?.ok, true);
    assert.equal(follow.worker, started.worker);
    const state = path.join(arm.dir, `shard-${shard(a)}`, 'tenants', createHash('sha256').update(a).digest('hex'), 'state');
    const log = (await fs.readFile(path.join(state, 'memory', 'events.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
    assert.equal(log.at(-1).userText, message);
    const contexts = path.join(state, 'session-context', 'sessions');
    const checkpoint = (await fs.readdir(contexts)).find((name) => name.endsWith('.json'));
    assert.ok(checkpoint);
    assert.ok((await fs.readFile(path.join(contexts, checkpoint), 'utf8')).includes(message));
    return { rejectedMissingShard: true, rejectedDuplicate: true, independentChat: true, sameProcess,
        cancelAndResume: true, savedBeforeDone: true };
}

async function checkPersistence(arm) {
    const counts = { tenants: 0, turns: 0 };
    const read = (file) => fs.readFile(file, 'utf8');
    for (const [tenant, completed] of arm.completed) {
        const state = path.join(arm.dir, `shard-${shard(tenant)}`, 'tenants', createHash('sha256').update(tenant).digest('hex'), 'state');
        const events = (await read(path.join(state, 'memory/events.jsonl'))).trim().split('\n').map(JSON.parse);
        const snapshot = JSON.parse(await read(path.join(state, 'memory/memory-state.json')));
        assert.deepEqual(snapshot.events.map((entry) => entry.id), events.map((entry) => entry.id));
        const expected = new Set(completed);
        const matching = (messages) => messages.flatMap((text) => [...String(text || '').matchAll(/ailis_probe_[0-9a-f]+/g)].map((item) => item[0]));
        const verify = (markers) => {
            for (const marker of markers) assert.equal(owners.get(marker), tenant, 'foreign marker on disk');
            assert.deepEqual(markers.filter((marker) => expected.has(marker)), completed, 'missing, reordered or repeated committed turn');
        };
        verify(matching(events.map((event) => event.userText)));
        const rawDir = path.join(state, 'raw-memory/entries');
        const messages = [];
        for (const file of (await fs.readdir(rawDir)).filter((name) => name.endsWith('.jsonl')).sort()) {
            for (const line of (await read(path.join(rawDir, file))).split('\n')) {
                if (!line) continue;
                const record = JSON.parse(line);
                if (record.type === 'chat.llm_turn') messages.push(record.payload?.requestPayload?.memoryUserMessage);
            }
        }
        verify(matching(messages));
        counts.tenants++;
        counts.turns += expected.size;
    }
    return counts;
}

function slotSummary({ totalSlots, slotsByWorker }) {
    const uniform = slotsByWorker.every((slots) => slots === slotsByWorker[0]);
    return { ...(uniform ? { slots: slotsByWorker[0] } : {}), totalSlots, slotsByWorker };
}

async function topology(layout, trial, provider, totalSlots) {
    const dir = await fs.mkdtemp(path.join(artifacts, `${trial}-${layout}-`));
    const children = [], arms = [];
    const slotsByWorker = Array.from({ length: workerCount }, (_, index) => distribute(totalSlots, index));
    const env = { ...bootEnv, TEMP: dir, TMP: dir, AILIS_PROJECT_ROOT: root, AILIS_HOSTED_RUNTIME_HOST: '127.0.0.1',
        AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN: token, AILIS_HOSTED_MAX_ACTIVE_TENANTS: '24',
        AILIS_AGENT_LLM_PROVIDER: 'openai-compatible', AILIS_AGENT_LLM_TIMEOUT_MS: '20000',
        AILIS_LLM_BASE_URL: `${provider}/v1`, AILIS_LLM_API_KEY: 'loopback-fixture', AILIS_LLM_MODEL: model,
        AILIS_VISION_ENABLED: 'false' };
    try {
        if (layout === 'bullmq') {
            const redisPort = await port();
            Object.assign(env, { AILIS_AGENT_CLUSTER_ENABLED: 'true', AILIS_AGENT_CLUSTER_REDIS_URL: `redis://:${token}@127.0.0.1:${redisPort}`,
                AILIS_AGENT_CLUSTER_NAMESPACE: `ailis-ab-${randomUUID()}`, AILIS_AGENT_CLUSTER_STORAGE_ID: randomUUID(),
                AILIS_AGENT_CLUSTER_CONCURRENCY: '3', AILIS_AGENT_CLUSTER_MAX_QUEUED: '12', AILIS_HOSTED_DATA_ROOT: path.join(dir, 'data'),
                NODE_PATH: path.join(prod, 'worker/server/agent-cluster/node_modules') });
            const redisProcess = start(children, redis, ['--bind', '127.0.0.1', '--port', String(redisPort), '--requirepass', token, '--save', '', '--appendonly', 'no', '--dir', dir], env);
            await ready(async () => redisProcess.log.includes('Ready to accept connections'), 'Redis');
            const command = path.join(prod, 'worker/scripts/ailis-agent-cluster.cjs');
            const init = start(children, node, [command, 'init'], env);
            assert.equal((await once(init, 'exit'))[0], 0, init.log);
            for (let i = 0; i < workerCount; i++) {
                const worker = start(children, node, ['--require', observer, command, 'worker'],
                    { ...env, AILIS_AB_RUNTIME_ROLE: 'observe' });
                await ready(async () => worker.log.includes('worker.ready'), 'BullMQ worker');
            }
            arms.push(await port());
            start(children, node, [path.join(prod, 'ingress/scripts/start-ailis-hosted-runtime.cjs')],
                { ...env, AILIS_HOSTED_RUNTIME_PORT: String(arms[0]) });
        } else {
            for (let i = 0; i < workerCount; i++) {
                const chosen = await port();
                arms.push(chosen);
                start(children, node, ['--require', observer,
                    path.join(root, 'scripts/start-ailis-hosted-runtime.cjs')],
                    { ...env, AILIS_AB_SLOTS: String(slotsByWorker[i]),
                        ...(profile ? { AILIS_AB_PROFILE_DIR: dir } : {}),
                        AILIS_HOSTED_MAX_ACTIVE_TENANTS: String(Math.max(24, distribute(clientCount, i))),
                        AILIS_HOSTED_DATA_ROOT: path.join(dir, `shard-${i}`), AILIS_HOSTED_RUNTIME_PORT: String(chosen) });
            }
        }
        for (const endpoint of arms) await ready(() => status(url(endpoint)).then((body) => body.ok === true), 'AILIS');
        const gatewayPort = await port();
        const routes = arms.map((endpoint, i) => layout === 'bullmq' ? `reverse_proxy 127.0.0.1:${endpoint}` : `
    @shard${i} header X-Ailis-Bench-Shard ${i}
    handle @shard${i} {
        reverse_proxy 127.0.0.1:${endpoint} {
            header_down X-Ailis-Bench-Worker ${i}
        }
    }`).join('\n');
        const config = path.join(dir, 'Caddyfile');
        const fallback = layout === 'fixed-shards' ? 'handle {\n respond 403\n}' : '';
        await fs.writeFile(config, `{\n    admin off\n    auto_https off\n}\n${url(gatewayPort)} {\n${routes}\n${fallback}\n}\n`);
        start(children, caddy, ['run', '--config', config, '--adapter', 'caddyfile'], { ...env, XDG_DATA_HOME: dir, XDG_CONFIG_HOME: dir });
        const target = url(gatewayPort);
        await ready(async () => (await fetch(`${target}/health`, { headers: { 'x-ailis-bench-shard': '0' }, signal: AbortSignal.timeout(1000) })).ok, 'Caddy');
        return { target, dir, children, totalSlots, slotsByWorker, completed: new Map(), close: async () => {
            await stop(children);
            await fs.writeFile(path.join(dir, 'process-tail.log'), children.map((child) => child.log).join('\n---\n'));
        } };
    } catch (error) {
        await stop(children);
        throw new Error(`${error.message}\n${children.map((child) => child.log.slice(-1500)).join('\n')}`);
    }
}

async function main() {
    await fs.mkdir(artifacts, { recursive: true });
    for (const role of slotSeries ? [] : ['ingress', 'worker']) {
        const link = path.join(prod, role, 'electron');
        try { await fs.symlink(path.join(root, 'electron'), link, 'junction'); }
        catch (error) { if (error.code !== 'EEXIST') throw error; }
        assert.equal(await fs.realpath(link), await fs.realpath(path.join(root, 'electron')));
    }
    const provider = await serve(http.createServer(async (req, res) => {
        let raw = '';
        const start = performance.now();
        for await (const chunk of req) raw += chunk;
        const body = JSON.parse(raw);
        const markers = [...raw.matchAll(/ailis_probe_[0-9a-f]+/g)].map((match) => match[0]);
        const key = markers.findLast((marker) => data.has(marker));
        const trace = data.get(key);
        if (trace) trace.foreign = markers.some((marker) => owners.has(marker) && owners.get(marker) !== trace.tenant);
        const span = { start };
        trace?.push(span);
        await delay(140);
        const id = `chatcmpl-${randomUUID()}`;
        const send = (values) => res.write(`data: ${JSON.stringify({ id, model, ...values })}\n\n`);
        const usage = { prompt_tokens: 24, completion_tokens: 9, total_tokens: 33 };
        if (!body.stream) {
            span.first = span.done = performance.now();
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(JSON.stringify({ id, model, usage, choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'AILIS local load test response.' } }] }));
        }
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        for (const content of ['AILIS ', 'local ', 'load test ', slotSeries && key ? `response ${key.slice(-8)}.` : 'response.']) {
            span.first ??= performance.now();
            send({ choices: [{ index: 0, delta: { content }, finish_reason: null }] });
            await delay(trace?.long ? 2000 : 55);
            if (res.destroyed) return;
        }
        span.done = performance.now();
        send({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] });
        send({ choices: [], usage });
        res.end('data: [DONE]\n\n');
    }));
    const groups = Array.from({ length: workerCount }, () => []);
    const withSixClientStage = !slotSeries || clientCount === 24;
    const tenantCount = slotSeries ? clientCount + (withSixClientStage ? 6 : 0) : 24;
    const perShard = groups.map((_, index) => distribute(tenantCount, index));
    for (let i = 0; groups.some((group, index) => group.length < perShard[index]); i++) {
        const tenant = `ab-tenant-${i}`;
        const index = shard(tenant);
        if (groups[index].length < perShard[index]) groups[index].push(tenant);
    }
    const tenants = groups[0].flatMap((_, i) => groups.map((group) => group[i]).filter(Boolean));
    try {
        const layouts = slotSeries ? slotSeries.map(() => 'fixed-shards') : process.env.AILIS_AB_ORDER?.split(',') || ['bullmq', 'fixed-shards'];
        const name = totalSlotSeries ? `total-slots-${totalSlotSeries.join('-')}-clients-${clientCount}` :
            perWorkerSeries ? `slot-matrix-${perWorkerSeries.join('-')}` : `${process.env.AILIS_AB_CHECKS_ONLY ? 'routing-checks' : 'routing-ab'}-${layouts.join('-')}`;
        const output = path.join(artifacts, `${name}.json`);
        for (const [i, layout] of layouts.entries()) {
            assert.ok(['bullmq', 'fixed-shards'].includes(layout));
            const arm = await topology(layout, i + 1, url(provider.address().port), slotSeries?.[i] || workerCount);
            try {
                if (!process.env.AILIS_AB_CHECKS_ONLY) {
                    if (slotSeries) {
                        // Each tenant starts with one completed turn; the two measured stages use disjoint tenants.
                        for (let offset = 0; offset < tenants.length; offset += 6) {
                            const group = tenants.slice(offset, offset + 6);
                            const wave = await testWindow(arm, group, 6000, i + 1, layout, true);
                            assert.equal(wave.completed, group.length, 'slot matrix warm-up did not complete');
                        }
                    } else await testWindow(arm, tenants, 6000, i + 1, layout, true);
                    if (withSixClientStage) await testWindow(arm, tenants.slice(0, 6), 18000, i + 1, layout, false);
                    if (layout === 'fixed-shards') await profileWorkers(arm.children, 'start');
                    await testWindow(arm, slotSeries && withSixClientStage ? tenants.slice(6) : tenants, 18000, i + 1, layout, false);
                    if (layout === 'fixed-shards') await profileWorkers(arm.children, 'stop');
                    await fs.writeFile(output, JSON.stringify(receipt, null, 2));
                }
                if (layout === 'fixed-shards') {
                    let checks = { trial: i + 1, layout, ...slotSummary(arm) };
                    try {
                        Object.assign(checks, await checkLifecycle(arm, tenants));
                        if (slotSeries) checks.persistence = await checkPersistence(arm);
                        checks.passed = true;
                    } catch (error) {
                        checks = { ...checks, passed: false, error: error.message };
                        process.exitCode = 1;
                    }
                    console.log(JSON.stringify(checks));
                    receipt.push(checks);
                }
            } finally { await arm.close(); }
            await fs.writeFile(output, JSON.stringify(receipt, null, 2));
        }
    } finally { provider.closeAllConnections(); provider.close(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
