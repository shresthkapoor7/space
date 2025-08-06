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
import SquigglyText from './SquigglyText'
import FlashcardGrid from './FlashcardGrid'
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

// Function to process glossary content and wrap in FlashcardGrid
function processGlossary(content: string): { processedContent: string; glossaryElements: { [key: string]: JSX.Element } } {
  const glossaryElements: { [key: string]: JSX.Element } = {}
  let processedContent = content

  // Find glossary-group divs and replace them with FlashcardGrid components
  const glossaryGroupRegex = /<div class="glossary-group">([\s\S]*?)<\/div>/g
  let match
  let index = 0

  while ((match = glossaryGroupRegex.exec(content)) !== null) {
    const glossaryContent = match[1]
    const placeholder = `GLOSSARY_PLACEHOLDER_${index}`

    processedContent = processedContent.replace(match[0], `<div data-glossary-placeholder="${placeholder}"></div>`)
    glossaryElements[placeholder] = <FlashcardGrid key={placeholder} dangerouslySetInnerHTML={{ __html: glossaryContent }} />
    index++
  }

  return { processedContent, glossaryElements }
}

export default function BlogPost({ post, currentPage = 'home' }: BlogPostProps) {
  const mathProcessedContent = preprocessMath(post.content)
  const { processedContent: tweetProcessedContent, tweetElements } = processTweets(mathProcessedContent)
  const { processedContent, glossaryElements } = processGlossary(tweetProcessedContent)

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
                        span({ className, children, ...props }: any) {
              // Handle squiggly text with custom attributes
              if (className && className.includes('squiggly')) {
                const fontSize = props['data-font-size'] || '1rem'
                const fontWeight = props['data-font-weight'] || 'normal'

                return (
                  <SquigglyText
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                  >
                    {children}
                  </SquigglyText>
                )
              }
              return <span className={className} {...props}>{children}</span>
            },
            div({ 'data-tweet-placeholder': placeholder, 'data-glossary-placeholder': glossaryPlaceholder, ...props }: any) {
              if (placeholder && tweetElements[placeholder]) {
                return tweetElements[placeholder]
              }
              if (glossaryPlaceholder && glossaryElements[glossaryPlaceholder]) {
                return glossaryElements[glossaryPlaceholder]
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