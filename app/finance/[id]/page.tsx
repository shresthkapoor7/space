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
    <div>
      <DynamicTitle title={post.title} />
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
