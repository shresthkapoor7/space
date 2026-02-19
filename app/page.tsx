'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const [showEnter, setShowEnter] = useState(false)
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!showEnter) return
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push('/home')
      }
    }
    window.addEventListener('keydown', handleEnterKey)
    return () => window.removeEventListener('keydown', handleEnterKey)
  }, [showEnter, router])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Game state
    const ENEMIES_TO_DEFEAT = 20
    let defeated = 0
    let gameWon = false

    // Player ship (adjust position based on screen size)
    const isMobileScreen = canvas.width <= 768
    const player = {
      x: canvas.width / 2,
      y: isMobileScreen ? canvas.height - 180 : canvas.height - 140,
      width: 40,
      height: 30,
      speed: isMobileScreen ? 6 : 8
    }

    // Keyboard state
    const keys: { [key: string]: boolean } = {}

    // Bullets
    const bullets: Array<{ x: number; y: number; speed: number }> = []

    // Enemies
    const enemies: Array<{ x: number; y: number; type: number; alive: boolean; moveDown: number }> = []

    // Stars background
    const stars: Array<{ x: number; y: number; size: number; speed: number }> = []

    // Initialize stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
      })
    }

    // Initialize enemies in formation
    const initEnemies = () => {
      enemies.length = 0
      const isMobileScreen = canvas.width <= 768
      const rows = 3
      const cols = isMobileScreen ? 5 : 8
      const enemySpacing = isMobileScreen ? 50 : 60
      const startX = canvas.width / 2 - (cols * enemySpacing) / 2
      const startY = isMobileScreen ? 80 : 100

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          enemies.push({
            x: startX + col * enemySpacing,
            y: startY + row * enemySpacing,
            type: row, // Different enemy types per row
            alive: true,
            moveDown: 0
          })
        }
      }
    }

    initEnemies()

    let enemyDirection = 1
    let enemyMoveCounter = 0
    let time = 0

    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true

      // Shoot with spacebar
      if (e.key === ' ' && !gameWon) {
        e.preventDefault()
        bullets.push({
          x: player.x,
          y: player.y,
          speed: 8
        })
      }

      // Hide instructions on first keypress
      if (showInstructions) {
        setShowInstructions(false)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Mobile control functions exposed to window
    ;(window as any).mobileShoot = () => {
      if (!gameWon) {
        bullets.push({
          x: player.x,
          y: player.y,
          speed: 8
        })
      }
      if (showInstructions) {
        setShowInstructions(false)
      }
    }

    ;(window as any).mobileMoveLeft = () => {
      if (!gameWon && player.x > player.width / 2) {
        player.x -= player.speed * 2
      }
    }

    ;(window as any).mobileMoveRight = () => {
      if (!gameWon && player.x < canvas.width - player.width / 2) {
        player.x += player.speed * 2
      }
    }

    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw moving stars background
      drawStars()

      // Update player position
      if (!gameWon) {
        if (keys['ArrowLeft'] && player.x > player.width / 2) {
          player.x -= player.speed
        }
        if (keys['ArrowRight'] && player.x < canvas.width - player.width / 2) {
          player.x += player.speed
        }
      }

      // Update and draw bullets
      updateBullets()

      // Update and draw enemies
      if (!gameWon) {
        updateEnemies()
      }
      drawEnemies()

      // Draw player
      drawPlayer()

      // Draw HUD
      drawHUD()

      // Check win condition
      if (defeated >= ENEMIES_TO_DEFEAT && !gameWon) {
        gameWon = true
        setShowEnter(true)
        setEnemiesDefeated(defeated)
      }

      time += 0.02
      requestAnimationFrame(draw)
    }

    const drawStars = () => {
      ctx.fillStyle = '#ffffff'
      stars.forEach(star => {
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        ctx.fillRect(star.x, star.y, star.size, star.size)
      })
    }

    const drawPlayer = () => {
      const fontSize = canvas.width <= 480 ? 10 : 14
      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#00ff00'

      // Classic spaceship ASCII art
      const ship = [
        '  ^  ',
        ' /|\\ ',
        '/_|_\\',
        ' | | '
      ]

      ship.forEach((line, i) => {
        ctx.fillText(line, player.x, player.y + (i - 1.5) * fontSize)
      })
    }

    const drawEnemies = () => {
      const fontSize = canvas.width <= 480 ? 10 : 14
      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      enemies.forEach(enemy => {
        if (!enemy.alive) return

        // Different enemy types
        let enemySprite: string[]
        let color: string

        switch (enemy.type) {
          case 0: // Type 1: Crab
            enemySprite = [' /oo\\ ', '<(##)>', ' \\__/ ']
            color = '#ff00ff'
            break
          case 1: // Type 2: Squid
            enemySprite = [' /||\\ ', '(====)', ' \\  / ']
            color = '#00ffff'
            break
          case 2: // Type 3: Octopus
            enemySprite = [' dMMb ', '<O##O>', ' \\||/ ']
            color = '#ffff00'
            break
          default:
            enemySprite = [' *** ', '*****', ' *** ']
            color = '#ffffff'
        }

        ctx.fillStyle = color
        enemySprite.forEach((line, i) => {
          ctx.fillText(line, enemy.x, enemy.y + (i - 1) * fontSize)
        })
      })
    }

    const updateEnemies = () => {
      enemyMoveCounter++

      // Move enemies side to side
      if (enemyMoveCounter > 30) {
        enemyMoveCounter = 0

        let hitEdge = false
        enemies.forEach(enemy => {
          if (!enemy.alive) return
          enemy.x += enemyDirection * 10

          if (enemy.x <= 50 || enemy.x >= canvas.width - 50) {
            hitEdge = true
          }
        })

        // If hit edge, change direction and move down
        if (hitEdge) {
          enemyDirection *= -1
          enemies.forEach(enemy => {
            if (!enemy.alive) return
            enemy.y += 20
          })
        }
      }
    }

    const updateBullets = () => {
      ctx.fillStyle = '#ffffff'

      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        bullet.y -= bullet.speed

        // Draw bullet
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 10)

        // Remove if off screen
        if (bullet.y < 0) {
          bullets.splice(i, 1)
          continue
        }

        // Check collision with enemies
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j]
          if (!enemy.alive) continue

          const dx = bullet.x - enemy.x
          const dy = bullet.y - enemy.y

          if (Math.abs(dx) < 25 && Math.abs(dy) < 20) {
            // Hit!
            enemy.alive = false
            bullets.splice(i, 1)
            defeated++

            // Respawn enemy if not enough defeated yet
            if (defeated < ENEMIES_TO_DEFEAT) {
              setTimeout(() => {
                enemy.alive = true
                enemy.x = Math.random() * (canvas.width - 100) + 50
                enemy.y = Math.random() * 200 + 50
              }, 2000)
            }
            break
          }
        }
      }
    }

    const drawHUD = () => {
      const fontSize = canvas.width <= 768 ? 16 : 24
      const padding = canvas.width <= 480 ? 10 : 20
      const spacing = canvas.width <= 480 ? 20 : 30

      ctx.font = `bold ${fontSize}px monospace`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      // Score
      ctx.fillStyle = '#ff0000'
      ctx.fillText('1UP', padding, padding)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(String(defeated).padStart(2, '0'), padding, padding + fontSize + 5)

      // Hi-Score
      ctx.fillStyle = '#ff0000'
      ctx.textAlign = 'center'
      ctx.fillText('SCORE NEEDED', canvas.width / 2, padding)
      ctx.fillStyle = '#00ffff'
      ctx.fillText(String(ENEMIES_TO_DEFEAT).padStart(4, '0'), canvas.width / 2, padding + fontSize + 5)

      // Lives indicator (hide on very small screens)
      if (canvas.width > 480) {
        ctx.textAlign = 'right'
        ctx.fillStyle = '#00ff00'
        const livesX = canvas.width - padding
        for (let i = 0; i < 3; i++) {
          ctx.fillText('^', livesX - i * spacing, padding + 10)
        }
      }
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      delete (window as any).mobileShoot
      delete (window as any).mobileMoveLeft
      delete (window as any).mobileMoveRight
    }
  }, [showInstructions])

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} className="background-canvas" />

      {showInstructions && (
        <div className="instructions">
          <div className="instructions-box">
            <h2>╔═══════════════════╗</h2>
            <h2>║   SPACE INVADERS  ║</h2>
            <h2>╚═══════════════════╝</h2>
            <div className="instructions-content">
              {!isMobile ? (
                <>
                  <p><span className="key">←</span> <span className="key">→</span> MOVE</p>
                  <p><span className="key">SPACE</span> SHOOT</p>
                  <p className="mission">DEFEAT {20} ENEMIES TO ENTER</p>
                  <p className="hint">Press any key to start...</p>
                </>
              ) : (
                <>
                  <p>USE BUTTONS TO PLAY</p>
                  <p className="mission">DEFEAT {20} ENEMIES TO ENTER</p>
                  <p className="hint">Tap any button to start...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mobile-controls">
          <button
            className="control-btn move-btn left-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileMoveLeft() }}
            onClick={() => (window as any).mobileMoveLeft()}
          >
            ←
          </button>
          <button
            className="control-btn shoot-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileShoot() }}
            onClick={() => (window as any).mobileShoot()}
          >
            SHOOT
          </button>
          <button
            className="control-btn move-btn right-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileMoveRight() }}
            onClick={() => (window as any).mobileMoveRight()}
          >
            →
          </button>
        </div>
      )}

      <div className="content">
        <div className="footer-links">
          {showEnter && (
            <>
              <Link href="/home">
                ENTER
              </Link>
              <span>•</span>
            </>
          )}
          <a href="https://github.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span>•</span>
          <a href="https://www.linkedin.com/in/shresth-kapoor-7skp/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span>•</span>
          <a href="https://twitter.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #0a0a0a;
          cursor: crosshair;
        }

        .background-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .instructions {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.85);
          animation: fadeIn 0.5s ease-in;
        }

        .instructions-box {
          font-family: 'Courier New', Courier, monospace;
          text-align: center;
          padding: 40px;
          background: rgba(0, 0, 0, 0.9);
          border: 3px solid #00ff00;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        }

        .instructions-box h2 {
          color: #00ff00;
          font-size: 1.2rem;
          margin: 0;
          padding: 0;
          line-height: 1.3;
          letter-spacing: 0.05em;
          font-family: 'Courier New', Courier, monospace;
          white-space: pre;
          font-weight: normal;
        }

        .instructions-content {
          margin-top: 30px;
        }

        .instructions-content p {
          color: #ffffff;
          font-size: 1.2rem;
          margin: 15px 0;
          letter-spacing: 1px;
        }

        .key {
          display: inline-block;
          padding: 5px 12px;
          background: #333;
          border: 2px solid #666;
          border-radius: 4px;
          color: #00ff00;
          font-weight: bold;
          margin: 0 5px;
          box-shadow: 0 2px 0 #000;
        }

        .mission {
          color: #ffff00;
          font-weight: bold;
          margin-top: 25px !important;
          font-size: 1.1rem;
        }

        .hint {
          color: #888;
          font-size: 0.9rem;
          margin-top: 30px !important;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          padding: 20px;
          padding-bottom: 40px;
          text-align: center;
          pointer-events: none;
        }

        .footer-links {
          display: flex;
          gap: 16px;
          align-items: center;
          font-size: 0.95rem;
          font-family: monospace;
          pointer-events: auto;
        }

        .footer-links a {
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #00ff00;
        }

        .footer-links span {
          color: #444;
        }

        .mobile-controls {
          position: fixed;
          bottom: 100px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          z-index: 100;
          padding: 0 20px;
        }

        .control-btn {
          background: rgba(0, 255, 0, 0.2);
          border: 2px solid #00ff00;
          color: #00ff00;
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 20px;
          border-radius: 10px;
          cursor: var(--cursor-pointer);
          transition: all 0.2s;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .control-btn:active {
          background: rgba(0, 255, 0, 0.4);
          transform: scale(0.95);
        }

        .move-btn {
          width: 70px;
          height: 70px;
          font-size: 2rem;
        }

        .shoot-btn {
          padding: 20px 30px;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .instructions-box {
            padding: 20px 15px;
            max-width: 90%;
          }

          .instructions-box h2 {
            font-size: 0.7rem;
            letter-spacing: 0.05em;
          }

          .instructions-content {
            margin-top: 15px;
          }

          .instructions-content p {
            font-size: 0.85rem;
            margin: 10px 0;
          }

          .mission {
            font-size: 0.9rem !important;
            margin-top: 15px !important;
          }

          .hint {
            font-size: 0.75rem !important;
            margin-top: 15px !important;
          }

          .footer-links {
            font-size: 0.85rem;
            gap: 12px;
          }

          .content {
            padding-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .instructions-box h2 {
            font-size: 0.6rem;
          }

          .instructions-content p {
            font-size: 0.75rem;
          }

          .control-btn {
            padding: 15px;
          }

          .move-btn {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .shoot-btn {
            padding: 15px 20px;
            font-size: 0.9rem;
          }

          .mobile-controls {
            bottom: 80px;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}
