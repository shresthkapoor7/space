import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const mathsPosts = [
  {
    id: 1,
    date: '04 Mar, 2025',
    title: "the beauty of fibonacci sequences",
    content: `the <mark data-tooltip="A sequence where each number is the sum of the two preceding ones">fibonacci sequence</mark> is one of the most fascinating patterns in mathematics.

starting with 0 and 1, each subsequent number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...

## applications in nature

- flower petals often follow fibonacci numbers
- spiral shells approximate the <mark data-tooltip="An irrational mathematical constant approximately equal to 1.618">golden ratio</mark>
- **tree branching patterns** exhibit fibonacci growth

## the golden ratio

the ratio of consecutive fibonacci numbers approaches <mark data-tooltip="Phi (φ) is the golden ratio, often called the most beautiful number in mathematics">φ (phi)</mark> = 1.618...

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate the first 10 Fibonacci numbers
print("First 10 Fibonacci numbers:")
for i in range(10):
    fib_num = fibonacci(i)
    print(f"F({i}) = {fib_num}")

# Calculate the golden ratio approximation
if fibonacci(9) != 0:  # Avoid division by zero
    golden_ratio = fibonacci(10) / fibonacci(9)
    print(f"\\nGolden ratio approximation: {golden_ratio:.6f}")
    print(f"Actual golden ratio: {(1 + 5**0.5) / 2:.6f}")
\`\`\`

> "Mathematics is the language with which God has written the universe" - Galileo Galilei`
  },
  {
    id: 2,
    date: '02 Mar, 2025',
    title: "understanding calculus intuitively",
    content: `<mark data-tooltip="The mathematical study of continuous change, invented by Newton and Leibniz">calculus</mark> doesn't have to be intimidating. it's fundamentally about **change** and **accumulation**.

## derivatives: the rate of change

imagine you're driving a car. your **position** changes over time, and the rate of that change is your <mark data-tooltip="The derivative of position with respect to time">**velocity**</mark>.

## integrals: accumulation

if <mark data-tooltip="Mathematical operation that finds the rate of change at any point">derivatives</mark> tell us about instantaneous change, <mark data-tooltip="Mathematical operation that finds the area under a curve or total accumulation">integrals</mark> tell us about total accumulation.

- area under a curve
- total distance traveled
- accumulated growth over time

calculus bridges the discrete and continuous worlds beautifully.`
  }
]

export default function Maths() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={mathsPosts} currentPage="maths" />
      <div className="main-content">
        <br />
        <h1 className="page-title">mathematical musings</h1>
        {mathsPosts.map((post) => (
          <BlogPost key={`maths-${post.id}`} post={post} currentPage="maths" />
        ))}
      </div>
    </div>
  )
}