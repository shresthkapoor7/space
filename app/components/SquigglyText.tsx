'use client'

import React from 'react'

interface SquigglyTextProps {
  children: React.ReactNode
  fontSize?: string
  fontWeight?: string
  className?: string
}

// Function to create deterministic random capitalization based on text content
function deterministicRandomizeCase(text: string): string {
  return text.split('').map((char, index) => {
    // Skip spaces and punctuation
    if (char === ' ' || /[^\w]/.test(char)) {
      return char
    }
    // Use a simple hash of the character position and character to determine case
    // This ensures the same text always produces the same result
    const hash = char.charCodeAt(0) + index
    return hash % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
  }).join('')
}

export default function SquigglyText({
  children,
  fontSize = '1rem',
  fontWeight = 'normal',
  className = '',
  ...props
}: SquigglyTextProps) {
  // Convert children to string and randomize case deterministically
  const text = typeof children === 'string' ? children : String(children)
  const randomizedText = deterministicRandomizeCase(text)

  return (
    <span
      className={`squiggly-text ${className}`}
      style={{
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        display: 'inline-block',
        animation: 'flag-wave 3s ease-in-out infinite',
        transformOrigin: 'center',
        color: '#4a9eff', // Nice blue color
        ...props
      }}
    >
      {randomizedText}
    </span>
  )
}