import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import DynamicTitle from '../components/DynamicTitle'
import { getStrandsPosts } from '../../lib/markdown'

export default function Strands() {
  const strandsPosts = getStrandsPosts()

  return (
    <div className="page-with-toc">
      <DynamicTitle section="strands" />
      <TableOfContents posts={strandsPosts} currentPage="strands" />
      <div className="main-content">
        <br />
        <h1 className="page-title">another chatgpt wrapper</h1>
        <a href="https://strandschat.com" target="_blank" rel="noopener noreferrer">strands</a> cause other wrappers are mid.
        <div style={{display: "flex", justifyContent: "center"}}>
          <img
            src="https://i.programmerhumor.io/2025/03/a01943824dab967a9428e59937b87fefc07591c5a9773a26a29395288f6689e4.png"
            alt="nerd"
            style={{width: "375px", padding: "1rem"}}
          />
        </div>
        {strandsPosts.map((post) => (
          <BlogPost
            key={`strands-${post.id}`}
            post={post}
            currentPage="strands"
          />
        ))}
      </div>
    </div>
  )
}