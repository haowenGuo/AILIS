# AIGril Desktop Pet V1: From Web Avatar to Resident Companion

This iteration is important not because AIGril now runs inside Electron, but because it finally behaves like a desktop product instead of a browser demo inside a shell.

At this point, AIGL is no longer only a 3D character on a web page. She can stay on the desktop, open a chat window on demand, and respond with animation, expression, and speech-aware interaction.

## What actually shipped in this version

- A frameless transparent pet window that stays on top
- A separate chat window opened by clicking the character
- A right-click control menu for chat, scale, speech mode, and quit
- A system tray entry for visibility and desktop behavior
- Persisted window position, scale, and visibility state
- A shared VRM runtime and shared backend chat flow between web and desktop

That is the point where AIGril stops being only a character prototype and starts becoming a usable desktop companion.

## How I handled speech in this version

I split speech into two layers.

The first layer is output, meaning how the character speaks back.  
The desktop build currently supports three modes:

- server-side AI voice
- local lightweight voice
- voice off, with text and motion only

The second layer is input, meaning how the user speaks to the character.  
For this version, I focused on a manual local speech-recognition path on desktop. The goal was not to imitate a full voice assistant yet. The goal was to make the core loop work reliably: record, transcribe, and send the text back into the conversation.

That split keeps the desktop experience lightweight while giving more control over the most environment-sensitive parts of the product.

## Why desktop cannot be treated like the web

After shipping this pass, one thing became very obvious: a desktop pet is not just a web app with a wrapper.

The hard parts are usually the details:

- whether the window is transparent, always on top, and still draggable
- whether the tray and right-click controls feel natural
- how the pet window and chat window stay in sync
- whether voice, rendering, and input devices block each other
- what closing a window should mean: hide, minimize, or quit

None of these decisions looks dramatic on its own, but together they decide whether the character feels like a real desktop pet or just a webpage packaged with Electron.

## The structure behind this version

I did not rewrite the existing runtime from scratch. Instead, I kept the VRM renderer and chat flow, then added an Electron desktop shell around them.

The system is now split into three parts:

1. Electron main process  
   Handles the pet window, chat window, tray, context menu, state persistence, and local speech-recognition worker orchestration.

2. Frontend runtime  
   Handles avatar rendering, motion, expression, lip sync, streaming messages, and chat interaction.

3. FastAPI backend  
   Handles the main conversation, memory compression, and server-side voice endpoints.

This keeps the core avatar experience shared between web and desktop, while the desktop version only adds platform-specific logic where it actually matters.

## What kind of product this feels like now

The most accurate way to describe AIGril at this stage is no longer “a chat page.” It is becoming a lightweight virtual companion system in desktop-pet form:

- it stays on the desktop
- it opens chat when needed
- it responds with more than text
- it is starting to feel suitable for long-term companionship instead of short demos

That shift matters because it changes how I think about future work. The next steps are less about stacking features and more about improving presence, stability, and resource use.

## Closing thoughts

The most valuable part of this iteration is that AIGril has crossed from prototype territory into something closer to a product.

It already has the basic shape of a desktop pet, while still keeping the most important parts of the original virtual-character experience: personality, movement, and conversation.

From here, the interesting work is not making the interface more complex. It is making the character lighter, steadier, and more natural to live with on a real desktop.
