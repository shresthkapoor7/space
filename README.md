# Σpace

Personal site at [shresth.space](https://shresth.space). Built with Next.js 14, content written in Markdown.

## What it is

A place to write about things I'm working on — AI agents, ML, math, hackathon builds, projects. Three-column layout: left sidebar for navigation and post index, center for content, right sidebar for a music player (YouTube-backed) and GitHub activity when reading a post.

## Content

All posts live in `content/` as Markdown files with YAML front matter. Categories: `home`, `aiagents`, `ml`, `math`, `finance`, `hackathons`, `project`. Adding a post means dropping a `.md` file in the right folder — the sidebar, RSS feed, and search index all update automatically.

## Custom Markdown features

Beyond standard Markdown, posts support:

- **Runnable Python** — code blocks execute in the browser via Pyodide (no server)
- **LaTeX** — inline and block math via KaTeX using `$` delimiters
- **Embedded tweets** — `<Tweet id="..." />` renders the full card client-side
- **Tooltips** — `<mark data-tooltip="...">text</mark>` on hover
- **Collapsible flashcards** — `<details>` styled as cards, useful for definitions
- **PDF embeds** — `<pdf link="..." />` renders an inline viewer

## Other bits

- `⌘K` opens a command palette that searches across all posts
- The Σ logo links to a Space Invaders clone
- RSS at `/rss.xml`
- `ssh-server/` — unfinished experiment for SSH access to the site

## Stack

Next.js 14 · TypeScript · Pyodide · KaTeX · react-tweet · YouTube IFrame API
