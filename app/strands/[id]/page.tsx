import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
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
    <div>
      <DynamicTitle title={post.title} />
      <BlogPost post={post} currentPage="strands" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getStrandsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
