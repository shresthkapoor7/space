'use client'

import { useState, useEffect } from 'react'

interface PdfViewerProps {
  link: string
}

export default function PdfViewer({ link }: PdfViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Body scroll lock for modal
  useEffect(() => {
    if (isFullscreen) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isFullscreen])

  // Normalize the link to ensure it works with both relative and absolute paths
  const normalizedLink = link.startsWith('/') ? link : `/${link}`

  const handleError = () => {
    setError('Failed to load PDF')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  if (!mounted) {
    return (
      <div className="pdf-viewer-container">
        <div className="pdf-loading">
          Loading PDF...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pdf-viewer-container">
        <div className="pdf-error">
          {error}
          <br />
          <a href={normalizedLink} target="_blank" rel="noopener noreferrer" className="pdf-download-link">
            Download PDF instead
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <span className="pdf-label">PDF</span>
          <div className="pdf-controls">
            <button
              onClick={toggleFullscreen}
              className="pdf-icon-btn"
              title="Fullscreen"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 5V1H5M15 5V1H11M1 11V15H5M15 11V15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a
              href={normalizedLink}
              download
              className="pdf-icon-btn"
              title="Download"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V11M8 11L5 8M8 11L11 8M2 11V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="pdf-viewer-wrapper">
          <iframe
            src={normalizedLink}
            className="pdf-iframe"
            title="PDF Viewer"
            onError={handleError}
          />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="pdf-modal-overlay" onClick={closeFullscreen}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="pdf-modal-close" onClick={closeFullscreen}>
              ×
            </button>
            <iframe
              src={normalizedLink}
              className="pdf-iframe-fullscreen"
              title="PDF Viewer Fullscreen"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .pdf-viewer-container {
          margin: 1.5rem 0;
          border: 1px solid #333;
          border-radius: 6px;
          overflow: hidden;
          background: #1a1a1a;
          max-width: 100%;
        }

        .pdf-viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid #333;
        }

        .pdf-label {
          font-weight: 500;
          color: #999;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pdf-controls {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .pdf-icon-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid transparent;
          border-radius: 4px;
          background: transparent;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .pdf-icon-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #444;
          color: #ccc;
        }

        .pdf-viewer-wrapper {
          width: 100%;
          height: 600px;
          position: relative;
        }

        .pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .pdf-loading,
        .pdf-error {
          padding: 3rem 1rem;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
        }

        .pdf-error {
          color: #ff6b6b;
        }

        .pdf-download-link {
          display: inline-block;
          margin-top: 0.75rem;
          color: #64b5f6;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }

        .pdf-download-link:hover {
          border-bottom-color: #64b5f6;
        }

        /* Fullscreen Modal */
        .pdf-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
        }

        .pdf-modal-content {
          position: relative;
          width: calc(100% - 2rem);
          height: calc(100% - 2rem);
          max-width: 1400px;
          max-height: 95%;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .pdf-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .pdf-modal-close:hover {
          background: rgba(0, 0, 0, 0.95);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .pdf-iframe-fullscreen {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .pdf-viewer-wrapper {
            height: 400px;
          }

          .pdf-viewer-header {
            padding: 0.5rem 0.75rem;
          }

          .pdf-icon-btn {
            width: 36px;
            height: 36px;
          }

          .pdf-modal-overlay {
            padding: 0;
          }

          .pdf-modal-content {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  )
}
