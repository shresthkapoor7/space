'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import RightSidebar from './RightSidebar'

export default function ConditionalSidebar() {
  const pathname = usePathname()
  const [sidebarKey, setSidebarKey] = useState('sidebar-persistent')
  const wasOnIndividualPost = useRef(false)

  const isIndividualPost = /\/\d+\/?$/.test(pathname)

  useEffect(() => {
    if (isIndividualPost && !wasOnIndividualPost.current) {
      wasOnIndividualPost.current = true
    } else if (!isIndividualPost && wasOnIndividualPost.current) {
      wasOnIndividualPost.current = false
      setSidebarKey(`sidebar-${Date.now()}`)
    }
  }, [isIndividualPost])

  if (isIndividualPost) {
    return null
  }

  return <RightSidebar key={sidebarKey} />
}
