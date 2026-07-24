# SHE W09: Turning Physics2D into a Fixed-Step and Collision Event Boundary

SHE W08 Renderer2D put “how the world becomes visible” behind a clear submission path. W09 Physics2D takes on the next core requirement for a playable 2D engine: how objects move predictably, how collisions enter gameplay, and who owns simulation steps.

The public docs place W09 in Wave C, the playable runtime stage. This is not just about adding a physics library. The real work is to fit Box2D, body/collider lifetime, fixed-step simulation, and collision callbacks into the runtime service, scene, gameplay, diagnostics, and AI context boundaries that SHE has already established.

## Physics Needs a Boundary First

SHE is still a compileable architectural skeleton, and the README is clear that complex rendering and physics code comes later. That order is sensible. Once physics logic is scattered through gameplay, scene, or renderer code, deterministic stepping, debugging, and event flow become much harder to recover.

The first value of W09 is making `IPhysicsService` the owner of fixed-step simulation. Upper layers should not control a Box2D world directly, and collision handling should not hide inside private feature callbacks. They should express body, collider, step, and contact intent through stable runtime contracts.

That also explains why the docs mark W09 with A-level importance and difficulty. It may not be as visually immediate as Renderer2D, but it will decide whether platforming, triggers, ray queries, damage zones, and character controllers can all follow one shared rule set.

## Fixed-Step Belongs in the Frame Story

The AI-native refactor document’s frame flow is important: the fixed update stage contains `Layer.OnFixedUpdate`, `Gameplay.AdvanceFixedStep`, and `Physics.Step`. Physics is not temporary code inside a generic update. It is an explicit, diagnosable fixed-step phase.

That design has several benefits.

First, simulation cadence can stay separate from render framerate. Renderer2D draws the current world, Physics2D advances motion and contacts at fixed intervals, Platform + Input supplies frame timing, and Gameplay responds through a clear fixed-step entry point.

Second, tests become easier to write. Physics smoke tests can assert fixed steps, body lifecycle, collider registration, and contact events without depending on a real window or unstable frame timing.

Third, diagnostics become more useful. Since diagnostics already records what happened in a frame, W09 should make the physics phase explainable too: whether a step ran, which collision events were produced, and which gameplay events were queued from them.

## Box2D Should Sit Behind a Runtime Contract

The tech stack document describes the current physics layer as a null physics service, with Box2D planned as the real implementation. The reason is practical: Box2D covers 2D colliders, rigid bodies, contact callbacks, and raycasts, and it has mature documentation and community familiarity.

But the real deliverable for W09 is not merely “the project uses Box2D.” It is the Box2D runtime boundary. That boundary needs to answer several questions:

- who owns body and collider lifetime
- how scene entities map to physics bodies
- when the physics world steps inside fixed update
- how contact callbacks become gameplay events
- how raycast or query results reach gameplay without leaking backend details

If those answers become clear contracts early, later implementation swaps, debug panels, and gameplay features do not need to pass low-level Box2D objects through the whole engine.

## Collision Events Should Enter Gameplay, Not Bypass It

One architecture decision matters especially for W09: downstream systems should treat the public `IGameplayService` surface as the stable entry point, and gameplay-triggering integrations should use the shared command/event/timer path instead of inventing private dispatch channels.

That means collision callbacks should not directly mutate arbitrary gameplay state. A stronger approach is to translate collision results into gameplay events: which objects touched, whether contact began or ended, whether it was a trigger, and which feature may subscribe to it.

The benefit is concrete. Scripting, audio, diagnostics, debug UI, and AI context can all observe the same event path. One collision can trigger sound, script logic, debug display, and logging, while every module still knows it came from the fixed-step physics phase rather than a hidden callback.

## W09 Should Stay Explainable to AI Tools

One of SHE’s core goals is to let Codex understand the project from stable facts instead of guessing. The AI context document says new subsystems should extend the context exporter instead of bypassing it, and the architecture decisions keep AI context read-only with respect to deterministic simulation.

So the AI-native direction for W09 is not letting AI directly mutate simulation output. It is making physics state and events easier to explain. The current physics service capability, recent fixed-step statistics, registered collider types, recent contact digest, and scene-entity mapping can all become inputs for diagnostics or authoring context summaries.

That makes later debugging more direct. When a character clips through a wall, a trigger does not fire, or a body fails to sync with rendering, Codex should be able to see the relationship between fixed step, scene, gameplay events, and renderer snapshot instead of reading disconnected implementation details.

## Closing

W09 Physics2D is the step that moves SHE from a visible runtime toward a playable runtime. Its goal is not to finish every physics feature at once. It is to stabilize the parts that shape the long-term architecture: the Box2D runtime boundary, body/collider lifetime, fixed-step simulation integration, and collision callbacks into gameplay events.

If W08 lets the world be drawn, W09 lets the world move and respond by rules. The important part is that those rules enter SHE’s existing service, scene, gameplay, diagnostics, and AI context system instead of becoming a second hidden runtime inside the implementation.
