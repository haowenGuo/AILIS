# electron/preload.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。
- 文件类型：`source-code`
- 原始行数：276
- SHA-256：`1591d3942500221f1a4b245ccc8391abce503b52c01b889d6b8d16543f860c2f`
- 可运行副本：[打开源文件](../../../source/electron/preload.cjs)
- 依赖：`electron`
- 主要符号：`getCurrentPageName`、`currentPageName`、`shouldLoadPreferencesSynchronously`、`initialPreferences`、`createResourceUrl`、`cleanPath`、`wrapped`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const { contextBridge, ipcRenderer, webUtils } = require('electron');</code> | 导入依赖 `electron`，使本文件可以复用外部模块能力。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>function getCurrentPageName() {</code> | 定义函数 `getCurrentPageName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 4 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5 | <code>        return String(window.location?.pathname &#124;&#124; '').split('/').pop() &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 6 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 7 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 8 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 9 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const currentPageName = getCurrentPageName();</code> | 声明局部标识符 `currentPageName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 12 | <code>const shouldLoadPreferencesSynchronously = !new Set([</code> | 声明局部标识符 `shouldLoadPreferencesSynchronously`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 13 | <code>    'control.html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 14 | <code>    'agent-lab.html'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 15 | <code>]).has(currentPageName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 16 | <code>const initialPreferences = shouldLoadPreferencesSynchronously</code> | 声明局部标识符 `initialPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 17 | <code>    ? ipcRenderer.sendSync('ailis:get-preferences-sync')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 18 | <code>    : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>function createResourceUrl(relativePath = '') {</code> | 定义函数 `createResourceUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 21 | <code>    const cleanPath = String(relativePath &#124;&#124; '')</code> | 声明局部标识符 `cleanPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 22 | <code>        .replace(/\\/g, '/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 23 | <code>        .replace(/^\/+/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 24 | <code>        .split('/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 25 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 26 | <code>        .map((segment) =&gt; encodeURIComponent(segment))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 27 | <code>        .join('/');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 28 | <code>    return `ailis-resource:///${cleanPath}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>contextBridge.exposeInMainWorld('ailisDesktop', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 32 | <code>    platform: 'electron',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 33 | <code>    preferences: initialPreferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 34 | <code>    resourceUrl: createResourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 35 | <code>    versions: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 36 | <code>        chrome: process.versions.chrome,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 37 | <code>        electron: process.versions.electron,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 38 | <code>        node: process.versions.node</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 39 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    getControlPanelState: () =&gt; ipcRenderer.invoke('ailis:get-control-panel-state'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 41 | <code>    getPreferences: () =&gt; ipcRenderer.invoke('ailis:get-preferences'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 42 | <code>    savePreferences: (payload) =&gt; ipcRenderer.invoke('ailis:save-preferences', payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 43 | <code>    restoreDefaultPreferences: () =&gt; ipcRenderer.invoke('ailis:restore-default-preferences'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 44 | <code>    chooseAILISStateDir: () =&gt; ipcRenderer.invoke('ailis:choose-ailis-state-dir'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 45 | <code>    toggleChatWindow: () =&gt; ipcRenderer.invoke('ailis:toggle-chat-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 46 | <code>    showChatWindow: () =&gt; ipcRenderer.invoke('ailis:show-chat-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 47 | <code>    hideChatWindow: () =&gt; ipcRenderer.invoke('ailis:hide-chat-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 48 | <code>    showControlPanel: () =&gt; ipcRenderer.invoke('ailis:show-control-panel'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 49 | <code>    showAgentLab: () =&gt; ipcRenderer.invoke('ailis:show-agent-lab'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 50 | <code>    showControlMenu: () =&gt; ipcRenderer.invoke('ailis:show-control-menu'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 51 | <code>    showTextEditMenu: (payload) =&gt; ipcRenderer.invoke('ailis:show-text-edit-menu', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 52 | <code>    minimizeCurrentWindow: () =&gt; ipcRenderer.invoke('ailis:minimize-current-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 53 | <code>    toggleMaximizeCurrentWindow: () =&gt; ipcRenderer.invoke('ailis:toggle-maximize-current-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 54 | <code>    getCurrentWindowState: () =&gt; ipcRenderer.invoke('ailis:get-current-window-state'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 55 | <code>    closeCurrentWindow: () =&gt; ipcRenderer.invoke('ailis:close-current-window'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 56 | <code>    setSpeechMode: (mode) =&gt; ipcRenderer.invoke('ailis:set-speech-mode', mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 57 | <code>    setRecognitionMode: (mode) =&gt; ipcRenderer.invoke('ailis:set-recognition-mode', mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 58 | <code>    setPreferredMicDevice: (deviceId) =&gt; ipcRenderer.invoke('ailis:set-preferred-mic-device', deviceId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 59 | <code>    llm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 60 | <code>        chat: (payload) =&gt; ipcRenderer.invoke('ailis:llm-chat', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 61 | <code>        healthCheck: (payload) =&gt; ipcRenderer.invoke('ailis:llm-health-check', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 62 | <code>        searchVllmModels: (payload) =&gt; ipcRenderer.invoke('ailis:vllm-model-catalog-search', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 63 | <code>        searchOllamaModels: (payload) =&gt; ipcRenderer.invoke('ailis:ollama-model-catalog-search', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 64 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    files: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 66 | <code>        choose: (payload) =&gt; ipcRenderer.invoke('ailis:chat-files-choose', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 67 | <code>        describe: (payload) =&gt; ipcRenderer.invoke('ailis:chat-files-describe', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 68 | <code>        getPathForFile: (file) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 69 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 70 | <code>                if (webUtils?.getPathForFile &amp;&amp; file) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 71 | <code>                    return webUtils.getPathForFile(file) &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 72 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 74 | <code>                return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>            return file?.path &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>    assetPacks: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 80 | <code>        list: () =&gt; ipcRenderer.invoke('ailis:asset-packs-list'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 81 | <code>        installFromFolder: () =&gt; ipcRenderer.invoke('ailis:asset-packs-install-folder'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 82 | <code>        installSample: () =&gt; ipcRenderer.invoke('ailis:asset-packs-install-sample'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 83 | <code>        activate: (payload) =&gt; ipcRenderer.invoke('ailis:asset-packs-activate', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 84 | <code>        resetActive: (payload) =&gt; ipcRenderer.invoke('ailis:asset-packs-reset-active', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 85 | <code>        uninstall: (payload) =&gt; ipcRenderer.invoke('ailis:asset-packs-uninstall', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 86 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    memory: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 88 | <code>        getSnapshot: (payload) =&gt; ipcRenderer.invoke('ailis:memory-snapshot', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 89 | <code>        search: (payload) =&gt; ipcRenderer.invoke('ailis:memory-search', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 90 | <code>        updateBlock: (payload) =&gt; ipcRenderer.invoke('ailis:memory-update-block', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 91 | <code>        resetAffinity: (payload) =&gt; ipcRenderer.invoke('ailis:memory-reset-affinity', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 92 | <code>        clear: (payload) =&gt; ipcRenderer.invoke('ailis:memory-clear', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 93 | <code>        forget: (payload) =&gt; ipcRenderer.invoke('ailis:memory-forget', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 94 | <code>        saveSecret: (payload) =&gt; ipcRenderer.invoke('ailis:memory-save-secret', payload &#124;&#124; {}),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 95 | <code>        deleteSecret: (payload) =&gt; ipcRenderer.invoke('ailis:memory-delete-secret', payload &#124;&#124; {})</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 96 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    rawMemory: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 98 | <code>        status: () =&gt; ipcRenderer.invoke('ailis:raw-memory-status'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 99 | <code>        replay: (payload) =&gt; ipcRenderer.invoke('ailis:raw-memory-replay', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 100 | <code>        sessions: (payload) =&gt; ipcRenderer.invoke('ailis:raw-memory-sessions', payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 101 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    memoryProfile: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 103 | <code>        state: () =&gt; ipcRenderer.invoke('ailis:memory-profile-state'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 104 | <code>        curate: (payload) =&gt; ipcRenderer.invoke('ailis:memory-profile-curate', payload &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 105 | <code>        rebuild: (payload) =&gt; ipcRenderer.invoke('ailis:memory-profile-rebuild', payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 106 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>    chatHistory: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 108 | <code>        load: (payload) =&gt; ipcRenderer.invoke('ailis:chat-history-load', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 109 | <code>        save: (payload) =&gt; ipcRenderer.invoke('ailis:chat-history-save', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 110 | <code>        clear: (payload) =&gt; ipcRenderer.invoke('ailis:chat-history-clear', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 111 | <code>        status: () =&gt; ipcRenderer.invoke('ailis:chat-history-status')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 112 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    vision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 114 | <code>        capture: (payload) =&gt; ipcRenderer.invoke('ailis:vision-capture', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 115 | <code>        finishRegionSelection: (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 116 | <code>            ipcRenderer.send('ailis:vision-region-selected', payload &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 117 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>        cancelRegionSelection: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 119 | <code>            ipcRenderer.send('ailis:vision-region-cancelled');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 120 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>    tts: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 123 | <code>        synthesize: (payload) =&gt; ipcRenderer.invoke('ailis:tts-synthesize', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 124 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>    voiceRuntime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 126 | <code>        diagnose: () =&gt; ipcRenderer.invoke('ailis:voice-runtime-diagnose'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 127 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:voice-runtime-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 128 | <code>        chooseInstallDir: () =&gt; ipcRenderer.invoke('ailis:voice-runtime-choose-install-dir'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 129 | <code>        bootstrap: (payload) =&gt; ipcRenderer.invoke('ailis:voice-runtime-bootstrap', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 130 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>    runtimeComponents: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 132 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:runtime-components-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 133 | <code>        installSelected: (payload) =&gt; ipcRenderer.invoke('ailis:runtime-components-install', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 134 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    runtimeAssets: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 136 | <code>        scan: () =&gt; ipcRenderer.invoke('ailis:runtime-assets-scan'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 137 | <code>        delete: (payload) =&gt; ipcRenderer.invoke('ailis:runtime-assets-delete', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 138 | <code>        chooseMigrationRoot: (payload) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 139 | <code>            ipcRenderer.invoke('ailis:runtime-assets-choose-migration-root', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 140 | <code>        migrate: (payload) =&gt; ipcRenderer.invoke('ailis:runtime-assets-migrate', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 141 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    vllmRuntime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 143 | <code>        diagnose: (payload) =&gt; ipcRenderer.invoke('ailis:vllm-runtime-diagnose', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 144 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:vllm-runtime-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 145 | <code>        deploy: (payload) =&gt; ipcRenderer.invoke('ailis:vllm-runtime-deploy', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 146 | <code>        chooseLocalModelFolder: () =&gt; ipcRenderer.invoke('ailis:vllm-local-model-folder-choose'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 147 | <code>        describeLocalModelPath: (payload) =&gt; ipcRenderer.invoke('ailis:vllm-local-model-path-describe', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 148 | <code>        chooseDownloadFolder: (payload) =&gt; ipcRenderer.invoke('ailis:vllm-download-folder-choose', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 149 | <code>        cancel: () =&gt; ipcRenderer.invoke('ailis:vllm-runtime-cancel')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 150 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    ollamaRuntime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 152 | <code>        diagnose: (payload) =&gt; ipcRenderer.invoke('ailis:ollama-runtime-diagnose', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 153 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:ollama-runtime-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 154 | <code>        inspectInstalledModels: (payload) =&gt; ipcRenderer.invoke('ailis:ollama-installed-models-inspect', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 155 | <code>        deploy: (payload) =&gt; ipcRenderer.invoke('ailis:ollama-runtime-deploy', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 156 | <code>        chooseLocalModelPath: () =&gt; ipcRenderer.invoke('ailis:ollama-local-model-path-choose'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 157 | <code>        describeLocalModelPath: (payload) =&gt; ipcRenderer.invoke('ailis:ollama-local-model-path-describe', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 158 | <code>        cancel: () =&gt; ipcRenderer.invoke('ailis:ollama-runtime-cancel')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 159 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    transcribeAudio: (audioBytes) =&gt; ipcRenderer.invoke('ailis:asr-transcribe', audioBytes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 161 | <code>    beginDragPetWindow: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 162 | <code>        ipcRenderer.send('ailis:begin-drag-pet-window', {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 163 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    dragPetWindow: (payloadOrDeltaX = {}, deltaY = 0) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 165 | <code>        if (payloadOrDeltaX &amp;&amp; typeof payloadOrDeltaX === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 166 | <code>            ipcRenderer.send('ailis:drag-pet-window', payloadOrDeltaX);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 167 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 168 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>        ipcRenderer.send('ailis:drag-pet-window', { deltaX: payloadOrDeltaX, deltaY });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 170 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>    endDragPetWindow: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 172 | <code>        ipcRenderer.send('ailis:end-drag-pet-window', {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 173 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    setPetMousePassthrough: (enabled) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 175 | <code>        ipcRenderer.send('ailis:set-pet-mouse-passthrough', { enabled: Boolean(enabled) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 176 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    setPetDialogueExpanded: (payload) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 178 | <code>        ipcRenderer.invoke('ailis:set-pet-dialogue-expanded', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 179 | <code>    sendChatMessage: (content, options = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 180 | <code>        if (content &amp;&amp; typeof content === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 181 | <code>            ipcRenderer.send('ailis:chat-send-message', content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 182 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 183 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>        ipcRenderer.send('ailis:chat-send-message', { content, ...(options &#124;&#124; {}) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 185 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    sendChatControl: (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 187 | <code>        ipcRenderer.send('ailis:chat-control', payload &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 188 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>    emitChatEvent: (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 190 | <code>        ipcRenderer.send('ailis:pet-chat-event', payload &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 191 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    requestChatStateSync: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 193 | <code>        ipcRenderer.send('ailis:chat-state-sync-request');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 194 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    onChatMessageRequest: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 196 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 197 | <code>        ipcRenderer.on('ailis:chat-send-message', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 198 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:chat-send-message', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    onChatStateSyncRequest: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 201 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 202 | <code>        ipcRenderer.on('ailis:chat-state-sync-request', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 203 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:chat-state-sync-request', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 204 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    onChatControlRequest: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 206 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 207 | <code>        ipcRenderer.on('ailis:chat-control', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 208 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:chat-control', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 209 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>    onPetCursorPoint: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 211 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 212 | <code>        ipcRenderer.on('ailis:pet-cursor-point', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 213 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:pet-cursor-point', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    onChatEvent: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 216 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 217 | <code>        ipcRenderer.on('ailis:chat-event', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 218 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:chat-event', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    onPreferencesUpdated: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 221 | <code>        const wrapped = (_event, payload = {}) =&gt; {</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 222 | <code>            if (payload?.preferences &amp;&amp; typeof payload.preferences === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 223 | <code>                Object.assign(initialPreferences, payload.preferences);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 224 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>            listener(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 226 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        ipcRenderer.on('ailis:preferences-updated', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 228 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:preferences-updated', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 229 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    onCharacterLabToggle: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 231 | <code>        const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 232 | <code>        ipcRenderer.on('ailis:character-lab-toggle', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 233 | <code>        return () =&gt; ipcRenderer.removeListener('ailis:character-lab-toggle', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 234 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    assistant: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 236 | <code>        isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 237 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:assistant-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 238 | <code>        getToolSurface: () =&gt; ipcRenderer.invoke('ailis:assistant-tool-surface'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 239 | <code>        validateToolSurface: () =&gt; ipcRenderer.invoke('ailis:assistant-validate-tool-surface'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 240 | <code>        getHistory: (limit) =&gt; ipcRenderer.invoke('ailis:assistant-history', { limit }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 241 | <code>        sendMessage: (content, timeoutMs) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 242 | <code>            ipcRenderer.invoke('ailis:assistant-send-message', { content, timeoutMs }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 243 | <code>        abortRun: (runId) =&gt; ipcRenderer.invoke('ailis:assistant-abort-run', { runId }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 244 | <code>        listSessions: (limit) =&gt; ipcRenderer.invoke('ailis:assistant-list-sessions', { limit }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 245 | <code>        setSessionKey: (sessionKey) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 246 | <code>            ipcRenderer.invoke('ailis:assistant-set-session-key', { sessionKey }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 247 | <code>        patchSession: (patch) =&gt; ipcRenderer.invoke('ailis:assistant-patch-session', patch &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 248 | <code>        onEvent: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 249 | <code>            const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 250 | <code>            ipcRenderer.on('ailis:assistant-event', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 251 | <code>            return () =&gt; ipcRenderer.removeListener('ailis:assistant-event', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 252 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>    gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 255 | <code>        isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 256 | <code>        getStatus: () =&gt; ipcRenderer.invoke('ailis:gateway-status'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 257 | <code>        listTools: () =&gt; ipcRenderer.invoke('ailis:gateway-tools-list'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 258 | <code>        callTool: (payload) =&gt; ipcRenderer.invoke('ailis:gateway-tools-call', payload &#124;&#124; {}),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 259 | <code>        runAgent: (payload) =&gt; ipcRenderer.invoke('ailis:gateway-agent-run', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 260 | <code>        interruptAgentRun: (payload) =&gt; ipcRenderer.invoke('ailis:gateway-agent-interrupt', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 261 | <code>        listAudit: (limit) =&gt; ipcRenderer.invoke('ailis:gateway-audit-list', { limit }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 262 | <code>        onEvent: (listener) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 263 | <code>            const wrapped = (_event, payload = {}) =&gt; listener(payload);</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 264 | <code>            ipcRenderer.on('ailis:gateway-event', wrapped);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 265 | <code>            return () =&gt; ipcRenderer.removeListener('ailis:gateway-event', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>    agentLab: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 269 | <code>        isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 270 | <code>        listRuns: (payload) =&gt; ipcRenderer.invoke('ailis:agent-lab-runs', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 271 | <code>        getRunAnalysis: (payload) =&gt; ipcRenderer.invoke('ailis:agent-lab-analysis', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 272 | <code>        runTask: (payload) =&gt; ipcRenderer.invoke('ailis:agent-lab-run', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 273 | <code>        continueTask: (payload) =&gt; ipcRenderer.invoke('ailis:agent-lab-continue', payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 274 | <code>        interruptTask: (payload) =&gt; ipcRenderer.invoke('ailis:agent-lab-interrupt', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。”这一文件职责。 |
| 275 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
