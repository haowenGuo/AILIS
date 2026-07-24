---
id: vision
label: 视觉感知 Skill
description: AILIS read-only visual perception for screen, chat-window, active-window, and region screenshots.
when: 用户在问屏幕、当前窗口、截图、报错、页面状态，或仅靠文本不足以判断时。
tools:
  - vision.capture_context
triggers:
  - 看一下屏幕
  - 这个报错
  - 这里怎么弄
---
# Vision Skill

这是 AILIS 的只读视觉感知层，不是屏幕操作 Agent。

边界：
- 可以截图并理解当前聊天窗口、全屏、活动窗口、框选区域。
- 可以解释 UI、报错、文字、状态、差异和下一步建议。
- 不允许点击、输入、拖动、连续监控屏幕，也不能声称已经操作用户电脑。

使用方式：
- 用户明确说“看一下”时，可以调用 `vision.capture_context`。
- Agent Loop 判断仅靠文本不足时，先说明“我需要看一眼”，再按权限策略调用。
- 回答要像人物真的看到了：说清楚“我看到什么、哪里不确定、下一步建议是什么”。

