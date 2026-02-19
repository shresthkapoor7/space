'use client'

import { useEffect, useRef, useState } from 'react'

const MAX_PARTICLES = 25
const SPAWN_INTERVAL_MS = 35

export default function CursorDust() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const lastSpawn = useRef(0)
  const idRef = useRef(0)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastSpawn.current < SPAWN_INTERVAL_MS) return

      setParticles(prev => {
        const next = [
          ...prev,
          {
            id: idRef.current++,
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
          },
        ]
        if (next.length > MAX_PARTICLES) {
          return next.slice(-MAX_PARTICLES)
        }
        return next
      })
      lastSpawn.current = now
    }

    const handleLeave = () => {
      lastSpawn.current = 0
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const handleAnimationEnd = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div
      className="cursor-dust-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
      aria-hidden
    >
      {particles.map(({ id, x, y }) => (
        <div
          key={id}
          className="cursor-dust-particle"
          style={{
            left: x,
            top: y,
          }}
          onAnimationEnd={() => handleAnimationEnd(id)}
        />
      ))}
    </div>
  )
}
