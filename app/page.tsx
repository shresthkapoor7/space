import React from 'react'
import BlogPost from './components/BlogPost'
import TableOfContents from './components/TableOfContents'
import { getHomePosts } from '../lib/markdown'

export default function Home() {
  const homePosts = getHomePosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={homePosts} currentPage="home" />
      <div className="main-content">
        <br />
        <h1 className="page-title">code, memes and maths</h1>
        {homePosts.map((post) => (
          <BlogPost
            key={`home-${post.id}`}
            post={post}
            currentPage="home"
          />
        ))}
      </div>
    </div>
  )
}