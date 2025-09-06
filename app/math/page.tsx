import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import DynamicTitle from '../components/DynamicTitle'
import { getmathPosts } from '../../lib/markdown'

export default function math() {
  const mathPosts = getmathPosts()

  return (
    <div className="page-with-toc">
      <DynamicTitle section="math" />
      <TableOfContents posts={mathPosts} currentPage="math" />
      <div className="main-content">
        <br />
        <h1 className="page-title">mathematical chaos</h1>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img
            src="https://img.devrant.com/devrant/rant/r_2293403_nbLGe.jpg"
            alt="nerd"
            style={{width: "375px", padding: "1rem"}}
          />
        </div>
        <br />
        {mathPosts.map((post) => (
          <BlogPost
            key={`math-${post.id}`}
            post={post}
            currentPage="math"
          />
        ))}
      </div>
    </div>
  )
}