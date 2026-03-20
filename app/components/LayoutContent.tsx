'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import ReadingProgressBar from './ReadingProgressBar'
import CommandPalette from './CommandPalette'

interface PostSummary {
  id: number
  date: string
  title: string
  pinned?: boolean
}

interface LayoutContentProps {
  children: React.ReactNode
  allCategoryPosts: Record<string, PostSummary[]>
}

export default function LayoutContent({ children, allCategoryPosts }: LayoutContentProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/' || pathname === '/game'

  if (isLandingPage) {
    return <main>{children}</main>
  }

  const pathParts = pathname.split('/').filter(Boolean)
  const category = pathParts[0] || ''
  const postIdStr = pathParts[1]
  const isPostPage = !!postIdStr

  let postTitle = ''
  if (isPostPage) {
    const postId = parseInt(postIdStr)
    const posts = allCategoryPosts[category] || []
    const post = posts.find(p => p.id === postId)
    postTitle = post?.title || ''
  }

  return (
    <div className="app-layout">
      <CommandPalette allCategoryPosts={allCategoryPosts} />
      {isPostPage && <ReadingProgressBar />}
      <LeftSidebar allCategoryPosts={allCategoryPosts} />
      <div id="main-area-scroll" className="main-area">
        <div className="main-center">
          <div className="mobile-header">
            <Link href="/game" className="logo logo-game" title="Play Σpace Invaders">
              <span className="logo-sigma">Σ</span>pace
            </Link>
          </div>
          {isPostPage && (
            <div className="breadcrumb">
              <Link href="/home" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <Link href={`/${category}`} className="breadcrumb-link">{category}</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{postTitle}</span>
            </div>
          )}
          <main className="main-inner">
            {children}
          </main>
          <footer className="site-footer">
            <p>// welcome to my over engineered personal website</p>
          </footer>
        </div>
        <RightSidebar />
      </div>
    </div>
  )
}
