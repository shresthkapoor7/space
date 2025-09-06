---
id: 3
date: '2025-08-16'
title: "🐳 Strands needs a reset: moving to Docker"
pinned: false
---

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://nickjanetakis.com/assets/blog/cards/save-yourself-from-years-of-turmoil-by-using-docker-today.jpg"
    alt="nerd"
    style="width: 100%;"
  />
</div>

### The frontend mess

Visually Strands looks fine, but under the hood the CSS is scattered everywhere. No structure, no consistency. I keep thinking about Σpace its clean, organized, and easy to navigate. That’s exactly what I want Strands to feel like.

### Backend + auth reality check

This was my first real Express project, so I was basically fumbling in the dark. Since then I’ve taken time to learn properly built practice apps, understood middleware/auth but my biggest bottleneck is still Postgres. Without containerization, connecting Express ↔ Postgres is just janky. I couldn’t even peek into the DB without hacking ports. (Shoutout to this [banger video](https://www.youtube.com/watch?v=SccSCuHhOw0) that finally clicked things for me.)

### Open Router vs Gemini

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://preview.redd.it/who-was-in-the-wrong-in-this-scene-luffy-or-usopp-v0-0k1p2ks0wszb1.jpg?width=1080&crop=smart&auto=webp&s=92865de5a6e8438b38f4c71400cedb1cfed0fdfa"
    alt="nerd"
    style="width: 100%;"
  />
</div>

API juggling shouldn’t be harder than building features. But OpenRouter’s credit system is bizarre, and Gemini 2.5 Flash isn’t strong enough.

<center style="color:yellow">final verdict → both are 🗑️</center>

### The plan forward

1. Strip out OpenRouter for now, dockerize everything, and add proper middleware + auth.
2. Rebuild the save API as auto-save, and add a RAG-based system for chat.
3. Deploy a clean instance, test thoroughly, then shut down the old one while fixing frontend issues.

honestly, since the backend isn't that complex yet, i'm considering just starting fresh.


>Sometimes a clean slate is worth more than trying to untangle old code.

<center style="color: pink"> ✨ Plus, some bonus resume points for Docker. ✨ </center>