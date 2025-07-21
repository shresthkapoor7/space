import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const projectPosts = [
    {
        id: 0,
        date: '21 Jul, 2025',
        title: "why strands would be >>>",
        content: `apps like chatgpt, claude, gemini aren't perfect, there are issue in them. chatgpt is great with context but doesn't give out the best responses, claude is good with coding but sucks with context across chats, gemini .... well it just sucks. i mean gemini 2.5 pro is good for coding but could be better with other stuff.
    <div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://qph.cf2.quoracdn.net/main-qimg-d5c893cd0d473aa7760cba52396c03b9"
    alt="nerd"
    style="width: 400px;"
  />
</div>
    there is inherently something that i feel is missing ever since chatgpt came out and its threads, think about it having the ability to branch off conversations exploring new ideas and coming right back to the original one. no polluting the context, reduced hallucinations. it is perfect and it is kinda astonishing that no one is doing it like no one. until now
    `
    }
]

export default function Project() {
    return (
        <div className="page-with-toc">
            <TableOfContents posts={projectPosts} currentPage="project" />
            <div className="main-content">
                <br />
                <h1 className="page-title">another chatgpt wrapper</h1>
                {projectPosts.find((post) => post.id === 0) && (
                    <BlogPost key={`project-${projectPosts[0].id}`} post={projectPosts[0]} currentPage="project" />
                )}
                {projectPosts.filter((post) => post.id !== 0).map((post) => (
                    <BlogPost key={`project-${post.id}`} post={post} currentPage="project" />
                ))}
            </div>
        </div>
    )
}