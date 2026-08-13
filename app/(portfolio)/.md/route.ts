import { getPortfolioMarkdown } from '../../../lib/portfolio/content'

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function GET() {
  const markdown = getPortfolioMarkdown()
  const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <title>portfolio.md</title>
    <style>
      :root { color-scheme: dark; --bg: #0d0d0d; --fg: #f2f2f2; --muted: #767676; --line: #2b2b2b; }
      :root[data-theme="light"] { color-scheme: light; --bg: #fafafa; --fg: #0f0f0f; --muted: #777777; --line: #e2e2e2; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--fg); font: 14px/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      main { width: min(960px, calc(100% - 48px)); margin: 0 auto; padding: 34px 0 72px; }
      header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 30px; padding-bottom: 14px; border-bottom: 1px solid var(--line); color: var(--muted); letter-spacing: .05em; }
      .file-id { display: flex; align-items: center; gap: 10px; color: var(--fg); }
      .file-id img { width: 24px; height: 24px; border-radius: 5px; }
      nav { display: flex; align-items: center; gap: 18px; }
      a, button { border: 0; padding: 0; color: inherit; background: none; font: inherit; text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 4px; cursor: pointer; }
      a:hover, button:hover { color: var(--fg); text-decoration-color: var(--fg); }
      pre { margin: 0; overflow: auto; color: var(--fg); font: inherit; white-space: pre-wrap; word-break: break-word; }
      @media (max-width: 600px) { main { width: min(100% - 32px, 960px); padding-top: 22px; } header { align-items: flex-start; flex-direction: column; gap: 10px; } }
    </style>
  </head>
  <body>
    <main>
      <header><div class="file-id"><img src="/icon.svg" alt="" /><span>portfolio.md</span></div><nav><a href="/">back to site</a><button id="theme-toggle" type="button">light</button><button type="button" onclick="navigator.clipboard.writeText(document.querySelector('pre').innerText); this.textContent='copied'">copy</button></nav></header>
      <pre>${escapeHtml(markdown)}</pre>
    </main>
    <script>
      const root = document.documentElement
      const themeToggle = document.getElementById('theme-toggle')
      const setTheme = (theme) => { root.dataset.theme = theme; themeToggle.textContent = theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('portfolio-markdown-theme', theme) }
      setTheme(localStorage.getItem('portfolio-markdown-theme') || 'dark')
      themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'))
    </script>
  </body>
</html>`

  return new Response(document, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
