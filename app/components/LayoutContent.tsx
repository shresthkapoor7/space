'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import ConditionalSidebar from './ConditionalSidebar'
import ReadingProgressBar from './ReadingProgressBar'

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLandingPage = pathname === '/'
    const isIndividualPost = pathname.split('/').filter(Boolean).length >= 2

    if (isLandingPage) {
        return <main>{children}</main>
    }

    return (
        <div className="app-layout">
            {isIndividualPost && <ReadingProgressBar />}
            <header className="main-header">
                <Link href="/home" className="logo">
                    Σpace
                </Link>
                <Navigation />
            </header>
            <main className="main-wrapper">
                {children}
            </main>
            <ConditionalSidebar />
            <footer className="site-footer">
                <p>// i use arc btw, not arch you nerd</p>
            </footer>
        </div>
    )
}
