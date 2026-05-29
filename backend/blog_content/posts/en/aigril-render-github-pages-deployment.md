# How AIGril Is Deployed: GitHub Pages for the Frontend and Render for the Backend

AIGril is no longer only a local virtual-character demo. It has been split into a deployable web system: the frontend runs on GitHub Pages, the backend runs on Render, and visitors can open a browser to meet AIGL and try the conversation flow.

This post documents one of the most important engineering lines in the project: turning an AI application with a 3D avatar, streaming chat, memory, and safety APIs into something other people can actually visit.

## Why the frontend and backend are deployed separately

The frontend owns the experience.

It includes:

- 3D VRM avatar rendering
- motion and expression control
- streaming text display
- fallback lip sync and speaking state
- the browser interaction layer

These pieces are a natural fit for GitHub Pages. They are static assets, easy to host, and ideal for a project showcase.

The backend owns the parts that should not live directly in the browser:

- LLM API calls
- session memory
- RAG retrieval
- content safety checks
- TTS and other key-protected services
- SQLite-backed server state

That part needs a real Python service, so I deploy it to Render as a FastAPI backend.

## Current live entry points

The project currently has three useful public links:

- Full live experience: [https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com](https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com)
- Frontend-only page: [https://haowenGuo.github.io/AIGril/](https://haowenGuo.github.io/AIGril/)
- Backend API docs: [https://airi-backend.onrender.com/docs](https://airi-backend.onrender.com/docs)

This setup makes the project easy to understand. Visitors can first try the live page without installing anything, then inspect the source code or backend API if they want to go deeper.

## What the Render backend does

The AIGril backend is not just a thin proxy.

It handles several responsibilities:

- chat endpoints such as `/api/chat`
- user sessions and conversation history
- memory compression when conversations become long
- content safety checks
- a shared FastAPI surface for later modules such as voice, education demos, and the blog

Render works well here because it connects directly to GitHub and can redeploy when the `main` branch changes. For a personal project that needs to be shown to others, this is much lighter than maintaining a cloud server by hand.

There are tradeoffs. Free or small instances can cold-start, and network latency between Render and model providers can hurt the experience. That is one reason I paused heavy TTS work and returned to streaming text first: the interaction needs to feel stable before it feels fancy.

## What GitHub Pages does

The frontend turns backend capability into something the user can feel.

AIGril is not organized around a plain chat box. It is organized around the AIGL avatar:

- the user sends a message
- the backend returns streaming text
- the avatar enters a speaking state
- text appears progressively
- fallback lip sync follows the estimated speaking rhythm
- expressions and actions change through controlled interfaces

GitHub Pages is a good home for this layer because it doubles as a project homepage. A visitor can open the link and immediately see the character, interaction model, and overall polish.

## Source code and desktop packages

The source code is available here:

[https://github.com/haowenGuo/AIGril](https://github.com/haowenGuo/AIGril)

The desktop version also has an Electron packaging path. According to the project README, Windows packages can be generated with:

```bash
pnpm desktop:package
```

The generated files are written to `release/`, including installer, portable, and unpacked versions.

I do not want the auto-blogging job to upload local installers automatically. A public binary should be checked for version, size, dependencies, and redistribution safety first. For now, the better path is to document the packaging command, then publish official downloads through GitHub Releases once a stable build is ready.

## What changed after deployment

Deployment changes the nature of the project.

AIGril is no longer just “something that runs on my machine.” It becomes:

- a live web experience
- a demo that can be shared with classmates or interviewers
- a product-like project with a visible iteration trail
- a backend platform that can keep growing through APIs

That is why the blog system and publishing guide matter. Once a project is online, it needs more than code. It needs documentation, public explanation, iteration notes, and a way for people to follow the work.

## Next steps

The next improvements are less about adding random features and more about tightening the loop:

- reduce cold-start and model-call latency
- improve streaming output and avatar speaking state
- prepare a clean public desktop release
- keep turning project iterations into blog posts
- decide which source, assets, and model resources are safe to distribute

The current deployment is not complicated, but it changes AIGril from a local AI avatar experiment into something people can open, experience, understand, and follow.
