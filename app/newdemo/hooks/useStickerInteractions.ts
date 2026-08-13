'use client'

import { useEffect, useRef, useState } from 'react'

type Offset = { x: number; y: number }
type DragState = { id: string; startX: number; startY: number; offsetX: number; offsetY: number }

function findSticker(event: PointerEvent) {
  return Array.from(document.querySelectorAll<HTMLElement>('.newdemo-sticker')).find((element) => {
    const bounds = element.getBoundingClientRect()
    return event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom
  })
}

export function useStickerInteractions(enabled: boolean) {
  const [hoveredSticker, setHoveredSticker] = useState<string | null>(null)
  const [stickerOffsets, setStickerOffsets] = useState<Record<string, Offset>>({})
  const offsetsRef = useRef<Record<string, Offset>>({})
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => {
    if (!enabled) {
      setHoveredSticker(null)
      return
    }

    const clearPreview = () => {
      setHoveredSticker(null)
      if (!dragRef.current) document.body.style.cursor = ''
    }
    const moveSticker = (event: PointerEvent) => {
      const drag = dragRef.current
      if (drag) {
        const nextOffset = {
          x: drag.offsetX + event.clientX - drag.startX,
          y: drag.offsetY + event.clientY - drag.startY,
        }
        offsetsRef.current = { ...offsetsRef.current, [drag.id]: nextOffset }
        setStickerOffsets(offsetsRef.current)
        return
      }

      const stickerId = findSticker(event)?.dataset.stickerId
      if (!stickerId) return clearPreview()
      setHoveredSticker(stickerId)
      document.body.style.cursor = 'grab'
    }
    const beginStickerDrag = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      const stickerId = findSticker(event)?.dataset.stickerId
      if (!stickerId) return
      const offset = offsetsRef.current[stickerId] ?? { x: 0, y: 0 }
      dragRef.current = { id: stickerId, startX: event.clientX, startY: event.clientY, offsetX: offset.x, offsetY: offset.y }
      document.body.style.cursor = 'grabbing'
      event.preventDefault()
    }
    const endStickerDrag = () => {
      dragRef.current = null
      document.body.style.cursor = ''
    }

    window.addEventListener('pointermove', moveSticker, { passive: true })
    window.addEventListener('pointerdown', beginStickerDrag)
    window.addEventListener('pointerup', endStickerDrag)
    window.addEventListener('pointercancel', endStickerDrag)
    window.addEventListener('blur', clearPreview)
    return () => {
      window.removeEventListener('pointermove', moveSticker)
      window.removeEventListener('pointerdown', beginStickerDrag)
      window.removeEventListener('pointerup', endStickerDrag)
      window.removeEventListener('pointercancel', endStickerDrag)
      window.removeEventListener('blur', clearPreview)
      document.body.style.cursor = ''
    }
  }, [enabled])

  return { hoveredSticker, stickerOffsets }
}
