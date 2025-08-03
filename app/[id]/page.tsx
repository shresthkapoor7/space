import { notFound } from 'next/navigation'
import BlogPost from '../components/BlogPost'
import DynamicTitle from '../components/DynamicTitle'
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
    <div className="container">
      <DynamicTitle title={post.title} />
      <div style={{ marginBottom: '1rem' }}>
        <a href="/" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
          ← Back to all posts
        </a>
      </div>
      <BlogPost post={post} currentPage="home" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getHomePosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}