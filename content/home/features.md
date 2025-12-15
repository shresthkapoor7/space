---
id: 2
date: '2025-07-19'
title: "Special Features of this Website"
pinned: true
---

All posts here are written in markdown as I am something of a markdown nerd my self, which then gets rendered as html.

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="/images/unnamed.jpg"
    alt="nerd"
    style="width: 400px;"
  />
</div>

Think of it like writing latex on overleaf adding special symbols and tags which then gets rendered into codeblocks, math equations, tables, tweets, etc. These special symbols and features include:

1. Adding <mark data-tooltip="i am a tooltip">tooltips</mark> with just `<tooltip>`
2. Writing code by just putting ` ```python `, not only it gets rendered as a codeblock, but you can also execute that code in the browser.

```python
import random as rd
import numpy as np
import matplotlib.pyplot as plt

print(f"random number: {rd.randint(1, 100)}")
numbers = np.random.randn(5)
print(f"random numbers: {numbers}")
plt.plot(numbers)
plt.show()
print("this is so cool right?!")
```

3. Sharing links to individual blog posts like https://www.shresth.space/2

4. Creating tables, the same way you would do it in obsidian or notion.

| name | age | city |
|------|-----|------|
| shresth | 23  | delulu |

5. Embedding tweets with just `<Tweet id="" />`

<Tweet id="1945713783562711165" />


6. Adding Flashcards with `<details>` and `<summary>` tags.

<div class="glossary-group">
<details><summary>Gemini</summary>🗑️🗑️🗑️</details>
<details><summary>Claude</summary>🥇🥇🥇</details>
<details><summary>ChatGPT</summary>💬💬💬</details>
</div>

7. Pinning posts with `pinned: true` in the frontmatter.
8. Math equations with `$ begin:math:display $` and `$ end:math:display $` tags.

$begin:math:display$
\int_0^1 x^2 dx = \frac{1}{3}
$end:math:display$

9. Listening to music while scrolling through posts because attention span is too short to read. They are basically embedded youtube video urls with preview hidden and some local storage magic to keep track of the current track and timestamp →