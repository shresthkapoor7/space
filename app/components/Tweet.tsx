'use client'

import { useTweet } from 'react-tweet'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface TweetProps {
  id: string
}

interface MediaModalProps {
  media: any[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

const MediaModal = ({ media, currentIndex, isOpen, onClose, onNavigate }: MediaModalProps) => {
  if (!isOpen || typeof window === 'undefined' || !media || media.length === 0) return null

  const currentMedia = media[currentIndex]
  const hasMultiple = media.length > 1

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1
    onNavigate(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0
    onNavigate(newIndex)
  }

  const modalContent = (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="media-modal-close" onClick={onClose}>
          ×
        </button>

        {hasMultiple && (
          <>
            <button className="media-modal-nav media-modal-prev" onClick={goToPrevious}>
              ←
            </button>
            <button className="media-modal-nav media-modal-next" onClick={goToNext}>
              →
            </button>
          </>
        )}

        {currentMedia.type === 'photo' && (
          <img
            src={currentMedia.media_url_https}
            alt={`Tweet image ${currentIndex + 1} of ${media.length}`}
            className="media-modal-image"
          />
        )}
        {currentMedia.type === 'video' && (
          <video
            src={currentMedia.video_info?.variants?.find((v: any) => v.content_type === 'video/mp4')?.url || currentMedia.video_info?.variants?.[0]?.url}
            controls
            className="media-modal-video"
            poster={currentMedia.media_url_https}
            autoPlay
          />
        )}

        {hasMultiple && (
          <div className="media-modal-counter">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default function Tweet({ id }: TweetProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedMediaList, setSelectedMediaList] = useState<any[]>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: tweet, error, isLoading } = useTweet(id)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Enhanced body scroll lock for mobile
  useEffect(() => {
    if (isModalOpen) {
      // Store original scroll position
      const scrollY = window.scrollY

      // Lock body scroll with enhanced mobile support
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      // Prevent touch scrolling on mobile
      const preventTouch = (e: TouchEvent) => {
        e.preventDefault()
      }

      document.addEventListener('touchmove', preventTouch, { passive: false })

      return () => {
        // Restore scroll and position
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
        document.removeEventListener('touchmove', preventTouch)
      }
    }
  }, [isModalOpen])

  const handleMediaClick = (media: any, mediaList: any[], index: number) => {
    setSelectedMediaList(mediaList)
    setCurrentMediaIndex(index)
    setIsModalOpen(true)
  }

  const handleNavigate = useCallback((index: number) => {
    setCurrentMediaIndex(index)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedMediaList([])
    setCurrentMediaIndex(0)
  }, [])

  // Keyboard support for modal navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return

      switch (event.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (selectedMediaList.length > 1) {
            const newIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : selectedMediaList.length - 1
            handleNavigate(newIndex)
          }
          break
        case 'ArrowRight':
          event.preventDefault()
          if (selectedMediaList.length > 1) {
            const newIndex = currentMediaIndex < selectedMediaList.length - 1 ? currentMediaIndex + 1 : 0
            handleNavigate(newIndex)
          }
          break
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, closeModal, handleNavigate, selectedMediaList.length, currentMediaIndex])

  if (!mounted) {
    return (
      <div className="tweet-component">
        <div className="tweet-wrapper">
          <div className="loading-card">
            Loading tweet...
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="tweet-component">
        <div className="tweet-wrapper">
          <div className="loading-card">
            Loading tweet...
          </div>
        </div>
      </div>
    )
  }

  if (error || !tweet) {
    return (
      <div className="tweet-component">
        <div className="tweet-wrapper">
          <div className="loading-card">
            Failed to load tweet
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tweet-component">
      <div className="tweet-wrapper">
        <div className="tweet-card">
          <div className="tweet-header">
            <div className="user-section">
              <div className="profile-picture">
                <img
                  src={tweet.user?.profile_image_url_https}
                  alt={`${tweet.user?.name}'s profile picture`}
                  className="profile-image"
                />
              </div>
              <div className="user-details">
                <a
                  href={`https://twitter.com/${tweet.user?.screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="user-info"
                >
                  <div className="user-name">
                    {tweet.user?.name}
                    {tweet.user?.verified && (
                      <span className="verified-badge">✓</span>
                    )}
                  </div>
                  <div className="user-handle">
                    @{tweet.user?.screen_name}
                  </div>
                </a>
              </div>
            </div>
            <a
              href={`https://twitter.com/${tweet.user?.screen_name}/status/${tweet.id_str}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tweet-date"
            >
              {new Date(tweet.created_at).toLocaleDateString()}
            </a>
          </div>

          {tweet.in_reply_to_status_id_str && (
            <div className="reply-info">
              Replying to{' '}
              <a
                href={`https://twitter.com/${tweet.in_reply_to_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="reply-link"
              >
                @{tweet.in_reply_to_screen_name}
              </a>
            </div>
          )}

          <a
            href={`https://twitter.com/${tweet.user?.screen_name}/status/${tweet.id_str}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-link"
          >
            <div className="tweet-text">
              {/* Remove media URLs from tweet text */}
              {(tweet as any).mediaDetails ?
                tweet.text.replace(/https:\/\/t\.co\/[a-zA-Z0-9]+/g, '').trim() :
                tweet.text
              }
            </div>
          </a>

          {/* Display tweet media/images */}
          {((tweet as any).mediaDetails || (tweet as any).photos) && (
            <div className={`tweet-media grid-${Math.min((tweet as any).mediaDetails?.length || 0, 8)}`}>
              {/* Use mediaDetails for both photos and videos, avoid duplicates */}
              {(tweet as any).mediaDetails?.map((media: any, index: number) => (
                <div key={`media-${index}`} className="tweet-media-item" onClick={() => handleMediaClick(media, (tweet as any).mediaDetails, index)}>
                  {media.type === 'photo' && (
                    <img
                      src={media.media_url_https}
                      alt="Tweet image"
                      className="tweet-image"
                    />
                  )}
                  {media.type === 'video' && (
                    <video
                      src={media.video_info?.variants?.find((v: any) => v.content_type === 'video/mp4')?.url || media.video_info?.variants?.[0]?.url}
                      controls
                      className="tweet-video"
                      poster={media.media_url_https}
                      preload="metadata"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Media Modal */}
          <MediaModal
            media={selectedMediaList}
            currentIndex={currentMediaIndex}
            isOpen={isModalOpen}
            onClose={closeModal}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  )
}