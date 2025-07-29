import { notFound } from 'next/navigation'
import BlogPost from '../../components/BlogPost'
import TableOfContents from '../../components/TableOfContents'
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
    <div className="page-with-toc">
      <DynamicTitle title={post.title} />
      <TableOfContents posts={allPosts} currentPage="project" currentPostId={postId} />
      <div className="main-content">
        <br />
        <div style={{ marginBottom: '1rem' }}>
          <a href="/project" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            ← Back to all project posts
          </a>
        </div>
        <h1 className="page-title">project stuff</h1>
        <BlogPost post={post} currentPage="project" />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const posts = getProjectPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}