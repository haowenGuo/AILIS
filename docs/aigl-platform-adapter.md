# AIGL Platform Adapter Architecture

AIGL keeps Windows as the first-class desktop target, but platform-specific behavior must live behind a Platform Adapter instead of leaking into Agent, Memory, Skill, MCP, or Persona code.

## Layers

```text
AIGL Core
Agent Loop / Memory / Skills / MCP / Eval / Persona Surface
        |
HumanClaw Tool Contracts
        |
Computer and Vision Tool Interfaces
        |
Platform Adapter
        |
        Windows Adapter first, then macOS / Linux / Android / iOS adapters
```

## Platform-Neutral Core

These modules should stay platform neutral:

- Agent Loop, Turn Items, tool observations, and generic recovery handling
- Memory and relationship state
- Persona Surface Gateway
- Tool contracts and Skill packages
- MCP session manager and Capability Manager
- Eval runners and reports

They may read `platform` metadata from observations, but should not hard-code Windows, macOS, Linux, Android, or iOS assumptions.

## Adapter Surface

The base adapter lives in `electron/humanclaw-platform-adapter.cjs`.

It currently owns:

- Platform identity and capability metadata
- Capability matrix for filesystem, shell, PTY, screenshot, clipboard, GUI input, ACL, and process control
- Case-insensitive path comparison on Windows
- Protected root detection
- Default shell and PTY shell arguments
- ACL read/write command selection
- Cross-platform screenshot command selection
- Cross-platform clipboard command selection
- Windows process-tree termination via `taskkill`
- Mobile target dispatch: Android commands are routed through ADB, while iOS is currently exposed as Simulator-first skeleton capability

The first connected consumer is `computer`. Gateway and Runtime also expose platform status so tools and evals can verify the active platform.

The Electron shell adapter lives in `electron/humanclaw-desktop-platform-adapter.cjs`.

It owns desktop-shell behavior that previously leaked into `electron/main.cjs`:

- Electron `desktopCapturer` screen snapshots
- `BrowserWindow.capturePage()` window snapshots
- Region capture overlay windows
- Display-aware window clamping and dialogue expansion layout
- Transparent/topmost/all-workspaces window behavior
- Mouse passthrough via `setIgnoreMouseEvents`

`main.cjs` should keep product state and IPC wiring, while this adapter owns Electron-specific screen/window primitives.

## Windows Priority

The Windows adapter remains the production path for now:

- Electron desktop shell
- VRM pet window and chat/control windows
- Screenshot and region capture
- Local computer/filesystem/process tools
- TTS/ASR desktop pipeline

Windows-only behavior is allowed inside the adapter or Windows-specific Electron capture/window code, but should not be copied into Agent prompt logic or generic tool contracts.

## Current Desktop Capability Matrix

| Capability | Windows | macOS | Linux |
|---|---|---|---|
| Filesystem | Node fs | Node fs | Node fs |
| Shell command | `cmd.exe` by default | `zsh`/`SHELL` | `bash`/`SHELL` |
| PTY | node-pty ConPTY | node-pty POSIX | node-pty POSIX |
| Screenshot | PowerShell + System.Drawing | `screencapture` | `gnome-screenshot` / `grim` / `spectacle` / `import` / `scrot` if installed |
| Clipboard read | PowerShell `Get-Clipboard` | `pbpaste` | `wl-paste` / `xclip` / `xsel` if installed |
| Clipboard write | PowerShell `Set-Clipboard` | `pbcopy` | `wl-copy` / `xclip` / `xsel` if installed |
| GUI input | PowerShell User32 / SendKeys | skeleton only | skeleton only |
| ACL read | `icacls` | `ls -ld` | `ls -ld` |
| ACL set | `icacls` | unavailable | unavailable |
| Window capture/control | Electron desktop adapter | Electron desktop adapter | Electron desktop adapter, subject to compositor permissions |

Linux screenshot and clipboard support is intentionally reported as `available-if-installed`.
Wayland desktops may block global screenshot, clipboard, or input automation unless the user grants portal/compositor permissions or installs a backend such as `grim` / `wl-clipboard`.

## Current Mobile Capability Matrix

Mobile adapters distinguish the target device platform from the host desktop platform. For example, AIGL can run on Windows while controlling Android through `adb`; local project files and process cleanup still follow Windows host rules, while device input/screenshot uses Android rules.

| Capability | Android | iOS Simulator | Real iOS Device |
|---|---|---|---|
| General shell | `adb shell` | unavailable | unavailable |
| PTY | limited `node-pty + adb shell` | unavailable | unavailable |
| Screenshot | `adb shell screencap -p` + `adb pull` | `xcrun simctl io booted screenshot` on macOS host | skeleton: XCUITest/Appium/WebDriverAgent needed |
| Basic input | `adb shell input tap/swipe/text/keyevent` | skeleton: XCUITest/Appium needed | skeleton: XCUITest/Appium/WebDriverAgent needed |
| Clipboard read/write | skeleton: helper app, Termux API, or Appium needed | `xcrun simctl pbpaste/pbcopy` on macOS host | skeleton: Appium/XCUITest app context needed |
| Device filesystem | limited: ADB shell/push/pull bridge planned | limited: app container APIs planned | limited: app container only after provisioning |
| Local project filesystem | Node fs on host | Node fs on host | Node fs on host |

Android is the first mobile path with real executable controls because ADB provides stable primitives for shell, screenshot, tap, swipe, text, and key events.

iOS is intentionally not marked as fully available. Apple does not expose a general-purpose device shell for normal automation, so the adapter starts with Simulator support and leaves real-device automation behind a future XCUITest/Appium/WebDriverAgent bridge.

## Future Adapters

Future platform adapters should implement the same conceptual surface:

- `observeScreen`
- `listWindows`
- `focusWindow`
- `click`
- `typeText`
- `hotkey`
- `scroll`
- `drag`
- `runCommand`
- `killProcessTree`
- `readClipboard`
- `writeClipboard`

Expected backends:

- Windows: Electron, Win32/UIAutomation, PowerShell/cmd, `taskkill`
- macOS: Electron, `screencapture`, `pbpaste`/`pbcopy`, Accessibility API or AppleScript later, zsh
- Linux: Electron, `gnome-screenshot`/`grim`/`spectacle`, `wl-clipboard`/`xclip`/`xsel`, X11/Wayland-specific input later, DBus, bash
- Android: ADB, UIAutomator, Appium, screenshot/OCR, push/pull device file bridge
- iOS simulator: `xcrun simctl`, XCUITest/Appium, simulator APIs
- Real iOS: XCUITest/Appium/WebDriverAgent, provisioning-aware app lifecycle and app-container files

## Migration Rule

When adding platform-specific behavior:

1. Put the generic tool contract in `humanclaw-tool-contracts.cjs`.
2. Put platform-neutral orchestration in Agent/Runtime.
3. Put OS-specific command/API decisions in `humanclaw-platform-adapter.cjs` or a platform-specific adapter module.
4. Add a test that simulates at least Windows and one non-Windows adapter.
