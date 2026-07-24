# SHE W10: Turning Audio Runtime into Playback Contracts and Gameplay Feedback

SHE W08 made the world visible, and W09 gave it fixed-step motion and collision events. W10 Audio Runtime adds a part of playability that is easy to underestimate: how feedback becomes audible, how audio assets are played, and how sound-producing events fit into the existing runtime story.

The public docs place W10 in Wave C, the playable runtime stage. This is not just about wiring in a library that can make sound. The real work is to fit `IAudioService`, miniaudio, sound and music asset contracts, channel or group ownership, and gameplay-triggered audio events into SHE’s existing service, asset, platform, gameplay, diagnostics, and AI context boundaries.

## Audio Needs a Runtime Service Boundary

SHE is still a compileable 2D engine skeleton. The README says this stage is about stabilizing ownership boundaries, module responsibilities, and development workflow before more complex runtime code replaces the bootstrap placeholders.

Audio follows that strategy directly. The AI-native refactor document lists `IAudioService` as a first-class runtime service. Its current bootstrap class is `NullAudioService`, and its responsibility is audio frame ownership. The tech stack document points the future implementation toward `miniaudio` because it has a small integration footprint and is practical for sound effects, music, buses, and volume control in a small game.

So the first W10 goal is not a complete mixer. It is to make ownership clear: who owns playback state, who submits playback requests, who manages channels, and who updates audio each frame. Once that boundary is stable, the null service can be replaced with a real miniaudio backend without forcing gameplay, assets, or diagnostics to bypass the shared contract.

## Playback Is More Than Making Sound

The Multi-Codex launch plan gives W10 a clear set of immediate tasks: confirm that W01, W06, and W07 contracts are stable enough, implement the first miniaudio-backed playback path, define sound and music asset usage plus channel ownership, and add focused audio smoke tests.

That means the audio runtime depends on three earlier foundations.

W01 Gameplay Core provides the shared command, event, and timer path. Audio should not require features to call private playback helpers directly. It should be able to respond to gameplay-triggered audio events such as hit feedback, UI actions, environment triggers, or level-state changes.

W06 Asset Pipeline provides asset IDs, metadata, loader registration, and handle lifetime rules. Audio should not be a set of hard-coded file paths. It should become a resource contract like textures and materials: sound effects and music need clear identity, load state, lifetime, and intended use.

W07 Platform + Input provides the window loop, event pumping, and frame timing. Audio updates are not the same as rendering frames, but playback requests, pause, resume, and shutdown still need to live inside a clear runtime lifecycle.

## Channels and Music Need Ownership Rules First

The tech stack document names miniaudio targets such as sound effect playback, music, buses, and volume control. For a small 2D engine, those are practical features, but they can easily become hidden global state in the first implementation.

W10 should answer several ownership questions early:

- whether sound effects and music use separate playback paths
- how short effects, looping ambience, and background music are distinguished
- who creates, reuses, and stops channels or groups
- whether volume, mute, pause, and fades are global rules or group-level rules
- what happens to active playback when an asset handle becomes invalid

If those answers become contracts, later debug UI, settings screens, cutscenes, script events, and level systems can share one audio vocabulary instead of each owning a private playback model.

## Audio Events Should Enter Gameplay, Not Bypass It

One architecture decision matters especially for W10: downstream systems should treat the public `IGameplayService` surface as the stable entry point, and gameplay-triggering integrations should use the shared command, event, and timer path instead of inventing private dispatch channels.

For audio, that means “play a sound” should not degrade into arbitrary modules touching the low-level backend. A stronger approach is to express the reason for playback as a gameplay event or command, then let Audio Runtime translate it into a playback request inside its own boundary.

The benefit is concrete. A physics collision can trigger hit feedback, debug UI can show recent audio events, diagnostics can record which events produced playback requests, and AI context can summarize current audio capability plus recent sound feedback. Every module observes the same explainable path instead of scattered backend calls.

## `Audio.Update` Belongs in the Frame Story

Both the architecture document and the AI-native refactor document place `Audio.Update` inside the frame flow: after renderer and UI, before AI context refresh and diagnostics end frame. That placement matters.

It says audio is not a detached background box. During a frame, gameplay advances commands and events first; scripting, scene, renderer, and UI run their phases; then audio reads the playback intent formed by that frame. Only after that does AI context refresh and diagnostics close the frame.

This order makes audio feedback explainable. The engine should be able to say why a sound played in a frame, which gameplay event caused it, which asset it used, which channel or group owned it, and whether volume or pause state affected it. To the player it is feedback; to the engine it should be testable, diagnosable, and replayable runtime behavior.

## Closing

W10 Audio Runtime is not about rushing sound into the game. It is about putting sound inside the architectural order SHE has already established. It should stabilize `IAudioService` frame ownership, use miniaudio as the later real playback backend, define sound and music asset usage plus channel or group ownership, and route gameplay-triggered audio events through the shared event path.

If W08 makes the world visible and W09 makes it move, W10 makes it respond audibly. The important part is that this feedback does not become a second hidden system inside the implementation. It should continue to serve SHE’s runtime services, asset pipeline, gameplay contracts, diagnostics, and AI-readable context.
