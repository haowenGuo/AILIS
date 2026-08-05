# AIGAME Unity Edition Archive

AIGAME is the paused Unity-rendered edition split from the lightweight AILIS desktop runtime on 2026-08-05. The active AILIS product continues with the Electron/Three.js/VRM renderer; this repository preserves the Unity renderer, integration contracts, tests, and design notes for future work.

## Archive layout

- `unity-character-demo/`: Unity 2022.3 project and renderer source.
- `integration/`: Electron integration modules removed from the active AILIS runtime.
- `integration-snapshot/`: source snapshots needed to reconstruct the former AILIS/AIGAME connection.
- `docs/`: Unity renderer and product-split design notes.
- `source-assets/`: redistributable source motion assets and their licenses.
- `Build/`: local standalone build, intentionally excluded from Git.

The split was made from AILIS branch `codex/ailis-self-evolve-sync-20260804`, whose pre-split baseline was commit `4ddef69`.

## Restore

1. Clone this branch and open `unity-character-demo/` with Unity `2022.3.62f3` or a compatible Unity 2022.3 LTS editor.
2. Let Unity restore registry packages and the vendored packages under `Packages/vendor/`.
3. Restore locally licensed character assets listed in `ASSET_MANIFEST.md` to their original paths.
4. Reopen the project so Unity regenerates `Library/` and generated animation artifacts.
5. Use the files in `integration/` and `integration-snapshot/` if the renderer is reconnected to a future AILIS host.

## Public archive policy

Git contains source code and redistributable dependencies. Generated Unity caches, standalone builds, temporary logs, and character packages that prohibit or complicate redistribution remain available in the local `F:\AIGAME` archive but are excluded from the public branch. This keeps the source recoverable without publishing assets outside their licenses.

Development is intentionally paused. New renderer work should resume on this archive branch rather than reintroducing Unity into the lightweight AILIS branch.
