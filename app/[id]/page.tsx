import { notFound } from 'next/navigation'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getHomePosts } from '../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function HomePost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getHomePosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-with-toc">
      <TableOfContents posts={allPosts} currentPage="home" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all posts
          </a>
        </div>
        <h1 className="page-title">home</h1>
        <BlogPost post={post} currentPage="home" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getHomePosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}