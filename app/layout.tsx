import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from './components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Σpace',
  description: 'Personal blog and portfolio',
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
    shortcut: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <header className="main-header">
            <Link href="/" className="logo">
              Σpace
            </Link>
            <Navigation />
          </header>
          <main className="main-wrapper">
            {children}
          </main>
          <footer className="site-footer">
  <p>written by <a href="https://github.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">shresth kapoor</a> (no cap. literally).</p>
</footer>
        </div>
      </body>
    </html>
  )
}