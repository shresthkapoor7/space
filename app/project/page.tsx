import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getProjectPosts } from '../../lib/markdown'

export default function Project() {
  const projectPosts = getProjectPosts()
  return (
    <div>
      <DynamicTitle section="project" />
      <h1 className="page-title">Things I've built</h1>
      <PostList posts={projectPosts} category="project" />
    </div>
  )
}
