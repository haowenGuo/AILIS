const path = require('path');
const { spawn } = require('child_process');

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|on)$/i.test(value.trim())) {
            return true;
        }
        if (/^(false|0|no|off)$/i.test(value.trim())) {
            return false;
        }
    }
    return fallback;
}

function normalizePlatformId(value = '') {
    const normalized = normalizeString(value).toLowerCase();
    if (['windows', 'win'].includes(normalized)) {
        return 'win32';
    }
    if (['mac', 'macos', 'osx'].includes(normalized)) {
        return 'darwin';
    }
    if (['ios-sim', 'ios_simulator', 'iphonesimulator', 'iphone-simulator', 'ipad-simulator'].includes(normalized)) {
        return 'ios-simulator';
    }
    if (['iphone', 'ipad', 'ipados'].includes(normalized)) {
        return 'ios';
    }
    return normalized || process.platform;
}

function isMobileTargetPlatform(platform = '') {
    return ['android', 'ios', 'ios-simulator'].includes(normalizePlatformId(platform));
}

function encodeBase64Utf8(value = '') {
    return Buffer.from(String(value), 'utf8').toString('base64');
}

function shellScriptCommand(script, args = []) {
    return {
        supported: true,
        command: '/bin/sh',
        args: ['-lc', script, 'aigl-platform-adapter', ...args.map((entry) => String(entry))]
    };
}

function parseKeyChord(keys = []) {
    if (typeof keys === 'string') {
        return keys
            .split(/[+\s,]+/g)
            .map((entry) => normalizeString(entry).toLowerCase())
            .filter(Boolean);
    }
    return normalizeArray(keys)
        .map((entry) => normalizeString(entry).toLowerCase())
        .filter(Boolean);
}

function sendKeysToken(key = '') {
    const normalized = normalizeString(key).toLowerCase();
    const named = {
        enter: '{ENTER}',
        return: '{ENTER}',
        tab: '{TAB}',
        escape: '{ESC}',
        esc: '{ESC}',
        backspace: '{BACKSPACE}',
        delete: '{DELETE}',
        del: '{DELETE}',
        up: '{UP}',
        down: '{DOWN}',
        left: '{LEFT}',
        right: '{RIGHT}',
        home: '{HOME}',
        end: '{END}',
        pageup: '{PGUP}',
        pagedown: '{PGDN}',
        pgup: '{PGUP}',
        pgdn: '{PGDN}',
        space: ' ',
        printscreen: '{PRTSC}'
    };
    if (named[normalized]) {
        return named[normalized];
    }
    if (/^f([1-9]|1[0-9]|2[0-4])$/.test(normalized)) {
        return `{${normalized.toUpperCase()}}`;
    }
    if (normalized.length === 1) {
        return normalized.replace(/[+^%~(){}\[\]]/g, '{$&}');
    }
    return `{${normalized.toUpperCase()}}`;
}

function keyChordToSendKeys(keys = []) {
    const chord = parseKeyChord(keys);
    const modifiers = [];
    const regular = [];
    for (const key of chord) {
        if (['ctrl', 'control', 'cmd', 'command', 'meta'].includes(key)) {
            modifiers.push('^');
        } else if (['alt', 'option'].includes(key)) {
            modifiers.push('%');
        } else if (key === 'shift') {
            modifiers.push('+');
        } else {
            regular.push(key);
        }
    }
    return `${modifiers.join('')}${regular.map(sendKeysToken).join('') || ''}`;
}

function androidInputText(value = '') {
    return String(value)
        .replace(/%/g, '%25')
        .replace(/\s/g, '%s');
}

function androidKeyCode(key = '') {
    const normalized = normalizeString(key).toLowerCase();
    const named = {
        home: '3',
        back: '4',
        browser_back: '4',
        call: '5',
        endcall: '6',
        volume_up: '24',
        volume_down: '25',
        power: '26',
        camera: '27',
        clear: '28',
        enter: '66',
        return: '66',
        del: '67',
        delete: '67',
        backspace: '67',
        tab: '61',
        space: '62',
        escape: '111',
        esc: '111',
        app_switch: '187',
        recent: '187',
        menu: '82',
        search: '84'
    };
    if (named[normalized]) {
        return named[normalized];
    }
    if (/^\d+$/.test(normalized)) {
        return normalized;
    }
    return '';
}

class HumanClawPlatformAdapter {
    constructor(options = {}) {
        this.platform = normalizePlatformId(options.platform || process.platform);
        this.hostPlatform = normalizePlatformId(options.hostPlatform || (isMobileTargetPlatform(this.platform) ? process.platform : this.platform));
        this.arch = normalizeString(options.arch, process.arch);
        this.env = options.env && typeof options.env === 'object' ? options.env : process.env;
    }

    get id() {
        if (this.isAndroid()) {
            return 'android';
        }
        if (this.isIOSSimulator()) {
            return 'ios-simulator';
        }
        if (this.isIOS()) {
            return 'ios';
        }
        if (this.isWindows()) {
            return 'windows';
        }
        if (this.isMacOS()) {
            return 'macos';
        }
        if (this.isLinux()) {
            return 'linux';
        }
        return this.platform || 'unknown';
    }

    isWindows() {
        return this.platform === 'win32';
    }

    isMacOS() {
        return this.platform === 'darwin';
    }

    isLinux() {
        return this.platform === 'linux';
    }

    isAndroid() {
        return this.platform === 'android';
    }

    isIOS() {
        return this.platform === 'ios';
    }

    isIOSSimulator() {
        return this.platform === 'ios-simulator';
    }

    isAppleMobile() {
        return this.isIOS() || this.isIOSSimulator();
    }

    isHostWindows() {
        return this.hostPlatform === 'win32';
    }

    isHostMacOS() {
        return this.hostPlatform === 'darwin';
    }

    isHostLinux() {
        return this.hostPlatform === 'linux';
    }

    isMobileTarget() {
        return isMobileTargetPlatform(this.platform);
    }

    androidAdbExecutable() {
        return normalizeString(this.env.HUMANCLAW_ANDROID_ADB || this.env.ANDROID_ADB || this.env.ADB, 'adb');
    }

    iosXcrunExecutable() {
        return normalizeString(this.env.HUMANCLAW_IOS_XCRUN || this.env.XCRUN, 'xcrun');
    }

    pathKey(filePath) {
        const resolved = path.resolve(String(filePath || ''));
        return this.isHostWindows() ? resolved.toLowerCase() : resolved;
    }

    isPathInside(rootPath, targetPath) {
        const root = path.resolve(rootPath);
        const target = path.resolve(targetPath);
        const rootComparable = this.pathKey(root);
        const targetComparable = this.pathKey(target);
        return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
    }

    uniquePaths(paths = []) {
        const seen = new Set();
        const result = [];
        for (const entry of normalizeArray(paths)) {
            const normalized = normalizeString(entry);
            if (!normalized) {
                continue;
            }
            const resolved = path.resolve(normalized);
            const key = this.pathKey(resolved);
            if (!seen.has(key)) {
                seen.add(key);
                result.push(resolved);
            }
        }
        return result;
    }

    protectedRoots() {
        if (this.isHostWindows()) {
            const systemDrive = this.env.SystemDrive || 'C:';
            const windir = this.env.WINDIR || `${systemDrive}\\Windows`;
            return this.uniquePaths([
                `${systemDrive}\\`,
                windir,
                `${systemDrive}\\Program Files`,
                `${systemDrive}\\Program Files (x86)`,
                `${systemDrive}\\ProgramData`
            ]);
        }
        if (this.isHostMacOS()) {
            return ['/', '/bin', '/dev', '/etc', '/Library', '/private', '/sbin', '/System', '/usr'];
        }
        return ['/', '/bin', '/boot', '/dev', '/etc', '/lib', '/proc', '/root', '/sbin', '/sys', '/usr'];
    }

    defaultShellExecutable() {
        if (this.isAndroid()) {
            return this.androidAdbExecutable();
        }
        if (this.isAppleMobile()) {
            return this.iosXcrunExecutable();
        }
        if (this.isWindows()) {
            return this.env.ComSpec || 'cmd.exe';
        }
        if (this.isMacOS()) {
            return this.env.SHELL || 'zsh';
        }
        return this.env.SHELL || 'bash';
    }

    shellArgs(command = '') {
        const text = normalizeString(command);
        if (!text) {
            return [];
        }
        if (this.isAndroid()) {
            return ['shell', text];
        }
        if (this.isAppleMobile()) {
            return [];
        }
        return this.isWindows() ? ['/d', '/s', '/c', text] : ['-lc', text];
    }

    shellSpawnOptions({ cwd, env } = {}) {
        return {
            cwd,
            shell: true,
            windowsHide: this.isHostWindows(),
            env: {
                ...this.env,
                ...(env && typeof env === 'object' ? env : {})
            }
        };
    }

    commandSpawnSpec(command = '', { args = [], cwd, env } = {}) {
        const text = normalizeString(command);
        const argList = normalizeArray(args)
            .map((entry) => String(entry))
            .filter((entry) => entry.length > 0);
        const spawnEnv = {
            ...this.env,
            ...(env && typeof env === 'object' ? env : {})
        };
        if (this.isAndroid()) {
            if (!text) {
                return {
                    supported: false,
                    reason: 'Android command execution requires a non-empty adb shell command.'
                };
            }
            return {
                supported: true,
                command: this.androidAdbExecutable(),
                args: argList.length ? ['shell', text, ...argList] : ['shell', text],
                options: {
                    cwd,
                    shell: false,
                    windowsHide: this.isHostWindows(),
                    env: spawnEnv
                },
                targetCommand: text,
                backend: 'adb shell'
            };
        }
        if (this.isAppleMobile()) {
            return {
                supported: false,
                reason: this.isIOSSimulator()
                    ? 'iOS Simulator does not expose a general-purpose POSIX shell through the adapter. Use screenshot/clipboard/Appium-XCUITest style actions instead.'
                    : 'Real iOS devices do not expose a general-purpose shell through AIGL. Use XCUITest/Appium/WebDriverAgent-backed actions after pairing/provisioning.'
            };
        }
        if (argList.length) {
            return {
                supported: true,
                command: text,
                args: argList,
                options: {
                    cwd,
                    shell: false,
                    windowsHide: this.isHostWindows(),
                    env: spawnEnv
                },
                targetCommand: [text, ...argList].join(' '),
                backend: 'direct-spawn'
            };
        }
        return {
            supported: true,
            command: text,
            args: [],
            options: this.shellSpawnOptions({ cwd, env }),
            targetCommand: text,
            backend: this.defaultShellExecutable()
        };
    }

    ptySpawnOptions({ command = '', executable = '', args = [], cwd, env, term = 'xterm-256color', cols = 100, rows = 30, useConpty, useConptyDll } = {}) {
        if (this.isAndroid()) {
            const ptyArgs = Array.isArray(args) && args.length
                ? ['shell', ...args.map((entry) => String(entry))]
                : normalizeString(command)
                ? ['shell', normalizeString(command)]
                : ['shell'];
            return {
                executable: normalizeString(executable, this.androidAdbExecutable()),
                args: ptyArgs,
                options: {
                    name: term,
                    cols,
                    rows,
                    cwd,
                    ...(this.isHostWindows()
                        ? {
                              useConpty: useConpty === undefined ? true : normalizeBoolean(useConpty, true),
                              useConptyDll: normalizeBoolean(useConptyDll, false)
                          }
                        : {}),
                    env: {
                        ...this.env,
                        ...(env && typeof env === 'object' ? env : {})
                    }
                }
            };
        }
        const shell = normalizeString(executable, this.defaultShellExecutable());
        const ptyArgs = Array.isArray(args) && args.length
            ? args.map((entry) => String(entry))
            : this.shellArgs(command);
        return {
            executable: shell,
            args: ptyArgs,
            options: {
                name: term,
                cols,
                rows,
                cwd,
                ...(this.isHostWindows()
                    ? {
                          useConpty: useConpty === undefined ? true : normalizeBoolean(useConpty, true),
                          useConptyDll: normalizeBoolean(useConptyDll, false)
                      }
                    : {}),
                env: {
                    ...this.env,
                    ...(env && typeof env === 'object' ? env : {})
                }
            }
        };
    }

    aclReadCommand(targetPath) {
        return this.isWindows()
            ? { supported: true, command: 'icacls.exe', args: [targetPath] }
            : { supported: true, command: 'ls', args: ['-ld', targetPath] };
    }

    aclSetCommand(targetPath, icaclsArgs = []) {
        if (!this.isWindows()) {
            return {
                supported: false,
                reason: 'acl_set currently has a Windows icacls adapter only.'
            };
        }
        return {
            supported: true,
            command: 'icacls.exe',
            args: [targetPath, ...icaclsArgs]
        };
    }

    powershellCommand(script) {
        if (!this.isWindows()) {
            return {
                supported: false,
                reason: 'PowerShell desktop automation is currently implemented for Windows only.'
            };
        }
        return {
            supported: true,
            command: 'powershell.exe',
            args: ['-NoProfile', '-STA', '-ExecutionPolicy', 'Bypass', '-Command', script],
            windowsHide: true
        };
    }

    desktopScreenshotCommand({ outputPath } = {}) {
        if (this.isAndroid()) {
            const remotePath = `/sdcard/aigl-screen-${Date.now()}-${Math.random().toString(16).slice(2)}.png`;
            const adb = this.androidAdbExecutable();
            return {
                supported: true,
                backend: 'adb-screencap-pull',
                windowsHide: this.isHostWindows(),
                steps: [
                    { command: adb, args: ['shell', 'screencap', '-p', remotePath] },
                    { command: adb, args: ['pull', remotePath, outputPath] },
                    { command: adb, args: ['shell', 'rm', '-f', remotePath], optional: true }
                ]
            };
        }
        if (this.isIOSSimulator()) {
            if (!this.isHostMacOS()) {
                return {
                    supported: false,
                    reason: 'iOS Simulator screenshots require a macOS host with Xcode command line tools.'
                };
            }
            return {
                supported: true,
                command: this.iosXcrunExecutable(),
                args: ['simctl', 'io', 'booted', 'screenshot', outputPath],
                backend: 'xcrun-simctl-screenshot'
            };
        }
        if (this.isIOS()) {
            return {
                supported: false,
                reason: 'Real iOS screenshots require a paired/provisioned XCUITest, Appium, or WebDriverAgent bridge; this adapter currently exposes the iOS Simulator path first.'
            };
        }
        if (this.isMacOS()) {
            return shellScriptCommand(`
set -e
path="$1"
dir="$(dirname "$path")"
mkdir -p "$dir"
if ! command -v screencapture >/dev/null 2>&1; then
  echo "screencapture is not available on this macOS host." >&2
  exit 127
fi
screencapture -x "$path"
printf '{"ok":true,"backend":"screencapture"}\\n'
            `.trim(), [outputPath]);
        }
        if (this.isLinux()) {
            return shellScriptCommand(`
set -e
path="$1"
dir="$(dirname "$path")"
mkdir -p "$dir"
if command -v gnome-screenshot >/dev/null 2>&1; then
  gnome-screenshot -f "$path"
  backend="gnome-screenshot"
elif command -v grim >/dev/null 2>&1; then
  grim "$path"
  backend="grim"
elif command -v spectacle >/dev/null 2>&1; then
  spectacle -b -n -o "$path"
  backend="spectacle"
elif command -v import >/dev/null 2>&1; then
  import -window root "$path"
  backend="imagemagick-import"
elif command -v scrot >/dev/null 2>&1; then
  scrot "$path"
  backend="scrot"
else
  echo "No supported Linux screenshot backend found. Install gnome-screenshot, grim, spectacle, ImageMagick import, or scrot." >&2
  exit 127
fi
printf '{"ok":true,"backend":"%s"}\\n' "$backend"
            `.trim(), [outputPath]);
        }
        if (!this.isWindows()) {
            return {
                supported: false,
                reason: 'screen_screenshot is not supported by this platform adapter.'
            };
        }
        const encodedPath = encodeBase64Utf8(outputPath);
        return this.powershellCommand(`
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$path = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}'))
$dir = [IO.Path]::GetDirectoryName($path)
if ($dir) { [IO.Directory]::CreateDirectory($dir) | Out-Null }
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
@{ ok = $true; path = $path; width = $bounds.Width; height = $bounds.Height } | ConvertTo-Json -Compress
        `.trim());
    }

    clipboardReadCommand() {
        if (this.isAndroid()) {
            return {
                supported: false,
                reason: 'Android clipboard read has no stable universal adb-only backend. Use a helper app, Termux API, or Appium/UIAutomator bridge in a later adapter.'
            };
        }
        if (this.isIOSSimulator()) {
            if (!this.isHostMacOS()) {
                return {
                    supported: false,
                    reason: 'iOS Simulator clipboard requires a macOS host with xcrun simctl.'
                };
            }
            return {
                supported: true,
                command: this.iosXcrunExecutable(),
                args: ['simctl', 'pbpaste', 'booted']
            };
        }
        if (this.isIOS()) {
            return {
                supported: false,
                reason: 'Real iOS clipboard access requires an Appium/XCUITest/WebDriverAgent bridge and user-granted app context.'
            };
        }
        if (this.isMacOS()) {
            return {
                supported: true,
                command: 'pbpaste',
                args: []
            };
        }
        if (this.isLinux()) {
            return shellScriptCommand(`
if command -v wl-paste >/dev/null 2>&1; then
  wl-paste --no-newline 2>/dev/null || wl-paste
elif command -v xclip >/dev/null 2>&1; then
  xclip -selection clipboard -out
elif command -v xsel >/dev/null 2>&1; then
  xsel --clipboard --output
else
  echo "No supported Linux clipboard read backend found. Install wl-clipboard, xclip, or xsel." >&2
  exit 127
fi
            `.trim());
        }
        return this.powershellCommand(`
$ErrorActionPreference = 'Stop'
$value = Get-Clipboard -Raw
if ($null -eq $value) { $value = '' }
@{ ok = $true; text = $value } | ConvertTo-Json -Compress
        `.trim());
    }

    clipboardWriteCommand({ text = '' } = {}) {
        const encodedText = encodeBase64Utf8(text);
        if (this.isAndroid()) {
            return {
                supported: false,
                reason: 'Android clipboard write has no stable universal adb-only backend. Use Appium clipboard APIs, a helper IME/app, or Termux API in a later adapter.'
            };
        }
        if (this.isIOSSimulator()) {
            if (!this.isHostMacOS()) {
                return {
                    supported: false,
                    reason: 'iOS Simulator clipboard requires a macOS host with xcrun simctl.'
                };
            }
            return shellScriptCommand(`
set -e
encoded="$1"
decode() {
  printf "%s" "$encoded" | base64 --decode 2>/dev/null || printf "%s" "$encoded" | base64 -D
}
decode | xcrun simctl pbcopy booted
printf '{"ok":true,"backend":"xcrun-simctl-pbcopy"}\\n'
            `.trim(), [encodedText]);
        }
        if (this.isIOS()) {
            return {
                supported: false,
                reason: 'Real iOS clipboard access requires an Appium/XCUITest/WebDriverAgent bridge and user-granted app context.'
            };
        }
        if (this.isMacOS()) {
            return shellScriptCommand(`
set -e
encoded="$1"
decode() {
  printf "%s" "$encoded" | base64 --decode 2>/dev/null || printf "%s" "$encoded" | base64 -D
}
if ! command -v pbcopy >/dev/null 2>&1; then
  echo "pbcopy is not available on this macOS host." >&2
  exit 127
fi
decode | pbcopy
printf '{"ok":true,"backend":"pbcopy"}\\n'
            `.trim(), [encodedText]);
        }
        if (this.isLinux()) {
            return shellScriptCommand(`
set -e
encoded="$1"
decode() {
  printf "%s" "$encoded" | base64 --decode
}
if command -v wl-copy >/dev/null 2>&1; then
  decode | wl-copy
  backend="wl-copy"
elif command -v xclip >/dev/null 2>&1; then
  decode | xclip -selection clipboard -in
  backend="xclip"
elif command -v xsel >/dev/null 2>&1; then
  decode | xsel --clipboard --input
  backend="xsel"
else
  echo "No supported Linux clipboard write backend found. Install wl-clipboard, xclip, or xsel." >&2
  exit 127
fi
printf '{"ok":true,"backend":"%s"}\\n' "$backend"
            `.trim(), [encodedText]);
        }
        return this.powershellCommand(`
$ErrorActionPreference = 'Stop'
$text = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedText}'))
Set-Clipboard -Value $text
@{ ok = $true; bytes = [Text.Encoding]::UTF8.GetByteCount($text) } | ConvertTo-Json -Compress
        `.trim());
    }

    guiInputCommand(args = {}) {
        const action = normalizeString(args.action || args.operation || args.intent).toLowerCase();
        if (this.isAndroid()) {
            const adb = this.androidAdbExecutable();
            const x = Math.round(Number(args.x) || 0);
            const y = Math.round(Number(args.y) || 0);
            const endX = Math.round(Number(args.endX ?? args.toX ?? args.x2 ?? x) || 0);
            const endY = Math.round(Number(args.endY ?? args.toY ?? args.y2 ?? y) || 0);
            const durationMs = Math.round(Math.min(Math.max(Number(args.durationMs ?? args.duration ?? 180) || 180, 0), 10000));
            const delta = Math.round(Number(args.delta ?? args.scrollDelta ?? args.amount ?? -600) || -600);
            const windowsHide = this.isHostWindows();
            if (['mouse_click', 'click'].includes(action)) {
                return { supported: true, command: adb, args: ['shell', 'input', 'tap', String(x), String(y)], windowsHide };
            }
            if (['mouse_double_click', 'double_click'].includes(action)) {
                return {
                    supported: true,
                    windowsHide,
                    steps: [
                        { command: adb, args: ['shell', 'input', 'tap', String(x), String(y)] },
                        { command: adb, args: ['shell', 'input', 'tap', String(x), String(y)] }
                    ]
                };
            }
            if (['mouse_drag', 'drag'].includes(action)) {
                return {
                    supported: true,
                    command: adb,
                    args: ['shell', 'input', 'swipe', String(x), String(y), String(endX), String(endY), String(durationMs)],
                    windowsHide
                };
            }
            if (['scroll', 'mouse_scroll'].includes(action)) {
                const scrollEndY = y + delta;
                return {
                    supported: true,
                    command: adb,
                    args: ['shell', 'input', 'swipe', String(x), String(y), String(x), String(scrollEndY), String(durationMs)],
                    windowsHide
                };
            }
            if (['keyboard_type', 'type_text', 'type'].includes(action)) {
                return {
                    supported: true,
                    command: adb,
                    args: ['shell', 'input', 'text', androidInputText(args.text || args.content || '')],
                    windowsHide
                };
            }
            if (['keyboard_hotkey', 'hotkey', 'keyboard_press', 'press_key'].includes(action)) {
                const keys = parseKeyChord(args.keys || args.key || args.chord || '');
                const keyCode = androidKeyCode(keys[keys.length - 1] || args.key || args.chord || '');
                if (!keyCode) {
                    return {
                        supported: false,
                        reason: `Unsupported Android key event: ${args.keys || args.key || args.chord || ''}`
                    };
                }
                return {
                    supported: true,
                    command: adb,
                    args: ['shell', 'input', 'keyevent', keyCode],
                    windowsHide
                };
            }
            return {
                supported: false,
                reason: `Unsupported Android GUI action: ${action}`
            };
        }
        if (!this.isWindows()) {
            const platformLabel = this.isMacOS()
                ? 'macOS'
                : this.isLinux()
                ? 'Linux'
                : this.id;
            return {
                supported: false,
                reason: `${platformLabel} GUI input adapter is a skeleton for now. Shell, filesystem, PTY, screenshot, and clipboard are available first; click/type/hotkey will be added behind the same adapter surface later.`
            };
        }
        const x = Math.round(Number(args.x) || 0);
        const y = Math.round(Number(args.y) || 0);
        const endX = Math.round(Number(args.endX ?? args.toX ?? args.x2 ?? x) || 0);
        const endY = Math.round(Number(args.endY ?? args.toY ?? args.y2 ?? y) || 0);
        const durationMs = Math.round(Math.min(Math.max(Number(args.durationMs ?? args.duration ?? 120) || 120, 0), 10000));
        const delta = Math.round(Number(args.delta ?? args.scrollDelta ?? args.amount ?? -600) || -600);
        const keys = keyChordToSendKeys(args.keys || args.key || args.chord || '');
        const textBase64 = encodeBase64Utf8(args.text || args.content || '');
        const keyBase64 = encodeBase64Utf8(keys);
        const mouseScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class AiglWinInput {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint dx, uint dy, int data, UIntPtr extra);
}
"@
function MoveTo([int]$mx, [int]$my) { [AiglWinInput]::SetCursorPos($mx, $my) | Out-Null }
function LeftClick() { [AiglWinInput]::mouse_event(0x0002,0,0,0,[UIntPtr]::Zero); Start-Sleep -Milliseconds 30; [AiglWinInput]::mouse_event(0x0004,0,0,0,[UIntPtr]::Zero) }
function RightClick() { [AiglWinInput]::mouse_event(0x0008,0,0,0,[UIntPtr]::Zero); Start-Sleep -Milliseconds 30; [AiglWinInput]::mouse_event(0x0010,0,0,0,[UIntPtr]::Zero) }
        `.trim();
        let body = '';
        if (['mouse_move', 'move_mouse'].includes(action)) {
            body = `${mouseScript}\nMoveTo ${x} ${y}`;
        } else if (['mouse_click', 'click'].includes(action)) {
            body = `${mouseScript}\nMoveTo ${x} ${y}\nLeftClick`;
        } else if (['mouse_double_click', 'double_click'].includes(action)) {
            body = `${mouseScript}\nMoveTo ${x} ${y}\nLeftClick\nStart-Sleep -Milliseconds 80\nLeftClick`;
        } else if (['mouse_right_click', 'right_click'].includes(action)) {
            body = `${mouseScript}\nMoveTo ${x} ${y}\nRightClick`;
        } else if (['mouse_drag', 'drag'].includes(action)) {
            body = `${mouseScript}
MoveTo ${x} ${y}
[AiglWinInput]::mouse_event(0x0002,0,0,0,[UIntPtr]::Zero)
$steps = [Math]::Max(1, [Math]::Min(40, [Math]::Round(${durationMs} / 30)))
for ($i = 1; $i -le $steps; $i++) {
    $nx = [Math]::Round(${x} + ((${endX} - ${x}) * $i / $steps))
    $ny = [Math]::Round(${y} + ((${endY} - ${y}) * $i / $steps))
    MoveTo $nx $ny
    Start-Sleep -Milliseconds ([Math]::Max(1, [Math]::Round(${durationMs} / $steps)))
}
[AiglWinInput]::mouse_event(0x0004,0,0,0,[UIntPtr]::Zero)`;
        } else if (['scroll', 'mouse_scroll'].includes(action)) {
            body = `${mouseScript}\nMoveTo ${x} ${y}\n[AiglWinInput]::mouse_event(0x0800,0,0,${delta},[UIntPtr]::Zero)`;
        } else if (['keyboard_type', 'type_text', 'type'].includes(action)) {
            body = `
Add-Type -AssemblyName System.Windows.Forms
$text = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${textBase64}'))
Set-Clipboard -Value $text
Start-Sleep -Milliseconds 60
[System.Windows.Forms.SendKeys]::SendWait('^v')
            `.trim();
        } else if (['keyboard_hotkey', 'hotkey', 'keyboard_press', 'press_key'].includes(action)) {
            body = `
Add-Type -AssemblyName System.Windows.Forms
$keys = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${keyBase64}'))
[System.Windows.Forms.SendKeys]::SendWait($keys)
            `.trim();
        } else {
            return {
                supported: false,
                reason: `Unsupported GUI action: ${action}`
            };
        }
        return this.powershellCommand(`
$ErrorActionPreference = 'Stop'
${body}
@{ ok = $true; action = '${action}'; x = ${x}; y = ${y}; endX = ${endX}; endY = ${endY}; durationMs = ${durationMs}; delta = ${delta} } | ConvertTo-Json -Compress
        `.trim());
    }

    async killProcessTree(child, signal = 'SIGTERM') {
        if (!child) {
            return { ok: false, status: 'missing_child' };
        }
        if (this.isHostWindows() && child.pid) {
            return await new Promise((resolve) => {
                const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
                    stdio: 'ignore',
                    windowsHide: true
                });
                killer.on('close', (code) => {
                    resolve({ ok: code === 0, status: code === 0 ? 'killed' : 'taskkill_failed', code, pid: child.pid });
                });
                killer.on('error', (error) => {
                    try {
                        child.kill(signal);
                    } catch {}
                    resolve({
                        ok: false,
                        status: 'taskkill_error',
                        pid: child.pid,
                        error: error?.message || String(error)
                    });
                });
            });
        }
        try {
            child.kill(signal);
            return { ok: true, status: 'killed', signal, pid: child.pid || null };
        } catch (error) {
            return {
                ok: false,
                status: 'kill_failed',
                signal,
                pid: child.pid || null,
                error: error?.message || String(error)
            };
        }
    }

    getStatus() {
        const capabilityMatrix = this.getCapabilityMatrix();
        const shellAvailable = capabilityMatrix.shell.status !== 'unavailable';
        const ptyAvailable = capabilityMatrix.pty.status !== 'unavailable';
        return {
            id: this.id,
            platform: this.platform,
            hostPlatform: this.hostPlatform,
            arch: this.arch,
            family: this.isAndroid()
                ? 'android'
                : this.isAppleMobile()
                ? 'ios'
                : this.isWindows()
                ? 'windows'
                : this.isMacOS()
                ? 'macos'
                : this.isLinux()
                ? 'linux'
                : 'unknown',
            capabilities: {
                desktopApp: ['windows', 'macos', 'linux'].includes(this.id),
                mobileDevice: ['android', 'ios', 'ios-simulator'].includes(this.id),
                shell: shellAvailable,
                processKill: true,
                processTreeKill: this.isHostWindows(),
                filesystem: true,
                deviceFilesystem: capabilityMatrix.deviceFilesystem?.status || 'unavailable',
                aclRead: true,
                aclSet: this.isWindows(),
                pty: ptyAvailable,
                screenCapture: capabilityMatrix.screenCapture.status,
                windowControl: 'electron-adapter',
                guiInput: this.isWindows() ? 'windows-powershell-user32' : capabilityMatrix.guiInput.status,
                clipboard: capabilityMatrix.clipboard.status
            },
            capabilityMatrix,
            defaults: {
                shell: this.defaultShellExecutable()
            }
        };
    }

    getCapabilityMatrix() {
        const family = this.isWindows()
            ? 'windows'
            : this.isMacOS()
            ? 'macos'
            : this.isLinux()
            ? 'linux'
            : this.isAndroid()
            ? 'android'
            : this.isAppleMobile()
            ? 'ios'
            : 'unknown';
        const common = {
            platform: family,
            hostPlatform: this.hostPlatform,
            filesystem: { status: 'available', backend: 'node-fs' },
            deviceFilesystem: { status: 'unavailable', backend: 'pending' },
            shell: { status: 'available', backend: this.defaultShellExecutable() },
            pty: { status: 'available', backend: this.isWindows() ? 'node-pty-conpty' : 'node-pty-posix' },
            processKill: { status: 'available', backend: this.isWindows() ? 'taskkill/direct' : 'posix-signal' },
            aclRead: { status: 'available', backend: this.isWindows() ? 'icacls' : 'ls -ld' },
            aclSet: { status: 'unavailable', backend: 'pending' },
            screenCapture: { status: 'unavailable', backend: 'pending' },
            clipboard: { status: 'unavailable', backend: 'pending' },
            guiInput: { status: 'unavailable', backend: 'pending' },
            windowControl: { status: 'electron-only', backend: 'electron-desktop-adapter' }
        };
        if (this.isWindows()) {
            return {
                ...common,
                aclSet: { status: 'available', backend: 'icacls' },
                screenCapture: { status: 'available', backend: 'powershell-system-drawing' },
                clipboard: { status: 'available', backend: 'powershell-get-set-clipboard' },
                guiInput: { status: 'available', backend: 'powershell-user32-sendkeys' }
            };
        }
        if (this.isMacOS()) {
            return {
                ...common,
                screenCapture: { status: 'available', backend: 'screencapture' },
                clipboard: { status: 'available', backend: 'pbpaste/pbcopy' },
                guiInput: { status: 'skeleton', backend: 'accessibility-api-or-applescript-pending' }
            };
        }
        if (this.isLinux()) {
            return {
                ...common,
                screenCapture: {
                    status: 'available-if-installed',
                    backend: 'gnome-screenshot|grim|spectacle|imagemagick-import|scrot'
                },
                clipboard: { status: 'available-if-installed', backend: 'wl-clipboard|xclip|xsel' },
                guiInput: { status: 'skeleton', backend: 'xdotool|ydotool|portal-pending' }
            };
        }
        if (this.isAndroid()) {
            return {
                ...common,
                shell: { status: 'available-if-adb', backend: `${this.androidAdbExecutable()} shell` },
                pty: { status: 'limited', backend: 'node-pty + adb shell' },
                processKill: { status: 'host-adb-process', backend: this.isHostWindows() ? 'taskkill adb process' : 'posix-signal adb process' },
                aclRead: { status: 'host-local', backend: this.isHostWindows() ? 'icacls' : 'ls -ld' },
                screenCapture: { status: 'available-if-adb', backend: 'adb shell screencap + adb pull' },
                clipboard: { status: 'skeleton', backend: 'Appium|Termux API|helper app pending' },
                guiInput: { status: 'available-basic', backend: 'adb shell input tap|swipe|text|keyevent' },
                deviceFilesystem: { status: 'limited', backend: 'adb shell/push/pull bridge pending as first-class file API' },
                windowControl: { status: 'mobile-surface', backend: 'adb activity/window commands pending' }
            };
        }
        if (this.isIOSSimulator()) {
            return {
                ...common,
                shell: { status: 'unavailable', backend: 'no-general-ios-shell' },
                pty: { status: 'unavailable', backend: 'no-general-ios-shell' },
                processKill: { status: 'limited', backend: 'xcrun simctl terminate pending' },
                screenCapture: { status: this.isHostMacOS() ? 'available-if-simulator' : 'unavailable', backend: 'xcrun simctl io booted screenshot' },
                clipboard: { status: this.isHostMacOS() ? 'available-if-simulator' : 'unavailable', backend: 'xcrun simctl pbpaste/pbcopy' },
                guiInput: { status: 'skeleton', backend: 'XCUITest|Appium|WebDriverAgent pending' },
                deviceFilesystem: { status: 'limited', backend: 'xcrun simctl get_app_container pending' },
                windowControl: { status: 'mobile-surface', backend: 'simctl ui/app lifecycle pending' }
            };
        }
        if (this.isIOS()) {
            return {
                ...common,
                shell: { status: 'unavailable', backend: 'no-general-ios-shell' },
                pty: { status: 'unavailable', backend: 'no-general-ios-shell' },
                processKill: { status: 'limited', backend: 'XCUITest/Appium app lifecycle pending' },
                screenCapture: { status: 'skeleton', backend: 'XCUITest|Appium|WebDriverAgent pending' },
                clipboard: { status: 'skeleton', backend: 'Appium set/get clipboard pending' },
                guiInput: { status: 'skeleton', backend: 'XCUITest|Appium|WebDriverAgent pending' },
                deviceFilesystem: { status: 'limited', backend: 'app-container only through XCUITest/Appium pending' },
                windowControl: { status: 'mobile-surface', backend: 'app lifecycle only after provisioning' }
            };
        }
        return common;
    }
}

let defaultAdapter = null;

function createHumanClawPlatformAdapter(options = {}) {
    if (options instanceof HumanClawPlatformAdapter) {
        return options;
    }
    if (typeof options === 'string') {
        return new HumanClawPlatformAdapter({ platform: options });
    }
    return new HumanClawPlatformAdapter(options);
}

function getDefaultPlatformAdapter() {
    if (!defaultAdapter) {
        defaultAdapter = createHumanClawPlatformAdapter();
    }
    return defaultAdapter;
}

module.exports = {
    HumanClawPlatformAdapter,
    createHumanClawPlatformAdapter,
    getDefaultPlatformAdapter
};
