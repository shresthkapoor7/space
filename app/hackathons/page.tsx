import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getHackathonsPosts } from '../../lib/markdown'

export default function Hackathons() {
  const posts = getHackathonsPosts()
  return (
    <div>
      <DynamicTitle section="hackathons" />
      <h1 className="page-title">Hackathon Builds</h1>
      <PostList posts={posts} category="hackathons" />
    </div>
  )
}
