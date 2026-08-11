'use client'

import { useEffect, useRef } from 'react'

interface DonutBackgroundProps {
  dark: boolean
}

const TAU = Math.PI * 2
const CHARACTERS = '.,-~:;=!*#$@'

export default function DonutBackground({ dark }: DonutBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const darkRef = useRef(dark)
  const redrawRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    darkRef.current = dark
    redrawRef.current?.()
  }, [dark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0
    let width = 0
    let height = 0
    let columns = 0
    let rows = 0
    let rotationA = 0
    let rotationB = 0
    let previousTime = 0
    let lastRenderTime = 0
    let zBuffer = new Float32Array(0)
    let frame: string[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const glyphWidth = 8
      const glyphHeight = 14
      const verticalPadding = 10
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.font = '13px "Geist Mono", ui-monospace, monospace'
      context.textBaseline = 'top'

      columns = Math.ceil(width / glyphWidth)
      rows = Math.floor(Math.max(glyphHeight, height - verticalPadding * 2) / glyphHeight)
      const cellCount = columns * rows
      zBuffer = new Float32Array(cellCount)
      frame = new Array<string>(cellCount).fill(' ')
    }

    const draw = (time: number) => {
      frameId = 0
      if (!reducedMotion.matches && time - lastRenderTime < 1000 / 30) {
        frameId = window.requestAnimationFrame(draw)
        return
      }

      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .08) : 0
      previousTime = time
      lastRenderTime = time
      if (!reducedMotion.matches) {
        rotationA += elapsed * .72
        rotationB += elapsed * .36
      }

      zBuffer.fill(0)
      frame.fill(' ')
      context.clearRect(0, 0, width, height)
      context.fillStyle = darkRef.current ? '#f2f2f2' : '#0f0f0f'

      const glyphWidth = 8
      const glyphHeight = 14
      const cosA = Math.cos(rotationA)
      const sinA = Math.sin(rotationA)
      const cosB = Math.cos(rotationB)
      const sinB = Math.sin(rotationB)
      const scaleX = columns * .42
      const scaleY = rows * .74

      for (let theta = 0; theta < TAU; theta += .07) {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        const circleX = 2 + cosTheta
        const circleY = sinTheta

        for (let phi = 0; phi < TAU; phi += .02) {
          const cosPhi = Math.cos(phi)
          const sinPhi = Math.sin(phi)
          const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB
          const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB
          const z = 5 + cosA * circleX * sinPhi + circleY * sinA
          const inverseZ = 1 / z
          const pointX = Math.floor(columns / 2 + scaleX * inverseZ * x)
          const pointY = Math.floor(rows / 2 - scaleY * inverseZ * y)
          const luminance = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi - sinA * sinTheta + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi)

          if (luminance <= 0 || pointX < 0 || pointX >= columns || pointY < 0 || pointY >= rows) continue

          const index = pointX + columns * pointY
          if (inverseZ > zBuffer[index]) {
            zBuffer[index] = inverseZ
            frame[index] = CHARACTERS[Math.min(CHARACTERS.length - 1, Math.floor(luminance * 8))]
          }
        }
      }

      const offsetX = Math.round((width - columns * glyphWidth) / 2)
      const offsetY = Math.round((height - rows * glyphHeight) / 2)
      for (let row = 0; row < rows; row += 1) {
        context.fillText(frame.slice(row * columns, (row + 1) * columns).join(''), offsetX, offsetY + row * glyphHeight)
      }

      if (!reducedMotion.matches) frameId = window.requestAnimationFrame(draw)
    }

    const handleReducedMotionChange = () => {
      if (!reducedMotion.matches && !frameId) frameId = window.requestAnimationFrame(draw)
    }

    redrawRef.current = () => {
      if (!frameId) frameId = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    reducedMotion.addEventListener('change', handleReducedMotionChange)
    frameId = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', handleReducedMotionChange)
      redrawRef.current = null
    }
  }, [])

  return <canvas ref={canvasRef} className="newdemo-donut" aria-hidden="true" />
}
