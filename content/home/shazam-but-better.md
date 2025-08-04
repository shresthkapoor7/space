---
id: 5
date: '2025-08-04'
title: "shazam but better"
pinned: false
---

this will probably be the last project before i go deep into the mindless job applying arc. gonna build this one out with a friend. simple as always: a swiftui application that can analyze music but here’s the kicker no apple music links, only spotify (not really a kicker tbh). the app will also suggest similar music based on what you just heard.

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://preview.redd.it/all-of-us-tomorrow-v0-2n07tmsnhtu81.jpg?width=640&crop=smart&auto=webp&s=ca3af7a9dd4642da45fdddbdf73e33cb2b904377"
    alt="nerd"
    style="width: 400px;"
  />
</div>

<div style="text-align: center;">
  <span class="squiggly" data-font-size="1.2rem">the recruiters gonna fight over me after this one truly unique.</span>
</div>

i think the only thing that is left in my arsenal apart from a vs code fork is a good swiftui app and a bit of an ml brush-up. this one should hit that spot perfectly. also the inspiration came from [this video](https://www.youtube.com/watch?v=a0CVCcb0RJM) and lets face it shazam sucks for just giving out apple music links.

a good future improvement would be auto-creating a spotify playlist with the current and recommended songs. i might not release it as an actual app though probably just a homebrew package or repo. app store publishing is too much overhead, and testflight exists but no recruiter is gonna ask for a testflight link.

right now, starting out, i have 4 questions:
1.	how do you even recognize music (no api calls to an llm)
2.	does spotify have an sdk or api that doesn’t involve too much auth pain to get track links
3.	swift is new territory for me
4.	hoping this group project doesn’t end up solo (especially because strands should be wrapped by end of august and it’s already the 4th)

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://static.tvtropes.org/pmwiki/pub/images/d10.jpg"
    alt="nerd"
    style="width: 400px;"
  />
</div>

probably gonna start by firing up a jupyter notebook to see what i’m dealing with here.

>riff - a dumb little app to recognize music, link spotify, and flex some on-device ml. not trying to change the world, just the playlist.