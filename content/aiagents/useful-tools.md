---
id: 1
date: '2026-03-16'
title: "Useful AI tools - locus, lyria, exa, browser use"
pinned: false
---

The space is moving fast with new tools shipping every day and it's genuinely hard to keep up. These are a few I've had the chance to actually test, and they're worth knowing about.

<Tweet id="2026655633357857068" />

## Locus - Allow your agents to pay

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://pbs.twimg.com/media/HDyaXGuWoAAEqoE.jpg"
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

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://exa.imgix.net/og-image.png/"
    alt="exaai"
  />
</div>

Back in 2025 I was adding search to a project and reached for the obvious choice: Brave Search + Gemini. It worked, but barely with slow responses, mediocre relevance, and enough friction that I kept second-guessing whether search was even worth including.

Then I switched to [Exa](https://exa.ai/). The latency difference alone was hard to ignore: 178ms versus 559ms on Brave. Beyond speed, the result quality was noticeably better more relevant hits, less noise. They also published a [search evals breakdown for coding agents](https://exa.ai/blog/webcode) that I've been meaning to put to use in [dowsing](https://github.com/shresthkapoor7/dowsing/).

### How I used it in DIA

[DIA](/project/1) is a company research agent, and Exa became the first tool it reaches for before anything else. The integration lives in `backend/services/exa.py` and calls the Exa `/search` API across four distinct modes depending on what the agent needs:

| search_type | Behavior |
|---|---|
| `company_overview` | General semantic search, `useAutoprompt: false` |
| `news` | Neural search, filtered to last 90 days |
| `funding` | Appends "funding investment round" to the query |
| `competitors` | Appends "competitors alternatives" to the query |

Each call returns up to N results with up to 2000 chars of body text and 3 highlight sentences per result.

The agent is prompted (`prompts.py:30`) to always start with `exa_search(company_overview)` as a baseline, then run all four modes for a thorough report. If Exa comes back thin, it escalates to `abstract_verify_company` or `browser_use_scrape`. Every result also gets chunked and stored in Supabase/pgvector via `loop.py:38` for retrieval in future sessions. The tool description includes `Cost: $0.007/search` so Claude can factor that in when deciding how many searches to run.

### Links

- [Exa](https://exa.ai/)
- [Docs](https://docs.exa.ai/)
- [Search evals for coding agents](https://exa.ai/blog/webcode)



## Browser Use - The Way AI Uses the Web

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://browser-use.com/og/browser-use-og.png"
    alt="browser-use"
  />
</div>

[Browser Use](https://cloud.browser-use.com/) is genuinely impressive and genuinely expensive. It's a web navigator that spins up a real browser, uses an LLM to navigate pages, and returns structured findings via their cloud API. The idea is solid. My last call costed \$0.61. They give you ~$10 in credits to start, but at that rate it adds up fast.

### How I used it in DIA

In [DIA](/project/1), Browser Use is the last resort — it only fires when Exa comes back thin, or when a company's website looks important but didn't get indexed well. The integration in `backend/services/browser_use.py` works in two phases:

1. **Create task** — POSTs a natural-language instruction: `"Visit {url} and {objective}. Extract key information and return it as structured text."`
2. **Poll for result** — hits `/tasks/{task_id}/status` every 2 seconds, up to 30 times (~60s timeout), then returns the output once `status == "finished"`

To keep the agent from reaching for it too readily, the tool description explicitly says `EXPENSIVE ($0.10/task) — Do NOT use unless you have a clear reason. Takes 30–60 seconds.` and `prompts.py:18` lists the only two valid triggers: Exa data is thin/suspicious, or the company website looks important but Exa didn't capture it well. It only runs after `exa_search` and optionally `abstract_verify_company` have already been tried.

Unlike Exa's fixed rate, Browser Use returns the actual cost in the response so the agent loop reads `tool_result.get("cost")` and passes the real value to the cost accumulator. Scraped content also gets chunked and stored in pgvector, so future sessions on the same company can skip the $0.10 call entirely.

### Under the hood

Browser Use is open source, and the architecture is worth understanding. It runs Chrome via CDP and builds a structured representation of each page before sending anything to the LLM:

```
browser_use/
├── agent/
│   ├── service.py              ← main agent loop (step, run, multi_act)
│   ├── views.py                ← AgentOutput, ActionModel, AgentHistory pydantic models
│   ├── message_manager/
│   │   └── service.py          ← builds messages sent to LLM
│   ├── prompts.py              ← AgentMessagePrompt, system prompt loading
│   └── system_prompts/
│       └── system_prompt.md    ← LLM instructions (what DOM format looks like, rules)
├── browser/
│   └── session.py              ← CDP session management, BrowserSession, watchdogs
├── dom/
│   ├── service.py              ← DOM extraction, EnhancedDOMTree building
│   └── serializer/
│       └── serializer.py       ← DOM → indexed text serialization
└── tools/
    ├── service.py              ← action registration + execution handlers
    └── registry/
        └── views.py            ← ActionModel base class
```

The DOM pipeline looks like this:

```
CDP: DOMSnapshot.captureSnapshot()   → raw DOM tree + computed bounds
CDP: Accessibility.getFullAXTree()   → semantic roles, names, states
↓
Merge into EnhancedDOMTreeNode[]
  - bounding box (is element in viewport?)
  - ax_node (role="button", name="Submit", disabled=false)
  - shadow DOM traversal (open + closed)
  - iframe content (configurable depth)
  - paint order (filter obscured elements)
↓
Prune non-interactive nodes
↓
Assign [index] to interactive nodes → selector_map
↓
Serialize to text → sent to LLM
```

Even with all that, two problems remain. First, it's slow a minute per call is common. Second, and more fundamentally: what about authenticated sites? LinkedIn, Jira, X Browser Use can't touch those (I think they have a way you can give access but I wouldn't with sensitive stuff) because it's running in an isolated sandbox with no session state.

### Why I built Dowsing

Those two problems are what [dowsing](https://github.com/shresthkapoor7/dowsing) is meant to address. It runs locally inside your actual Chrome browser, so authenticated sites work by default. It uses ONNX for local embeddings, is written in Rust, and makes zero LLM calls extraction is done entirely with cosine similarity, which means results come back in under a second.

The tradeoff is that it's intelligent but not smart. On LinkedIn the page text is sparse enough that embeddings don't have much to work with. And some cases need custom handling PDFs have no DOM at all, so the usual approach doesn't apply. Still experimental, but the direction feels right.

### Links

- [Browser Use Cloud](https://cloud.browser-use.com/)
- [GitHub (open source)](https://github.com/browser-use/browser-use)
- [Dowsing — the local alternative I am building](https://github.com/shresthkapoor7/dowsing)