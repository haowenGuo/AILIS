'use strict';

const vm = require('node:vm');

const pendingTools = new Map();
let nextToolCallId = 1;
let outputs = [];
let storedValues = {};
let finished = false;
let activeContext = null;
let nextTimerId = 1;
const timers = new Map();

function send(message) {
    if (typeof process.send === 'function') process.send(message);
}

function jsonClone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
}

function cloneIntoActiveContext(value) {
    if (!activeContext || value === undefined) return value;
    const serialized = JSON.stringify(value);
    return vm.runInContext(`JSON.parse(${JSON.stringify(serialized)})`, activeContext);
}

function printable(value) {
    if (typeof value === 'string') return value;
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function callTool(name, input) {
    const id = `nested-${nextToolCallId++}`;
    return new Promise((resolve, reject) => {
        pendingTools.set(id, { resolve, reject });
        send({ type: 'tool_call', id, name, input: jsonClone(input) });
    });
}

function appendOutput(kind, value, metadata = {}) {
    const item = { kind, value: jsonClone(value), ...jsonClone(metadata) };
    outputs.push(item);
    send({ type: 'output', item });
}

function createSandbox(tools = []) {
    const sandbox = Object.create(null);
    const context = vm.createContext(sandbox, {
        name: 'ailis-code-mode',
        codeGeneration: { strings: false, wasm: false }
    });
    activeContext = context;
    const hardenBridge = (fn) => {
        Object.setPrototypeOf(fn, null);
        return Object.freeze(fn);
    };
    context.__bridgeCallTool = hardenBridge((name, input) => callTool(name, input));
    context.__bridgeText = hardenBridge((value) => appendOutput('text', printable(value)));
    context.__bridgeImage = hardenBridge((value, detail = null) => appendOutput('image', value, detail == null ? {} : { detail }));
    context.__bridgeAudio = hardenBridge((value) => appendOutput('audio', value));
    context.__bridgeGeneratedImage = hardenBridge((value) => appendOutput('generated_image', value));
    context.__bridgeNotify = hardenBridge((value) => {
            appendOutput('text', printable(value), { notify: true });
            send({ type: 'yield' });
    });
    context.__bridgeStore = hardenBridge((key, value) => {
        const normalizedKey = String(key);
        const cloned = jsonClone(value);
        storedValues[normalizedKey] = cloned;
        send({ type: 'store', key: normalizedKey, value: cloned });
    });
    context.__bridgeLoad = hardenBridge((key) => cloneIntoActiveContext(storedValues[String(key)]));
    context.__bridgeYield = hardenBridge(() => send({ type: 'yield' }));
    context.__bridgeSetTimeout = hardenBridge((callback, delayMs = 0) => {
            const timerId = nextTimerId++;
            const timer = setTimeout(() => {
                timers.delete(timerId);
                try {
                    callback();
                } catch (error) {
                    send({ type: 'async_error', error: error?.stack || error?.message || String(error) });
                }
            }, Math.max(0, Number(delayMs) || 0));
            timer.unref?.();
            timers.set(timerId, timer);
            return timerId;
    });
    context.__bridgeClearTimeout = hardenBridge((timerId) => {
        const timer = timers.get(Number(timerId));
        if (timer) clearTimeout(timer);
        timers.delete(Number(timerId));
    });
    const serializedTools = JSON.stringify(tools.map((tool) => ({
        name: tool.name,
        globalName: tool.globalName,
        description: tool.description || ''
    })));
    vm.runInContext(`(() => {
        const callTool = globalThis.__bridgeCallTool;
        const appendText = globalThis.__bridgeText;
        const appendImage = globalThis.__bridgeImage;
        const appendAudio = globalThis.__bridgeAudio;
        const appendGeneratedImage = globalThis.__bridgeGeneratedImage;
        const emitNotification = globalThis.__bridgeNotify;
        const saveValue = globalThis.__bridgeStore;
        const readValue = globalThis.__bridgeLoad;
        const yieldNow = globalThis.__bridgeYield;
        const schedule = globalThis.__bridgeSetTimeout;
        const cancel = globalThis.__bridgeClearTimeout;
        const definitions = JSON.parse(${JSON.stringify(serializedTools)});
        const exposedTools = Object.create(null);
        for (const definition of definitions) {
            exposedTools[definition.globalName] = async (input) => await callTool(definition.name, input);
        }
        globalThis.tools = Object.freeze(exposedTools);
        globalThis.ALL_TOOLS = Object.freeze(definitions.map(({ name, description }) => Object.freeze({ name, description })));
        globalThis.text = (value) => appendText(value);
        globalThis.image = (value, detail = null) => appendImage(value, detail);
        globalThis.audio = (value) => appendAudio(value);
        globalThis.generatedImage = (value) => appendGeneratedImage(value);
        globalThis.notify = (value) => emitNotification(value);
        globalThis.store = (key, value) => saveValue(key, value);
        globalThis.load = (key) => readValue(key);
        globalThis.yield_control = () => yieldNow();
        globalThis.exit = () => { throw '__AILIS_CODE_MODE_EXIT__'; };
        globalThis.setTimeout = (callback, delayMs = 0) => schedule(callback, delayMs);
        globalThis.clearTimeout = (timerId) => cancel(timerId);
        delete globalThis.__bridgeCallTool;
        delete globalThis.__bridgeText;
        delete globalThis.__bridgeImage;
        delete globalThis.__bridgeAudio;
        delete globalThis.__bridgeGeneratedImage;
        delete globalThis.__bridgeNotify;
        delete globalThis.__bridgeStore;
        delete globalThis.__bridgeLoad;
        delete globalThis.__bridgeYield;
        delete globalThis.__bridgeSetTimeout;
        delete globalThis.__bridgeClearTimeout;
    })()`, context);
    return context;
}

async function run({ source = '', tools = [], store = {} } = {}) {
    storedValues = jsonClone(store) || {};
    const context = createSandbox(tools);
    try {
        const module = new vm.SourceTextModule(String(source || ''), {
            context,
            identifier: 'ailis:exec'
        });
        await module.link(() => {
            throw new Error('exec imports are not supported');
        });
        await module.evaluate();
        finished = true;
        send({ type: 'complete', outputs });
        setImmediate(() => process.exit(0));
    } catch (error) {
        finished = true;
        if (error === '__AILIS_CODE_MODE_EXIT__' || error?.code === 'AILIS_CODE_MODE_EXIT' || error?.message === '__AILIS_CODE_MODE_EXIT__') {
            send({ type: 'complete', outputs });
            setImmediate(() => process.exit(0));
            return;
        }
        send({
            type: 'complete',
            outputs,
            error: error?.stack || error?.message || String(error)
        });
        setImmediate(() => process.exit(0));
    }
}

process.on('message', (message) => {
    if (!message || typeof message !== 'object') return;
    if (message.type === 'start') {
        void run(message);
        return;
    }
    if (message.type === 'tool_result') {
        const pending = pendingTools.get(message.id);
        if (!pending) return;
        pendingTools.delete(message.id);
        if (message.error) pending.reject(new Error(String(message.error)));
        else pending.resolve(cloneIntoActiveContext(message.result));
        return;
    }
    if (message.type === 'terminate' && !finished) {
        finished = true;
        send({ type: 'terminated', outputs });
        process.exit(0);
    }
});
