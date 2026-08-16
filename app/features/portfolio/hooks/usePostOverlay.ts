'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { PortfolioContent, PortfolioPost } from '../../../../lib/portfolio/content'

interface PostOverlayState {
  post: PortfolioPost | null
  pageContentRef: React.RefObject<HTMLDivElement>
  overlayRef: React.RefObject<HTMLDivElement>
  openPost: (index: number, trigger: HTMLElement) => void
  closePost: () => void
}

function getPost(pathname: string, writing: PortfolioPost[]) {
  const routeSegment = pathname.slice(1)
  const postIndex = Number(routeSegment) - 1

  return Number.isInteger(postIndex) && String(postIndex + 1) === routeSegment
    ? writing[postIndex] ?? null
    : null
}

export function usePostOverlay(content: PortfolioContent): PostOverlayState {
  const pathname = usePathname()
  const router = useRouter()
  const post = getPost(pathname, content.writing)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pageContentRef = useRef<HTMLDivElement>(null)
  const postTriggerRef = useRef<HTMLElement | null>(null)

  const closePost = () => router.push('/')
  const openPost = (index: number, trigger: HTMLElement) => {
    postTriggerRef.current = trigger
    router.push(`/${index + 1}`)
  }

  useEffect(() => {
    if (!post) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePost()
        return
      }

      if (event.key !== 'Tab') return

      const overlay = overlayRef.current
      if (!overlay) return
      const focusable = Array.from(overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ))

      if (!focusable.length) {
        event.preventDefault()
        overlay.focus()
        return
      }

      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
      const nextIndex = event.shiftKey
        ? currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1
        : currentIndex === focusable.length - 1 ? 0 : currentIndex + 1
      event.preventDefault()
      focusable[nextIndex].focus()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [post, router])

  useEffect(() => {
    if (!post) return

    const previouslyFocused = postTriggerRef.current ?? document.activeElement as HTMLElement | null
    const pageContent = pageContentRef.current
    pageContent?.setAttribute('inert', '')
    pageContent?.setAttribute('aria-hidden', 'true')
    const focusFrame = window.requestAnimationFrame(() => {
      overlayRef.current?.querySelector<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      )?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      pageContent?.removeAttribute('inert')
      pageContent?.removeAttribute('aria-hidden')
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [post])

  useEffect(() => {
    document.body.style.overflow = post ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [post])

  return { post, pageContentRef, overlayRef, openPost, closePost }
}
