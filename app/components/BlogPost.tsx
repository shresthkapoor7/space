import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import RunnableCodeBlock from './RunnableCodeBlock'
import Highlight from './Highlight'
import 'katex/dist/katex.min.css'

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

// Function to convert custom math delimiters to standard KaTeX format
function preprocessMath(content: string): string {
  let processed = content

  // Convert display math: $begin:math:display$ ... $end:math:display$ to $$...$$
  processed = processed.replace(/\$begin:math:display\$([\s\S]*?)\$end:math:display\$/g, (match, mathContent) => {
    const cleanedMath = mathContent.trim()
    // Remove any extra newlines and normalize spacing
    const normalizedMath = cleanedMath.replace(/\n\s*/g, '\n').trim()
    return `$$${normalizedMath}$$`
  })

  // Convert inline math: $begin:math:text$ ... $end:math:text$ to $...$
  processed = processed.replace(/\$begin:math:text\$([\s\S]*?)\$end:math:text\$/g, (match, mathContent) => {
    const cleanedMath = mathContent.trim()
    return `$${cleanedMath}$`
  })

  return processed
}

export default function BlogPost({ post, currentPage = 'home' }: BlogPostProps) {
  const processedContent = preprocessMath(post.content)

  return (
    <article className="post" id={`post-${currentPage}-${post.id}`}>
      <div className="post-header">
        <div className="post-date">{post.date} {post.id === 0 && <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📌</span>}</div>
        <h2 className="post-title">{post.title}</h2>
      </div>
      <div className="post-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
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
          {processedContent}
        </ReactMarkdown>
      </div>
    </article>
  )
}