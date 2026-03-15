import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getmathPosts } from '../../lib/markdown'

export default function math() {
  const mathPosts = getmathPosts()
  return (
    <div>
      <DynamicTitle section="math" />
      <h1 className="page-title">mathematical chaos</h1>
      <PostList posts={mathPosts} category="math" />
    </div>
  )
}
