import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import { getMathsPosts } from '../../lib/markdown'

export default function Maths() {
  const mathsPosts = getMathsPosts()

  return (
    <div className="page-with-toc">
      <TableOfContents posts={mathsPosts} currentPage="maths" />
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
        {mathsPosts.map((post) => (
          <BlogPost
            key={`maths-${post.id}`}
            post={post}
            currentPage="maths"
          />
        ))}
      </div>
    </div>
  )
}