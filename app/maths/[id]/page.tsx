import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
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
    <div className="post-container">
      <DynamicTitle title={post.title} />
      <div style={{ marginBottom: '1rem' }}>
        <a href="/maths" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
          ← Back to all maths posts
        </a>
      </div>
      <BlogPost post={post} currentPage="maths" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getMathsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}