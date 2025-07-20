import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import RunnableCodeBlock from './RunnableCodeBlock'
import Highlight from './Highlight'

interface Post {
  id: number
  date: string
  title: string
  content: string
}

interface BlogPostProps {
  post: Post
  currentPage?: string
}

export default function BlogPost({ post, currentPage = 'home' }: BlogPostProps) {
  return (
    <article className="post" id={`post-${currentPage}-${post.id}`}>
      <div className="post-header">
        <div className="post-date">{post.date}</div>
        <h2 className="post-title">{post.title}</h2>
      </div>
      <div className="post-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''
              const isInline = !match

              if (!isInline && language) {
                return (
                  <RunnableCodeBlock className={className}>
                    {String(children).replace(/\n$/, '')}
                  </RunnableCodeBlock>
                )
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            mark({ children, ...props }: any) {
              return (
                <Highlight {...props}>
                  {children}
                </Highlight>
              )
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}