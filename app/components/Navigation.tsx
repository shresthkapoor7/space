'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/home', label: 'home' },
    { href: '/math', label: 'math' },
    // { href: '/finance', label: 'finance' },
    { href: '/ml', label: 'ml' },
    { href: '/project', label: 'projects' },
    { href: '/aiagents', label: 'ai agents' },
    { href: '/hackathons', label: 'hackathons' },
  ]

  const isActive = (href: string) => {
    if (href === '/home') {
      const knownSections = ['/math', '/finance', '/ml', '/project', '/aiagents', '/hackathons']
      return pathname === '/home' || (pathname.startsWith('/') && pathname.split('/').length === 2 && !knownSections.some(s => pathname.startsWith(s)) && !pathname.startsWith('/home'))
    } else {
      return pathname.startsWith(href)
    }
  }

  return (
    <nav>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(item.href) ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}