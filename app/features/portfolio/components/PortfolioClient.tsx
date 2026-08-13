'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PortfolioContent } from '../../../../lib/portfolio/content'
import { useYouTubeMusicPlayer } from '../../../../lib/portfolio/useYouTubeMusicPlayer'
import DonutBackground from './DonutBackground'
import { usePostOverlay } from '../hooks/usePostOverlay'
import { useStickerInteractions } from '../hooks/useStickerInteractions'

const stickerPositions = [
  ['left', 'sticker--black-clover', 'square'], ['left', 'sticker--headphones', 'square'],
  ['left', 'sticker--one-piece', 'portrait'], ['left', 'sticker--code', 'landscape'],
  ['left', 'sticker--minesweeper', 'square'], ['right', 'sticker--camera', 'landscape'],
  ['right', 'sticker--f1', 'wide'], ['left', 'sticker--robot', 'square'],
  ['right', 'sticker--coffee', 'square'], ['right', 'sticker--paddle', 'portrait'],
] as const

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="portfolio-section-label">{children}</div>
}

function Divider() {
  return <div className="portfolio-divider" />
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return <button className="portfolio-close" onClick={onClick} aria-label="close">×</button>
}

function InlineMarkdown({ value }: { value: string }) {
  return <>{value.split(/(\*\*.+?\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}</>
}

function StickerVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let resumeTimer = 0
    const pauseForScroll = () => {
      videoRef.current?.pause()
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(() => videoRef.current?.play().catch(() => undefined), 160)
    }

    window.addEventListener('scroll', pauseForScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', pauseForScroll)
      window.clearTimeout(resumeTimer)
    }
  }, [])

  return <video ref={videoRef} src={src} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
}

function PreviewDomain({ href }: { href: string }) {
  try {
    return <>{new URL(href).hostname.replace(/^www\./, '')}</>
  } catch {
    return <>{href}</>
  }
}

export default function PortfolioClient({ content, children }: { content: PortfolioContent; children?: React.ReactNode }) {
  const [dark, setDark] = useState(true)
  const [showStickers, setShowStickers] = useState(false)
  const [showSedimentPreview, setShowSedimentPreview] = useState(false)
  const [hoveredResearch, setHoveredResearch] = useState<string | null>(null)
  const [emailCopied, setEmailCopied] = useState(false)
  const { hoveredSticker, stickerOffsets } = useStickerInteractions(showStickers)
  const { post, pageContentRef, overlayRef, openPost, closePost } = usePostOverlay(content)
  const {
    currentTrack,
    currentlyPlaying,
    isPaused,
    playerElementId,
    playNextTrack,
    playPreviousTrack,
    togglePlayPause,
  } = useYouTubeMusicPlayer()

  useEffect(() => {
    const host = document.createElement('div')
    host.id = playerElementId
    host.className = 'portfolio-audio-host'
    host.setAttribute('aria-hidden', 'true')
    document.body.appendChild(host)
    return () => host.remove()
  }, [playerElementId])

  const copyEmail = async (href: string) => {
    const email = href.replace(/^mailto:/, '')
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 1500)
    } catch {
      window.location.href = href
    }
  }

  return (
    <div className={`portfolio ${dark ? 'portfolio--dark' : ''}`}>
      {children}
      <DonutBackground dark={dark} />

      {showStickers && <div className="portfolio-stickers" aria-hidden="true">
        {stickerPositions.map(([side, position, shape], index) => {
          const sticker = content.stickers[index]
          if (!sticker) return null
          const offset = stickerOffsets[sticker.label] || { x: 0, y: 0 }
          const isVideo = sticker.mediaSrc?.toLowerCase().endsWith('.mp4')
          const isPolaroid = isVideo || sticker.mediaSrc === '/homebase.jpeg'
          return <div key={sticker.label} className={`portfolio-sticker ${side} ${position}${hoveredSticker === sticker.label ? ' is-flipped' : ''}`} data-sticker-id={sticker.label} style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
            <div className="portfolio-sticker-flip">
              <div className={`portfolio-sticker-art portfolio-sticker-face portfolio-sticker-face--front ${shape}${sticker.mediaSrc ? ' portfolio-sticker-art--asset' : ''}${isPolaroid ? ' portfolio-sticker-art--polaroid' : ''}`}><div className="portfolio-sticker-media">{sticker.mediaSrc ? isVideo ? <StickerVideo src={sticker.mediaSrc} /> : <img src={sticker.mediaSrc} alt="" loading="lazy" decoding="async" /> : <span>{sticker.label}</span>}</div>{isPolaroid && sticker.caption && <div className="portfolio-sticker-caption">{sticker.caption}</div>}</div>
              <div className="portfolio-sticker-back"><p>{sticker.previewLabel || sticker.caption || sticker.label}</p></div>
            </div>
          </div>
        })}
      </div>}

      <div ref={pageContentRef}>
        <header className="portfolio-hero">
          <div className="portfolio-content">
            <h1><span>{content.greeting}</span>{content.headline}</h1>
            <p className="portfolio-intro">{content.bio}</p>
            <div className="portfolio-profile-row">
              <nav className="portfolio-links" aria-label="Profile links">
                {content.links.map(link => link.label === 'email'
                  ? <button type="button" className="portfolio-email-link" onClick={() => copyEmail(link.href)} title={emailCopied ? 'copied' : 'copy email'} key={link.label}>{emailCopied ? 'copied' : link.label}</button>
                  : <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} key={link.label}>{link.label}</a>)}
              </nav>
              <div className="portfolio-controls">
                <a className="portfolio-control portfolio-markdown-trigger" href="/.md">markdown</a>
                <button className={`portfolio-control portfolio-stickers-trigger ${showStickers ? 'is-active' : ''}`} onClick={() => setShowStickers(value => !value)} aria-pressed={showStickers}>stickers</button>
                <button className="portfolio-control portfolio-theme-trigger" onClick={() => setDark(value => !value)}>{dark ? 'light' : 'dark'}</button>
              </div>
            </div>
          </div>
        </header>

        <main className="portfolio-main portfolio-content">
          <div className="portfolio-player" aria-label="Now playing">
            <span className={`portfolio-equalizer ${currentlyPlaying && !isPaused ? '' : 'paused'}`} aria-hidden="true"><i /><i /><i /></span>
            {currentTrack && <><span className="portfolio-now-playing">now playing</span><span className="portfolio-track">{currentTrack.title} — {currentTrack.artist}</span></>}
            <div className="portfolio-player-controls">
              <button onClick={playPreviousTrack} aria-label="previous track" title="previous track">prev</button>
              <button onClick={togglePlayPause} aria-label={isPaused ? 'play track' : 'pause track'} aria-pressed={Boolean(currentlyPlaying && !isPaused)} title={isPaused ? 'play' : 'pause'}>{isPaused ? 'play' : 'pause'}</button>
              <button onClick={playNextTrack} aria-label="next track" title="next track">next</button>
            </div>
          </div>

          <section>
            <SectionLabel>toolkit</SectionLabel>
            <div className="portfolio-toolkit" aria-label="Toolkit">
              {content.toolkit.icons.map((tool, index) => <span key={tool} className={index % 2 ? 'alternate' : ''}>{tool}</span>)}
            </div>
            <p className="portfolio-toolkit-note">{content.toolkit.description}</p>
          </section>

          <Divider />

          <section>
            <SectionLabel>currently building</SectionLabel>
            <div className="portfolio-sediment-trigger" onPointerEnter={() => setShowSedimentPreview(true)} onPointerLeave={() => setShowSedimentPreview(false)} onFocus={() => setShowSedimentPreview(true)} onBlur={() => setShowSedimentPreview(false)} tabIndex={0}>
              <h2 className="portfolio-project-title">{content.building.title}</h2>
              {showSedimentPreview && <div className="portfolio-sediment-preview">
                <div className="portfolio-sediment-preview-bar"><span>sediment-ai.com</span><a href="https://www.sediment-ai.com/" target="_blank" rel="noreferrer">live preview ↗</a></div>
                <iframe src="https://www.sediment-ai.com/" title="Sediment live preview" loading="eager" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
              </div>}
            </div>
            <p className="portfolio-copy">{content.building.description}</p>
            <a className="portfolio-underline-link" href={content.building.href}>{content.building.linkLabel}</a>
          </section>

          <Divider />

          <section>
            <SectionLabel>selected research</SectionLabel>
            {content.research.map((entry, index) => <article className={`portfolio-research ${index < content.research.length - 1 ? 'portfolio-research--divided' : ''}${hoveredResearch === entry.title ? ' is-preview-open' : ''}`} key={entry.title}>
              <div><div className="portfolio-research-trigger" onPointerEnter={() => setHoveredResearch(entry.title)} onPointerLeave={() => setHoveredResearch(null)} onFocus={() => setHoveredResearch(entry.title)} onBlur={() => setHoveredResearch(null)} tabIndex={0}>
                <a href={entry.href} target="_blank" rel="noreferrer"><h2>{entry.title} ↗</h2></a>
                {hoveredResearch === entry.title && <div className="portfolio-research-preview">
                  <div className="portfolio-research-preview-bar"><span><PreviewDomain href={entry.href} /></span><a href={entry.href} target="_blank" rel="noreferrer">live preview ↗</a></div>
                  <iframe src={entry.href} title={`${entry.title} live preview`} loading="eager" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
                </div>}
              </div><time>{entry.year}</time></div><p>{entry.description}</p><small>{entry.metadata}</small>
            </article>)}
          </section>

          <Divider />

          <section>
            <SectionLabel>writing</SectionLabel>
            {content.writing.map((entry, index) => (
              <button className={`portfolio-post ${index < content.writing.length - 1 ? 'portfolio-post--divided' : ''}`} onClick={(event) => openPost(index, event.currentTarget)} key={entry.title}>
                <div><h3>{entry.title}</h3><time>{entry.date}</time></div>
                <p>{entry.description}</p>
                <small>{entry.meta} &nbsp;·&nbsp; {entry.read}</small>
              </button>
            ))}
          </section>

          <Divider />

          <section>
            <SectionLabel>off the clock</SectionLabel>
            <p className="portfolio-copy"><InlineMarkdown value={content.offTheClock} /></p>
          </section>

          <footer className="portfolio-footer"><span>{content.copyright}</span><span>{content.location}</span></footer>
        </main>
      </div>

      {post && <div ref={overlayRef} className="portfolio-overlay" role="dialog" aria-modal="true" aria-label={post.title} tabIndex={-1}>
        <CloseButton onClick={closePost} />
        {post.coverImage && <img className="portfolio-overlay-cover" src={post.coverImage} alt="Research desk illustration" />}
        <article className={`portfolio-overlay-content${post.coverImage ? ' portfolio-overlay-content--with-cover' : ''}`}>
          <div className="portfolio-overlay-meta">{post.meta} &nbsp;·&nbsp; {post.date} &nbsp;·&nbsp; {post.read}</div>
          <h1>{post.title}</h1>
          <div className="portfolio-post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              a({ href, children }) { return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>{children}</a> },
            }}>{post.body.join('\n\n')}</ReactMarkdown>
          </div>
        </article>
      </div>}
    </div>
  )
}
