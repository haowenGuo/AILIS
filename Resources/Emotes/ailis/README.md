# AILIS Emote Stickers

These AILIS emote stickers are generated from the project character reference and used by the program-level emoji replacement pipeline.

The active assets are transparent PNG files referenced by `src/ailis-emote-stickers.js`. The SVG files are lightweight placeholders/fallback references.

Current set: 30 transparent PNG stickers covering common LLM emoji output, including smile, shy, sparkle, love, sad, surprised, laugh, wink, kiss, cool, thinking, confused, sweat, worried, cry, angry, sleepy, calm, proud, party, thumbs up, clap, thanks, wave, hug, dizzy, neutral, eyes, idea, and facepalm.

Recommended final asset specs:

- Transparent PNG or WebP.
- 512x512 source size.
- Keep the face readable at 28-36 CSS pixels.
- No text, watermark, speech bubble, or hard background.
- Keep expression categories stable: `happy`, `shy`, `sparkle`, `love`, `sad`, `surprised`.
