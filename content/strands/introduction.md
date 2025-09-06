---
id: 1
date: '2025-07-21'
title: "🌲 How and Why Strands?"
pinned: true
---

### Current state of LLM apps

Right now there are a few major players in LLM apps but they all share the same core problem: context management.
1. **ChatGPT**: Great voice mode, multi-file support, and cross-chat context is unmatched. But once it starts hallucinating, there’s no stopping it.
2. **Claude**: By far the best for code. I’ve tried ChatGPT and Gemini’s best models, but Claude even on smaller models is superior. The catch? It struggles with long contexts, and their Mac app feels sluggish.
3. **Gemini**: UI/UX isn’t great, and after ~5 messages it loses track of what you’re doing. The token limit is impressive though if you want to one-shot something, Gemini 2.5 Pro can handle it (even if it sometimes fills your codebase with CSS in odd places). I also use [NotebookLM](https://notebooklm.google.com/) for paper reading, which is one of their better tools.


And then there are third-party apps:

- T3 Chat: Closest to what I’m building. Their branching approach is interesting, but I think there’s a cleaner, more dynamic way to do it. Overall, great product (I don’t use it so can’t comment deeply on context handling).

[t3 chat](https://t3.chat/) funny side story I tried DM’ing him on Twitter no response :)

### My Proposal : Strands

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://www.flowtrace.co/hs-fs/hubfs/slack%20thread-compressed.jpg?width=1400&name=slack%20thread-compressed.jpg"
    alt="nerd"
    style="width: 100%;"
  />
</div>


What if you could branch a conversation from any message, the same way Slack threads work?

<div style="font-weight: bold; color: #4a9eff">Q: Why would you want branching?</div>
Because every time you ask an off-track question in ChatGPT, the whole conversation starts drifting into that new direction. That’s how you end up with hallucinations and lost context.


With Strands, you can:

1.	Explore without losing your place. Start a thread at any point, chase an idea, then return to the main flow. No endless scrolling to find your original question.
2.	Keep contexts clean on the backend. Each thread has its own context window, isolated from the main chat. Once you close it, that detour is gone no cross-pollution, no memory bloat.

>That’s the kicker: better UX on the surface, and a fundamentally cleaner architecture underneath.


<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://qph.cf2.quoracdn.net/main-qimg-d5c893cd0d473aa7760cba52396c03b9"
    alt="nerd"
    style="width: 100%;"
  />
</div>

<center style="font-weight: light;">from <a href="https://www.google.com/search?q=loki" style="color:green; font-style: italic;" target="_blank" rel="noopener noreferrer">Loki</a> like time branching</center>

