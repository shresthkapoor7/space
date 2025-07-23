import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getStrandsPosts } from '../../lib/markdown'

export default function Strands() {
  const strandsPosts = getStrandsPosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={strandsPosts} currentPage="strands" />
      <div className="main-content">
        <br />
        <h1 className="page-title">another chatgpt wrapper</h1>
        {strandsPosts.map((post) => (
          <BlogPost
            key={`strands-${post.id}`}
            post={post}
            currentPage="strands"
          />
        ))}
      </div>
    </div>
  )
}