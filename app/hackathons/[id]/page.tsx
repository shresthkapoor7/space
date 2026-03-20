import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import DynamicTitle from '../../components/DynamicTitle'
import { getHackathonsPosts } from '../../../lib/markdown'

interface PageProps {
  params: {
    id: string
  }
}

export default function HackathonsPost({ params }: PageProps) {
  const postId = parseInt(params.id)
  const allPosts = getHackathonsPosts()
  const post = allPosts.find(p => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <DynamicTitle title={post.title} />
      <BlogPost post={post} currentPage="hackathons" />
    </div>
  )
}

export function generateStaticParams() {
  const posts = getHackathonsPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
