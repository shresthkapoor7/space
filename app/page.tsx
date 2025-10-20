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
        <div style={{textAlign: "center", color: "#FF5900", fontSize: "1.5rem", marginBottom: "1rem"}}>welcome to my <img src="/images/substack.png" alt="nerd" style={{width: "40px", verticalAlign: "middle"}} /></div>
        <div style={{textAlign: "center"}}>LinkedIn: <a href="https://www.linkedin.com/in/shresth-kapoor-7skp/" target="_blank" rel="noopener noreferrer">shresth kapoor</a> | GitHub: <a href="https://github.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">shresthkapoor7</a> | Twitter: <a href="https://twitter.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">shresthkapoor7</a></div>
        <div className="toc-header"></div>
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