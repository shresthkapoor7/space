import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
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
    <div className="container">
      <DynamicTitle title={post.title} />
      <div style={{ marginBottom: '1rem' }}>
        <a href="/finance" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
          ← Back to all finance posts
        </a>
      </div>
      <BlogPost post={post} currentPage="finance" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getFinancePosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}