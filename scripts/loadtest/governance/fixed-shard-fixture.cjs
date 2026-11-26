'use strict';

// Only loaded by the loopback A/B; never install this as a runtime preload.
const { AsyncLocalStorage } = require('node:async_hooks');
const { ServerResponse } = require('node:http');
const { AILISHostedRuntimeManager } = require('../../../electron/ailis-hosted-runtime.cjs');
const prototype = AILISHostedRuntimeManager.prototype;
const exec = prototype.runAgent;
const execStream = prototype.runAgentEventStream;
const waiting = [];
const admittedTenants = new Set();
const scope = new AsyncLocalStorage();
const slots = Number(process.env.AILIS_AB_SLOTS || 1);
if (!Number.isInteger(slots) || slots < 1 || slots > 64) throw new Error('Invalid fixture slot count');
let running = 0;

const markerOf = (payload) => String(payload.message || '').match(/ailis_probe_[0-9a-f]+/)?.[0];

function mark(marker, phase) {
    if (marker) process.send?.({ marker, phase, pid: process.pid, running, at: performance.timeOrigin + performance.now() });
}

if (process.env.AILIS_AB_PROFILE_DIR) {
    const { Session } = require('node:inspector');
    const { writeFile } = require('node:fs/promises');
    const path = require('node:path');
    const session = new Session();
    session.connect();
    const post = (command, params = {}) => new Promise((resolve, reject) => session.post(command, params,
        (error, result) => error ? reject(error) : resolve(result)));
    process.on('message', async (message) => {
        if (!message?.profile) return;
        try {
            if (message.profile === 'start') {
                await post('Profiler.enable');
                await post('Profiler.setSamplingInterval', { interval: 2000 });
                await post('Profiler.start');
            } else if (message.profile === 'stop') {
                const { profile } = await post('Profiler.stop');
                await writeFile(path.join(process.env.AILIS_AB_PROFILE_DIR, `worker-${process.pid}.cpuprofile`), JSON.stringify(profile));
            }
            process.send({ profileAck: message.profile });
        } catch (error) { process.send({ profileAck: message.profile, profileError: error.message }); }
    });

    const fetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
        const context = scope.getStore();
        const response = await fetch(...args);
        if (!context?.marker || args[0] !== `${process.env.AILIS_LLM_BASE_URL}/chat/completions` || !response.body) return response;
        const getReader = response.body.getReader.bind(response.body);
        response.body.getReader = (...params) => {
            const reader = getReader(...params);
            const read = reader.read.bind(reader);
            reader.read = async () => {
                const result = await read();
                if (!context.firstRead && result.value?.length) {
                    context.firstRead = true;
                    mark(context.marker, 'firstRead');
                }
                return result;
            };
            return reader;
        };
        return response;
    };
    const write = ServerResponse.prototype.write;
    ServerResponse.prototype.write = function (chunk, ...args) {
        const context = scope.getStore();
        if (context?.marker && !context.firstWrite && typeof chunk === 'string' && chunk.startsWith('event: response.output_text.delta\n')) {
            context.firstWrite = true;
            mark(context.marker, 'firstWrite');
        }
        return write.call(this, chunk, ...args);
    };
}

async function admit(tenantId, payload, operation) {
    if (admittedTenants.has(tenantId)) throw Object.assign(new Error('tenant_busy'), { statusCode: 409 });
    if (running >= slots && waiting.length >= 4) throw Object.assign(new Error('queue_full'), { statusCode: 429 });
    admittedTenants.add(tenantId);
    const marker = markerOf(payload);
    mark(marker, 'admitted');
    if (running < slots) running++;
    else await new Promise((resume) => waiting.push(resume));
    try {
        mark(marker, 'dispatch');
        return await scope.run({ tenantId, marker }, operation);
    } finally {
        admittedTenants.delete(tenantId);
        // Give a waiting request the slot before any new arrival can take it.
        if (waiting.length) waiting.shift()();
        else running--;
    }
}

if (process.env.AILIS_AB_RUNTIME_ROLE === 'observe') {
    prototype.runAgent = function (tenant, payload, options) {
        mark(markerOf(payload), 'dispatch');
        return exec.call(this, tenant, payload, options);
    };
} else {
    prototype.runAgent = function (tenant, payload, options) {
        const operation = () => exec.call(this, tenant, payload, options);
        return scope.getStore()?.tenantId === tenant ? operation() : admit(tenant, payload, operation);
    };
    prototype.runAgentEventStream = function (tenant, payload, options) {
        return admit(tenant, payload, () => execStream.call(this, tenant, payload, options));
    };
}
