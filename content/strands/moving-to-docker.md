---
id: 3
date: '2025-08-16'
title: "move to docker"
pinned: false
---

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://nickjanetakis.com/assets/blog/cards/save-yourself-from-years-of-turmoil-by-using-docker-today.jpg"
    alt="nerd"
    style="width: 100%;"
  />
</div>

### the frontend issues

haven't touched strands in a while, and right now i'm dealing with this weird situation where the frontend looks solid visually but the underlying code is a mess. the css is scattered everywhere with no real structure. i keep thinking about how clean the ∑pace codebase looks - everything has its place and you can actually find what you're looking for. that's what i want strands to feel like.

### the backend and auth issues

then there's the backend situation. this being my first real express project, i was basically fumbling around in the dark when i started. but between then and now, i've actually taken time to understand the framework properly - watched tutorials, built some practice projects, and finally grasped how middleware and auth services actually work. funny thing is, i didn't even know nodemon existed and kept manually restarting my server like some kind of caveman.
the real bottleneck though is postgres. the whole express setup isn't containerized, so the connection between postgres and express is just janky. and since i couldn't figure out how to expose the postgres port properly, i can't even peek inside the database to see what's happening. also shoutout to this [banger video](https://www.youtube.com/watch?v=SccSCuHhOw0)

### open router vs gemini

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://preview.redd.it/who-was-in-the-wrong-in-this-scene-luffy-or-usopp-v0-0k1p2ks0wszb1.jpg?width=1080&crop=smart&auto=webp&s=92865de5a6e8438b38f4c71400cedb1cfed0fdfa"
    alt="nerd"
    style="width: 100%;"
  />
</div>

don't even get me started on openrouter and gemini. openrouter making gemini (2.5 flash) paid is so stupid, and their credit system is bizarre - you get maybe 3 conversations with a decent model and suddenly you're out of credits. trying to juggle both apis with their different request formats has been a headache. but just having gemini makes it like a basic project and 2.5 flash is not good enough but is the only free one.

<center style="color:yellow">final verdict -> both are 🗑️</center>

### solution

1. clean up the backend by removing openrouter temporarily, then dockerize everything and implement proper middleware with authentication.

2. for the cleanup phase - ditch the save api and build auto-save functionality, remove openrouter for now, and add a rag-based system for chat.

3. once that's solid, deploy it and test everything thoroughly before killing the current instance. during testing, i'll make the necessary frontend adjustments.


honestly, since the backend isn't that complex yet, i'm considering just starting fresh.

> ***sometimes a clean slate is worth more than trying to untangle old code.***

<center style="color: pink"> ✨✨ and obviously some extra resume points for using docker ✨✨ </center>