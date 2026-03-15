import BlogPost from '../components/BlogPost'
import { getHomePosts } from '../../lib/markdown'

export default function Home() {
  const homePosts = getHomePosts()
  const aboutPost = homePosts.find(p => p.id === 7) || homePosts[0]

  return (
    <div className="home-profile">
      <div className="home-links">
        <a href="https://www.linkedin.com/in/shresth-kapoor-7skp/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span className="home-link-sep">·</span>
        <a href="https://github.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span className="home-link-sep">·</span>
        <a href="https://twitter.com/shresthkapoor7" target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
      <BlogPost post={aboutPost} currentPage="home" />
    </div>
  )
}
