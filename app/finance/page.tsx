import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const financePosts = [
  {
    id: 1,
    date: '19 Jul, 2025',
    title: "",
    content: ``
  },
]

export default function Finance() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={financePosts} currentPage="finance" />
      <div className="main-content">
        <br />
        <h1 className="page-title">finance brain dump</h1>
        {financePosts.map((post) => (
          <BlogPost key={`finance-${post.id}`} post={post} currentPage="finance" />
        ))}
      </div>
    </div>
  )
}