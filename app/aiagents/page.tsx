import DynamicTitle from '../components/DynamicTitle'
import PostList from '../components/PostList'
import { getAIAgentsPosts } from '../../lib/markdown'

export default function AIAgents() {
  const posts = getAIAgentsPosts()
  return (
    <div>
      <DynamicTitle section="aiagents" />
      <h1 className="page-title">AI Agents - tools, builds, and what broke</h1>
      <p className="page-subtitle">
        Tools I've used, systems I've built, and what I actually learned.
        Mostly agentic workflows, LLM tooling, and production AI.
      </p>
      <PostList posts={posts} category="aiagents" />
    </div>
  )
}
