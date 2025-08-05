'use client'

import { useEffect } from 'react'

export default function GlobalConsoleLog() {
  useEffect(() => {
    console.log('go away nerd')
  }, [])

  return null
}