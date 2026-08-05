# ChatdollKit Core

AILIS vendors the model-performance subset of ChatdollKit v0.8.16:

- Upstream: https://github.com/uezo/ChatdollKit
- Tag: `v0.8.16`
- Commit: `eb5ad8f9531e15d6e68b1e0a4bfbba7db2304f1d`
- License: Apache License 2.0 (see `LICENSE`)

Included code is limited to the `Scripts/Model` types required for animation
queues, weighted idle selection, face-controller contracts, blinking, and
speech timing contracts. AILIS does not include ChatdollKit's LLM, memory,
speech recognition, speech synthesis, UI, networking, examples, or demo
characters.

## AILIS compatibility patch

`ModelController` retains upstream behavior by default. AILIS adds opt-out
switches for following the avatar root and resetting unrelated Animator layers,
plus support for direct Animator-state playback without a parameter. Idle mode
switches validate that a usable pool exists, repeated idle states restart their
duration correctly, and weighted pools avoid immediately repeating the same
animation when another animation is available. An animation-start callback
provides runtime scheduling evidence to the AILIS bridge. These changes keep
ChatdollKit isolated from the transparent window, expression layer, and
PersonaSurface protocol.

The vendored subset uses `System.Threading.Tasks.Task` in place of UniTask.
AILIS does not instantiate ChatdollKit's speech controller, and this avoids a
network-fetched build dependency while preserving the async behavior required
by the model-performance runtime.
