'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const scroller = document.getElementById('main-area-scroll')
    if (!scroller) return

    const updateProgress = () => {
      const scrollTop = scroller.scrollTop
      const scrollHeight = scroller.scrollHeight - scroller.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }

    scroller.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => scroller.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: '#FF6B35',
        zIndex: 9999,
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
    />
  )
}
