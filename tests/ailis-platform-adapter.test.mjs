import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISPlatformAdapter,
    createAILISPlatformAdapter
} = require('../electron/ailis-platform-adapter.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

test('AILIS platform adapter normalizes OS-specific path and shell behavior', () => {
    const windows = new AILISPlatformAdapter({
        platform: 'win32',
        env: {
            SystemDrive: 'C:',
            WINDIR: 'C:\\Windows',
            ComSpec: 'C:\\Windows\\System32\\cmd.exe'
        }
    });
    assert.equal(windows.id, 'windows');
    assert.equal(windows.isPathInside('C:\\Work', 'C:\\WORK\\note.txt'), true);
    assert.equal(windows.pathKey('C:\\Work\\Note.txt'), path.resolve('C:\\Work\\Note.txt').toLowerCase());
    assert.deepEqual(windows.shellArgs('echo hi'), ['/d', '/s', '/c', 'echo hi']);
    assert.equal(windows.aclSetCommand('C:\\Work\\note.txt', ['/grant', 'User:(R)']).supported, true);
    assert.equal(windows.getStatus().capabilities.aclSet, true);

    const linux = createAILISPlatformAdapter('linux');
    assert.equal(linux.id, 'linux');
    assert.equal(linux.isPathInside('/tmp/work', '/tmp/work/note.txt'), true);
    assert.equal(linux.isPathInside('/tmp/work', '/tmp/work-other/note.txt'), false);
    assert.deepEqual(linux.shellArgs('echo hi'), ['-lc', 'echo hi']);
    assert.equal(linux.aclSetCommand('/tmp/work/note.txt', []).supported, false);
});

test('AILIS platform adapter exposes macOS and Linux desktop skeleton capabilities', () => {
    const macos = new AILISPlatformAdapter({
        platform: 'darwin',
        env: {}
    });
    assert.equal(macos.id, 'macos');
    assert.equal(macos.defaultShellExecutable(), 'zsh');
    assert.equal(macos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' }).supported, true);
    assert.match(macos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' }).args.join('\n'), /screencapture/);
    assert.deepEqual(macos.clipboardReadCommand(), {
        supported: true,
        command: 'pbpaste',
        args: []
    });
    assert.equal(macos.clipboardWriteCommand({ text: 'hello' }).supported, true);
    assert.match(macos.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /pbcopy/);
    assert.equal(macos.guiInputCommand({ action: 'click' }).supported, false);
    assert.equal(macos.getStatus().capabilityMatrix.screenCapture.backend, 'screencapture');
    assert.equal(macos.getStatus().capabilityMatrix.guiInput.status, 'skeleton');

    const linux = new AILISPlatformAdapter({
        platform: 'linux',
        env: {}
    });
    assert.equal(linux.id, 'linux');
    assert.equal(linux.defaultShellExecutable(), 'bash');
    const linuxScreenshot = linux.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' });
    assert.equal(linuxScreenshot.supported, true);
    assert.match(linuxScreenshot.args.join('\n'), /gnome-screenshot|grim|spectacle|scrot/);
    assert.equal(linux.clipboardReadCommand().supported, true);
    assert.match(linux.clipboardReadCommand().args.join('\n'), /wl-paste|xclip|xsel/);
    assert.equal(linux.clipboardWriteCommand({ text: 'hello' }).supported, true);
    assert.match(linux.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /wl-copy|xclip|xsel/);
    assert.equal(linux.guiInputCommand({ action: 'click' }).supported, false);
    assert.equal(linux.getStatus().capabilityMatrix.screenCapture.status, 'available-if-installed');
    assert.equal(linux.getStatus().capabilityMatrix.clipboard.status, 'available-if-installed');
    assert.equal(linux.getStatus().capabilityMatrix.guiInput.status, 'skeleton');
});

test('AILIS platform adapter exposes Android ADB mobile capabilities', () => {
    const android = new AILISPlatformAdapter({
        platform: 'android',
        hostPlatform: 'win32',
        env: {
            ADB: 'adb-test',
            SystemDrive: 'C:',
            WINDIR: 'C:\\Windows'
        }
    });
    assert.equal(android.id, 'android');
    assert.equal(android.getStatus().capabilities.mobileDevice, true);
    assert.equal(android.defaultShellExecutable(), 'adb-test');
    assert.deepEqual(android.shellArgs('ls /sdcard'), ['shell', 'ls /sdcard']);

    const spawnSpec = android.commandSpawnSpec('echo hello', { cwd: 'C:\\Work' });
    assert.equal(spawnSpec.supported, true);
    assert.equal(spawnSpec.command, 'adb-test');
    assert.deepEqual(spawnSpec.args, ['shell', 'echo hello']);
    assert.equal(spawnSpec.options.shell, false);

    const screenshot = android.desktopScreenshotCommand({ outputPath: 'C:\\Temp\\screen.png' });
    assert.equal(screenshot.supported, true);
    assert.equal(screenshot.steps.length, 3);
    assert.deepEqual(screenshot.steps[0].args.slice(0, 3), ['shell', 'screencap', '-p']);
    assert.deepEqual(screenshot.steps[1].args.slice(0, 1), ['pull']);

    const click = android.guiInputCommand({ action: 'click', x: 10, y: 20 });
    assert.equal(click.supported, true);
    assert.deepEqual(click.args, ['shell', 'input', 'tap', '10', '20']);

    const type = android.guiInputCommand({ action: 'type_text', text: 'hi there' });
    assert.equal(type.supported, true);
    assert.deepEqual(type.args, ['shell', 'input', 'text', 'hi%sthere']);

    const back = android.guiInputCommand({ action: 'keyboard_press', key: 'back' });
    assert.equal(back.supported, true);
    assert.deepEqual(back.args, ['shell', 'input', 'keyevent', '4']);

    assert.equal(android.clipboardReadCommand().supported, false);
    assert.equal(android.getStatus().capabilityMatrix.guiInput.status, 'available-basic');
    assert.equal(android.getStatus().capabilityMatrix.screenCapture.status, 'available-if-adb');
});

test('AILIS platform adapter exposes iOS simulator skeleton and real-device limits', () => {
    const simulator = new AILISPlatformAdapter({
        platform: 'ios-simulator',
        hostPlatform: 'darwin',
        env: {
            XCRUN: 'xcrun-test'
        }
    });
    assert.equal(simulator.id, 'ios-simulator');
    assert.equal(simulator.getStatus().capabilities.mobileDevice, true);
    assert.equal(simulator.commandSpawnSpec('ls').supported, false);
    const screenshot = simulator.desktopScreenshotCommand({ outputPath: '/tmp/ailis-ios.png' });
    assert.equal(screenshot.supported, true);
    assert.equal(screenshot.command, 'xcrun-test');
    assert.deepEqual(screenshot.args, ['simctl', 'io', 'booted', 'screenshot', '/tmp/ailis-ios.png']);
    assert.deepEqual(simulator.clipboardReadCommand(), {
        supported: true,
        command: 'xcrun-test',
        args: ['simctl', 'pbpaste', 'booted']
    });
    assert.equal(simulator.clipboardWriteCommand({ text: 'hello' }).supported, true);
    assert.match(simulator.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /simctl pbcopy booted/);
    assert.equal(simulator.guiInputCommand({ action: 'click', x: 10, y: 20 }).supported, false);
    assert.equal(simulator.getStatus().capabilityMatrix.screenCapture.status, 'available-if-simulator');

    const realIos = new AILISPlatformAdapter({
        platform: 'ios',
        hostPlatform: 'darwin'
    });
    assert.equal(realIos.id, 'ios');
    assert.equal(realIos.commandSpawnSpec('ls').supported, false);
    assert.equal(realIos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-ios.png' }).supported, false);
    assert.equal(realIos.getStatus().capabilityMatrix.guiInput.status, 'skeleton');
});

test('AILIS Gateway exposes the active platform adapter to tools and status', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-platform-gateway-'));
    const platformAdapter = new AILISPlatformAdapter({ platform: 'win32' });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        platformAdapter
    });

    try {
        await gateway.start();
        const status = gateway.getStatus();
        assert.equal(status.platform.id, 'windows');
        assert.equal(status.runtime.platform.id, 'windows');

        const schema = await gateway.callTool({
            tool: 'computer',
            args: { action: 'schema' },
            context: {
                workspace: workspaceRoot
            }
        });
        assert.equal(schema.ok, true);
        assert.equal(schema.result.details.schema.safety.platform.id, 'windows');
    } finally {
        await gateway.stop().catch(() => {});
    }
});
