# Markdown 回复与成果资源展示

实现于 2026-09-15，基于本地 1.4.6 源码。不改变模型 instructions、工具选择、Agent Loop 或最终回复格式。

## 已实现

### 2026-09-16 展示入口增强

- `html` / `htm` fenced code blocks retain the original source and gain explicit preview/source switching and byte-preserving HTML download. Preview is lazy, capped at 1,048,576 JS string code units, and shares the same static sanitizer + CSP + opaque sandbox as HTML artifacts. Raw Markdown HTML is still not executed. Incomplete streaming HTML is not automatically executed or previewed.
- HTTP/HTTPS links in resource-enabled task replies gain an explicit webpage-preview button. Only clicking it starts network loading. The iframe uses an empty sandbox, no Referer, and denied camera/microphone/geolocation/clipboard permissions. It has no scripts, same-origin privilege, forms, popups or desktop bridge. This is a read-only preview, not a full browser; sites with frame restrictions or JS requirements may be blank/incomplete. The UI always offers an ordinary browser link and explains the limitation; it does not claim load success from an iframe load event.
- Resource dialogs support expand/restore. Closing the dialog removes its contents and stops the embedded page. No added crawler, server-side URL proxy, provider call or changed final-answer protocol.
- Verification: 8 resource unit tests, existing rich-output browser smoke and new `tests/html-web-preview-browser-smoke.cjs` pass. Desktop Vite build passes (existing highlight/chunk warnings remain). Build is in `tmp/html-preview-build`, not a deployment or restart.

- 最终回复仍是一段 Markdown。共享 markdown-it 解析器，前端用 DOM 节点渲染，不执行 Markdown 内的 HTML。
- 支持表格横向滚动、嵌套列表、引用、链接、图片和代码复制；保留已有表情贴纸、原文复制和语音文本处理。
- 最终回复的明确本地 Markdown 链接/图片引用登记为成果。代码块、普通文字路径、全部附件和工具 stdout 不会被扫描。
- 终端生成的文件也能接入，不要求产生文件改动事件。同一文件的成果操作合并到已有文件卡片，「查看改动」保持原样；其他引用文件单独展示成果卡片。
- 图片、Markdown、文本及 HTML 可预览。HTML 提供静态预览/源码切换。PDF、Office、ZIP 提供完整下载，暂不支持内嵌阅读。
- 下载保留原始字节；源文件后续修改/删除不影响历史快照。

## 链路与契约

1. 模型最终 Markdown 原文先持久化。
2. 共享解析器提取显式文件引用，宿主校验工作区权限和路径边界。
3. 资源按 SHA-256 保存，任务条目增加 `hrefs`、`artifactRef`、`artifactStatus`。这些是展示记录，不追加到模型正文。
4. Markdown 引用关联任务资源，前端调用已有 `tasks.resource` IPC，携带会话、任务、资源 ID 和格式，不接受任意磁盘路径。
5. 宿主校验归属及哈希，返回预览或完整 base64。前端用 Blob 下载；渲染链接不执行 shell。

`format: "preview"`：图片返回 data URL；文本成果预览最多 1 MiB，超出明确提示；不支持预览的二进制格式返回元数据。已有工具/差异资源沿用原大小限制。

`format: "base64"`：完整原文件字节，供下载使用。

## 安全与范围

- 每份最终回复最多登记 20 个不同的显式引用，单文件最多 16 MiB，本轮文件快照总量最多 64 MiB；相同路径复用快照。
- 只读当前工作区内的普通文件：执行已有 `resolveToolPath`，并校验真实路径；拒绝隐藏配置、任务内部记录、目录联接、符号链接、硬链接、UNC/设备路径及 Windows 备用数据流。
- 类型白名单见 `electron/ailis-task-artifacts.cjs`。栅格图片检查内容头；SVG 不内嵌。找不到、不支持或禁止读取的文件显示原因，不伪造下载状态。
- 外部 Markdown 图片点击后加载，不随每次历史恢复自动请求，且不发送 Referer。
- HTML 经过标签/属性白名单，放入无权限 token 的 sandbox iframe，并设置 CSP。脚本、表单、跳转、外部图片/字体/网络请求禁用，不获得 Electron/AILIS 桥接权限。下载原 HTML 不改写其内容；在外部打开属于独立行为。
- 本轮接通的是桌面 `chat.html` 的宿主任务链。网页 Hosted Runtime 不是该 IPC 入口：没有新增线上文件服务，也没有部署到线上，不能把本地路径当远程下载 URL。
- 未加入交互地图、任意 HTML 应用执行及 PDF/Office 内嵌阅读器。

## 验证结果

68 项 Node 测试通过（任务生命周期、成果边界、字节下载、语音、贴纸及打包依赖检查）；原有聊天浏览器烟测 70 项断言通过；新增真实宿主资源 + 合成模型回复的浏览器烟测通过。桌面 Vite 构建通过，仍有原有 `::highlight` 和大 chunk 警告。全部验证不调用付费模型。

```powershell
node --test tests/ailis-task-artifacts.test.mjs tests/ailis-task-interaction.test.mjs tests/ailis-task-interaction-gateway.test.mjs tests/ailis-task-file-diff.test.mjs tests/ailis-hosted-gateway-client.test.mjs tests/tts-speech-text.test.mjs tests/ailis-companion-chat-service.test.mjs tests/ailis-emote-stickers.test.mjs tests/ailis-production-closure.test.mjs
pnpm exec vite build --mode desktop --outDir tmp/rich-output-build
```

浏览器烟测：独立终端运行 `pnpm exec vite --host 127.0.0.1 --port 5191 --strictPort`，配置本机的 `PLAYWRIGHT_MODULE`、`CHROME_EXECUTABLE` 后运行：

```powershell
$env:AILIS_PREVIEW_URL = 'http://127.0.0.1:5191'
node tests/task-interaction-browser-smoke.cjs
node tests/task-rich-output-browser-smoke.cjs
```

后者验证字节一致的 HTML/二进制下载、快照恢复、HTML 隔离、外部图片按需加载、移动端及过期会话读取。截图：`tmp/rich-output-smoke/`。

包含改动的桌面开发版手测提示词：

> 在当前工作区创建一份简单的 HTML 报告和 PNG 图。最终回复里写一个 Markdown 表格，用 Markdown 文件链接引用报告，再用 Markdown 图片语法引用 PNG。

应显示表格、图片、成果卡片及预览/下载。HTML 预览不执行脚本。此次没有自动重启、打包发布或改变用户正在运行的安装版。
