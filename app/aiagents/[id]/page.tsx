import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
import { getAIAgentsPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function AIAgentsPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getAIAgentsPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <DynamicTitle title={post.title} />
      <BlogPost post={post} currentPage="aiagents" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getAIAgentsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
