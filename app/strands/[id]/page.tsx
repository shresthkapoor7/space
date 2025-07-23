import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import TableOfContents from '../../components/TableOfContents'
import { getStrandsPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function StrandsPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getStrandsPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-with-toc">
      <TableOfContents posts={allPosts} currentPage="strands" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/strands" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all strands posts
          </a>
        </div>
        <h1 className="page-title">another chatgpt wrapper</h1>
        <BlogPost post={post} currentPage="strands" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getStrandsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}