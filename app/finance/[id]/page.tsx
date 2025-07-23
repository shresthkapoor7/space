import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import TableOfContents from '../../components/TableOfContents'
import { getFinancePosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function FinancePost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getFinancePosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-with-toc">
      <TableOfContents posts={allPosts} currentPage="finance" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/finance" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all finance posts
          </a>
        </div>
        <h1 className="page-title">finance brain dump</h1>
        <BlogPost post={post} currentPage="finance" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getFinancePosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}