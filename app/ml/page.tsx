import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getMLPosts } from '../../lib/markdown'

export default function ML() {
  const mlPosts = getMLPosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={mlPosts} currentPage="ml" />
      <div className="main-content">
        <br />
        <h1 className="page-title">machine learning</h1>
        {mlPosts.map((post) => (
          <BlogPost
            key={`ml-${post.id}`}
            post={post}
            currentPage="ml"
          />
        ))}
      </div>
    </div>
  )
}