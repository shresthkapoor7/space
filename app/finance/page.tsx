import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'
import DynamicTitle from '../components/DynamicTitle'
import QuantNavigation from '../components/QuantNavigation'
import { getFinancePosts } from '../../lib/markdown'

export default function Finance() {
  const financePosts = getFinancePosts()

  return (
      <div className="page-with-toc">
        <DynamicTitle section="finance" />
        <TableOfContents posts={financePosts} currentPage="finance" />
        <div className="main-content">
        <QuantNavigation />
          <br />
          <h1 className="page-title">finance notes</h1>
          {financePosts.map((post) => (
            <BlogPost
              key={`finance-${post.id}`}
              post={post}
              currentPage="finance"
            />
          ))}
        </div>
      </div>
  )
}