import fs from 'node:fs';
import path from 'node:path';

function readOption(name, fallback = '') {
    const index = process.argv.indexOf(name);
    return index >= 0 && index + 1 < process.argv.length
        ? process.argv[index + 1]
        : fallback;
}

const port = Number(readOption('--port', '9333'));
const sampleSeconds = Number(readOption('--sample-seconds', '10'));
const outputDir = path.resolve(readOption(
    '--output-dir',
    path.join('.runtime-logs', 'character-benchmark')));
const processStartedAtMs = Number(readOption('--process-started-at-ms', Date.now()));
fs.mkdirSync(outputDir, { recursive: true });

async function waitForPetTarget(timeoutMs = 45000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const response = await fetch(`http://127.0.0.1:${port}/json/list`);
            const targets = await response.json();
            const target = targets.find((item) => item.title === 'AILIS Pet');
            if (target?.webSocketDebuggerUrl) {
                return target;
            }
        } catch {
            // The desktop process may still be starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`AILIS Pet DevTools target did not appear on port ${port}.`);
}

class DevToolsClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.nextId = 1;
        this.pending = new Map();
    }

    async connect() {
        this.socket = new WebSocket(this.url);
        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(String(event.data));
            const pending = this.pending.get(message.id);
            if (!pending) {
                return;
            }
            this.pending.delete(message.id);
            if (message.error) {
                pending.reject(new Error(message.error.message));
            } else {
                pending.resolve(message.result);
            }
        });
        await new Promise((resolve, reject) => {
            this.socket.addEventListener('open', resolve, { once: true });
            this.socket.addEventListener('error', reject, { once: true });
        });
    }

    call(method, params = {}) {
        const id = this.nextId++;
        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            this.socket.send(JSON.stringify({ id, method, params }));
        });
    }

    async evaluate(expression, awaitPromise = false) {
        const result = await this.call('Runtime.evaluate', {
            expression,
            awaitPromise,
            returnByValue: true
        });
        if (result.exceptionDetails) {
            throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed.');
        }
        return result.result?.value;
    }

    close() {
        this.socket?.close();
    }
}

const target = await waitForPetTarget();
const client = new DevToolsClient(target.webSocketDebuggerUrl);
await client.connect();

try {
    const deadline = Date.now() + 45000;
    let readiness = null;
    while (Date.now() < deadline) {
        readiness = await client.evaluate(`(() => ({
            readyState: document.readyState,
            modelLoaded: Boolean(window.vrmSystem?.isModelLoaded),
            hasRenderer: Boolean(window.vrmSystem?.renderer),
            canvasCount: document.querySelectorAll('canvas').length
        }))()`);
        if (readiness?.modelLoaded && readiness?.hasRenderer) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!readiness?.modelLoaded || !readiness?.hasRenderer) {
        throw new Error('Three.js character model did not become ready.');
    }

    const modelReadyMs = Date.now() - processStartedAtMs;
    const rendering = await client.evaluate(`(() => new Promise((resolve) => {
        const system = window.vrmSystem;
        const renderer = system.renderer;
        const originalRender = renderer.render;
        let renderCount = 0;
        renderer.render = function (...args) {
            renderCount += 1;
            return originalRender.apply(this, args);
        };
        const startedAt = performance.now();
        setTimeout(() => {
            const elapsedSeconds = (performance.now() - startedAt) / 1000;
            renderer.render = originalRender;
            resolve({
                sampleSeconds: elapsedSeconds,
                renderedFrames: renderCount,
                averageFps: renderCount / elapsedSeconds,
                canvasWidth: renderer.domElement.width,
                canvasHeight: renderer.domElement.height,
                cssWidth: renderer.domElement.clientWidth,
                cssHeight: renderer.domElement.clientHeight,
                pixelRatio: renderer.getPixelRatio(),
                drawCalls: renderer.info.render.calls,
                triangles: renderer.info.render.triangles,
                lines: renderer.info.render.lines,
                points: renderer.info.render.points,
                textures: renderer.info.memory.textures,
                geometries: renderer.info.memory.geometries
            });
        }, ${Math.max(1, sampleSeconds) * 1000});
    }))()`, true);

    await client.call('Page.enable');
    const capture = await client.call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false
    });
    const performanceMetrics = await client.call('Performance.getMetrics');
    const metricsByName = Object.fromEntries(
        (performanceMetrics.metrics || []).map((item) => [item.name, item.value]));

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(outputDir, `threejs-render-${stamp}.png`);
    const metricsPath = path.join(outputDir, `threejs-metrics-${stamp}.json`);
    fs.writeFileSync(screenshotPath, Buffer.from(capture.data, 'base64'));
    fs.writeFileSync(metricsPath, JSON.stringify({
        target: {
            id: target.id,
            title: target.title,
            url: target.url
        },
        modelReadyMs,
        rendering,
        chromium: {
            jsHeapUsedBytes: metricsByName.JSHeapUsedSize || 0,
            jsHeapTotalBytes: metricsByName.JSHeapTotalSize || 0,
            documents: metricsByName.Documents || 0,
            nodes: metricsByName.Nodes || 0,
            layoutCount: metricsByName.LayoutCount || 0
        },
        screenshotPath
    }, null, 2));
    console.log(JSON.stringify({ metricsPath, screenshotPath, modelReadyMs, rendering }, null, 2));
} finally {
    client.close();
}
