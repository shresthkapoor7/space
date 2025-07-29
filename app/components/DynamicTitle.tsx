'use client'

import { useEffect } from 'react'

interface DynamicTitleProps {
  title?: string
  section?: string
}

export default function DynamicTitle({ title, section }: DynamicTitleProps) {
  useEffect(() => {
    let pageTitle = ''

    if (title) {
      pageTitle = `Σpace - ${title}`
    } else if (section) {
      pageTitle = `Σpace - ${section}`
    }

    document.title = pageTitle
  }, [title, section])

  return null
}