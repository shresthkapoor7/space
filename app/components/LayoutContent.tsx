'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import ReadingProgressBar from './ReadingProgressBar'
import CommandPalette from './CommandPalette'
import type { NowPlayingBarState } from '../../lib/nowPlayingBar'

interface PostSummary {
  id: number
  date: string
  title: string
  pinned?: boolean
}

interface LayoutContentProps {
  children: React.ReactNode
  allCategoryPosts: Record<string, PostSummary[]>
}

export default function LayoutContent({ children, allCategoryPosts }: LayoutContentProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const [nowPlaying, setNowPlaying] = useState<NowPlayingBarState>({
    title: '',
    artist: '',
    playing: false,
  })

  // Derive state before any hooks so all hooks run unconditionally
  const isLandingPage = pathname === '/' || pathname === '/game'
  const pathParts     = pathname.split('/').filter(Boolean)
  const category      = pathParts[0] || ''
  const postIdStr     = pathParts[1]
  const isPostPage    = !!postIdStr

  let postTitle = ''
  if (isPostPage) {
    const postId = parseInt(postIdStr)
    const posts  = allCategoryPosts[category] || []
    const post   = posts.find(p => p.id === postId)
    postTitle    = post?.title || ''
  }

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  // j / k  — scroll the main content area (vim-style)
  // ESC    — go up one level (post → category)
  // All hooks must be called before any conditional return.
  useEffect(() => {
    if (isLandingPage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Never intercept when focus is inside a text field or editable element
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT'    ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable      ||
        target.closest('[role="dialog"]')
      ) return

      const scroller = document.getElementById('main-area-scroll')

      switch (e.key) {
        case 'j':
          scroller?.scrollBy({ top: 80, behavior: 'smooth' })
          break
        case 'k':
          scroller?.scrollBy({ top: -80, behavior: 'smooth' })
          break
        case 'Escape':
          if (isPostPage) router.push(`/${category}`)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLandingPage, isPostPage, category, router])

  // Landing page has its own layout — bail out after hooks
  if (isLandingPage) {
    return <main>{children}</main>
  }

  // Build terminal-style path for title bar
  const tuiPath = isPostPage
    ? `~/${category}/${postTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 28)}`
    : `~/${category}`

  return (
    <div className="tui-chrome">

      {/* ── Terminal title bar ── */}
      <div className="tui-titlebar">
        <span className="tui-titlebar-left">
          <span className="tui-session">[shresth@Σpace]</span>
          <span className="tui-sep">──</span>
          <span className="tui-path">[{tuiPath}]</span>
        </span>
        <span className="tui-titlebar-right">
          {nowPlaying.title ? (
            <span className={`tui-listening${nowPlaying.playing ? ' tui-listening--live' : ''}`}>
              <span className="tui-listening-label">Listening to</span>
              <span className="tui-listening-title" title={nowPlaying.artist ? `${nowPlaying.title} — ${nowPlaying.artist}` : nowPlaying.title}>
                {nowPlaying.title}
              </span>
            </span>
          ) : null}
          <span
            className={`tui-indicator${nowPlaying.playing ? ' tui-indicator--live' : ' tui-indicator--idle'}`}
            aria-hidden="true"
          >
            ●
          </span>
        </span>
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="app-layout">
        <CommandPalette allCategoryPosts={allCategoryPosts} />
        {isPostPage && <ReadingProgressBar />}
        <LeftSidebar allCategoryPosts={allCategoryPosts} />
        <div id="main-area-scroll" className="main-area">
          <div className="main-center">
            <div className="mobile-header">
              <Link href="/game" className="logo logo-game" title="Play Σpace Invaders">
                <span className="logo-sigma">Σ</span>pace
              </Link>
            </div>
            {isPostPage && (
              <div className="breadcrumb">
                <Link href="/home" className="breadcrumb-link">~/home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href={`/${category}`} className="breadcrumb-link">{category}</Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{postTitle}</span>
              </div>
            )}
            <main className="main-inner">
              {children}
            </main>
            <footer className="site-footer">
              <p>
                <span className="tui-footer-prompt">shresth@Σpace:~$</span>
                {' '}echo &quot;welcome to my over engineered personal website&quot;
              </p>
            </footer>
          </div>
          <RightSidebar onNowPlayingChange={setNowPlaying} />
        </div>
      </div>

      {/* ── Terminal status bar ── */}
      <div className="tui-statusbar">
        <span className="tui-status-item"><kbd>⌘K</kbd> search</span>
        <span className="tui-status-item"><kbd>j/k</kbd> scroll</span>
        <span className="tui-status-item"><kbd>ESC</kbd> back</span>
        {isPostPage && postTitle && (
          <span className="tui-status-right">
            // {postTitle.length > 48 ? postTitle.slice(0, 48) + '…' : postTitle}
          </span>
        )}
      </div>

      {/* ── CRT atmosphere overlays — pointer-events: none, fully transparent to interaction ── */}
      <div className="tui-scanlines" aria-hidden="true" />
      <div className="tui-vignette"  aria-hidden="true" />
      <div className="tui-grain"     aria-hidden="true" />

    </div>
  )
}
