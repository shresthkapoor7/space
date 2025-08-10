'use client'

import { useState, useEffect } from 'react'

interface Track {
  id: number
  title: string
  artist: string
  album?: string
  duration?: string
  isPlaying?: boolean
}

interface MusicListProps {
  tracks: Track[]
}

export default function MusicList({ tracks }: MusicListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile && !isOpen) {
        setIsOpen(true)
      } else if (mobile && isOpen) {
        setIsOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.classList.add('music-is-open')
        document.body.classList.remove('music-is-closed')
      } else {
        document.body.classList.remove('music-is-open')
        document.body.classList.add('music-is-closed')
      }
    } else {
      if (isOpen) {
        document.body.classList.remove('music-is-closed')
        document.body.classList.remove('music-is-open')
      } else {
        document.body.classList.add('music-is-closed')
        document.body.classList.remove('music-is-open')
      }
    }

    return () => {
      document.body.classList.remove('music-is-open')
      document.body.classList.remove('music-is-closed')
    }
  }, [isOpen, isMobile])

  const playTrack = (trackId: number) => {
    setCurrentTrack(trackId)
    // Here you would implement actual music playing logic
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={toggleDrawer}
          className="mobile-music-button"
          aria-label="Open music list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2ZM21 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {!isMobile && !isOpen && (
        <button
          onClick={toggleDrawer}
          className="desktop-music-button"
          aria-label="Open music list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2ZM21 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="mobile-music-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`music-sidebar ${isOpen ? 'music-open' : ''} ${!isOpen ? 'music-closed' : ''}`}>
        <div className="music-header">
          <h3>&nbsp;&nbsp;Now Playing</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="music-close-button"
            aria-label={isOpen ? "Close music list" : "Open music list"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="music-nav">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => playTrack(track.id)}
              className={`music-link ${currentTrack === track.id ? 'active' : ''}`}
            >
              <div className="music-track-artist">
                {track.artist}
              </div>
              <div className="music-track-title">{track.title}</div>
              {track.album && (
                <div className="music-track-album">{track.album}</div>
              )}
              {track.duration && (
                <div className="music-track-duration">{track.duration}</div>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
