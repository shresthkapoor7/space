import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getMLPosts } from '../../lib/markdown'

export default function ML() {
  const mlPosts = getMLPosts()
  return (
    <div>
      <DynamicTitle section="ml" />
      <h1 className="page-title">ml stuff</h1>
      <PostList posts={mlPosts} category="ml" />
    </div>
  )
}
