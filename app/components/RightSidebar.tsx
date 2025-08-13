'use client'

import { useState, useEffect } from 'react'
import MusicList from './MusicList'
import GitHubActivity from './GitHubActivity'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface Track {
  id: number
  title: string
  artist: string
  duration?: string
  isPlaying?: boolean
  youtubeUrl?: string
}

interface RightSidebarProps {
  tracks?: Track[]
  githubUsername?: string
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Thru the night",
    artist: "Jack Harlow",
    duration: "3:20",
    youtubeUrl: "https://www.youtube.com/watch?v=wPrEkA_gQp4"
  },
  {
    id: 2,
    title: "No Pole",
    artist: "Don Toliver",
    duration: "2:54",
    youtubeUrl: "https://www.youtube.com/watch?v=A5mURRozXtg"
  },
  {
    id: 3,
    title: "Dumbo",
    artist: "Travis Scott",
    duration: "2:58",
    youtubeUrl: "https://www.youtube.com/watch?v=pyLs2dk9aVU"
  },
  {
    id: 4,
    title: "Freak",
    artist: "Doja Cat",
    duration: "3:23",
    youtubeUrl: "https://www.youtube.com/watch?v=Wc9_dsv5YYA"
  }
]

export default function RightSidebar({ tracks = sampleTracks, githubUsername = "shresthkapoor7" }: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState('activity')
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('music-current-track')
      return saved ? parseInt(saved) : null
    }
    return null
  })
  const [showPlayer, setShowPlayer] = useState(true)
  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('music-is-paused')
      return saved === 'true'
    }
    return false
  })
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentlyPlaying !== null) {
        sessionStorage.setItem('music-current-track', currentlyPlaying.toString())
      } else {
        sessionStorage.removeItem('music-current-track')
      }
    }
  }, [currentlyPlaying])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('music-is-paused', isPaused.toString())
    }
  }, [isPaused])

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
        document.body.classList.add('right-sidebar-is-open')
        document.body.classList.remove('right-sidebar-is-closed')
      } else {
        document.body.classList.remove('right-sidebar-is-open')
        document.body.classList.add('right-sidebar-is-closed')
      }
    } else {
      if (isOpen) {
        document.body.classList.remove('right-sidebar-is-closed')
        document.body.classList.remove('right-sidebar-is-open')
      } else {
        document.body.classList.add('right-sidebar-is-closed')
        document.body.classList.remove('right-sidebar-is-open')
      }
    }

    return () => {
      document.body.classList.remove('right-sidebar-is-open')
      document.body.classList.remove('right-sidebar-is-closed')
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      const sidebar = document.querySelector('.right-positioned .toc-content')
      if (!sidebar) return

      const musicSection = sidebar.querySelector('[data-section="music"]')
      const githubSection = sidebar.querySelector('[data-section="github"]')

      if (!musicSection || !githubSection) return

      const sidebarRect = sidebar.getBoundingClientRect()
      const musicRect = musicSection.getBoundingClientRect()
      const githubRect = githubSection.getBoundingClientRect()

      const musicVisibility = Math.max(0, Math.min(musicRect.bottom, sidebarRect.bottom) - Math.max(musicRect.top, sidebarRect.top))
      const githubVisibility = Math.max(0, Math.min(githubRect.bottom, sidebarRect.bottom) - Math.max(githubRect.top, sidebarRect.top))

      if (githubVisibility > musicVisibility && githubVisibility > 100) {
        setActiveSection('github')
      } else {
        setActiveSection('activity')
      }
    }

    const sidebar = document.querySelector('.right-positioned .toc-content')
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (window.YT && window.YT.Player && !youtubePlayer) {
      createYouTubePlayer()
      return
    }

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        createYouTubePlayer()
      }
    } else if (!youtubePlayer) {
      createYouTubePlayer()
    }
  }, [])

  const createYouTubePlayer = () => {
    if (window.YT && window.YT.Player && !youtubePlayer) {
      const playerElement = document.getElementById('youtube-player')
      if (!playerElement) {
        setTimeout(createYouTubePlayer, 100)
        return
      }

      const player = new window.YT.Player('youtube-player', {
        height: '1',
        width: '1',
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
          autohide: 1
        },
        events: {
          onReady: (event: any) => {
            setYoutubePlayer(event.target)
          },
          onStateChange: (event: any) => {
            const playerState = event.data
            if (playerState === window.YT.PlayerState.PLAYING) {
              setIsPaused(false)
            } else if (playerState === window.YT.PlayerState.PAUSED) {
              setIsPaused(true)
            }
          }
        }
      })
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  const handleTrackPlay = (track: Track) => {
    if (!track.youtubeUrl || !youtubePlayer) return

    if (currentlyPlaying === track.id) {
      if (isPaused) {
        youtubePlayer.playVideo()
        setIsPaused(false)
      } else {
        youtubePlayer.pauseVideo()
        setIsPaused(true)
      }
    } else {
      const videoId = extractYouTubeId(track.youtubeUrl)
      if (videoId) {
        youtubePlayer.loadVideoById(videoId)
        setCurrentlyPlaying(track.id)
        setShowPlayer(true)
        setIsPaused(false)
      }
    }
  }

  const getCurrentTrack = () => {
    return tracks.find(track => track.id === currentlyPlaying)
  }

  const playNextTrack = () => {
    if (!youtubePlayer) return

    const currentIndex = tracks.findIndex(track => track.id === currentlyPlaying)
    const nextIndex = (currentIndex + 1) % tracks.length
    const nextTrack = tracks[nextIndex]

    if (nextTrack.youtubeUrl) {
      const videoId = extractYouTubeId(nextTrack.youtubeUrl)
      if (videoId) {
        youtubePlayer.loadVideoById(videoId)
        setCurrentlyPlaying(nextTrack.id)
        setIsPaused(false)
      }
    }
  }

  const playPreviousTrack = () => {
    if (!youtubePlayer) return

    const currentIndex = tracks.findIndex(track => track.id === currentlyPlaying)
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
    const prevTrack = tracks[prevIndex]

    if (prevTrack.youtubeUrl) {
      const videoId = extractYouTubeId(prevTrack.youtubeUrl)
      if (videoId) {
        youtubePlayer.loadVideoById(videoId)
        setCurrentlyPlaying(prevTrack.id)
        setIsPaused(false)
      }
    }
  }

  return (
    <>

      {!isMobile && !isOpen && (
        <button
          onClick={toggleDrawer}
          className="desktop-toc-button right-positioned"
          aria-label="Open activity sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12H3m9-9l-9 9 9 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {!isMobile && (
        <aside className={`toc-sidebar right-positioned ${isOpen ? 'toc-open' : ''} ${!isOpen ? 'toc-closed' : ''}`} style={{ right: 0, left: 'auto' }}>
        <div className="toc-header">
          <h3>&nbsp;&nbsp;Current Favorites</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="toc-close-button"
            aria-label={isOpen ? "Close activity sidebar" : "Open activity sidebar"}
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

        <div className="toc-content" style={{ paddingBottom: showPlayer ? '100px' : '20px' }}>
          <nav className="toc-nav">
            <div data-section="music" style={{ marginBottom: '20px' }}>
              {tracks.map((track) => (
                <button
                  key={track.id}
                  className={`toc-link full-width ${currentlyPlaying === track.id ? 'playing' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                  onClick={() => handleTrackPlay(track)}
                  disabled={!track.youtubeUrl}
                >
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div className="toc-post-date">
                      {track.artist}
                    </div>
                    <div className="toc-post-title">{track.title}</div>
                  </div>
                  {track.youtubeUrl && (
                    <div style={{
                      fontSize: '16px',
                      color: currentlyPlaying === track.id ? '#ff6b6b' : '#666',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {currentlyPlaying === track.id && !isPaused ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div data-section="github">
              <GitHubActivity username={githubUsername} />
            </div>
          </nav>
        </div>

                  {!isMobile && showPlayer && (
            <div style={{
              position: 'fixed',
              bottom: 0,
              right: isOpen ? 0 : '-270px',
              width: '270px',
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid #333',
              padding: '8px 20px 16px 20px',
              zIndex: 1001,
              transition: 'right 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {getCurrentTrack()?.title || 'Select a track to play'}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    color: '#888',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {getCurrentTrack()?.artist || 'Choose from your favorites'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPlayer(false)
                    setCurrentlyPlaying(null)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    padding: '2px',
                    marginLeft: '8px',
                    flexShrink: 0
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  onClick={playPreviousTrack}
                  disabled={!currentlyPlaying}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentlyPlaying ? '#666' : '#444',
                    cursor: currentlyPlaying ? 'pointer' : 'not-allowed',
                    padding: '2px',
                    opacity: currentlyPlaying ? 1 : 0.5
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    if (!youtubePlayer) return

                    if (currentlyPlaying) {
                      // Toggle pause/play
                      if (isPaused) {
                        youtubePlayer.playVideo()
                        setIsPaused(false)
                      } else {
                        youtubePlayer.pauseVideo()
                        setIsPaused(true)
                      }
                    } else {
                      const firstTrackWithUrl = tracks.find(track => track.youtubeUrl)
                      if (firstTrackWithUrl && firstTrackWithUrl.youtubeUrl) {
                        const videoId = extractYouTubeId(firstTrackWithUrl.youtubeUrl)
                        if (videoId) {
                          youtubePlayer.loadVideoById(videoId)
                          setCurrentlyPlaying(firstTrackWithUrl.id)
                          setIsPaused(false)
                        }
                      }
                    }
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid #ff6b6b',
                    borderRadius: '50%',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {currentlyPlaying && !isPaused ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={playNextTrack}
                  disabled={!currentlyPlaying}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentlyPlaying ? '#666' : '#444',
                    cursor: currentlyPlaying ? 'pointer' : 'not-allowed',
                    padding: '2px',
                    opacity: currentlyPlaying ? 1 : 0.5
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 18h2V6h-2zM6 6v12l8.5-6z" />
                  </svg>
                </button>

              </div>
              <div
                id="youtube-player"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden'
                }}
              />
            </div>
          )}
        </aside>
      )}
    </>
  )
}
