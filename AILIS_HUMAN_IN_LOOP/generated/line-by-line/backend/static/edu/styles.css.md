# backend/static/edu/styles.css 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`source-code`
- 原始行数：1002
- SHA-256：`99f7c94957b66fcbf07f92fefe08a132055e1246eb9955239b156eec37311410`
- 可运行副本：[打开源文件](../../../../../source/backend/static/edu/styles.css)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>:root {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>  --bg: #eef2ec;</code> | 设置 CSS 属性 `--bg`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 3 | <code>  --surface: rgba(255, 255, 255, 0.92);</code> | 设置 CSS 属性 `--surface`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 4 | <code>  --surface-strong: #ffffff;</code> | 设置 CSS 属性 `--surface-strong`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 5 | <code>  --text: #18211b;</code> | 设置 CSS 属性 `--text`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 6 | <code>  --muted: #5e6d63;</code> | 设置 CSS 属性 `--muted`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 7 | <code>  --line: rgba(24, 33, 27, 0.12);</code> | 设置 CSS 属性 `--line`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 8 | <code>  --accent: #12a57d;</code> | 设置 CSS 属性 `--accent`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 9 | <code>  --accent-strong: #0f7c5e;</code> | 设置 CSS 属性 `--accent-strong`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 10 | <code>  --accent-soft: rgba(18, 165, 125, 0.14);</code> | 设置 CSS 属性 `--accent-soft`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 11 | <code>  --warm: #ff7a59;</code> | 设置 CSS 属性 `--warm`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 12 | <code>  --gold: #f0b844;</code> | 设置 CSS 属性 `--gold`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 13 | <code>  --shadow: 0 18px 48px rgba(16, 34, 22, 0.12);</code> | 设置 CSS 属性 `--shadow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 14 | <code>  --radius: 8px;</code> | 设置 CSS 属性 `--radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 15 | <code>  --sidebar-width: 250px;</code> | 设置 CSS 属性 `--sidebar-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 16 | <code>  font-family: "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif;</code> | 设置 CSS 属性 `font-family`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 17 | <code>}</code> | 结束当前 CSS 规则块。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>* {</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 20 | <code>  box-sizing: border-box;</code> | 设置 CSS 属性 `box-sizing`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 21 | <code>}</code> | 结束当前 CSS 规则块。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>html,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 24 | <code>body {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 25 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 26 | <code>  min-height: 100%;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 27 | <code>  background: var(--bg);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 28 | <code>  color: var(--text);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 29 | <code>}</code> | 结束当前 CSS 规则块。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>body {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 32 | <code>  line-height: 1.55;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 33 | <code>}</code> | 结束当前 CSS 规则块。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>a {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 36 | <code>  color: inherit;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 37 | <code>  text-decoration: none;</code> | 设置 CSS 属性 `text-decoration`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 38 | <code>}</code> | 结束当前 CSS 规则块。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>img {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 41 | <code>  max-width: 100%;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 42 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 43 | <code>}</code> | 结束当前 CSS 规则块。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>button,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 46 | <code>input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 47 | <code>select,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 48 | <code>textarea {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 49 | <code>  font: inherit;</code> | 设置 CSS 属性 `font`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 50 | <code>}</code> | 结束当前 CSS 规则块。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>.eyebrow {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 53 | <code>  display: inline-block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 54 | <code>  color: var(--accent-strong);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 55 | <code>  font-size: 0.84rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 56 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 57 | <code>}</code> | 结束当前 CSS 规则块。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>.auth-layout {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 60 | <code>  min-height: 100vh;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 61 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 62 | <code>  grid-template-columns: 1.15fr minmax(360px, 0.85fr);</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 63 | <code>  background:</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 64 | <code>    linear-gradient(90deg, rgba(10, 18, 12, 0.72), rgba(10, 18, 12, 0.38)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 65 | <code>    var(--hero-image) center / cover no-repeat;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 66 | <code>}</code> | 结束当前 CSS 规则块。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>.register-layout {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 69 | <code>  grid-template-columns: 0.95fr 1.05fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 70 | <code>}</code> | 结束当前 CSS 规则块。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>.auth-hero,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 73 | <code>.auth-panel {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 74 | <code>  padding: 48px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 75 | <code>}</code> | 结束当前 CSS 规则块。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>.auth-hero {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 78 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 79 | <code>  align-items: flex-end;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 80 | <code>}</code> | 结束当前 CSS 规则块。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>.auth-copy {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 83 | <code>  max-width: 520px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 84 | <code>  color: #f8fffb;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 85 | <code>}</code> | 结束当前 CSS 规则块。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>.auth-copy h1 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 88 | <code>  margin: 12px 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 89 | <code>  font-size: clamp(2rem, 3vw, 3.4rem);</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 90 | <code>  line-height: 1.06;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 91 | <code>}</code> | 结束当前 CSS 规则块。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>.auth-points {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 94 | <code>  margin: 28px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 95 | <code>  padding: 0;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 96 | <code>  list-style: none;</code> | 设置 CSS 属性 `list-style`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 97 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 98 | <code>  gap: 10px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 99 | <code>}</code> | 结束当前 CSS 规则块。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>.auth-points li::before,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 102 | <code>.tiny-list li::before {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 103 | <code>  content: "";</code> | 设置 CSS 属性 `content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 104 | <code>  display: inline-block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 105 | <code>  width: 8px;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 106 | <code>  height: 8px;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 107 | <code>  margin-right: 10px;</code> | 设置 CSS 属性 `margin-right`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 108 | <code>  border-radius: 50%;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 109 | <code>  background: var(--warm);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 110 | <code>}</code> | 结束当前 CSS 规则块。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>.auth-panel {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 113 | <code>  background: rgba(244, 248, 244, 0.96);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 114 | <code>  overflow-y: auto;</code> | 设置 CSS 属性 `overflow-y`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 115 | <code>}</code> | 结束当前 CSS 规则块。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>.wide-panel {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 118 | <code>  max-height: 100vh;</code> | 设置 CSS 属性 `max-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 119 | <code>}</code> | 结束当前 CSS 规则块。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>.form-intro h2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 122 | <code>.section-heading h3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 123 | <code>.hero-band h2 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 124 | <code>  margin: 8px 0 10px;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 125 | <code>  font-size: 1.6rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 126 | <code>  line-height: 1.15;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 127 | <code>}</code> | 结束当前 CSS 规则块。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>.stack-form {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 130 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 131 | <code>  gap: 18px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 132 | <code>}</code> | 结束当前 CSS 规则块。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>.stack-form label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 135 | <code>.form-block {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 136 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 137 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 138 | <code>}</code> | 结束当前 CSS 规则块。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>.stack-form span,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 141 | <code>.form-block &gt; span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 142 | <code>  font-size: 0.92rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 143 | <code>  font-weight: 600;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 144 | <code>}</code> | 结束当前 CSS 规则块。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 147 | <code>select,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 148 | <code>textarea {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 149 | <code>  width: 100%;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 150 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 151 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 152 | <code>  background: #fff;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 153 | <code>  color: var(--text);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 154 | <code>  padding: 12px 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 155 | <code>}</code> | 结束当前 CSS 规则块。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>textarea {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 158 | <code>  resize: vertical;</code> | 设置 CSS 属性 `resize`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 159 | <code>}</code> | 结束当前 CSS 规则块。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>.two-column {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 162 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 163 | <code>  gap: 16px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 164 | <code>  grid-template-columns: repeat(2, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 165 | <code>}</code> | 结束当前 CSS 规则块。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>.chip-row {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 168 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 169 | <code>  flex-wrap: wrap;</code> | 设置 CSS 属性 `flex-wrap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 170 | <code>  gap: 10px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 171 | <code>}</code> | 结束当前 CSS 规则块。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>.chip-option {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 174 | <code>  display: inline-flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 175 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 176 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 177 | <code>  padding: 10px 12px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 178 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 179 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 180 | <code>  background: #fff;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 181 | <code>}</code> | 结束当前 CSS 规则块。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>.chip-option input {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 184 | <code>  width: auto;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 185 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 186 | <code>}</code> | 结束当前 CSS 规则块。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>.check-stack {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 189 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 190 | <code>  gap: 10px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 191 | <code>}</code> | 结束当前 CSS 规则块。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>.check-line {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 194 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 195 | <code>  gap: 10px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 196 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 197 | <code>}</code> | 结束当前 CSS 规则块。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>.check-line input {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 200 | <code>  width: auto;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 201 | <code>}</code> | 结束当前 CSS 规则块。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>.primary-button,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 204 | <code>.ghost-button,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 205 | <code>.inline-button {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 206 | <code>  display: inline-flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 207 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 208 | <code>  justify-content: center;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 209 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 210 | <code>  min-height: 44px;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 211 | <code>  padding: 0 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 212 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 213 | <code>  border: 1px solid transparent;</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 214 | <code>  cursor: pointer;</code> | 设置 CSS 属性 `cursor`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 215 | <code>}</code> | 结束当前 CSS 规则块。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>.primary-button,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 218 | <code>.inline-button {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 219 | <code>  background: var(--accent);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 220 | <code>  color: #fff;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 221 | <code>}</code> | 结束当前 CSS 规则块。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>.ghost-button {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 224 | <code>  background: transparent;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 225 | <code>  border-color: var(--line);</code> | 设置 CSS 属性 `border-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 226 | <code>  color: var(--text);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 227 | <code>}</code> | 结束当前 CSS 规则块。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>.auth-footer {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 230 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 231 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 232 | <code>  justify-content: center;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 233 | <code>  margin-top: 18px;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 234 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 235 | <code>}</code> | 结束当前 CSS 规则块。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>.auth-footer a {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 238 | <code>  color: var(--accent-strong);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 239 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 240 | <code>}</code> | 结束当前 CSS 规则块。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>.admin-login-hint {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 243 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 244 | <code>  gap: 4px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 245 | <code>  padding: 12px 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 246 | <code>  border: 1px solid rgba(22, 99, 62, 0.2);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 247 | <code>  background: rgba(22, 99, 62, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 248 | <code>  border-radius: 8px;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 249 | <code>  color: var(--text);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 250 | <code>}</code> | 结束当前 CSS 规则块。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>.admin-login-hint strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 253 | <code>  color: var(--accent-strong);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 254 | <code>}</code> | 结束当前 CSS 规则块。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>.admin-login-hint span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 257 | <code>  font-size: 0.9rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 258 | <code>  font-weight: 500;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 259 | <code>}</code> | 结束当前 CSS 规则块。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>.notice {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 262 | <code>  padding: 12px 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 263 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 264 | <code>  border: 1px solid transparent;</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 265 | <code>}</code> | 结束当前 CSS 规则块。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>.notice.error {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 268 | <code>  background: rgba(255, 122, 89, 0.12);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 269 | <code>  color: #8c3420;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 270 | <code>  border-color: rgba(255, 122, 89, 0.28);</code> | 设置 CSS 属性 `border-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 271 | <code>}</code> | 结束当前 CSS 规则块。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>.notice.success {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 274 | <code>  background: var(--accent-soft);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 275 | <code>  color: #0b5d48;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 276 | <code>  border-color: rgba(18, 165, 125, 0.28);</code> | 设置 CSS 属性 `border-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 277 | <code>}</code> | 结束当前 CSS 规则块。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>.notice.warning {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 280 | <code>  background: rgba(240, 184, 68, 0.14);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 281 | <code>  color: #8a5a00;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 282 | <code>  border-color: rgba(240, 184, 68, 0.3);</code> | 设置 CSS 属性 `border-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 283 | <code>}</code> | 结束当前 CSS 规则块。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>.app-shell {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 286 | <code>  min-height: 100vh;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 287 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 288 | <code>  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 289 | <code>}</code> | 结束当前 CSS 规则块。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>.sidebar {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 292 | <code>  background: #10251a;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 293 | <code>  color: #effaf4;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 294 | <code>  padding: 24px 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 295 | <code>  position: sticky;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 296 | <code>  top: 0;</code> | 设置 CSS 属性 `top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 297 | <code>  height: 100vh;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 298 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 299 | <code>  flex-direction: column;</code> | 设置 CSS 属性 `flex-direction`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 300 | <code>  gap: 22px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 301 | <code>}</code> | 结束当前 CSS 规则块。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>.brand {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 304 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 305 | <code>  gap: 4px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 306 | <code>}</code> | 结束当前 CSS 规则块。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>.brand-kicker {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 309 | <code>  color: rgba(239, 250, 244, 0.72);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 310 | <code>  font-size: 0.84rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 311 | <code>}</code> | 结束当前 CSS 规则块。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>.sidebar-user {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 314 | <code>  padding: 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 315 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 316 | <code>  background: rgba(255, 255, 255, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 317 | <code>}</code> | 结束当前 CSS 规则块。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>.sidebar-user p {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 320 | <code>  margin: 0 0 4px;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 321 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 322 | <code>}</code> | 结束当前 CSS 规则块。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>.sidebar-user span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 325 | <code>  color: rgba(239, 250, 244, 0.72);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 326 | <code>  font-size: 0.9rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 327 | <code>}</code> | 结束当前 CSS 规则块。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>.sidebar-nav {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 330 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 331 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 332 | <code>}</code> | 结束当前 CSS 规则块。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>.sidebar-nav a {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 335 | <code>  padding: 10px 12px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 336 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 337 | <code>  color: rgba(239, 250, 244, 0.76);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 338 | <code>}</code> | 结束当前 CSS 规则块。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>.sidebar-nav a.active,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 341 | <code>.sidebar-nav a:hover {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 342 | <code>  background: rgba(18, 165, 125, 0.18);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 343 | <code>  color: #fff;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 344 | <code>}</code> | 结束当前 CSS 规则块。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>.sidebar-logout {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 347 | <code>  margin-top: auto;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 348 | <code>}</code> | 结束当前 CSS 规则块。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>.page-shell {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 351 | <code>  min-width: 0;</code> | 设置 CSS 属性 `min-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 352 | <code>}</code> | 结束当前 CSS 规则块。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>.page-top {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 355 | <code>  position: relative;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 356 | <code>  padding: 38px 40px 34px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 357 | <code>  background: linear-gradient(135deg, rgba(18, 30, 22, 0.9), rgba(18, 30, 22, 0.54));</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 358 | <code>  color: #f6fff9;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 359 | <code>}</code> | 结束当前 CSS 规则块。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>.page-top.has-image::before {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 362 | <code>  content: "";</code> | 设置 CSS 属性 `content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 363 | <code>  position: absolute;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 364 | <code>  inset: 0;</code> | 设置 CSS 属性 `inset`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 365 | <code>  background:</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 366 | <code>    linear-gradient(135deg, rgba(10, 22, 16, 0.84), rgba(10, 22, 16, 0.44)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 367 | <code>    var(--hero-image) center / cover no-repeat;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 368 | <code>}</code> | 结束当前 CSS 规则块。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>.page-top-copy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 371 | <code>.nav-toggle {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 372 | <code>  position: relative;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 373 | <code>  z-index: 1;</code> | 设置 CSS 属性 `z-index`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 374 | <code>}</code> | 结束当前 CSS 规则块。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>.page-top h1 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 377 | <code>  margin: 10px 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 378 | <code>  font-size: clamp(1.9rem, 3vw, 3rem);</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 379 | <code>  line-height: 1.08;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 380 | <code>  max-width: 880px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 381 | <code>}</code> | 结束当前 CSS 规则块。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>.page-top p {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 384 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 385 | <code>  max-width: 760px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 386 | <code>  color: rgba(246, 255, 249, 0.82);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 387 | <code>}</code> | 结束当前 CSS 规则块。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>.nav-toggle {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 390 | <code>  display: none;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 391 | <code>  margin-bottom: 18px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 392 | <code>  background: rgba(255, 255, 255, 0.12);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 393 | <code>  color: #fff;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 394 | <code>  border: 1px solid rgba(255, 255, 255, 0.2);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 395 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 396 | <code>  padding: 10px 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 397 | <code>}</code> | 结束当前 CSS 规则块。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>.page-content {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 400 | <code>  padding: 28px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 401 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 402 | <code>  gap: 24px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 403 | <code>}</code> | 结束当前 CSS 规则块。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>.hero-band,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 406 | <code>.panel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 407 | <code>.feature-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 408 | <code>.metric-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 409 | <code>.stage-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 410 | <code>.stage-column {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 411 | <code>  background: var(--surface);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 412 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 413 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 414 | <code>  box-shadow: var(--shadow);</code> | 设置 CSS 属性 `box-shadow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 415 | <code>}</code> | 结束当前 CSS 规则块。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>.hero-band,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 418 | <code>.panel {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 419 | <code>  padding: 24px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 420 | <code>}</code> | 结束当前 CSS 规则块。 |
| 421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 422 | <code>.hero-band {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 423 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 424 | <code>  gap: 18px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 425 | <code>  grid-template-columns: 1.1fr 0.9fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 426 | <code>}</code> | 结束当前 CSS 规则块。 |
| 427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 428 | <code>.metric-strip {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 429 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 430 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 431 | <code>  grid-template-columns: repeat(3, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 432 | <code>}</code> | 结束当前 CSS 规则块。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>.metric-strip article {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 435 | <code>  padding: 16px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 436 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 437 | <code>  background: rgba(18, 165, 125, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 438 | <code>}</code> | 结束当前 CSS 规则块。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>.metric-strip strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 441 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 442 | <code>  font-size: 1.1rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 443 | <code>}</code> | 结束当前 CSS 规则块。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>.metric-strip span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 446 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 447 | <code>  font-size: 0.9rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 448 | <code>}</code> | 结束当前 CSS 规则块。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>.content-grid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 451 | <code>.card-grid {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 452 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 453 | <code>  gap: 24px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 454 | <code>}</code> | 结束当前 CSS 规则块。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>.two-up {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 457 | <code>  grid-template-columns: repeat(2, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 458 | <code>}</code> | 结束当前 CSS 规则块。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>.three-up {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 461 | <code>  grid-template-columns: repeat(3, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 462 | <code>}</code> | 结束当前 CSS 规则块。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>.four-up {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 465 | <code>  grid-template-columns: repeat(4, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 466 | <code>}</code> | 结束当前 CSS 规则块。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>.section-heading {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 469 | <code>  margin-bottom: 18px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 470 | <code>}</code> | 结束当前 CSS 规则块。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>.section-heading p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 473 | <code>.muted-text {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 474 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 475 | <code>}</code> | 结束当前 CSS 规则块。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>.step-list,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 478 | <code>.timeline {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 479 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 480 | <code>  gap: 16px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 481 | <code>}</code> | 结束当前 CSS 规则块。 |
| 482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 483 | <code>.step-list article,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 484 | <code>.timeline article {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 485 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 486 | <code>  grid-template-columns: 54px minmax(0, 1fr);</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 487 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 488 | <code>  align-items: start;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 489 | <code>}</code> | 结束当前 CSS 规则块。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>.step-list strong,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 492 | <code>.timeline strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 493 | <code>  width: 54px;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 494 | <code>  height: 54px;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 495 | <code>  display: inline-flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 496 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 497 | <code>  justify-content: center;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 498 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 499 | <code>  background: var(--accent-soft);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 500 | <code>  color: var(--accent-strong);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 501 | <code>}</code> | 结束当前 CSS 规则块。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>.step-list h4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 504 | <code>.timeline p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 505 | <code>.feature-card h4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 506 | <code>.metric-card h4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 507 | <code>.stage-card h5 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 508 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 509 | <code>}</code> | 结束当前 CSS 规则块。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>.step-list p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 512 | <code>.timeline p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 513 | <code>.feature-card p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 514 | <code>.metric-card p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 515 | <code>.stage-card p {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 516 | <code>  margin: 6px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 517 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 518 | <code>}</code> | 结束当前 CSS 规则块。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>.metric-head,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 521 | <code>.stage-head {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 522 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 523 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 524 | <code>  justify-content: space-between;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 525 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 526 | <code>}</code> | 结束当前 CSS 规则块。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>.pill {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 529 | <code>  display: inline-flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 530 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 531 | <code>  min-height: 30px;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 532 | <code>  padding: 0 10px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 533 | <code>  border-radius: 999px;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 534 | <code>  background: rgba(240, 184, 68, 0.16);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 535 | <code>  color: #96630a;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 536 | <code>  font-size: 0.84rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 537 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 538 | <code>}</code> | 结束当前 CSS 规则块。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>.feature-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 541 | <code>.metric-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 542 | <code>.stage-card {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 543 | <code>  padding: 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 544 | <code>}</code> | 结束当前 CSS 规则块。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>.feature-card.featured {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 547 | <code>  border-color: rgba(18, 165, 125, 0.34);</code> | 设置 CSS 属性 `border-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 548 | <code>  background: rgba(18, 165, 125, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 549 | <code>}</code> | 结束当前 CSS 规则块。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>.tiny-list {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 552 | <code>  margin: 14px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 553 | <code>  padding: 0;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 554 | <code>  list-style: none;</code> | 设置 CSS 属性 `list-style`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 555 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 556 | <code>  gap: 10px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 557 | <code>}</code> | 结束当前 CSS 规则块。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>.score-bar {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 560 | <code>  height: 10px;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 561 | <code>  margin: 14px 0 12px;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 562 | <code>  background: rgba(24, 33, 27, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 563 | <code>  border-radius: 999px;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 564 | <code>  overflow: hidden;</code> | 设置 CSS 属性 `overflow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 565 | <code>}</code> | 结束当前 CSS 规则块。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>.score-bar span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 568 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 569 | <code>  height: 100%;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 570 | <code>  border-radius: inherit;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 571 | <code>  background: linear-gradient(90deg, var(--warm), var(--gold), var(--accent));</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 572 | <code>}</code> | 结束当前 CSS 规则块。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>.empty-state {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 575 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 576 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 577 | <code>  justify-content: space-between;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 578 | <code>  gap: 16px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 579 | <code>}</code> | 结束当前 CSS 规则块。 |
| 580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 581 | <code>.button-row {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 582 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 583 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 584 | <code>  flex-wrap: wrap;</code> | 设置 CSS 属性 `flex-wrap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 585 | <code>}</code> | 结束当前 CSS 规则块。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>.stage-grid {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 588 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 589 | <code>  gap: 18px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 590 | <code>  grid-template-columns: repeat(3, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 591 | <code>}</code> | 结束当前 CSS 规则块。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>.stage-column {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 594 | <code>  padding: 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 595 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 596 | <code>  gap: 14px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 597 | <code>}</code> | 结束当前 CSS 规则块。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>@media (max-width: 1180px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 600 | <code>  .three-up,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 601 | <code>  .four-up,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 602 | <code>  .stage-grid {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 603 | <code>    grid-template-columns: repeat(2, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 604 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 605 | <code>}</code> | 结束当前 CSS 规则块。 |
| 606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 607 | <code>@media (max-width: 980px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 608 | <code>  .auth-layout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 609 | <code>  .register-layout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 610 | <code>  .app-shell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 611 | <code>  .hero-band,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 612 | <code>  .two-up,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 613 | <code>  .metric-strip {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 614 | <code>    grid-template-columns: 1fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 615 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 617 | <code>  .auth-hero {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 618 | <code>    min-height: 42vh;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 619 | <code>    align-items: flex-end;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 620 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 622 | <code>  .sidebar {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 623 | <code>    position: fixed;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 624 | <code>    inset: 0 auto 0 0;</code> | 设置 CSS 属性 `inset`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 625 | <code>    width: min(82vw, 290px);</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 626 | <code>    transform: translateX(-100%);</code> | 设置 CSS 属性 `transform`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 627 | <code>    transition: transform 0.25s ease;</code> | 设置 CSS 属性 `transition`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 628 | <code>    z-index: 10;</code> | 设置 CSS 属性 `z-index`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 629 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>  .sidebar.open {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 632 | <code>    transform: translateX(0);</code> | 设置 CSS 属性 `transform`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 633 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>  .nav-toggle {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 636 | <code>    display: inline-flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 637 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>  .page-top,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 640 | <code>  .page-content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 641 | <code>  .auth-hero,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 642 | <code>  .auth-panel {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 643 | <code>    padding: 24px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 644 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 645 | <code>}</code> | 结束当前 CSS 规则块。 |
| 646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 647 | <code>@media (max-width: 720px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 648 | <code>  .two-column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 649 | <code>  .three-up,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 650 | <code>  .four-up,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 651 | <code>  .stage-grid {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 652 | <code>    grid-template-columns: 1fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 653 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>  .empty-state {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 656 | <code>    flex-direction: column;</code> | 设置 CSS 属性 `flex-direction`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 657 | <code>    align-items: flex-start;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 658 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 659 | <code>}</code> | 结束当前 CSS 规则块。 |
| 660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 661 | <code>.assignment-stack,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 662 | <code>.question-list,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 663 | <code>.question-pick-list,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 664 | <code>.subject-breakdown,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 665 | <code>.transcript-stream,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 666 | <code>.choice-picks {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 667 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 668 | <code>  gap: 16px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 669 | <code>}</code> | 结束当前 CSS 规则块。 |
| 670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 671 | <code>.assignment-card,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 672 | <code>.question-pick,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 673 | <code>.transcript-bubble,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 674 | <code>.choice-pick,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 675 | <code>.question-stage {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 676 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 677 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 678 | <code>  background: #fff;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 679 | <code>  padding: 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 680 | <code>}</code> | 结束当前 CSS 规则块。 |
| 681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 682 | <code>.assignment-head,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 683 | <code>.question-pick-top,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 684 | <code>.tiny-meta {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 685 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 686 | <code>  align-items: center;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 687 | <code>  justify-content: space-between;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 688 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 689 | <code>  flex-wrap: wrap;</code> | 设置 CSS 属性 `flex-wrap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 690 | <code>}</code> | 结束当前 CSS 规则块。 |
| 691 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 692 | <code>.assignment-head h4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 693 | <code>.question-pick strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 694 | <code>  margin: 10px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 695 | <code>}</code> | 结束当前 CSS 规则块。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>.question-detail {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 698 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 699 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 700 | <code>  background: #fff;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 701 | <code>  overflow: hidden;</code> | 设置 CSS 属性 `overflow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 702 | <code>}</code> | 结束当前 CSS 规则块。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>.question-detail summary {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 705 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 706 | <code>  justify-content: space-between;</code> | 设置 CSS 属性 `justify-content`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 707 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 708 | <code>  cursor: pointer;</code> | 设置 CSS 属性 `cursor`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 709 | <code>  padding: 14px 16px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 710 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 711 | <code>}</code> | 结束当前 CSS 规则块。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>.question-body {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 714 | <code>  padding: 0 16px 16px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 715 | <code>}</code> | 结束当前 CSS 规则块。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>.choice-list {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 718 | <code>  margin: 12px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 719 | <code>  padding-left: 20px;</code> | 设置 CSS 属性 `padding-left`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 720 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 721 | <code>  gap: 8px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 722 | <code>}</code> | 结束当前 CSS 规则块。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>.compact-choice-list {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 725 | <code>  font-size: 0.92rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 726 | <code>}</code> | 结束当前 CSS 规则块。 |
| 727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 728 | <code>.answer-box {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 729 | <code>  margin-top: 14px;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 730 | <code>  padding: 12px 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 731 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 732 | <code>  background: var(--accent-soft);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 733 | <code>  color: #0b5d48;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 734 | <code>}</code> | 结束当前 CSS 规则块。 |
| 735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 736 | <code>.tiny-meta {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 737 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 738 | <code>  font-size: 0.88rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 739 | <code>}</code> | 结束当前 CSS 规则块。 |
| 740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 741 | <code>.block-meta {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 742 | <code>  margin-bottom: 16px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 743 | <code>}</code> | 结束当前 CSS 规则块。 |
| 744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 745 | <code>.subject-breakdown {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 746 | <code>  grid-template-columns: repeat(3, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 747 | <code>  margin-bottom: 18px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 748 | <code>}</code> | 结束当前 CSS 规则块。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>.subject-breakdown article {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 751 | <code>  padding: 14px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 752 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 753 | <code>  background: #fff;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 754 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 755 | <code>}</code> | 结束当前 CSS 规则块。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>.subject-breakdown strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 758 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 759 | <code>}</code> | 结束当前 CSS 规则块。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>.question-pick-top input {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 762 | <code>  width: auto;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 763 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 764 | <code>}</code> | 结束当前 CSS 规则块。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>.question-pick-top span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 767 | <code>  font-size: 0.84rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 768 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 769 | <code>}</code> | 结束当前 CSS 规则块。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>.compact-timeline article {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 772 | <code>  grid-template-columns: 54px minmax(0, 1fr);</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 773 | <code>}</code> | 结束当前 CSS 规则块。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>.transcript-bubble {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 776 | <code>  max-width: 100%;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 777 | <code>}</code> | 结束当前 CSS 规则块。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>.transcript-bubble span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 780 | <code>  display: inline-block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 781 | <code>  margin-bottom: 8px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 782 | <code>  color: var(--muted);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 783 | <code>  font-size: 0.82rem;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 784 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 785 | <code>}</code> | 结束当前 CSS 规则块。 |
| 786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 787 | <code>.transcript-bubble p {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 788 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 789 | <code>}</code> | 结束当前 CSS 规则块。 |
| 790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 791 | <code>.transcript-bubble.teacher {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 792 | <code>  background: rgba(18, 165, 125, 0.08);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 793 | <code>}</code> | 结束当前 CSS 规则块。 |
| 794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 795 | <code>.transcript-bubble.student {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 796 | <code>  background: rgba(240, 184, 68, 0.12);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 797 | <code>}</code> | 结束当前 CSS 规则块。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>.transcript-bubble.system {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 800 | <code>  background: rgba(24, 33, 27, 0.06);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 801 | <code>}</code> | 结束当前 CSS 规则块。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>.choice-pick {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 804 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 805 | <code>  align-items: flex-start;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 806 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 807 | <code>}</code> | 结束当前 CSS 规则块。 |
| 808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 809 | <code>.choice-pick input {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 810 | <code>  width: auto;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 811 | <code>  margin: 4px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 812 | <code>}</code> | 结束当前 CSS 规则块。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>.choice-pick span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 815 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 816 | <code>}</code> | 结束当前 CSS 规则块。 |
| 817 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 818 | <code>.question-stage h4 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 819 | <code>  margin: 14px 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 820 | <code>}</code> | 结束当前 CSS 规则块。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>.simulation-classroom {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 823 | <code>  position: relative;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 824 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 825 | <code>  gap: 22px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 826 | <code>  overflow: hidden;</code> | 设置 CSS 属性 `overflow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 827 | <code>  margin-bottom: 28px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 828 | <code>  padding: 24px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 829 | <code>  border: 1px solid var(--line);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 830 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 831 | <code>  background:</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 832 | <code>    linear-gradient(135deg, rgba(20, 56, 39, 0.16), rgba(240, 184, 68, 0.2)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 833 | <code>    #efe6cf;</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 834 | <code>  box-shadow: var(--shadow);</code> | 设置 CSS 属性 `box-shadow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 835 | <code>}</code> | 结束当前 CSS 规则块。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>.classroom-ambient {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 838 | <code>  position: absolute;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 839 | <code>  inset: 0;</code> | 设置 CSS 属性 `inset`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 840 | <code>  opacity: 0.2;</code> | 设置 CSS 属性 `opacity`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 841 | <code>  pointer-events: none;</code> | 设置 CSS 属性 `pointer-events`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 842 | <code>  background:</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 843 | <code>    linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 844 | <code>    url("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&amp;fit=crop&amp;w=1400&amp;q=80") center / cover no-repeat;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 845 | <code>}</code> | 结束当前 CSS 规则块。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>.knowledge-blackboard {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 848 | <code>  position: relative;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 849 | <code>  z-index: 1;</code> | 设置 CSS 属性 `z-index`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 850 | <code>  min-height: 520px;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 851 | <code>  padding: 34px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 852 | <code>  border: 14px solid #7b532c;</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 853 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 854 | <code>  background:</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 855 | <code>    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 38%),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 856 | <code>    #183c2b;</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 857 | <code>  color: #f8f4df;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 858 | <code>  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.08), 0 24px 50px rgba(24, 33, 27, 0.2);</code> | 设置 CSS 属性 `box-shadow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 859 | <code>}</code> | 结束当前 CSS 规则块。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>.chalk-mark {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 862 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 863 | <code>  width: 90px;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 864 | <code>  height: 6px;</code> | 设置 CSS 属性 `height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 865 | <code>  margin-bottom: 22px;</code> | 设置 CSS 属性 `margin-bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 866 | <code>  border-radius: 999px;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 867 | <code>  background: #f0b844;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 868 | <code>}</code> | 结束当前 CSS 规则块。 |
| 869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 870 | <code>.knowledge-blackboard h2 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 871 | <code>  max-width: 1200px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 872 | <code>  margin: 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 873 | <code>  color: #f8f4df;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 874 | <code>  font-size: clamp(30px, 4vw, 52px);</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 875 | <code>  line-height: 1.12;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 876 | <code>}</code> | 结束当前 CSS 规则块。 |
| 877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 878 | <code>.knowledge-blackboard h3 {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 879 | <code>  margin: 28px 0 12px;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 880 | <code>  color: #f0d777;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 881 | <code>  font-size: 26px;</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 882 | <code>}</code> | 结束当前 CSS 规则块。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>.knowledge-blackboard p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 885 | <code>.knowledge-blackboard li {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 886 | <code>  color: rgba(248, 244, 223, 0.9);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 887 | <code>  line-height: 1.75;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 888 | <code>}</code> | 结束当前 CSS 规则块。 |
| 889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 890 | <code>.classroom-board-only {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 891 | <code>  width: 100%;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 892 | <code>}</code> | 结束当前 CSS 规则块。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>.blackboard-question-form,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 895 | <code>.blackboard-empty {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 896 | <code>  margin-top: 34px;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 897 | <code>}</code> | 结束当前 CSS 规则块。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>.blackboard-question {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 900 | <code>  max-width: 1100px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 901 | <code>  margin: 12px 0 24px;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 902 | <code>  color: rgba(248, 244, 223, 0.96) !important;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 903 | <code>  font-size: clamp(18px, 2vw, 28px);</code> | 设置 CSS 属性 `font-size`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 904 | <code>  font-weight: 700;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 905 | <code>  line-height: 1.65;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 906 | <code>}</code> | 结束当前 CSS 规则块。 |
| 907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 908 | <code>.blackboard-choice-list {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 909 | <code>  display: grid;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 910 | <code>  grid-template-columns: repeat(2, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 911 | <code>  gap: 16px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 912 | <code>  margin-top: 20px;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 913 | <code>}</code> | 结束当前 CSS 规则块。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>.blackboard-choice {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 916 | <code>  display: flex;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 917 | <code>  align-items: flex-start;</code> | 设置 CSS 属性 `align-items`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 918 | <code>  gap: 12px;</code> | 设置 CSS 属性 `gap`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 919 | <code>  min-height: 72px;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 920 | <code>  padding: 16px 18px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 921 | <code>  border: 1px solid rgba(248, 244, 223, 0.2);</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 922 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 923 | <code>  background: rgba(255, 255, 255, 0.06);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 924 | <code>  color: rgba(248, 244, 223, 0.94);</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 925 | <code>  line-height: 1.55;</code> | 设置 CSS 属性 `line-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 926 | <code>}</code> | 结束当前 CSS 规则块。 |
| 927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 928 | <code>.blackboard-choice input {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 929 | <code>  width: auto;</code> | 设置 CSS 属性 `width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 930 | <code>  margin: 5px 0 0;</code> | 设置 CSS 属性 `margin`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 931 | <code>  accent-color: #f0b844;</code> | 设置 CSS 属性 `accent-color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 932 | <code>}</code> | 结束当前 CSS 规则块。 |
| 933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 934 | <code>.blackboard-choice span {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 935 | <code>  display: block;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 936 | <code>}</code> | 结束当前 CSS 规则块。 |
| 937 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 938 | <code>.blackboard-choice strong {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 939 | <code>  color: #f0b844;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 940 | <code>}</code> | 结束当前 CSS 规则块。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>.blackboard-submit {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 943 | <code>  margin-top: 22px;</code> | 设置 CSS 属性 `margin-top`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 944 | <code>  padding: 13px 22px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 945 | <code>  border: 0;</code> | 设置 CSS 属性 `border`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 946 | <code>  border-radius: var(--radius);</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 947 | <code>  background: #f0b844;</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 948 | <code>  color: #18211b;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 949 | <code>  font: inherit;</code> | 设置 CSS 属性 `font`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 950 | <code>  font-weight: 900;</code> | 设置 CSS 属性 `font-weight`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 951 | <code>  cursor: pointer;</code> | 设置 CSS 属性 `cursor`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 952 | <code>}</code> | 结束当前 CSS 规则块。 |
| 953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 954 | <code>.blackboard-empty p {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 955 | <code>  max-width: 760px;</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 956 | <code>  color: rgba(248, 244, 223, 0.82) !important;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 957 | <code>}</code> | 结束当前 CSS 规则块。 |
| 958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 959 | <code>@media (max-width: 720px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 960 | <code>  .simulation-classroom {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 961 | <code>    padding: 16px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 962 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>  .blackboard-choice-list {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 965 | <code>    grid-template-columns: 1fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 966 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>  .knowledge-blackboard {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 969 | <code>    min-height: auto;</code> | 设置 CSS 属性 `min-height`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 970 | <code>    padding: 24px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 971 | <code>    border-width: 10px;</code> | 设置 CSS 属性 `border-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 972 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 973 | <code>}</code> | 结束当前 CSS 规则块。 |
| 974 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 975 | <code>@media (max-width: 980px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 976 | <code>  .subject-breakdown {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 977 | <code>    grid-template-columns: repeat(2, minmax(0, 1fr));</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 978 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 979 | <code>}</code> | 结束当前 CSS 规则块。 |
| 980 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 981 | <code>@media (max-width: 720px) {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 982 | <code>  .subject-breakdown {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 983 | <code>    grid-template-columns: 1fr;</code> | 设置 CSS 属性 `grid-template-columns`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 984 | <code>  }</code> | 结束当前 CSS 规则块。 |
| 985 | <code>}</code> | 结束当前 CSS 规则块。 |
| 986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 987 | <code>.hidden {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 988 | <code>  display: none !important;</code> | 设置 CSS 属性 `display`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 989 | <code>}</code> | 结束当前 CSS 规则块。 |
| 990 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 991 | <code>.toast {</code> | CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 992 | <code>  position: fixed;</code> | 设置 CSS 属性 `position`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 993 | <code>  right: 24px;</code> | 设置 CSS 属性 `right`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 994 | <code>  bottom: 24px;</code> | 设置 CSS 属性 `bottom`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 995 | <code>  z-index: 1000;</code> | 设置 CSS 属性 `z-index`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 996 | <code>  max-width: min(360px, calc(100vw - 32px));</code> | 设置 CSS 属性 `max-width`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 997 | <code>  padding: 14px 16px;</code> | 设置 CSS 属性 `padding`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 998 | <code>  border-radius: 8px;</code> | 设置 CSS 属性 `border-radius`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 999 | <code>  background: rgba(24, 33, 27, 0.94);</code> | 设置 CSS 属性 `background`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 1000 | <code>  color: #f6f1df;</code> | 设置 CSS 属性 `color`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 1001 | <code>  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);</code> | 设置 CSS 属性 `box-shadow`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。 |
| 1002 | <code>}</code> | 结束当前 CSS 规则块。 |
