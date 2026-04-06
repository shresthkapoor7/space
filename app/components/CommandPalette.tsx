'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface PostSummary {
  id: number
  date: string
  title: string
  pinned?: boolean
  content?: string
}

interface CommandPaletteProps {
  allCategoryPosts: Record<string, PostSummary[]>
}

type ResultItem =
  | { type: 'post'; label: string; sub: string; snippet: string; href: string }
  | { type: 'music'; label: string; sub: string; action: 'playpause' | 'next' | 'prev' }
  | { type: 'game'; label: string; sub: string; href: string }
  | { type: 'rss'; label: string; sub: string; href: string }

function getSnippet(content: string, query: string, maxLen = 80): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return content.slice(0, maxLen) + (content.length > maxLen ? '…' : '')
  const start = Math.max(0, idx - 30)
  const end = Math.min(content.length, idx + query.length + 50)
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '')
}

export default function CommandPalette({ allCategoryPosts }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const buildItems = (q: string): ResultItem[] => {
    const postItems: ResultItem[] = Object.entries(allCategoryPosts).flatMap(([cat, posts]) =>
      posts
        .filter(p => {
          if (!q.trim()) return true
          const ql = q.toLowerCase()
          return (
            p.title.toLowerCase().includes(ql) ||
            `~/${cat}`.includes(ql) ||
            (p.content?.toLowerCase().includes(ql) ?? false)
          )
        })
        .map(p => ({
          type: 'post' as const,
          label: p.title,
          sub: `~/${cat}`,
          snippet: p.content ? getSnippet(p.content, q) : '',
          href: `/${cat}/${p.id}`,
        }))
    )

    const musicControls: ResultItem[] = [
      { type: 'music', label: 'Play / Pause', sub: 'music', action: 'playpause' },
      { type: 'music', label: 'Next Track',   sub: 'music', action: 'next' },
      { type: 'music', label: 'Prev Track',   sub: 'music', action: 'prev' },
    ].filter(() => {
      if (!q.trim()) return true
      const ql = q.toLowerCase()
      return 'music play pause next prev track'.includes(ql)
    }) as ResultItem[]

    const gameItem: ResultItem = {
      type: 'game',
      label: 'Play Σpace Invaders',
      sub: '~/game',
      href: '/game',
    }

    const showGame = !q.trim() || 'space invaders game play'.includes(q.toLowerCase()) || 'σpace'.includes(q.toLowerCase())

    const rssItem: ResultItem = { type: 'rss', label: 'RSS Feed', sub: '/rss.xml', href: '/rss.xml' }
    const showRss = !q.trim() || 'rss feed subscribe'.includes(q.toLowerCase())

    return [...(showGame ? [gameItem] : []), ...musicControls, ...(showRss ? [rssItem] : []), ...postItems]
  }

  const filtered = buildItems(query)

  useEffect(() => { setSelected(0) }, [query])

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const openHandler = () => setOpen(true)
    window.addEventListener('keydown', handler)
    window.addEventListener('cmd-open', openHandler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('cmd-open', openHandler)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const execute = useCallback((item: ResultItem) => {
    if (item.type === 'rss') {
      window.open(item.href, '_blank')
    } else if (item.type === 'post' || item.type === 'game') {
      router.push(item.href)
    } else if (item.type === 'music') {
      window.dispatchEvent(new CustomEvent('cmd-music', { detail: { action: item.action } }))
    }
    setOpen(false)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && filtered[selected]) {
      execute(filtered[selected])
    }
  }

  if (!open) return null

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="cmd-input-row">
          <svg className="cmd-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Search posts, play a track, or launch game..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="cmd-results" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.type === 'music' ? `music-${item.action}` : item.href}
                className={`cmd-item${i === selected ? ' selected' : ''}`}
                onClick={() => execute(item)}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="cmd-item-icon">
                  {item.type === 'post' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ) : item.type === 'game' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M6 12h4m-2-2v4" />
                      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
                      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  ) : item.type === 'rss' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="6.18" cy="17.82" r="2.18"/>
                      <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
                    </svg>
                  ) : item.type === 'music' && item.action === 'playpause' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  ) : item.type === 'music' && item.action === 'next' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 18h2V6h-2zM6 6v12l8.5-6z"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  )}
                </span>
                <span className="cmd-item-body">
                  <span className="cmd-item-label">{item.label}</span>
                  {item.type === 'post' && query.trim() && item.snippet && (
                    <span className="cmd-item-snippet">{item.snippet}</span>
                  )}
                </span>
                <span className="cmd-item-sub">{item.sub}</span>
              </button>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
