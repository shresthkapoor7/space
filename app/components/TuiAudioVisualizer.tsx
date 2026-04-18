'use client'

import { useEffect, useRef } from 'react'

/** Lower block elements U+2581–U+2588 — one TUI “bar” per column */
const LEVELS = ['\u2581', '\u2582', '\u2583', '\u2584', '\u2585', '\u2586', '\u2587', '\u2588'] as const
const N = 28

export default function TuiAudioVisualizer({
  active,
  hasTrack,
}: {
  active: boolean
  hasTrack: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const valuesRef = useRef<number[]>(Array.from({ length: N }, () => 0))
  const activeRef = useRef(active)
  const hasTrackRef = useRef(hasTrack)

  activeRef.current = active
  hasTrackRef.current = hasTrack

  useEffect(() => {
    wrapRef.current?.classList.toggle('tui-viz--live', active && hasTrack)
    const st = statusRef.current
    if (st) {
      if (!hasTrack) st.textContent = 'IDLE'
      else if (active) st.textContent = 'RUN'
      else st.textContent = 'HOLD'
    }
  }, [active, hasTrack])

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const a = activeRef.current
      const h = hasTrackRef.current
      const arr = valuesRef.current
      const el = preRef.current
      if (el) {
        let out = ''
        for (let i = 0; i < N; i++) {
          let target: number
          if (a && h) {
            const phase = t * (3.35 + (i % 5) * 0.11) + i * 0.37
            const base = (Math.sin(phase) * 0.5 + 0.5) * 0.64
            const beat = Math.abs(Math.sin(t * 7.9)) > 0.8 ? 0.3 : 0
            const flicker = (Math.random() - 0.5) * 0.11
            target = Math.min(0.98, Math.max(0.09, base + beat + flicker))
          } else if (h) {
            target = 0.11 + Math.sin(t * 0.85 + i * 0.24) * 0.065
          } else {
            target = 0.03 + Math.sin(t * 0.45 + i * 0.18) * 0.02
          }
          const smooth = a && h ? 0.44 : 0.16
          arr[i] += (target - arr[i]) * smooth
          const idx = Math.min(LEVELS.length - 1, Math.floor(arr[i] * LEVELS.length))
          out += LEVELS[idx]
        }
        el.textContent = out
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={wrapRef} className="tui-viz">
      <div className="tui-viz-chrome">
        <span className="tui-viz-prompt">$</span>
        <span className="tui-viz-title">pcm_scope</span>
        <span ref={statusRef} className="tui-viz-ch">
          IDLE
        </span>
      </div>
      <pre ref={preRef} className="tui-viz-bars" aria-hidden="true">
        {'\u2581'.repeat(N)}
      </pre>
      <div className="tui-viz-meta" aria-hidden="true">
        <span>L</span>
        <span className="tui-viz-dots">{'·'.repeat(22)}</span>
        <span>R</span>
      </div>
    </div>
  )
}
