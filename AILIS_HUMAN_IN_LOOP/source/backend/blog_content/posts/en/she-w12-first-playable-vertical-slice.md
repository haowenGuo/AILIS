# SHE W12: Validating the Engine Spine with the First Playable Vertical Slice

The earlier SHE workstreams have mostly been about building the skeleton. Gameplay Core defines commands, events, and timers. Data Core stabilizes schema-first data contracts. Diagnostics and AI Context make each frame explainable. Scene, Assets, Platform, Renderer2D, Physics2D, Audio, and UI Debug gradually fill in the runtime boundaries needed by a small 2D engine.

W12 First Vertical Slice Game matters because it pulls those boundaries into one small playable loop. It is not another isolated module. It asks a more direct question: can this AI-native 2D engine skeleton carry a complete gameplay path from input, movement, collision, pickup, fail state, win state, audio feedback, and debug visibility?

## A Vertical Slice Should Be Small, but Complete

`MILESTONES.md` defines M6 as the Vertical Slice Game milestone: one small but complete game loop, built through the engine's official gameplay, data, diagnostics, and AI-native workflows, and proof that Codex can extend gameplay quickly without architecture rewrites.

The W12 feature README gives the player loop in concrete terms: move with `WASD` or arrow keys, collect three signal cores, avoid red patrol drones, press `R` after a win or loss to restart, and press `Esc` to quit.

That target is intentionally small. It does not need a large level, a lot of content, or a full editor. But it does need to run end to end: the player has input, the world has goals and danger, state changes over time, the game has end conditions, and the result can be retried after success or failure.

The value of this kind of vertical slice is not content volume. It is connection quality. If one boundary is missing, the loop breaks immediately: input cannot drive gameplay, collision cannot become an event, data cannot describe the feature, audio cannot respond to gameplay, or debug UI and AI context cannot see the real runtime state.

## It Tests the Connections Between Systems

The W12 feature README lists the engine surfaces it exercises:

- gameplay commands, events, and timers
- feature-owned schema registration and authored records
- script-module registration plus command-routed invocation
- scene entities and renderer-driven sprite submission
- Box2D-backed sensor collisions for pickup and fail states
- gameplay-routed audio playback
- shared debug/UI/AI context exports

That is not just a feature checklist. It is an integration exam for W01-W11. W01 defines how gameplay activity enters the system. W02 gives gameplay data schemas and records. W03 makes frame diagnostics and AI context explain what happened. W05 and W08 bring entities and sprites into a visible world. W09 lets collision participate in gameplay. W10 makes audio part of feedback. W11 connects runtime inspection to the standard service surfaces.

So W12 should not bypass those contracts. Collecting a signal core should not only mutate a private feature variable; it should be observable through the command, event, timer, or gameplay digest path. Hitting a patrol drone should not be a renderer-side special case; it should travel through the physics sensor, collision callback, gameplay event, and diagnostics report path.

Those constraints may keep the first implementation plain, but they preserve maintainability. A playable vertical slice that depends on hidden channels means the architecture has not really absorbed gameplay yet. A playable vertical slice that runs through official services means the engine spine is starting to hold.

## Feature Boundaries Help Codex Stop Guessing

SHE does not want gameplay to grow as one expanding `Game/Source` folder. It organizes gameplay as `Game/Features/<FeatureName>/`. The feature index says each feature should own its layer or systems, data schemas, authoring notes, and tests. That shape is important for AI-assisted development: Codex can be pointed at one feature directory and the relevant engine service contracts instead of guessing across the whole repository.

W12 is the right place to test that design. The Vertical Slice Feature has to be independent enough to read as one gameplay loop, but integrated enough that it does not privatize data, input, collision, rendering, audio, and diagnostics.

That gives later work a useful template. If a future change adds another pickup, enemy behavior, level rule, or script trigger, the ideal path is not to relearn the whole engine from scratch. It should follow the boundary W12 has already exercised: register metadata, declare schemas, route input or collision into gameplay events, refresh diagnostics and AI context, and verify the behavior with focused smoke tests.

This is the practical benefit of the AI-native architecture. AI is not treated as an external chat helper. The project itself keeps exporting stable context: feature metadata, schema catalogs, data registry summaries, gameplay digests, latest frame reports, and debug surfaces all tell Codex what the current gameplay state means.

## Small Games Expose Architecture Problems Faster Than Big Plans

Many engine projects write long roadmaps before letting the player control anything. W12 takes the opposite path: once the service boundaries have shape, a very small game loop forces the architecture to meet reality.

That reality includes concrete questions:

- does input really enter gameplay instead of stopping at the platform layer?
- can one scene entity be referenced by renderer, physics, diagnostics, and AI context?
- can data schemas describe feature-owned authored records?
- can collision enter gameplay flow as a stable event?
- can audio act as gameplay-triggered feedback instead of an isolated playback API?
- can debug UI show runtime state instead of empty panels?
- does restart test the lifecycle of scene, gameplay, physics, audio, and timers?

These questions are specific, and documentation alone cannot prove all of them. A small vertical slice compresses them into one runtime path. It can expose unstable naming, unclear lifecycle rules, missing service parameters, thin diagnostics, or AI context sections that omit important state.

That is why W12 feels more like a milestone closeout than another module. It turns scattered workstreams into something a player can feel, and turns architecture assumptions into behavior that can be tested again.

## Tests and Debugging Should Arrive With the Gameplay

`ACCEPTANCE_CHECKLIST.md` is explicit about gameplay features: a feature should live under `Game/Features/<FeatureName>/`, register metadata through reflection, register schemas through DataService when data contracts change, use GameplayService for commands, events, and timers when appropriate, and update AI-visible context through standard engine contracts.

That means W12 acceptance should not stop at “it is playable.” Better acceptance questions are whether this gameplay path can be explained, tested, restarted, and extended by Codex later.

Focused tests can cover win and loss conditions, pickup counts, restart lifecycle, collision-to-event flow, schema registration, AI context sections, and diagnostics reports. The debug surface should help a developer quickly confirm how many signal cores have been collected, whether patrol drones exist, what the latest collision event was, and whether the current state is playing, won, or lost.

If all of that information requires source-code guessing, W12 has not fully met the AI-native goal. The ideal W12 is playable for the player, inspectable for the developer, understandable from public context for Codex, and ready for the next feature change without reopening the architecture debate.

## Closing

SHE W12 First Vertical Slice Game is the step from engine skeleton to playable proof. It uses one small loop to connect input, movement, pickups, danger, win/loss state, restart, rendering, physics, audio, debug UI, and AI context, then checks whether the service contracts from W01-W11 can work together.

The point is not content scale. The point is integration quality. Once a player-completable loop runs through the official gameplay, data, diagnostics, and AI-native workflows, it becomes the most important template for later gameplay work: fewer guesses, more contracts; fewer private shortcuts, more observable paths; fewer abstract promises, more running evidence.
