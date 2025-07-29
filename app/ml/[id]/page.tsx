import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import TableOfContents from '../../components/TableOfContents'
import DynamicTitle from '../../components/DynamicTitle'
import { getMLPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function MLPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getMLPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-with-toc">
      <DynamicTitle title={post.title} />
      <TableOfContents posts={allPosts} currentPage="ml" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/ml" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all ML posts
          </a>
        </div>
        <BlogPost post={post} currentPage="ml" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getMLPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}