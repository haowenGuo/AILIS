# AILIS Humanoid Motion Retarget Validation

## Purpose

This gate answers a specific procurement question: can one Humanoid motion
pack be retargeted onto every AILIS character without rebuilding the motion
for each skeleton?

AILIS motion approval is still scoped to a `(characterId, motionId)` pair. A
clip being Humanoid or working on one avatar does not make it safe for every
character. Clothing, hair, auxiliary bones, body proportions, and Avatar
configuration can all change the result.

The compatibility runner is separate from the desktop renderer. It does not
change a character manifest and does not make a motion available to automatic
semantic scheduling.

## Run

Build the Unity renderer, then execute:

```powershell
pnpm unity:motion:validate-retarget
```

Optional arguments:

```text
--output <directory>
--report <file>
--ids <motion-id,motion-id>
--timeout-ms <milliseconds>
```

The default output contains:

- `motion-compatibility-matrix.json`
- One three-frame contact sheet for every character and motion combination

## Decision Model

The runner applies the exact same raw `AnimationClipPlayable` to every target
Animator. It does not mix in a character's native Animator Controller, because
that would make the inputs incomparable.

Each combination has independent statuses:

- `mechanicalStatus`: Humanoid rig validity, finite bone transforms, ground
  penetration, root drift, facing, body-proximity risk, and pose integrity.
- `crossAvatarStatus`: normalized limb directions from the same clip are
  compared across all target Avatars. This catches source Avatar mapping,
  reversed facing, and target retarget configuration defects.
- `visualStatus`: whether the avatar was visibly captured and whether an artist
  has reviewed the contact sheet. If UniVRM materials cannot be captured
  offline, the runner renders the actual retargeted Humanoid skeleton instead.
- `status`: the release decision. A mechanically valid combination remains
  `review` until visual review is complete.

The report also records one `characterProfile` per target: Avatar validity,
Humanoid bone coverage, `humanScale`, bind facing, height, shoulder width, arm
span, and normalized limb lengths.

The machine checks are triage, not a mesh self-intersection proof. Hair,
clothing, sleeves, skirts, and spring-bone behavior must be checked visually.

## Current Verified Baseline

The baseline combines six CC0 Quaternius motions and seven compiled Sachi VRMA
motions. It covers idle, conversation, interaction, locomotion, celebration,
greeting, thinking, and presentation-like poses.

The current full run is stored under
`unity-character-demo/Logs/motion-retarget-final-v2`:

- 3 target characters, 13 motions, 39 combinations.
- Every target has all 15 core Humanoid bones.
- 39/39 combinations pass mechanical retarget checks.
- 39/39 combinations pass cross-Avatar pose consistency.
- Cross-Avatar mean joint-direction difference is about 4-7 degrees; the
  observed maximum is about 16 degrees.
- RadDoll and Unity-Chan have full art contact sheets. Shino has skeleton
  contact sheets because its UniVRM material capture is unavailable in the
  headless validation path.
- Every combination also has a `__retarget-skeleton` contact sheet generated
  directly from the driven Humanoid transforms. This is the authoritative
  pose-retarget evidence; the art sheet is the mesh and clothing review.

This proves that the current Humanoid retarget path is reusable. It does not
prove that every mesh looks good: large sleeves, skirts, hair, hands, props,
and spring bones still need live visual review.

## Approval Rule

A motion can enter automatic scheduling only when:

1. The source asset imports as a valid Humanoid clip.
2. Every target Avatar has complete core Humanoid mapping.
3. The exact character and motion combination passes mechanical checks.
4. The motion passes cross-Avatar pose consistency.
5. Its contact sheet and live playback pass visual review.
6. The motion has a redistributable license.
7. The character manifest explicitly records that combination as approved.

Global motion approval is not supported.
