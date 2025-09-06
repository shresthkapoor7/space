'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'home' },
    { href: '/math', label: 'math' },
    { href: '/finance', label: 'finance' },
    { href: '/ml', label: 'ml' },
    // { href: '/project', label: 'project' },
    { href: '/strands', label: 'strands' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || (pathname.startsWith('/') && pathname.split('/').length === 2 && !pathname.startsWith('/math') && !pathname.startsWith('/finance') && !pathname.startsWith('/ml') && !pathname.startsWith('/strands'))
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