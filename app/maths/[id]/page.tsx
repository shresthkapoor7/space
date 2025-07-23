import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import TableOfContents from '../../components/TableOfContents'
import { getMathsPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function MathPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getMathsPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-with-toc">
      <TableOfContents posts={allPosts} currentPage="maths" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/maths" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all maths posts
          </a>
        </div>
        <h1 className="page-title">mathematical chaos</h1>
        <BlogPost post={post} currentPage="maths" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getMathsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}