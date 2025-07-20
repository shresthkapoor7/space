import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const mathsPosts = [
{
  id: 1,
  date: '19 Jul, 2025',
  title: "",
  content: `
  `
}
]

export default function Maths() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={mathsPosts} currentPage="maths" />
      <div className="main-content">
        <br />
        <h1 className="page-title">mathematical chaos</h1>
        {mathsPosts.map((post) => (
          <BlogPost key={`maths-${post.id}`} post={post} currentPage="maths" />
        ))}
      </div>
    </div>
  )
}