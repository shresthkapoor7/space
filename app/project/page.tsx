import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getProjectPosts } from '../../lib/markdown'

export default function Project() {
  const projectPosts = getProjectPosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={projectPosts} currentPage="project" />
      <div className="main-content">
        <br />
        <h1 className="page-title">project stuff</h1>
        {projectPosts.map((post) => (
          <BlogPost
            key={`project-${post.id}`}
            post={post}
            currentPage="project"
          />
        ))}
      </div>
    </div>
  )
}