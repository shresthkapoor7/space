import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
import { getmathPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function MathPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getmathPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <DynamicTitle title={post.title} />
      <BlogPost post={post} currentPage="math" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getmathPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
