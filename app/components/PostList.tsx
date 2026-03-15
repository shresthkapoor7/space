import Link from 'next/link'

interface Post {
  id: number
  date: string
  title: string
  content: string
  pinned?: boolean
}

interface PostListProps {
  posts: Post[]
  category: string
}

function getExcerpt(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip HTML tags, markdown headings, images, empty lines
    if (!trimmed || trimmed.startsWith('<') || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
    const stripped = trimmed
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
    if (stripped.length > 40) {
      return stripped.length > 160 ? stripped.slice(0, 160) + '…' : stripped
    }
  }
  return ''
}

export default function PostList({ posts, category }: PostListProps) {
  return (
    <div className="post-list">
      {posts.map(post => (
        <Link
          key={post.id}
          href={`/${category}/${post.id}`}
          className="post-list-item"
        >
          <div className="post-list-meta">
            {post.date}
            {post.pinned && <span className="post-pin" />}
          </div>
          <div className="post-list-title">{post.title}</div>
          <div className="post-list-excerpt">{getExcerpt(post.content)}</div>
        </Link>
      ))}
    </div>
  )
}
