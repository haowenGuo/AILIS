# AILIS Motion Intake

This directory manages renderer-neutral VRM and VRMA motion candidates for the AILIS Three.js character runtime.

## Workflow

1. Place source archives under `candidates/<source-id>/raw/` only when redistribution is permitted.
2. Put reviewable `.vrma` files under `candidates/<source-id>/vrma/`.
3. Register source, license, style, clipping risk, and approval state in `src/character/motion-intake-catalog.js`.
4. Run `pnpm motion:intake:verify`.
5. Review each candidate in Character Lab with the default AILIS model.
6. Mark a motion approved only after checking framing, clothing and hair clipping, dialogue interruption, and license compatibility.

## Sources

- VRoid official VRMA motions: use under the VRoid Project terms; do not redistribute extractable originals outside those terms.
- fumi2kick VRMA motion pack: CC0 source motions, still subject to visual acceptance.
- Sachi VRMA: source page declares CC0; keep unverified or damaged archives out of stable runtime packages.
- Other GLB/FBX sources remain intake-only until converted to VRMA and visually accepted.

Large caches, editor imports, engine-specific packages, and purchased assets are not part of the AILIS repository.
