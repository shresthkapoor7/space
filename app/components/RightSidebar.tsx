'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import GitHubActivity from './GitHubActivity'
import TuiAudioVisualizer from './TuiAudioVisualizer'
import { sampleTracks, type Track } from '../../lib/tracks'
import type { NowPlayingBarState } from '../../lib/nowPlayingBar'
import { useYouTubeMusicPlayer } from '../../lib/useYouTubeMusicPlayer'

interface Heading {
  id: string
  text: string
  level: number
}

interface RightSidebarProps {
  tracks?: Track[]
  githubUsername?: string
  onNowPlayingChange?: (state: NowPlayingBarState) => void
}

export default function RightSidebar({
  tracks = sampleTracks,
  githubUsername = 'shresthkapoor7',
  onNowPlayingChange,
}: RightSidebarProps) {
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter(Boolean)
  const isPostPage = pathParts.length >= 2

  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState('')
  const vinylRef = useRef<HTMLButtonElement>(null)
  const rotationRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const DEG_PER_MS = 360 / 4000
  const audioCtxRef = useRef<AudioContext | null>(null)
  const prevIsPausedRef = useRef(true)
  const {
    currentTrack,
    currentVideoId,
    currentlyPlaying,
    isPaused,
    playerElementId,
    playNextTrack,
    playPreviousTrack,
    playTrack,
    togglePlayPause,
  } = useYouTubeMusicPlayer(tracks)

  const startSpinning = useCallback(() => {
    if (rafRef.current) return
    const animate = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        rotationRef.current = (rotationRef.current + (timestamp - lastTimeRef.current) * DEG_PER_MS) % 360
      }
      lastTimeRef.current = timestamp
      if (vinylRef.current) vinylRef.current.style.transform = `rotate(${rotationRef.current}deg)`
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  const stopSpinning = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    lastTimeRef.current = null
  }, [])

  const getAudioCtx = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
    return audioCtxRef.current
  }

  const playNeedleDrop = () => {
    try {
      const ctx = getAudioCtx()
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.12), ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      gain.gain.value = 0.28
      src.connect(gain)
      gain.connect(ctx.destination)
      src.start()
    } catch (_) {}
  }

  const playNeedleLift = () => {
    try {
      const ctx = getAudioCtx()
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.07), ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.014))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      gain.gain.value = 0.14
      src.connect(gain)
      gain.connect(ctx.destination)
      src.start()
    } catch (_) {}
  }

  useEffect(() => {
    if (!isPaused && currentlyPlaying) {
      if (prevIsPausedRef.current) playNeedleDrop()
      startSpinning()
    } else {
      if (!prevIsPausedRef.current) playNeedleLift()
      stopSpinning()
    }
    prevIsPausedRef.current = isPaused
  }, [isPaused, currentlyPlaying])

  // Scan for headings on any page that has .post-content
  useEffect(() => {
    const scan = () => {
      const contentEls = document.querySelectorAll('.post-content')
      if (!contentEls.length) { setHeadings([]); return }

      const found: Heading[] = []
      contentEls.forEach(contentEl => {
        contentEl.querySelectorAll('h2, h3').forEach((el, i) => {
          const text = el.textContent || ''
          const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + i
          if (!el.id) (el as HTMLElement).id = slug
          found.push({ id: (el as HTMLElement).id, text, level: parseInt(el.tagName[1]) })
        })
      })

      setHeadings(found)
    }

    const timer = setTimeout(scan, 400)
    return () => clearTimeout(timer)
  }, [pathname])

  // IntersectionObserver for active heading
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
            break
          }
        }
      },
      { root: document.getElementById('main-area-scroll'), rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    onNowPlayingChange?.({
      title: currentTrack?.title ?? '',
      artist: currentTrack?.artist ?? '',
      playing: Boolean(currentTrack && !isPaused),
    })
  }, [currentTrack, isPaused, onNowPlayingChange])

  // Listen for command palette music control events
  useEffect(() => {
    const handler = (e: Event) => {
      const { action } = (e as CustomEvent).detail
      if (action === 'playpause') {
        togglePlayPause()
      } else if (action === 'next') {
        playNextTrack()
      } else if (action === 'prev') {
        playPreviousTrack()
      }
    }
    window.addEventListener('cmd-music', handler)
    return () => window.removeEventListener('cmd-music', handler)
  }, [playNextTrack, playPreviousTrack, togglePlayPause])

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-inner">

        {/* Post headings TOC */}
        {headings.length > 0 && (
          <div className="right-sidebar-section">
            <div className="right-sidebar-section-label">Table of Contents</div>
            <nav className="right-toc-nav">
              {headings.map(h => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`right-toc-link${h.level === 3 ? ' indent' : ''}${activeHeading === h.id ? ' active' : ''}`}
                  onClick={e => {
                    e.preventDefault()
                    const el = document.getElementById(h.id)
                    const scroller = document.getElementById('main-area-scroll')
                    if (el && scroller) {
                      scroller.scrollTo({ top: el.offsetTop - 32, behavior: 'smooth' })
                    }
                  }}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Music */}
        <div className="right-sidebar-section">
          <div className="right-sidebar-section-label">music</div>

          {/* Vinyl disk player */}
          <div className="vinyl-player">
            <div className="vinyl-plinth">
              <button
                ref={vinylRef}
                className="vinyl-disk"
                onClick={togglePlayPause}
              >
                <div className={`vinyl-glow-ring${!isPaused && currentlyPlaying ? ' active' : ''}`} />
                <div className="vinyl-art-wrap">
                  {currentVideoId
                    ? <img src={`https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`} alt={currentTrack?.title} className="vinyl-art" />
                    : null}
                </div>
                <div className="vinyl-hole" />
              </button>

              {/* Tonearm */}
              <div className="tonearm-pivot-dot" />
              <div className={`tonearm-arm${!isPaused && currentlyPlaying ? ' on-record' : ''}`}>
                <svg width="16" height="92" viewBox="0 0 16 92" fill="none">
                  <defs>
                    <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#444"/>
                      <stop offset="40%" stopColor="#aaa"/>
                      <stop offset="100%" stopColor="#555"/>
                    </linearGradient>
                  </defs>
                  <path d="M 6,2 L 6.5,80 L 9.5,80 L 10,2 Z" fill="url(#armGrad)"/>
                  <path d="M 6.5,78 L 3,88 L 7,90 L 9.5,80 Z" fill="#888"/>
                  <circle cx="5" cy="89" r="2.5" fill="#bbb"/>
                </svg>
              </div>
            </div>

            <TuiAudioVisualizer
              active={!isPaused && !!currentlyPlaying}
              hasTrack={!!currentlyPlaying}
            />

            <div className="vinyl-controls-row">
              <button onClick={playPreviousTrack} disabled={!currentlyPlaying} className="vinyl-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={playNextTrack} disabled={!currentlyPlaying} className="vinyl-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 18h2V6h-2zM6 6v12l8.5-6z" /></svg>
              </button>
            </div>

            <div className="vinyl-track-info">
              <div className="vinyl-track-title">{currentTrack?.title || 'Tap to play'}</div>
              <div className="vinyl-track-artist">{currentTrack?.artist || ''}</div>
            </div>
          </div>

        </div>

        {/* GitHub Activity */}
        <div className="right-sidebar-section">
        <GitHubActivity username={githubUsername} />
        </div>

      </div>

      <div
        id={playerElementId}
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      />
    </aside>
  )
}
