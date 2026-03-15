import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
import { getProjectPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function ProjectPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getProjectPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <DynamicTitle title={post.title} />
      <BlogPost post={post} currentPage="project" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getProjectPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
