import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const projectPosts = [
  {
    id: 1,
    date: '19 Jul, 2025',
    title: "building a personal finance tracker",
    content: `nocap`
  }
]

export default function Project() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={projectPosts} currentPage="project" />
      <div className="main-content">
        <br />
        <h1 className="page-title">project shit</h1>
        {projectPosts.map((post) => (
          <BlogPost key={`project-${post.id}`} post={post} currentPage="project" />
        ))}
      </div>
    </div>
  )
}