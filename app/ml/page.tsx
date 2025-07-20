import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const mlPosts = [
  {
    id: 1,
    date: '19 Jul, 2025',
    title: "works",
    content: `

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Simple scatter plot
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, alpha=0.7, cmap='viridis')
plt.title('Random Scatter Plot', color='white', fontsize=14)
plt.xlabel('X values', color='white')
plt.ylabel('Y values', color='white')
plt.colorbar(label='Color Scale')

# Dark theme
plt.gca().set_facecolor('#2a2a2a')
plt.gcf().patch.set_facecolor('#2a2a2a')
plt.tick_params(colors='white')

plt.show()
print("🎨 Beautiful scatter plot generated!")
\`\`\`
`
  }
]

export default function ML() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={mlPosts} currentPage="ml" />
      <div className="main-content">
        <br />
        <h1 className="page-title">machine learning</h1>
        {mlPosts.map((post) => (
          <BlogPost key={`ml-${post.id}`} post={post} currentPage="ml" />
        ))}
      </div>
    </div>
  )
}