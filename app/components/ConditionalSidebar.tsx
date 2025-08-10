'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import RightSidebar from './RightSidebar'

export default function ConditionalSidebar() {
  const pathname = usePathname()
  const [sidebarKey, setSidebarKey] = useState('sidebar-persistent')
  const wasOnIndividualPost = useRef(false)

  // Hide sidebar on individual post pages (paths with /[id]/)
  const isIndividualPost = /\/\d+\/?$/.test(pathname)

  useEffect(() => {
    if (isIndividualPost && !wasOnIndividualPost.current) {
      // Just went to an individual post - mark it
      wasOnIndividualPost.current = true
      sessionStorage.removeItem('music-current-track')
      sessionStorage.removeItem('music-is-paused')
    } else if (!isIndividualPost && wasOnIndividualPost.current) {
      // Just came back from an individual post - force reset
      wasOnIndividualPost.current = false
      setSidebarKey(`sidebar-${Date.now()}`)
    }
    // If switching between normal tabs (both not individual posts), do nothing
  }, [isIndividualPost])

  if (isIndividualPost) {
    return null
  }

  return <RightSidebar key={sidebarKey} />
}
