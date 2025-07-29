'use client'

import { useTweet } from 'react-tweet'
import { useState, useEffect } from 'react'

interface TweetProps {
  id: string
}

interface MediaModalProps {
  media: any
  isOpen: boolean
  onClose: () => void
}

const MediaModal = ({ media, isOpen, onClose }: MediaModalProps) => {
  if (!isOpen) return null

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="media-modal-close" onClick={onClose}>
          ×
        </button>
        {media.type === 'photo' && (
          <img
            src={media.media_url_https}
            alt="Tweet image"
            className="media-modal-image"
          />
        )}
        {media.type === 'video' && (
          <video
            src={media.video_info?.variants?.find((v: any) => v.content_type === 'video/mp4')?.url || media.video_info?.variants?.[0]?.url}
            controls
            className="media-modal-video"
            poster={media.media_url_https}
            autoPlay
          />
        )}
      </div>
    </div>
  )
}

export default function Tweet({ id }: TweetProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: tweet, error, isLoading } = useTweet(id)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMediaClick = (media: any) => {
    setSelectedMedia(media)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMedia(null)
  }

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
                <div key={`media-${index}`} className="tweet-media-item" onClick={() => handleMediaClick(media)}>
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
            media={selectedMedia}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      </div>
    </div>
  )
}