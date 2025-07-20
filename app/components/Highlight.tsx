'use client'

import React, { useState } from 'react'

interface HighlightProps {
  children: React.ReactNode
  tooltip?: string
  'data-tooltip'?: string
}

export default function Highlight({ children, tooltip, 'data-tooltip': dataTooltip, ...props }: HighlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipContent = tooltip || dataTooltip

  return (
    <span
      className="highlight"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {tooltipContent && (
        <span className={`tooltip ${isVisible ? 'visible' : ''}`}>
          {tooltipContent}
        </span>
      )}
    </span>
  )
}