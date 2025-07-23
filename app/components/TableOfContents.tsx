'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [posts, currentPage])

  const navigateToPost = (postId: number) => {
    if (currentPostId !== undefined) {
      // We're on an individual post page, navigate to different post
      const baseUrl = currentPage === 'home' ? '' : `/${currentPage}`
      window.location.href = `${baseUrl}/${postId}`
    } else {
      // We're on the main page, scroll and update URL
      const element = document.getElementById(`post-${currentPage}-${postId}`)
      if (element) {
        const yOffset = -80; // Offset for header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // Update URL without page reload
        const baseUrl = currentPage === 'home' ? '' : `/${currentPage}`
        window.history.pushState({}, '', `${baseUrl}/${postId}`)
      }
    }
    setIsOpen(false) // Close mobile drawer
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // Add/remove class to body for styling adjustments
    if (isOpen) {
      document.body.classList.add('toc-is-open')
    } else {
      document.body.classList.remove('toc-is-open')
    }

    return () => {
      document.body.classList.remove('toc-is-open')
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          onClick={toggleDrawer}
          className="mobile-toc-button"
          aria-label="Open table of contents"
                >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="mobile-toc-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Table of Contents */}
      <aside className={`toc-sidebar ${isOpen ? 'toc-open' : ''}`}>
        <div className="toc-header">
          <h3>Contents</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="toc-close-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

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
                {post.date} {post.pinned && <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📌</span>}
              </div>
              <div className="toc-post-title">{post.title}</div>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}