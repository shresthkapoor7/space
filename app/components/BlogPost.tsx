'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import RunnableCodeBlock from './RunnableCodeBlock'
import Highlight from './Highlight'
import TweetComponent from './Tweet'
import 'katex/dist/katex.min.css'

interface Post {
  id: number
  date: string
  title: string
  content: string
  pinned?: boolean
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

// Function to process tweets and create React elements
function processTweets(content: string): { processedContent: string; tweetElements: { [key: string]: JSX.Element } } {
  const tweetElements: { [key: string]: JSX.Element } = {}
  let processedContent = content

  // Find all Tweet components and replace with placeholders
  const tweetRegex = /<Tweet id="([^"]+)"\s*\/>/g
  let match
  let index = 0

  while ((match = tweetRegex.exec(content)) !== null) {
    const tweetId = match[1]
    const placeholder = `TWEET_PLACEHOLDER_${index}`

    processedContent = processedContent.replace(match[0], `<div data-tweet-placeholder="${placeholder}"></div>`)
    tweetElements[placeholder] = <TweetComponent key={tweetId} id={tweetId} />
    index++
  }

  return { processedContent, tweetElements }
}

export default function BlogPost({ post, currentPage = 'home' }: BlogPostProps) {
  const mathProcessedContent = preprocessMath(post.content)
  const { processedContent, tweetElements } = processTweets(mathProcessedContent)

  const navigateToPost = () => {
    // We're on the main page, navigate to individual post
    const baseUrl = currentPage === 'home' ? '' : `/${currentPage}`
    window.location.href = `${baseUrl}/${post.id}`
  }

  return (
    <article className="post" id={`post-${currentPage}-${post.id}`}>
      <div className="post-header">
        <div className="post-date">{post.date} {post.pinned && <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📌</span>}</div>
        <h2 className="post-title" onClick={navigateToPost} style={{ cursor: 'pointer' }}>{post.title}</h2>
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
            },
            div({ 'data-tweet-placeholder': placeholder, ...props }: any) {
              if (placeholder && tweetElements[placeholder]) {
                return tweetElements[placeholder]
              }
              return <div {...props} />
            }
          } as any}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </article>
  )
}