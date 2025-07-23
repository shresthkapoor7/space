import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getFinancePosts } from '../../lib/markdown'

export default function Finance() {
  const financePosts = getFinancePosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={financePosts} currentPage="finance" />
      <div className="main-content">
        <br />
        <h1 className="page-title">finance brain dump</h1>
        {financePosts.map((post) => (
          <BlogPost
            key={`finance-${post.id}`}
            post={post}
            currentPage="finance"
          />
        ))}
      </div>
    </div>
  )
}