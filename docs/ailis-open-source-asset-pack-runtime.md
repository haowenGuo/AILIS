# AILIS Open Source Asset Pack Runtime

AILIS now treats character and skin packs as a local, community-friendly extension system for the MIT open-source runtime.

## Direction

- The asset-pack runtime is local-first and does not require an account, payment flow, store, order system, or cloud quota service.
- Users can install local character packs and skin packs from folders that contain a `manifest.json`.
- Community contributors can share packs separately, subject to the license of their own VRM, texture, motion, voice, and metadata assets.
- The core AILIS source code is MIT licensed, but bundled or third-party assets may have their own licenses and should be documented per pack.

## Pack Types

- `character_pack`: may include a VRM model and optional persona/style metadata.
- `skin_pack`: may override render profile, persona style, voice metadata, or expressions without replacing the base character model.

## Minimal Manifest

```json
{
  "schemaVersion": 1,
  "id": "ailis.skin.example.v1",
  "type": "skin_pack",
  "displayName": "Example Skin",
  "version": "1.0.0",
  "publisher": "Community",
  "description": "A local open-source skin pack.",
  "renderProfileId": "ailis_cinematic_rim_toon",
  "assets": {
    "renderProfile": "assets/render-profile.json",
    "personaStyle": "assets/persona-style.json",
    "voiceProfile": "assets/voice-profile.json"
  },
  "compatibility": {
    "minAilisVersion": "1.0.6",
    "runtime": ["desktop"]
  }
}
```

## Notes

- Do not put API keys, account tokens, or private model credentials into asset packs.
- Do not redistribute VRM, motion, voice, texture, or model files unless their upstream license allows it.
- If a pack uses third-party assets, include license notes in the pack README.
