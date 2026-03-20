---
id: 2
date: '2026-03-16'
title: "Useful AI tools - locus, lyria, exa, browser use"
pinned: true
---

The space is moving fast with new tools shipping every day and it's genuinely hard to keep up. These are a few I've had the chance to actually test, and they're worth knowing about.

<Tweet id="2026655633357857068" />

## Locus - Allow your agents to pay

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://paywithlocus.com/assets/hero-right-dark-1IpLhdkJ.svg"
    alt="paywithlocus"
  />
</div>

[Locus](https://paywithlocus.com/) is a YC-backed company (Fall 2025) solving a problem that's easy to overlook until you hit it: AI agents can do a lot, but they get completely stuck at payments. After <mark data-tooltip="if you don't know what that is .. congratulations you have a life">OpenClaw</mark> made autonomous agents more viable, the payments gap became more obvious. Locus fills that gap.

The core idea is straightforward you get a digital wallet funded with USDC, and your agent can make payments from it. I tested it with [Dia](/project/1) and it worked well for the basic flow: wallet-to-wallet transfers and checking balances.

### Wrapped APIs

One of the more interesting features is wrapped APIs. Instead of managing separate API keys for OpenAI, Gemini, Firecrawl, Exa, Resend, Apollo, Browser Use, Twitter, fal.ai, and Abstract, you route calls through Locus and the cost gets deducted from your wallet balance. Clean concept fewer credentials to manage, unified billing.

That said, I ran into 404s across the board when I tried the wrapped APIs last week. It could be something on my end, so I'm planning to revisit this in an upcoming project before writing it off.

### Keeping Your Agent From Draining Your Wallet

This is something worth paying attention to when you hand payment capabilities to an agent. Locus lets you configure an allowance, set a max per transaction, and define an approval threshold so anything above a certain amount requires explicit sign-off before it goes through. It's a sensible set of guardrails for autonomous use.

### Other Features

- **Email payments** — you can send USDC to an email address. The recipient claims it once they create an account. Useful for paying people who aren't already on Locus.
- **Custom endpoints** — they support x402-enabled endpoints for pay-per-use API calls. Haven't tested this yet but it's on the list.
- **skill.md** — they provide a [skill.md](https://paywithlocus.com/skill.md) file you can point your agent at so it knows exactly what Locus can do.

### Links

- [Website](https://paywithlocus.com/)
- [Skils.md](https://paywithlocus.com/skill.md)
- [Docs](https://docs.paywithlocus.com/) built on [mintlify](https://www.mintlify.com/), which makes navigation easy and you can ask questions. I ended up reading more of it than expected once my claude code started hallucinating.

## Lyria - AI Generated Music

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://i.ytimg.com/vi/Op8X8RmiE98/maxresdefault.jpg"
    alt="googlelyria"
  />
</div>

[Google Lyria](https://deepmind.google/models/lyria/) is DeepMind's real-time AI music generation model. Tools like Lyria and Suno are making it genuinely easy to generate music on the fly not just static audio files, but responsive, steerable streams that can shift style mid-playback.

I got hands-on with it at CerebralValley's Gemini 3 hackathon where the team did a live demo. Finding a good use case for real-time music generation isn't obvious, but we landed on [Beat Drop](/hackathons/2) a multiplayer rhythm game inspired by Beat Saber where the crowd collectively votes on the genre, and the music transitions live between rounds. Jazzy to hip-hop to lofi, all with roughly 2–3 seconds of latency. It held up well.

### Connecting to Lyria

Lyria exposes a real-time WebSocket API through the `@google/genai` SDK. You open a persistent connection to `models/lyria-realtime-exp` via the Gemini API (v1alpha) and keep it alive for the session:

```js
lyriaSession = await client.live.music.connect({
  model: 'models/lyria-realtime-exp',
  callbacks: { onmessage, onerror, onclose }
});
```

Auth is handled via `GEMINI_API_KEY`. We added a 3-second auto-reconnect in case the connection dropped during a game.

### Steering the Music in Real Time

This is where it gets interesting. Every 8 beats (~4 seconds at 118 BPM), the server recomputes the music direction based on player votes:

1. Each player's phone shows 5 random words drawn from a 158-word pool covering genres, instruments, and moods
2. Votes are tallied and converted into weighted prompts top words get weight proportional to vote share (`max(1.0, (count/max) * 3.0)`), words ranked 6–10 get a flat `0.4`, and an anchor word `"danceable"` is always included at `0.3` to keep the energy up
3. Two updates go out to Lyria each cycle:

```js
lyriaSession.setWeightedPrompts({ weightedPrompts })
lyriaSession.setMusicGenerationConfig({ bpm: 118, density, brightness, guidance })
```

The `density`, `brightness`, and `guidance` values are hand-tuned per winning word using preset mappings for example, Dubstep pushes `{ density: 0.9, brightness: 0.9, guidance: 5.0 }` while Ambient pulls back to `{ density: 0.15, brightness: 0.3, guidance: 2.0 }`.

### Links

- [Lyria](https://deepmind.google/models/lyria/)
- [Docs](https://ai.google.dev/gemini-api/docs/music-generation)
- [Beat Drop — the project we built with it](/hackathons/2)


## Exa - Search API for your AI

Back in 2025 (not that long ago but for dramatic effect) I was working on [strands](/project/4) and I wanted to add search functionality to it
so ... (testing rss feed will come back to this)