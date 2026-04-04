'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface PostSummary {
  id: number
  date: string
  title: string
  pinned?: boolean
}

interface LeftSidebarProps {
  allCategoryPosts: Record<string, PostSummary[]>
}

const categoryLabels: Record<string, string> = {
  home: 'home',
  aiagents: 'aiagents',
  project: 'projects',
  hackathons: 'hackathons',
  ml: 'ml',
  math: 'math',
}

export default function LeftSidebar({ allCategoryPosts }: LeftSidebarProps) {
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter(Boolean)
  const currentCategory = pathParts[0] || ''
  const currentPostId = pathParts[1] ? parseInt(pathParts[1]) : null

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => { const s = new Set<string>(); s.add(currentCategory); return s }
  )
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setIsMobileOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setExpandedCategories(prev => {
      const next = new Set(Array.from(prev))
      next.add(currentCategory)
      return next
    })
    setIsMobileOpen(false)
  }, [currentCategory])

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(Array.from(prev))
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const categories = Object.keys(categoryLabels)

  return (
    <>
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`left-sidebar${isMobile ? (isMobileOpen ? ' left-sidebar-mobile-open' : ' left-sidebar-mobile-closed') : ''}`}>
        <div className="left-sidebar-header">
          <div className="logo-row">
            <Link href="/game" className="logo logo-game" title="Play Σpace Invaders">
              <span className="logo-sigma">Σ</span>pace
            </Link>
            <a href="/rss.xml" className="rss-link" title="RSS Feed" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6.18" cy="17.82" r="2.18"/>
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
              </svg>
            </a>
          </div>
          <button
            className="sidebar-search-hint"
            onClick={() => window.dispatchEvent(new CustomEvent('cmd-open'))}
            aria-label="Open search"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span>search</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div className="left-sidebar-section-label">Topics</div>

        <nav className="left-sidebar-nav">
          {categories.map(cat => {
            const posts = allCategoryPosts[cat] || []
            const isExpanded = expandedCategories.has(cat)
            const isActive = currentCategory === cat

            return (
              <div key={cat} className="left-sidebar-category">
                <div
                  className={`left-sidebar-cat-header${isActive ? ' active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <span className="cat-chevron">{isExpanded ? '∨' : '>'}</span>
                  <Link
                    href={`/${cat}`}
                    className="cat-label"
                    onClick={e => e.stopPropagation()}
                  >
                    {categoryLabels[cat]}
                  </Link>
                </div>

                {isExpanded && posts.length > 0 && (
                  <div className="left-sidebar-posts">
                    {posts.map(post => (
                      <Link
                        key={post.id}
                        href={`/${cat}/${post.id}`}
                        className={`left-sidebar-post-link${currentCategory === cat && currentPostId === post.id ? ' active' : ''}`}
                      >
                        {post.pinned && <span className="post-pin" />}
                        {post.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
