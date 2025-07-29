import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import DynamicTitle from '../components/DynamicTitle'
import { getMLPosts } from '../../lib/markdown'

export default function ML() {
  const mlPosts = getMLPosts()

  return (
    <div className="page-with-toc">
      <DynamicTitle section="ml" />
      <TableOfContents posts={mlPosts} currentPage="ml" />
      <div className="main-content">
        <br />
        <h1 className="page-title">ml stuff</h1>
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