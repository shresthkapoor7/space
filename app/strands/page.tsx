import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getStrandsPosts } from '../../lib/markdown'

export default function Strands() {
  const strandsPosts = getStrandsPosts()
  return (
    <div>
      <DynamicTitle section="strands" />
      <h1 className="page-title">Not just another ChatGPT wrapper</h1>
      <PostList posts={strandsPosts} category="strands" />
    </div>
  )
}
