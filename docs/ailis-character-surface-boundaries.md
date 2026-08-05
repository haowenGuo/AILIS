# AILIS Character Surface Boundaries

AILIS keeps persona orchestration, dialogue UI, and character rendering in separate surfaces.

## Runtime ownership

| Surface | Owns | Must not own |
| --- | --- | --- |
| PersonaHost | Chat loop, TTS playback, lip-energy calculation | Three.js, Unity APIs, bubbles, visible windows |
| ThreeRenderer | VRM scene, motions, expressions, lip frames | Chat loop, TTS, bubbles, control panel |
| UnityRenderer | Avatar scene, motions, expressions, lip frames, session-local native drag presentation | Hit testing, persisted geometry, Electron APIs, chat loop, TTS, bubbles |
| DialogueSurface | Transient speech bubble | Avatar rendering, chat execution, window geometry of renderers |
| ChatWindow | Conversation transcript and controls | Avatar rendering and renderer lifecycle |
| Electron main | Lifecycle, backend selection, narrow IPC routing | Character rendering implementation |

## One-way protocols

```text
ChatWindow -> Electron -> PersonaHost
PersonaHost -> Electron -> ChatWindow
PersonaHost -> Electron -> active CharacterRenderer
PersonaHost -> Electron -> DialogueSurface
Electron -> active CharacterRenderer: renderer.configure
Electron -> UnityRenderer: renderer.window (`sync`, `drag_begin`, `settle`)
UnityRenderer -> Electron: renderer.hit_test_bounds
UnityRenderer -> Electron: renderer.window.drag_released
UnityRenderer -> Electron: renderer.window.settled
```

`renderer.configure` contains visual settings only. Native window bounds are sent only through
`renderer.window`. Dialogue payloads never enter the character renderer protocol.

## Invariants

1. Only one character renderer receives persona and lip commands at a time.
2. Switching renderer backends does not recreate or resize ChatWindow or DialogueSurface.
3. Visual configuration cannot change native window geometry.
4. Dialogue text is rendered only by DialogueSurface.
5. PersonaHost remains renderer-agnostic and talks through `CharacterRendererClient`.
6. Unity's native window is permanently mouse-through. Electron owns avatar hit testing, drag-session authority, context menus, persisted geometry, and final display-bound clamping. After one `drag_begin` handshake, Unity moves only its visible native window from the local system cursor until `settle`; no per-frame position packets cross processes.
7. Each renderer supplies the bounds of the avatar it actually displays. Three.js supplies bounds in-process; Unity publishes `renderer.hit_test_bounds`, which Electron converts from physical pixels to window coordinates before hit testing.
8. In Unity mode the transparent Electron interaction surface stays above the Unity window while only the Three.js canvas is hidden. Renderer-bound updates never reorder windows, avoiding focus churn and flicker during animation.
