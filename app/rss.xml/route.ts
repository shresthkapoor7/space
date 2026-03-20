import { readMarkdownFiles } from '@/lib/markdown'

const SITE_URL = 'https://shresth.space'
const SITE_TITLE = 'Shresth Kapoor'
const SITE_DESCRIPTION = 'notes dump'

const CATEGORIES = ['home', 'project', 'aiagents', 'hackathons', 'ml', 'math']

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .trim()
}

export async function GET() {
  const items: { title: string; link: string; description: string; pubDate: string; category: string }[] = []

  for (const cat of CATEGORIES) {
    const posts = readMarkdownFiles(cat)
    for (const post of posts) {
      const snippet = stripMarkdown(post.content).slice(0, 280)
      items.push({
        title: post.title,
        link: `${SITE_URL}/${cat}/${post.id}`,
        description: snippet ? snippet + (post.content.length > 280 ? '…' : '') : post.title,
        pubDate: post.dateForSorting.toUTCString(),
        category: cat,
      })
    }
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <generator>shresth.space</generator>
    ${items.map(item => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
    </item>`).join('\n    ')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
