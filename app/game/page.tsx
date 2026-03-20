'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  const showInstructionsRef = useRef(true)

  const playAgain = () => {
    showInstructionsRef.current = true
    setShowInstructions(true)
    setGameOver(false)
    setFinalScore(0)
    setResetKey(k => k + 1)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
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
    let defeated = 0
    let currentLevel = 1
    let lives = 3
    let isGameOver = false
    let animFrameId: number

    // Player
    const isMobileScreen = canvas.width <= 768
    const player = {
      x: canvas.width / 2,
      y: isMobileScreen ? canvas.height - 180 : canvas.height - 140,
      width: 40,
      height: 30,
      speed: isMobileScreen ? 6 : 8,
      // flash effect when hit
      hitFlash: 0,
    }

    // Audio — lazy-init on first user gesture
    let audioCtx: AudioContext | null = null
    const getAudio = () => {
      if (!audioCtx) audioCtx = new AudioContext()
      return audioCtx
    }

    const playShoot = () => {
      const ac = getAudio()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain); gain.connect(ac.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(900, ac.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.08)
      gain.gain.setValueAtTime(0.18, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.08)
    }

    const playEnemyDie = () => {
      const ac = getAudio()
      const bufLen = Math.floor(ac.sampleRate * 0.12)
      const buf = ac.createBuffer(1, bufLen, ac.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen)
      const src = ac.createBufferSource()
      src.buffer = buf
      const filter = ac.createBiquadFilter()
      filter.type = 'bandpass'; filter.frequency.value = 350; filter.Q.value = 0.8
      const gain = ac.createGain()
      gain.gain.setValueAtTime(0.5, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12)
      src.connect(filter); filter.connect(gain); gain.connect(ac.destination)
      src.start()
    }

    const playLoseLife = () => {
      const ac = getAudio()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain); gain.connect(ac.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(350, ac.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.5)
      gain.gain.setValueAtTime(0.35, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5)
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.5)
    }

    const playLevelUp = () => {
      const ac = getAudio()
      const notes = [440, 554, 659, 880]
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        osc.connect(gain); gain.connect(ac.destination)
        osc.type = 'square'
        const t = ac.currentTime + i * 0.09
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0.12, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
        osc.start(t); osc.stop(t + 0.08)
      })
    }

    const playGameOver = () => {
      const ac = getAudio()
      const notes = [300, 240, 180, 100]
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        osc.connect(gain); gain.connect(ac.destination)
        osc.type = 'sawtooth'
        const t = ac.currentTime + i * 0.18
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0.3, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
        osc.start(t); osc.stop(t + 0.16)
      })
    }

    const keys: { [key: string]: boolean } = {}
    const bullets: Array<{ x: number; y: number; speed: number }> = []
    const SHOT_COOLDOWN = isMobileScreen ? 200 : 300 // ms — shorter on mobile (tapping is harder)
    let lastShotAt = 0
    const enemies: Array<{ x: number; y: number; type: number; alive: boolean }> = []
    const stars: Array<{ x: number; y: number; size: number; speed: number }> = []
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string }> = []

    const spawnBurst = (x: number, y: number, color: string) => {
      const count = 10
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4
        const speed = Math.random() * 2.5 + 1
        const life = Math.floor(Math.random() * 15 + 18)
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life, size: Math.random() * 2.5 + 1, color })
      }
    }

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2,
      })
    }

    const initEnemies = () => {
      enemies.length = 0
      const mobile = canvas.width <= 768
      const rows = 3
      const cols = mobile ? 5 : 8
      const spacing = mobile ? 50 : 60
      const startX = canvas.width / 2 - (cols * spacing) / 2
      const startY = mobile ? 80 : 100
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          enemies.push({ x: startX + col * spacing, y: startY + row * spacing, type: row, alive: true })
        }
      }
    }
    initEnemies()

    let enemyDirection = 1
    let enemyMoveCounter = 0
    let time = 0

    // Difficulty helpers — scale with kills
    // Mobile gets a gentler difficulty curve — slower enemies, longer respawn, smaller steps
    const getMoveInterval = () => isMobileScreen
      ? Math.max(16, 40 - Math.floor(defeated / 8) * 2)
      : Math.max(8,  30 - Math.floor(defeated / 5) * 2)
    const getStepSize = () => isMobileScreen
      ? Math.min(12, 6  + Math.floor(defeated / 12))
      : Math.min(20, 10 + Math.floor(defeated / 8))
    const getRespawnDelay = () => isMobileScreen
      ? Math.max(800,  2500 - defeated * 35)
      : Math.max(400,  2000 - defeated * 40)

    const triggerHit = () => {
      lives--
      player.hitFlash = 20
      if (lives <= 0) {
        isGameOver = true
        playGameOver()
        setGameOver(true)
        setFinalScore(defeated)
      } else {
        playLoseLife()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
      if (e.key === ' ') {
        e.preventDefault()
        if (!isGameOver) {
          const now = Date.now()
          if (now - lastShotAt >= SHOT_COOLDOWN) {
            bullets.push({ x: player.x, y: player.y, speed: 8 })
            lastShotAt = now
            playShoot()
          }
        }
      }
      if (showInstructionsRef.current) {
        showInstructionsRef.current = false
        setShowInstructions(false)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    ;(window as any).mobileShoot = () => {
      if (!isGameOver) {
        const now = Date.now()
        if (now - lastShotAt >= SHOT_COOLDOWN) {
          bullets.push({ x: player.x, y: player.y, speed: 8 })
          lastShotAt = now
          playShoot()
        }
      }
      if (showInstructionsRef.current) { showInstructionsRef.current = false; setShowInstructions(false) }
    }
    ;(window as any).mobileMoveLeft = () => {
      if (!isGameOver && player.x > player.width / 2) player.x -= player.speed * 2
    }
    ;(window as any).mobileMoveRight = () => {
      if (!isGameOver && player.x < canvas.width - player.width / 2) player.x += player.speed * 2
    }

    const draw = () => {
      if (isGameOver) return

      ctx.fillStyle = '#060504'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawStars()

      if (!isGameOver) {
        if (keys['ArrowLeft'] && player.x > player.width / 2) player.x -= player.speed
        if (keys['ArrowRight'] && player.x < canvas.width - player.width / 2) player.x += player.speed
      }

      updateBullets()
      updateEnemies()
      checkEnemyPlayerCollision()
      drawEnemies()
      drawParticles()
      drawPlayer()
      drawHUD()

      if (player.hitFlash > 0) player.hitFlash--

      time += 0.02
      animFrameId = requestAnimationFrame(draw)
    }

    const drawGrid = () => {
      const gridSize = 50
      ctx.strokeStyle = 'rgba(255, 130, 60, 0.07)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height) }
      for (let y = 0; y <= canvas.height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y) }
      ctx.stroke()
    }

    const drawStars = () => {
      const speedMult = 1 + defeated * 0.02 // stars speed up with score
      stars.forEach(star => {
        star.y += star.speed * speedMult
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width }
        ctx.fillStyle = `rgba(255, 200, 160, ${star.size * 0.2 + 0.05})`
        ctx.fillRect(star.x, star.y, star.size, star.size)
      })
    }

    const drawPlayer = () => {
      const fontSize = canvas.width <= 480 ? 11 : 14
      ctx.font = `${fontSize}px 'Courier New', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (player.hitFlash > 0 && Math.floor(player.hitFlash / 3) % 2 === 0) {
        ctx.fillStyle = '#FF2222'
        ctx.shadowColor = '#FF0000'
        ctx.shadowBlur = 20
      } else {
        ctx.fillStyle = '#FF8C55'
        ctx.shadowColor = '#FF6B35'
        ctx.shadowBlur = 12
      }

      const ship = ['  ^  ', ' /Σ\\ ', '/___\\']
      ship.forEach((line, i) => ctx.fillText(line, player.x, player.y + (i - 1) * fontSize))
      ctx.shadowBlur = 0
    }

    const drawEnemies = () => {
      const symSize = canvas.width <= 480 ? 24 : 30
      ctx.font = `${symSize}px 'Georgia', 'Times New Roman', serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      enemies.forEach(enemy => {
        if (!enemy.alive) return
        let symbol: string, color: string, glow: number
        switch (enemy.type) {
          case 0: symbol = '∑'; color = '#FFAA66'; glow = 18; break
          case 1: symbol = '∫'; color = '#FF7A42'; glow = 14; break
          default: symbol = '∂'; color = '#C05520'; glow = 10; break
        }
        ctx.shadowBlur = glow; ctx.shadowColor = color; ctx.fillStyle = color
        ctx.fillText(symbol, enemy.x, enemy.y)
        ctx.shadowBlur = 0
      })
    }

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06 // slight gravity
        p.life--
        if (p.life <= 0) { particles.splice(i, 1); continue }
        const alpha = p.life / p.maxLife
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.shadowBlur = 6 * alpha
        ctx.shadowColor = p.color
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    const updateEnemies = () => {
      enemyMoveCounter++
      if (enemyMoveCounter > getMoveInterval()) {
        enemyMoveCounter = 0
        const step = getStepSize()
        let hitEdge = false
        enemies.forEach(enemy => {
          if (!enemy.alive) return
          enemy.x += enemyDirection * step
          if (enemy.x <= 50 || enemy.x >= canvas.width - 50) hitEdge = true
        })
        if (hitEdge) {
          enemyDirection *= -1
          enemies.forEach(enemy => { if (enemy.alive) enemy.y += 20 })
        }
      }
    }

    const checkEnemyPlayerCollision = () => {
      enemies.forEach(enemy => {
        if (!enemy.alive) return
        // Enemy reaches player level or directly overlaps player
        const dx = Math.abs(enemy.x - player.x)
        const dy = Math.abs(enemy.y - player.y)
        if (dx < 28 && dy < 28) {
          enemy.alive = false
          triggerHit()
          // Respawn the enemy after delay
          if (!isGameOver) {
            setTimeout(() => {
              enemy.alive = true
              enemy.x = Math.random() * (canvas.width - 100) + 50
              enemy.y = Math.random() * 200 + 50
            }, getRespawnDelay())
          }
        }
        // Enemy reaches bottom
        if (enemy.y >= player.y + 10) {
          enemy.alive = false
          triggerHit()
          if (!isGameOver) {
            setTimeout(() => {
              enemy.alive = true
              enemy.x = Math.random() * (canvas.width - 100) + 50
              enemy.y = Math.random() * 200 + 50
            }, getRespawnDelay())
          }
        }
      })
    }

    const updateBullets = () => {
      ctx.fillStyle = '#FFAA66'
      ctx.shadowBlur = 8
      ctx.shadowColor = '#FF6B35'

      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        bullet.y -= bullet.speed
        ctx.fillRect(bullet.x - 1, bullet.y, 2, 12)

        if (bullet.y < 0) { bullets.splice(i, 1); continue }

        let hit = false
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j]
          if (!enemy.alive) continue
          if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 20) {
            const burstColor = enemy.type === 0 ? '#FFAA66' : enemy.type === 1 ? '#FF7A42' : '#C05520'
            spawnBurst(enemy.x, enemy.y, burstColor)
            enemy.alive = false
            bullets.splice(i, 1)
            defeated++
            hit = true
            playEnemyDie()
            const newLevel = Math.floor(defeated / 5) + 1
            if (newLevel > currentLevel) { currentLevel = newLevel; playLevelUp() }
            setTimeout(() => {
              enemy.alive = true
              enemy.x = Math.random() * (canvas.width - 100) + 50
              enemy.y = Math.random() * 200 + 50
            }, getRespawnDelay())
            break
          }
        }
        if (hit) continue
      }
      ctx.shadowBlur = 0
    }

    const drawHUD = () => {
      const fontSize = canvas.width <= 768 ? 13 : 16
      const padding = canvas.width <= 480 ? 10 : 20
      ctx.textBaseline = 'top'
      ctx.shadowBlur = 6
      ctx.shadowColor = 'rgba(255, 107, 53, 0.6)'

      // Score
      ctx.font = `${fontSize}px 'Courier New', monospace`
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(255, 130, 60, 0.45)'
      ctx.fillText('killed', padding, padding)
      ctx.font = `bold ${fontSize}px 'Courier New', monospace`
      ctx.fillStyle = '#FF8C55'
      ctx.fillText(String(defeated).padStart(2, '0'), padding, padding + fontSize + 4)

      // Level / difficulty indicator
      const level = Math.floor(defeated / 5) + 1
      ctx.font = `${fontSize}px 'Courier New', monospace`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255, 130, 60, 0.45)'
      ctx.fillText('level', canvas.width / 2, padding)
      ctx.font = `bold ${fontSize}px 'Courier New', monospace`
      ctx.fillStyle = '#FF8C55'
      ctx.fillText(String(level).padStart(2, '0'), canvas.width / 2, padding + fontSize + 4)

      // Lives
      ctx.font = `${fontSize + 2}px 'Courier New', monospace`
      ctx.textAlign = 'right'
      const livesX = canvas.width - padding
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < lives ? '#FF8C55' : 'rgba(255, 107, 53, 0.15)'
        ctx.shadowBlur = i < lives ? 8 : 0
        ctx.shadowColor = '#FF6B35'
        ctx.fillText('^', livesX - i * 22, padding + 6)
      }
      ctx.shadowBlur = 0
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameId)
      audioCtx?.close()
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      delete (window as any).mobileShoot
      delete (window as any).mobileMoveLeft
      delete (window as any).mobileMoveRight
    }
  }, [resetKey])

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} className="background-canvas" />

      {showInstructions && !gameOver && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>╔═══════════════╗</h2>
            <h2>║     ΣPACE     ║</h2>
            <h2>╚═══════════════╝</h2>
            <div className="overlay-content">
              {!isMobile ? (
                <>
                  <p><span className="key">←</span> <span className="key">→</span> MOVE</p>
                  <p><span className="key">SPACE</span> SHOOT</p>
                  <p className="hint">Press any key to start...</p>
                </>
              ) : (
                <>
                  <p>USE BUTTONS TO PLAY</p>
                  <p className="hint">Tap any button to start...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>╔═══════════════╗</h2>
            <h2>║   GAME OVER   ║</h2>
            <h2>╚═══════════════╝</h2>
            <div className="overlay-content">
              <p className="score-label">SCORE</p>
              <p className="score-value">{String(finalScore).padStart(3, '0')}</p>
              <button className="play-again-btn" onClick={playAgain}>PLAY AGAIN</button>
              <p className="hint">or <Link href="/home" className="back-link">← back to site</Link></p>
            </div>
          </div>
        </div>
      )}

      {isMobile && !gameOver && (
        <div className="mobile-controls">
          <button className="control-btn move-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileMoveLeft() }}
            onClick={() => (window as any).mobileMoveLeft()}>←</button>
          <button className="control-btn shoot-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileShoot() }}
            onClick={() => (window as any).mobileShoot()}>SHOOT</button>
          <button className="control-btn move-btn"
            onTouchStart={(e) => { e.preventDefault(); (window as any).mobileMoveRight() }}
            onClick={() => (window as any).mobileMoveRight()}>→</button>
        </div>
      )}

      <div className="content">
        <div className="footer-links">
          <Link href="/home">← back</Link>
          <span>•</span>
          <a href="https://github.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>•</span>
          <a href="https://www.linkedin.com/in/shresth-kapoor-7skp/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span>•</span>
          <a href="https://twitter.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #060504;
          cursor: crosshair;
        }

        .background-canvas {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(6, 5, 4, 0.9);
          animation: fadeIn 0.4s ease-in;
        }

        .overlay-box {
          font-family: 'Courier New', Courier, monospace;
          text-align: center;
          padding: 40px;
          background: rgba(10, 8, 6, 0.95);
          border: 1px solid #FF6B35;
          box-shadow: 0 0 40px rgba(255, 107, 53, 0.15);
        }

        .overlay-box h2 {
          color: #FF6B35;
          font-size: 1.2rem;
          margin: 0; padding: 0;
          line-height: 1.3;
          font-family: 'Courier New', Courier, monospace;
          white-space: pre;
          font-weight: normal;
        }

        .overlay-content {
          margin-top: 30px;
        }

        .overlay-content p {
          color: #ffffff;
          font-size: 1.2rem;
          margin: 15px 0;
          letter-spacing: 1px;
        }

        .key {
          display: inline-block;
          padding: 5px 12px;
          background: rgba(255, 107, 53, 0.08);
          border: 1px solid rgba(255, 107, 53, 0.4);
          border-radius: 3px;
          color: #FF9966;
          font-weight: bold;
          margin: 0 5px;
        }

        .score-label {
          color: rgba(255, 130, 60, 0.55);
          font-size: 0.85rem !important;
          letter-spacing: 3px;
          margin-bottom: 4px !important;
        }

        .score-value {
          color: #FF8C55;
          font-size: 3rem !important;
          font-weight: bold;
          margin: 0 0 24px !important;
          letter-spacing: 6px;
        }

        .play-again-btn {
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid #FF6B35;
          color: #FF8C55;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          font-weight: bold;
          letter-spacing: 2px;
          padding: 12px 32px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .play-again-btn:hover {
          background: rgba(255, 107, 53, 0.22);
          box-shadow: 0 0 16px rgba(255, 107, 53, 0.3);
        }

        .hint {
          color: #888;
          font-size: 0.85rem !important;
          margin-top: 16px !important;
          animation: blink 1.5s infinite;
        }

        .back-link {
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: #FF6B35; }

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
        .footer-links a:hover { color: #FF6B35; }
        .footer-links span { color: #444; }

        .mobile-controls {
          position: fixed;
          bottom: 100px;
          left: 0; right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          z-index: 100;
          padding: 0 20px;
        }

        .control-btn {
          background: rgba(255, 107, 53, 0.12);
          border: 1px solid #FF6B35;
          color: #FF6B35;
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .control-btn:active {
          background: rgba(255, 107, 53, 0.25);
          transform: scale(0.95);
        }

        .move-btn { width: 70px; height: 70px; font-size: 2rem; }
        .shoot-btn { padding: 20px 30px; font-size: 1rem; }

        @media (max-width: 768px) {
          .overlay-box { padding: 20px 15px; max-width: 90%; }
          .overlay-box h2 { font-size: 0.7rem; }
          .overlay-content { margin-top: 15px; }
          .overlay-content p { font-size: 0.85rem; margin: 10px 0; }
          .hint { font-size: 0.75rem !important; margin-top: 15px !important; }
          .footer-links { font-size: 0.85rem; gap: 12px; }
          .content { padding-bottom: 20px; }
        }

        @media (max-width: 480px) {
          .overlay-box h2 { font-size: 0.6rem; }
          .overlay-content p { font-size: 0.75rem; }
          .control-btn { padding: 15px; }
          .move-btn { width: 60px; height: 60px; font-size: 1.5rem; }
          .shoot-btn { padding: 15px 20px; font-size: 0.9rem; }
          .mobile-controls { bottom: 80px; gap: 15px; }
        }
      `}</style>
    </div>
  )
}
