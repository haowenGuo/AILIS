# docs/ailis-platform-adapter.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。
- 文件类型：`documentation`
- 原始行数：146
- SHA-256：`c4b52dcae676bac5a72922ebccd2083e111a8dd9520f15e8fe82b69cfa98a0de`
- 可运行副本：[打开源文件](../../../source/docs/ailis-platform-adapter.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`desktop`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Platform Adapter Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS keeps Windows as the first-class desktop target, but platform-specific behavior must live behind a Platform Adapter instead of leaking into Agent, Memory, Skill, MCP, or Persona code.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Layers</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 8 | <code>AILIS Core</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>Agent Loop / Memory / Skills / MCP / Eval / Persona Surface</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 11 | <code>AILIS Tool Contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 13 | <code>Computer and Vision Tool Interfaces</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 15 | <code>Platform Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 17 | <code>        Windows Adapter first, then macOS / Linux / Android / iOS adapters</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>## Platform-Neutral Core</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>These modules should stay platform neutral:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>- Agent Loop, Turn Items, tool observations, and generic recovery handling</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- Memory and relationship state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- Persona Surface Gateway</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- Tool contracts and Skill packages</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- MCP session manager and Capability Manager</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- Eval runners and reports</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>They may read `platform` metadata from observations, but should not hard-code Windows, macOS, Linux, Android, or iOS assumptions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>## Adapter Surface</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>The base adapter lives in `electron/ailis-platform-adapter.cjs`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>It currently owns:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>- Platform identity and capability metadata</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- Capability matrix for filesystem, shell, PTY, screenshot, clipboard, GUI input, ACL, and process control</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- Case-insensitive path comparison on Windows</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- Protected root detection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- Default shell and PTY shell arguments</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- ACL read/write command selection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- Cross-platform screenshot command selection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- Cross-platform clipboard command selection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- Windows process-tree termination via `taskkill`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- Mobile target dispatch: Android commands are routed through ADB, while iOS is currently exposed as Simulator-first skeleton capability</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>The first connected consumer is `computer`. Gateway and Runtime also expose platform status so tools and evals can verify the active platform.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>The Electron shell adapter lives in `electron/ailis-desktop-platform-adapter.cjs`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>It owns desktop-shell behavior that previously leaked into `electron/main.cjs`:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>- Electron `desktopCapturer` screen snapshots</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- `BrowserWindow.capturePage()` window snapshots</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- Region capture overlay windows</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- Display-aware window clamping and dialogue expansion layout</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- Transparent/topmost/all-workspaces window behavior</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- Mouse passthrough via `setIgnoreMouseEvents`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>`main.cjs` should keep product state and IPC wiring, while this adapter owns Electron-specific screen/window primitives.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>## Windows Priority</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>The Windows adapter remains the production path for now:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- Electron desktop shell</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- VRM pet window and chat/control windows</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- Screenshot and region capture</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- Local computer/filesystem/process tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- TTS/ASR desktop pipeline</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>Windows-only behavior is allowed inside the adapter or Windows-specific Electron capture/window code, but should not be copied into Agent prompt logic or generic tool contracts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## Current Desktop Capability Matrix</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>&#124; Capability &#124; Windows &#124; macOS &#124; Linux &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 80 | <code>&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 81 | <code>&#124; Filesystem &#124; Node fs &#124; Node fs &#124; Node fs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 82 | <code>&#124; Shell command &#124; `cmd.exe` by default &#124; `zsh`/`SHELL` &#124; `bash`/`SHELL` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 83 | <code>&#124; PTY &#124; node-pty ConPTY &#124; node-pty POSIX &#124; node-pty POSIX &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 84 | <code>&#124; Screenshot &#124; PowerShell + System.Drawing &#124; `screencapture` &#124; `gnome-screenshot` / `grim` / `spectacle` / `import` / `scrot` if installed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 85 | <code>&#124; Clipboard read &#124; PowerShell `Get-Clipboard` &#124; `pbpaste` &#124; `wl-paste` / `xclip` / `xsel` if installed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 86 | <code>&#124; Clipboard write &#124; PowerShell `Set-Clipboard` &#124; `pbcopy` &#124; `wl-copy` / `xclip` / `xsel` if installed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 87 | <code>&#124; GUI input &#124; PowerShell User32 / SendKeys &#124; skeleton only &#124; skeleton only &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 88 | <code>&#124; ACL read &#124; `icacls` &#124; `ls -ld` &#124; `ls -ld` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>&#124; ACL set &#124; `icacls` &#124; unavailable &#124; unavailable &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 90 | <code>&#124; Window capture/control &#124; Electron desktop adapter &#124; Electron desktop adapter &#124; Electron desktop adapter, subject to compositor permissions &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>Linux screenshot and clipboard support is intentionally reported as `available-if-installed`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>Wayland desktops may block global screenshot, clipboard, or input automation unless the user grants portal/compositor permissions or installs a backend such as `grim` / `wl-clipboard`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>## Current Mobile Capability Matrix</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>Mobile adapters distinguish the target device platform from the host desktop platform. For example, AILIS can run on Windows while controlling Android through `adb`; local project files and process cleanup still follow Windows host rules, while device input/screenshot uses Android rules.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>&#124; Capability &#124; Android &#124; iOS Simulator &#124; Real iOS Device &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 100 | <code>&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 101 | <code>&#124; General shell &#124; `adb shell` &#124; unavailable &#124; unavailable &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 102 | <code>&#124; PTY &#124; limited `node-pty + adb shell` &#124; unavailable &#124; unavailable &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 103 | <code>&#124; Screenshot &#124; `adb shell screencap -p` + `adb pull` &#124; `xcrun simctl io booted screenshot` on macOS host &#124; skeleton: XCUITest/Appium/WebDriverAgent needed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 104 | <code>&#124; Basic input &#124; `adb shell input tap/swipe/text/keyevent` &#124; skeleton: XCUITest/Appium needed &#124; skeleton: XCUITest/Appium/WebDriverAgent needed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 105 | <code>&#124; Clipboard read/write &#124; skeleton: helper app, Termux API, or Appium needed &#124; `xcrun simctl pbpaste/pbcopy` on macOS host &#124; skeleton: Appium/XCUITest app context needed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 106 | <code>&#124; Device filesystem &#124; limited: ADB shell/push/pull bridge planned &#124; limited: app container APIs planned &#124; limited: app container only after provisioning &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 107 | <code>&#124; Local project filesystem &#124; Node fs on host &#124; Node fs on host &#124; Node fs on host &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>Android is the first mobile path with real executable controls because ADB provides stable primitives for shell, screenshot, tap, swipe, text, and key events.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>iOS is intentionally not marked as fully available. Apple does not expose a general-purpose device shell for normal automation, so the adapter starts with Simulator support and leaves real-device automation behind a future XCUITest/Appium/WebDriverAgent bridge.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>## Future Adapters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>Future platform adapters should implement the same conceptual surface:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>- `observeScreen`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- `listWindows`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>- `focusWindow`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- `click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `typeText`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>- `hotkey`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 123 | <code>- `scroll`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 124 | <code>- `drag`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 125 | <code>- `runCommand`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>- `killProcessTree`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- `readClipboard`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- `writeClipboard`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>Expected backends:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>- Windows: Electron, Win32/UIAutomation, PowerShell/cmd, `taskkill`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- macOS: Electron, `screencapture`, `pbpaste`/`pbcopy`, Accessibility API or AppleScript later, zsh</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- Linux: Electron, `gnome-screenshot`/`grim`/`spectacle`, `wl-clipboard`/`xclip`/`xsel`, X11/Wayland-specific input later, DBus, bash</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- Android: ADB, UIAutomator, Appium, screenshot/OCR, push/pull device file bridge</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- iOS simulator: `xcrun simctl`, XCUITest/Appium, simulator APIs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- Real iOS: XCUITest/Appium/WebDriverAgent, provisioning-aware app lifecycle and app-container files</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>## Migration Rule</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>When adding platform-specific behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>1. Put the generic tool contract in `ailis-tool-contracts.cjs`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>2. Put platform-neutral orchestration in Agent/Runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>3. Put OS-specific command/API decisions in `ailis-platform-adapter.cjs` or a platform-specific adapter module.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>4. Add a test that simulates at least Windows and one non-Windows adapter.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
