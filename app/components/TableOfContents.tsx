'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  date: string
  pinned?: boolean
}

interface TableOfContentsProps {
  posts: Post[]
  currentPage: string
  currentPostId?: number
}

export default function TableOfContents({ posts, currentPage, currentPostId }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePost, setActivePost] = useState<string>('')
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
    const handleScroll = () => {
      const postElements = posts.map(post =>
        document.getElementById(`post-${currentPage}-${post.id}`)
      )

      let currentActivePost = ''

      for (const element of postElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentActivePost = element.id
            break
          }
        }
      }

      setActivePost(currentActivePost)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [posts, currentPage])

  const navigateToPost = (postId: number) => {
    const baseUrl = currentPage === 'home' ? '' : `/${currentPage}`
    window.location.href = `${baseUrl}/${postId}`
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.classList.add('toc-is-open')
        document.body.classList.remove('toc-is-closed')
      } else {
        document.body.classList.remove('toc-is-open')
        document.body.classList.add('toc-is-closed')
      }
    } else {
      if (isOpen) {
        document.body.classList.remove('toc-is-closed')
        document.body.classList.remove('toc-is-open')
      } else {
        document.body.classList.add('toc-is-closed')
        document.body.classList.remove('toc-is-open')
      }
    }

    return () => {
      document.body.classList.remove('toc-is-open')
      document.body.classList.remove('toc-is-closed')
    }
  }, [isOpen, isMobile])

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={toggleDrawer}
          className="mobile-toc-button"
          aria-label="Open table of contents"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12H3m18 0l-9-9m9 9l-9 9"
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
          className="desktop-toc-button"
          aria-label="Open table of contents"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12H3m18 0l-9-9m9 9l-9 9"
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
          className="mobile-toc-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`toc-sidebar ${isOpen ? 'toc-open' : ''} ${!isOpen ? 'toc-closed' : ''}`}>
        <div className="toc-header">
          <h3>&nbsp;&nbsp;Posts</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="toc-close-button"
            aria-label={isOpen ? "Close table of contents" : "Open table of contents"}
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

        <div className="toc-content">
          <nav className="toc-nav">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => navigateToPost(post.id)}
                className={`toc-link ${
                  currentPostId !== undefined
                    ? currentPostId === post.id ? 'active' : ''
                    : activePost === `post-${currentPage}-${post.id}` ? 'active' : ''
                }`}
              >
                <div className="toc-post-date">
                  {post.date} {post.pinned && <span className="pin-icon">📌</span>}
                </div>
                <div className="toc-post-title">{post.title}</div>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}