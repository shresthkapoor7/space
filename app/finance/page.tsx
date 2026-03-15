import DynamicTitle from '../components/DynamicTitle'
import QuantNavigation from '../components/QuantNavigation'
import PostList from '../components/PostList'
import { getFinancePosts } from '../../lib/markdown'

export default function Finance() {
  const financePosts = getFinancePosts().reverse()
  return (
    <div>
      <DynamicTitle section="finance" />
      <QuantNavigation />
      <h1 className="page-title">finance notes</h1>
      <PostList posts={financePosts} category="finance" />
    </div>
  )
}
