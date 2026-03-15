'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { sampleTracks } from '../../lib/tracks'

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
  | { type: 'track'; label: string; sub: string; trackId: number }

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

    const trackItems: ResultItem[] = sampleTracks
      .filter(t => {
        if (!q.trim()) return true
        const ql = q.toLowerCase()
        return t.title.toLowerCase().includes(ql) || t.artist.toLowerCase().includes(ql) || 'play'.includes(ql)
      })
      .map(t => ({
        type: 'track' as const,
        label: `Play: ${t.title}`,
        sub: t.artist,
        trackId: t.id,
      }))

    return [...trackItems, ...postItems]
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
    if (item.type === 'post') {
      router.push(item.href)
    } else {
      window.dispatchEvent(new CustomEvent('cmd-play-track', { detail: { trackId: item.trackId } }))
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
            placeholder="Search posts or play a track..."
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
                key={item.type === 'post' ? item.href : `track-${item.trackId}`}
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
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
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
