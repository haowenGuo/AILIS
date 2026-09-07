# AILIS Desktop Experience

Workspace: `F:/AILIS/main`. Updated: 2026-09-07.

## Design Direction

- A companion, not a diagnostics console: warm paper surfaces, restrained green, the real AILIS illustration, readable text and few persistent buttons.
- Quick controls for frequent decisions; the control panel for configuration; chat for conversation and work. Each surface has a distinct purpose.
- Show the current selection and honest feedback. Saving a voice preference does not mean its model has finished loading.
- Search and progressive disclosure instead of adding more permanent navigation or setup forms.
- Preserve reading position, drafts and existing settings. UI interactions must not silently start downloads, run models or change providers.

## Implemented

1. Independent quick-controls popup, replacing the avatar's native context menu. Chat/settings shortcuts, selected voice, character size, language and quit. Uses existing preference persistence. Esc/blur dismissal, monitor work-area clamping and native-menu fallback on load failure. The system tray and text-edit menus remain native.
2. Settings palette (`Ctrl/Cmd+K`). Searches setting labels only, opens the correct page and enclosing disclosures, and focuses the result. Page switches restore their scroll positions. Does not index field values, credentials, memory or logs.
3. Conversation find (`Ctrl/Cmd+F`). Literal search across Markdown text with next/previous navigation and CSS Highlight ranges, without changing stored messages. Up to 1,000 highlighted matches to bound UI work. Searches the currently loaded conversation, not the full memory ledger.
4. Single-message copy on hover/keyboard focus. Copies original content, not buttons or status text.
5. Earlier chat refresh: compact auto-growing composer, IME-safe Enter, reading-width bubbles, preserved scroll/DOM on snapshots, latest-message button and character welcome state.

## Next Design Candidates (Not Implemented)

- A compact activity card for long tasks: actual state, elapsed time, newest public progress, stop/resume controls and resulting files. Must consume real runtime events; no invented percentage or templated reasoning.
- A recoverable draft and attachment shelf: interrupted sessions should preserve unfinished input. Any persistence design needs explicit retention, deletion and privacy treatment before shipping.
- An outcome-oriented settings home: current model connection, voice state and storage state, each with one relevant next action. Reuse cached status; never run full diagnostics on first paint.
- Result cards for generated files, with preview/open-folder/copy-path. Keep evidence and errors available on demand rather than dumping runtime JSON into conversation.
- Separate ordinary settings from developer tools. Keep Agent Lab, logs and runtime repair discoverable without making every user navigate them.

## Implementation Boundaries

- `electron/quick-controls-window.cjs` + dedicated sandboxed preload own the popup only. They never resize/move/parent the avatar or chat windows.
- `electron/main.cjs` adapts existing allowed choices and preference callbacks. No new configuration store, renderer pipeline or Agent policy.
- `src/settings-search.js` and `src/chat-search.js` are presentation-only modules. The shared Markdown renderer, memory and model requests are unchanged.
- `tests/quick-controls-smoke.cjs`, `tests/llm-connection-panel-smoke.cjs`, `tests/chat-panel-smoke.cjs`: hidden Electron, synthetic settings/messages, no model calls or user data. Real desktop acceptance is still needed for OS focus, native select menus and multi-monitor interaction.
